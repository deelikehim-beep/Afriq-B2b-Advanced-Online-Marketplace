import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  Alert, Dimensions, FlatList, Modal, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { CURRENCY_META, convertFromNGN, PRODUCTS, PRODUCT_COUNTRY, PRODUCT_GALLERY, fmt } from '@/constants/data';

const { width } = Dimensions.get('window');

// ─── AI-derived price intelligence ───────────────────────────
function useAIPriceInsight(price: number, id: string) {
  const offsets = [0.08, -0.12, 0.05, -0.08, 0.12, -0.05, 0.15, -0.10, 0.06, -0.14];
  const offset = offsets[parseInt(id) % offsets.length];
  const marketAvg = Math.round(price * (1 + offset));
  const pctDiff = Math.round(((price - marketAvg) / marketAvg) * 100);
  const isGoodDeal = pctDiff < 0;
  const score = Math.min(100, Math.max(20, 60 + (-pctDiff * 3)));
  const low = Math.round(marketAvg * 0.88);
  const high = Math.round(marketAvg * 1.18);
  return { marketAvg, pctDiff, isGoodDeal, score, low, high };
}

// ─── AI review summary per product rating ────────────────────
function getAIReviewSummary(rating: number, category: string) {
  const pros: string[] = [];
  const cons: string[] = [];
  if (rating >= 4.8) pros.push('Exceptional quality (95%+ buyers agree)', 'Always delivered on time', 'Exactly matches description');
  else if (rating >= 4.5) { pros.push('Consistently good quality', 'Reliable delivery schedule'); cons.push('Occasional packaging issues'); }
  else if (rating >= 4.0) { pros.push('Good value for money', 'Responsive supplier'); cons.push('Quality may vary between batches', 'MOQ high for small retailers'); }
  else { pros.push('Competitive pricing'); cons.push('Quality inconsistencies reported', 'Slower response time'); }
  if (['textiles', 'fashion'].includes(category)) pros.push('Colors accurate to photos');
  if (['electronics'].includes(category)) pros.push('Genuine products, valid warranty');
  if (['food', 'agriculture'].includes(category)) pros.push('Fresh produce, hygienic packaging');
  return { pros: pros.slice(0, 3), cons: cons.slice(0, 2) };
}

// ─── Lightbox Modal ───────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const ref = useRef<FlatList>(null);
  return (
    <Modal visible transparent statusBarTranslucent animationType="fade" onRequestClose={onClose}>
      <View style={lb.bg}>
        <View style={lb.topBar}>
          <TouchableOpacity style={lb.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text style={lb.counter}>{idx + 1} / {images.length}</Text>
          <View style={{ width: 44 }} />
        </View>
        <FlatList
          ref={ref}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={startIndex}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          onMomentumScrollEnd={e => setIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={{ width, flex: 1, justifyContent: 'center' }}>
              <Image source={{ uri: item }} style={{ width, height: width }} contentFit="contain" />
            </View>
          )}
        />
        <View style={lb.dots}>
          {images.map((_, i) => (
            <View key={i} style={[lb.dot, i === idx && { backgroundColor: '#ffffff', width: 20 }]} />
          ))}
        </View>
      </View>
    </Modal>
  );
}

// ─── Video Modal (demo) ───────────────────────────────────────
function VideoModal({ visible, productName, thumbUri, onClose }: {
  visible: boolean; productName: string; thumbUri: string; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={vid.overlay}>
        <View style={vid.sheet}>
          <Image source={{ uri: thumbUri }} style={vid.thumb} contentFit="cover" />
          <View style={vid.playCircle}>
            <Ionicons name="play" size={40} color="#ffffff" />
          </View>
          <View style={vid.info}>
            <View style={[vid.aiBadge]}>
              <Ionicons name="videocam" size={14} color="#059669" />
              <Text style={vid.aiBadgeTxt}>Product Video</Text>
            </View>
            <Text style={vid.vidTitle}>{productName}</Text>
            <Text style={vid.vidDesc}>Video preview available in the AFRIQ mobile app. Download from the App Store or Play Store to watch product demos from verified suppliers.</Text>
            <TouchableOpacity style={vid.closeBtn} onPress={onClose}>
              <Text style={vid.closeBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, cartCount, saveItem, isSaved, startProductConversation } = useApp();

  const product = PRODUCTS.find(p => p.id === id);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] ?? '');
  const [qty, setQty] = useState(product?.moq ?? 1);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  if (!product) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundTxt, { color: colors.mutedForeground }]}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLinkTxt, { color: colors.brand }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const galleryData = PRODUCT_GALLERY[product.id]?.images ?? [product.image];
  const hasVideo = !!(PRODUCT_GALLERY[product.id]?.videoUrl);
  // All slides: real images + optional VIDEO slide
  const allSlides: string[] = hasVideo ? [...galleryData, 'VIDEO'] : galleryData;

  const ai = useAIPriceInsight(product.price, product.id);
  const aiReview = getAIReviewSummary(product.rating, product.category);
  const viewsToday = 20 + ((parseInt(product.id) * 13) % 60);
  const ordersWeek = Math.max(3, Math.floor(product.sold * 0.018) + (parseInt(product.id) % 8));

  const currentPrice = () => {
    const tier = [...product.bulkPricing].reverse().find(t => qty >= t.qty);
    return tier ? tier.price : product.price;
  };
  const totalPrice = currentPrice() * qty;
  const originCode = PRODUCT_COUNTRY[product.id] ?? product.country ?? 'NG';
  const originCurrency = CURRENCY_META[originCode] ?? CURRENCY_META.NG;
  const convertedPrice = convertFromNGN(currentPrice(), originCode);
  const itemForCart = {
    productId: product.id, name: product.name, price: currentPrice(), qty,
    unit: product.unit, variant: selectedVariant, supplier: product.supplier,
    supplierId: product.supplierId, image: product.image, delivery: product.delivery, moq: product.moq,
  };

  const handleAddToCart = () => {
    addToCart(itemForCart);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Added to cart ✓', `${qty} ${product.unit} of ${product.name}`, [
      { text: 'Keep Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/cart') },
    ]);
  };

  const handleOrderNow = () => {
    addToCart(itemForCart);
    router.push('/cart');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}>

        {/* ── Gallery ── */}
        <View style={styles.galleryWrap}>
          <FlatList
            data={allSlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onMomentumScrollEnd={e => setGalleryIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ width, height: 310 }}
                activeOpacity={0.95}
                onPress={() => item === 'VIDEO' ? setVideoModalVisible(true) : setLightboxIdx(index)}
              >
                {item === 'VIDEO' ? (
                  <View style={{ width, height: 310 }}>
                    <Image source={{ uri: galleryData[0] }} style={{ width, height: 310 }} contentFit="cover" />
                    <View style={styles.videoOverlay}>
                      <View style={styles.playCircle}>
                        <Ionicons name="play" size={32} color="#ffffff" />
                      </View>
                      <View style={styles.videoTag}>
                        <Ionicons name="videocam" size={12} color="#ffffff" />
                        <Text style={styles.videoTagTxt}>Watch Video</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <Image source={{ uri: item }} style={{ width, height: 310 }} contentFit="cover" />
                )}
              </TouchableOpacity>
            )}
          />

          {/* Gallery overlay controls */}
          <View style={[styles.galleryTopBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={styles.imgBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.imgRight}>
              <TouchableOpacity style={styles.imgBtn} onPress={() => router.push('/cart')}>
                <Ionicons name="cart-outline" size={22} color="#ffffff" />
                {cartCount > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeTxt}>{cartCount}</Text></View>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.imgBtn}>
                <Ionicons name="share-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Gallery dots + count */}
          <View style={styles.galleryBottom}>
            <View style={styles.galDots}>
              {allSlides.map((_, i) => (
                <View key={i} style={[styles.galDot, i === galleryIdx && styles.galDotActive]} />
              ))}
            </View>
            <View style={styles.mediaCountBadge}>
              {hasVideo && <Ionicons name="videocam" size={11} color="#ffffff" />}
              <Text style={styles.mediaCountTxt}>{galleryData.length} Photos{hasVideo ? ' · 1 Video' : ''}</Text>
            </View>
          </View>

          {/* Tap to expand hint */}
          <View style={styles.tapHint}>
            <Ionicons name="expand-outline" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.tapHintTxt}>Tap to expand</Text>
          </View>

          {product.badge && (
            <View style={[styles.photoBadge, { backgroundColor: product.badge === 'HOT' ? '#ef4444' : product.badge === 'NEW' ? '#0284c7' : '#059669' }]}>
              <Text style={styles.photoBadgeTxt}>{product.badge}</Text>
            </View>
          )}
        </View>

        {/* ── Social proof strip ── */}
        <View style={[styles.socialStrip, { backgroundColor: colors.card }]}>
          <View style={styles.socialItem}>
            <Ionicons name="eye-outline" size={14} color="#f59e0b" />
            <Text style={[styles.socialTxt, { color: colors.foreground }]}>{viewsToday} viewing now</Text>
          </View>
          <View style={[styles.socialDivider, { backgroundColor: colors.border }]} />
          <View style={styles.socialItem}>
            <Ionicons name="bag-check-outline" size={14} color={colors.brand} />
            <Text style={[styles.socialTxt, { color: colors.foreground }]}>{ordersWeek} orders this week</Text>
          </View>
          <View style={[styles.socialDivider, { backgroundColor: colors.border }]} />
          <View style={styles.socialItem}>
            <Ionicons name="shield-checkmark" size={14} color={colors.brand} />
            <Text style={[styles.socialTxt, { color: colors.foreground }]}>Escrow Protected</Text>
          </View>
        </View>

        {/* ── Content card ── */}
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          {/* Chips */}
          <View style={styles.badgeRow}>
            {product.escrow && (
              <View style={[styles.chip, { backgroundColor: colors.brandBg }]}>
                <Ionicons name="shield-checkmark" size={12} color={colors.brand} />
                <Text style={[styles.chipTxt, { color: colors.brand }]}>Escrow Protected</Text>
              </View>
            )}
            <View style={[styles.chip, { backgroundColor: colors.navyBg }]}>
              <Ionicons name="checkmark-circle" size={12} color={colors.navy} />
              <Text style={[styles.chipTxt, { color: colors.navy }]}>Verified Supplier</Text>
            </View>
            {product.featured && (
              <View style={[styles.chip, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="star" size={12} color="#d97706" />
                <Text style={[styles.chipTxt, { color: '#d97706' }]}>Featured</Text>
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: colors.foreground }]}>{product.name}</Text>

          {/* Rating + sold */}
          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(s => (
                <Ionicons key={s} name={s <= Math.floor(product.rating) ? 'star' : s - 0.5 <= product.rating ? 'star-half' : 'star-outline'} size={14} color="#f59e0b" />
              ))}
              <Text style={[styles.ratingTxt, { color: colors.foreground }]}>{product.rating}</Text>
              <Text style={[styles.reviewsTxt, { color: colors.mutedForeground }]}>({product.reviews} reviews)</Text>
            </View>
            <Text style={[styles.soldTxt, { color: colors.mutedForeground }]}>{product.sold.toLocaleString()} sold</Text>
          </View>

          {/* Price + MOQ */}
          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.price, { color: colors.brand }]}>
                {fmt(currentPrice())}<Text style={styles.perUnit}>/{product.unit}</Text>
              </Text>
              {originCode !== 'NG' && (
                <Text style={[styles.currencyHint, { color: colors.mutedForeground }]}>
                  {originCurrency.symbol}{convertedPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} {originCurrency.code} · live conversion preview
                </Text>
              )}
              {currentPrice() < product.price && (
                <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>{fmt(product.price)}</Text>
              )}
            </View>
            <View style={[styles.moqBadge, { backgroundColor: colors.goldBg }]}>
              <Text style={[styles.moqTxt, { color: colors.goldDark }]}>MOQ: {product.moq} {product.unit}</Text>
            </View>
          </View>

          {/* ── AI Price Intelligence ── */}
          <View style={[styles.aiPanel, { borderColor: colors.brand + '33', backgroundColor: colors.brandBg }]}>
            <View style={styles.aiPanelHeader}>
              <View style={[styles.aiBadge, { backgroundColor: colors.brand }]}>
                <Ionicons name="sparkles" size={11} color="#ffffff" />
                <Text style={styles.aiBadgeTxt}>AFRIQ AI</Text>
              </View>
              <Text style={[styles.aiPanelTitle, { color: colors.foreground }]}>Price Intelligence</Text>
            </View>
            <Text style={[styles.aiPriceVerdict, { color: ai.isGoodDeal ? '#059669' : '#d97706' }]}>
              {ai.isGoodDeal
                ? `↓ ${Math.abs(ai.pctDiff)}% below Lagos market avg · Good Deal`
                : `↑ ${ai.pctDiff}% above market avg · Consider negotiating`}
            </Text>
            {/* Score bar */}
            <View style={[styles.aiScoreTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.aiScoreFill, { width: `${ai.score}%` as any, backgroundColor: ai.score >= 70 ? '#059669' : '#d97706' }]} />
            </View>
            <View style={styles.aiScoreRow}>
              <Text style={[styles.aiScoreLabel, { color: colors.mutedForeground }]}>Market low: {fmt(ai.low)}</Text>
              <Text style={[styles.aiScoreLabel, { color: ai.isGoodDeal ? '#059669' : '#d97706' }]}>
                Score: {ai.score}/100
              </Text>
              <Text style={[styles.aiScoreLabel, { color: colors.mutedForeground }]}>High: {fmt(ai.high)}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Variants */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Select Variant</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {product.variants.map(v => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.variantBtn,
                  { borderColor: selectedVariant === v ? colors.brand : colors.border, backgroundColor: selectedVariant === v ? colors.brandBg : colors.card },
                ]}
                onPress={() => setSelectedVariant(v)}
              >
                {selectedVariant === v && <Ionicons name="checkmark-circle" size={12} color={colors.brand} style={{ marginRight: 2 }} />}
                <Text style={[styles.variantTxt, { color: selectedVariant === v ? colors.brand : colors.foreground }]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quantity */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Quantity ({product.unit})</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setQty(q => Math.max(product.moq, q - Math.ceil(product.moq / 5)))}
            >
              <Ionicons name="remove" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <View style={[styles.qtyDisplay, { borderColor: colors.border }]}>
              <Text style={[styles.qtyTxt, { color: colors.foreground }]}>{qty}</Text>
            </View>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setQty(q => q + Math.ceil(product.moq / 5))}
            >
              <Ionicons name="add" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <View style={[styles.totalBox, { backgroundColor: colors.brandBg }]}>
              <Text style={[styles.totalTxt, { color: colors.brand }]}>Total: {fmt(totalPrice)}</Text>
            </View>
          </View>

          {/* AI Trade Tip */}
          <View style={[styles.aiTradeTip, { backgroundColor: colors.navyBg, borderColor: colors.navy + '44' }]}>
            <Ionicons name="bulb-outline" size={14} color={colors.navy} />
            <Text style={[styles.aiTradeTipTxt, { color: colors.navy }]}>
              {qty >= (product.bulkPricing[product.bulkPricing.length - 1]?.qty ?? Infinity)
                ? `✓ You're getting the best bulk price for this order`
                : `Order ${product.bulkPricing[0]?.qty ?? product.moq * 2}+ ${product.unit} to unlock ${Math.round(((product.price - (product.bulkPricing[0]?.price ?? product.price)) / product.price) * 100)}% bulk discount`
              }
            </Text>
          </View>

          {/* Bulk pricing */}
          {product.bulkPricing.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Bulk Pricing Tiers</Text>
              <View style={[styles.bulkTable, { borderColor: colors.border }]}>
                <View style={[styles.bulkHeader, { backgroundColor: colors.background }]}>
                  <Text style={[styles.bulkHeaderTxt, { color: colors.mutedForeground }]}>Quantity</Text>
                  <Text style={[styles.bulkHeaderTxt, { color: colors.mutedForeground }]}>Price/{product.unit}</Text>
                  <Text style={[styles.bulkHeaderTxt, { color: colors.mutedForeground }]}>Savings</Text>
                </View>
                <View style={styles.bulkRow}>
                  <Text style={[styles.bulkCell, { color: colors.foreground }]}>1–{product.bulkPricing[0].qty - 1}</Text>
                  <Text style={[styles.bulkCell, { color: colors.foreground }]}>{fmt(product.price)}</Text>
                  <Text style={[styles.bulkCell, { color: colors.mutedForeground }]}>Base</Text>
                </View>
                {product.bulkPricing.map((tier, i) => (
                  <View key={i} style={[styles.bulkRow, qty >= tier.qty && { backgroundColor: colors.brandBg }]}>
                    <Text style={[styles.bulkCell, { color: colors.foreground }]}>{tier.qty}+</Text>
                    <Text style={[styles.bulkCell, { color: colors.brand, fontFamily: 'Inter_700Bold' }]}>{fmt(tier.price)}</Text>
                    <Text style={[styles.bulkCell, { color: colors.brand }]}>
                      -{Math.round(((product.price - tier.price) / product.price) * 100)}%
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Delivery */}
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.navyBg }]}>
              <Ionicons name="cube-outline" size={18} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.foreground }]}>Delivery Time</Text>
              <Text style={[styles.infoVal, { color: colors.mutedForeground }]}>{product.delivery} · {product.location}</Text>
            </View>
            <View style={[styles.escrowInfoBadge, { backgroundColor: colors.brandBg }]}>
              <Ionicons name="lock-closed" size={11} color={colors.brand} />
              <Text style={[styles.escrowInfoTxt, { color: colors.brand }]}>Escrow</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Supplier card — links to full profile */}
          <TouchableOpacity
            style={[styles.supplierCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => router.push(`/supplier/${product.supplierId}` as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.supplierAvatar, { backgroundColor: colors.brandBg }]}>
              <Text style={[styles.supplierAvatarTxt, { color: colors.brand }]}>
                {product.supplier.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.supplierNameRow}>
                <Text style={[styles.supplierName, { color: colors.foreground }]}>{product.supplier}</Text>
                {product.supplierTrust >= 95 && (
                  <View style={[styles.goldBadge, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="star" size={10} color="#d97706" />
                    <Text style={[styles.goldBadgeTxt, { color: '#d97706' }]}>Gold</Text>
                  </View>
                )}
              </View>
              <View style={styles.supplierMeta}>
                <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
                <Text style={[styles.supplierMetaTxt, { color: colors.mutedForeground }]}>{product.location}</Text>
              </View>
              <View style={styles.supplierStats}>
                <View style={[styles.trustChip, { backgroundColor: colors.brandBg }]}>
                  <Ionicons name="shield-checkmark" size={10} color={colors.brand} />
                  <Text style={[styles.trustChipTxt, { color: colors.brand }]}>{product.supplierTrust}% Trust</Text>
                </View>
                <Text style={[styles.supplierDeals, { color: colors.mutedForeground }]}>{product.supplierDeals.toLocaleString()} deals</Text>
              </View>
            </View>
            <View style={styles.supplierActions}>
              <TouchableOpacity
                style={[styles.chatBtn, { backgroundColor: colors.brandBg }]}
                onPress={(e) => { e.stopPropagation(); router.push('/(tabs)/messages' as any); }}
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.brand} />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} style={{ marginTop: 4 }} />
            </View>
          </TouchableOpacity>

          <Text style={[styles.supplierProfileHint, { color: colors.mutedForeground }]}>
            Tap to view full business profile, certificates & reviews →
          </Text>

          <View style={styles.productActions}>
            <TouchableOpacity
              style={[styles.saveProductBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => saveItem(itemForCart)}
            >
              <Ionicons name={isSaved(product.id, selectedVariant) ? 'bookmark' : 'bookmark-outline'} size={16} color={colors.brand} />
              <Text style={[styles.saveProductTxt, { color: colors.brand }]}>{isSaved(product.id, selectedVariant) ? 'Saved for later' : 'Save item'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.askProductBtn, { backgroundColor: colors.brand }]}
              onPress={() => router.push(`/chat/${startProductConversation(product)}`)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#ffffff" />
              <Text style={styles.askProductTxt}>Ask about this item</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* ── AI Buyer Intelligence ── */}
          <View style={[styles.aiReviewPanel, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
            <View style={styles.aiReviewHeader}>
              <View style={[styles.aiBadge, { backgroundColor: '#059669' }]}>
                <Ionicons name="sparkles" size={11} color="#ffffff" />
                <Text style={styles.aiBadgeTxt}>AFRIQ AI</Text>
              </View>
              <Text style={[styles.aiReviewTitle, { color: '#064e3b' }]}>Buyer Intelligence</Text>
            </View>
            {aiReview.pros.map((p, i) => (
              <View key={i} style={styles.aiReviewRow}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={[styles.aiReviewTxt, { color: '#065f46' }]}>{p}</Text>
              </View>
            ))}
            {aiReview.cons.map((c, i) => (
              <View key={i} style={styles.aiReviewRow}>
                <Ionicons name="alert-circle-outline" size={14} color="#d97706" />
                <Text style={[styles.aiReviewTxt, { color: '#92400e' }]}>{c}</Text>
              </View>
            ))}
            <Text style={[styles.aiReviewFooter, { color: '#6ee7b7' }]}>
              Analysis based on {product.reviews} verified buyer reviews
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>About this Product</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>

          {/* Stock indicator */}
          <View style={[styles.stockRow, { borderColor: colors.border }]}>
            <View style={styles.stockLeft}>
              <Ionicons name="cube-outline" size={15} color={product.stock > 1000 ? colors.brand : '#d97706'} />
              <Text style={[styles.stockTxt, { color: product.stock > 1000 ? colors.brand : '#d97706' }]}>
                {product.stock > 5000 ? 'High stock' : product.stock > 500 ? `${product.stock.toLocaleString()} in stock` : `Only ${product.stock} remaining!`}
              </Text>
            </View>
            <Text style={[styles.stockSub, { color: colors.mutedForeground }]}>{product.unit}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom CTAs ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.bottomTotal, { color: colors.brand }]}>{fmt(totalPrice)}</Text>
          <Text style={[styles.bottomQty, { color: colors.mutedForeground }]}>{qty} {product.unit}</Text>
        </View>
        <View style={styles.ctaBtns}>
          <TouchableOpacity style={[styles.addCartBtn, { borderColor: colors.brand }]} onPress={handleAddToCart} activeOpacity={0.85}>
            <Ionicons name="cart-outline" size={18} color={colors.brand} />
            <Text style={[styles.addCartTxt, { color: colors.brand }]}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.orderBtn, { backgroundColor: colors.brand }]} onPress={handleOrderNow} activeOpacity={0.85}>
            <Ionicons name="flash-outline" size={16} color="#ffffff" />
            <Text style={styles.orderBtnTxt}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox images={galleryData} startIndex={Math.min(lightboxIdx, galleryData.length - 1)} onClose={() => setLightboxIdx(null)} />
      )}

      {/* Video modal */}
      <VideoModal
        visible={videoModalVisible}
        productName={product.name}
        thumbUri={galleryData[0]}
        onClose={() => setVideoModalVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundTxt: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  backLinkTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  // Gallery
  galleryWrap: { height: 310, position: 'relative', overflow: 'hidden' },
  galleryTopBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16 },
  imgBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  imgRight: { flexDirection: 'row', gap: 8 },
  cartBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#ef4444', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  cartBadgeTxt: { fontSize: 9, color: '#fff', fontFamily: 'Inter_700Bold' },
  galleryBottom: { position: 'absolute', bottom: 36, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  galDots: { flexDirection: 'row', gap: 5 },
  galDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  galDotActive: { backgroundColor: '#ffffff', width: 18 },
  mediaCountBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  mediaCountTxt: { fontSize: 10, color: '#ffffff', fontFamily: 'Inter_600SemiBold' },
  tapHint: { position: 'absolute', bottom: 14, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  tapHintTxt: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  photoBadge: { position: 'absolute', top: 56, left: 16, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  photoBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
  playCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(5,150,105,0.9)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  videoTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  videoTagTxt: { fontSize: 13, color: '#ffffff', fontFamily: 'Inter_600SemiBold' },

  // Social strip
  socialStrip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, gap: 0 },
  socialItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  socialTxt: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  socialDivider: { width: 1, height: 20 },

  // Content
  content: { borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 20, minHeight: 400 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  name: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold', lineHeight: 28, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginLeft: 4 },
  reviewsTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  soldTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  price: { fontSize: 26, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  perUnit: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  originalPrice: { fontSize: 14, textDecorationLine: 'line-through', fontFamily: 'Inter_400Regular' },
  currencyHint: { fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 3 },
  moqBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  moqTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  // AI Panel
  aiPanel: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 18 },
  aiPanelHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiBadgeTxt: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#ffffff' },
  aiPanelTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  aiPriceVerdict: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  aiScoreTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  aiScoreFill: { height: '100%', borderRadius: 4 },
  aiScoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  aiScoreLabel: { fontSize: 10, fontFamily: 'Inter_400Regular' },

  // AI trade tip
  aiTradeTip: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginTop: 10, marginBottom: 4 },
  aiTradeTipTxt: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 18 },

  divider: { height: 1, marginVertical: 18 },
  sectionLabel: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 12 },

  // Variants
  variantBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  variantTxt: { fontSize: 13, fontFamily: 'Inter_500Medium' },

  // Qty
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  qtyBtn: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  qtyDisplay: { width: 70, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10 },
  qtyTxt: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  totalBox: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  totalTxt: { fontSize: 13, fontFamily: 'Inter_700Bold' },

  // Bulk pricing
  bulkTable: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 6 },
  bulkHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10 },
  bulkHeaderTxt: { flex: 1, fontSize: 11, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  bulkRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10 },
  bulkCell: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center' },

  // Info row
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  infoVal: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  escrowInfoBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10 },
  escrowInfoTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  // Supplier
  supplierCard: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  supplierAvatar: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  supplierAvatarTxt: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  supplierNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  supplierName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  goldBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  goldBadgeTxt: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  supplierMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3, marginBottom: 6 },
  supplierMetaTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  supplierStats: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  trustChipTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  supplierDeals: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  supplierActions: { alignItems: 'center', gap: 4 },
  chatBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  supplierProfileHint: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8, marginBottom: 4 },
  productActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  saveProductBtn: { flex: 1, height: 42, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  saveProductTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  askProductBtn: { flex: 1.35, height: 42, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  askProductTxt: { color: '#ffffff', fontSize: 12, fontFamily: 'Inter_700Bold' },

  // AI Review Panel
  aiReviewPanel: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 18 },
  aiReviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  aiReviewTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  aiReviewRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 7 },
  aiReviewTxt: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  aiReviewFooter: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 6, color: '#6ee7b7' },

  // Description & stock
  description: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 21, marginBottom: 16 },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 12 },
  stockLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stockTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  stockSub: { fontSize: 11, fontFamily: 'Inter_400Regular' },

  // Bottom bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, elevation: 8 },
  bottomTotal: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  bottomQty: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  ctaBtns: { flexDirection: 'row', gap: 10 },
  addCartBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 14, borderWidth: 1.5 },
  addCartTxt: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  orderBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14 },
  orderBtnTxt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#ffffff' },
});

// ─── Lightbox styles ──────────────────────────────────────────
const lb = StyleSheet.create({
  bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.97)', justifyContent: 'center' },
  topBar: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  counter: { color: '#ffffff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  dots: { position: 'absolute', bottom: 60, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
});

// ─── Video modal styles ───────────────────────────────────────
const vid = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', backgroundColor: '#ffffff' },
  thumb: { width: '100%', height: 200 },
  playCircle: { position: 'absolute', top: 70, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', height: 80 },
  info: { padding: 24 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  aiBadgeTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#059669' },
  vidTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 10 },
  vidDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6b7280', lineHeight: 20, marginBottom: 20 },
  closeBtn: { backgroundColor: '#059669', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  closeBtnTxt: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#ffffff' },
});
