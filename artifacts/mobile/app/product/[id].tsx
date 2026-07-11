import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { PRODUCTS, fmt } from '@/constants/data';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, cartCount } = useApp();

  const product = PRODUCTS.find(p => p.id === id);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] ?? '');
  const [qty, setQty] = useState(product?.moq ?? 1);

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

  const currentPrice = () => {
    const tier = [...product.bulkPricing].reverse().find(t => qty >= t.qty);
    return tier ? tier.price : product.price;
  };
  const totalPrice = currentPrice() * qty;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice(),
      qty,
      unit: product.unit,
      variant: selectedVariant,
      supplier: product.supplier,
      supplierId: product.supplierId,
      image: product.image,
      delivery: product.delivery,
      moq: product.moq,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Added to cart', `${product.name} added. Qty: ${qty} ${product.unit}`, [
      { text: 'Keep Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/cart') },
    ]);
  };

  const handleOrderNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice(),
      qty,
      unit: product.unit,
      variant: selectedVariant,
      supplier: product.supplier,
      supplierId: product.supplierId,
      image: product.image,
      delivery: product.delivery,
      moq: product.moq,
    });
    router.push('/cart');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}>
        {/* Image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
          <View style={[styles.imageOverlay, { paddingTop: insets.top + 8 }]}>
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
          {product.badge && (
            <View style={[styles.photoBadge, { backgroundColor: product.badge === 'HOT' ? '#ef4444' : colors.navy }]}>
              <Text style={styles.photoBadgeTxt}>{product.badge}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          {/* Badges */}
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
          </View>

          <Text style={[styles.name, { color: colors.foreground }]}>{product.name}</Text>

          {/* Rating + sold */}
          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(s => (
                <Ionicons key={s} name={s <= Math.floor(product.rating) ? 'star' : 'star-outline'} size={14} color="#f59e0b" />
              ))}
              <Text style={[styles.ratingTxt, { color: colors.foreground }]}>{product.rating}</Text>
              <Text style={[styles.reviewsTxt, { color: colors.mutedForeground }]}>({product.reviews} reviews)</Text>
            </View>
            <Text style={[styles.soldTxt, { color: colors.mutedForeground }]}>{product.sold.toLocaleString()} sold</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.price, { color: colors.brand }]}>{fmt(currentPrice())}<Text style={styles.perUnit}>/{product.unit}</Text></Text>
              {currentPrice() < product.price && (
                <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>{fmt(product.price)}</Text>
              )}
            </View>
            <View style={[styles.moqBadge, { backgroundColor: colors.goldBg }]}>
              <Text style={[styles.moqTxt, { color: colors.goldDark }]}>MOQ: {product.moq} {product.unit}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Variants */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Select Variant</Text>
          <View style={styles.variants}>
            {product.variants.map(v => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.variantBtn,
                  { borderColor: selectedVariant === v ? colors.brand : colors.border, backgroundColor: selectedVariant === v ? colors.brandBg : colors.card },
                ]}
                onPress={() => setSelectedVariant(v)}
              >
                <Text style={[styles.variantTxt, { color: selectedVariant === v ? colors.brand : colors.foreground }]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

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

          {/* Bulk pricing */}
          {product.bulkPricing.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Bulk Pricing</Text>
              <View style={[styles.bulkTable, { borderColor: colors.border }]}>
                <View style={[styles.bulkHeader, { backgroundColor: colors.background }]}>
                  <Text style={[styles.bulkHeaderTxt, { color: colors.mutedForeground }]}>Quantity</Text>
                  <Text style={[styles.bulkHeaderTxt, { color: colors.mutedForeground }]}>Price per {product.unit}</Text>
                  <Text style={[styles.bulkHeaderTxt, { color: colors.mutedForeground }]}>Savings</Text>
                </View>
                <View style={styles.bulkRow}>
                  <Text style={[styles.bulkCell, { color: colors.foreground }]}>1–{product.bulkPricing[0].qty - 1}+</Text>
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
            <View>
              <Text style={[styles.infoLabel, { color: colors.foreground }]}>Delivery Time</Text>
              <Text style={[styles.infoVal, { color: colors.mutedForeground }]}>{product.delivery} · {product.location}</Text>
            </View>
          </View>

          {/* Supplier */}
          <View style={[styles.supplierCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.supplierAvatar, { backgroundColor: colors.brandBg }]}>
              <Text style={[styles.supplierAvatarTxt, { color: colors.brand }]}>
                {product.supplier.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.supplierName, { color: colors.foreground }]}>{product.supplier}</Text>
              <View style={styles.supplierMeta}>
                <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
                <Text style={[styles.supplierMetaTxt, { color: colors.mutedForeground }]}>{product.location}</Text>
                <View style={[styles.trustChip, { backgroundColor: colors.brandBg }]}>
                  <Ionicons name="shield-checkmark" size={10} color={colors.brand} />
                  <Text style={[styles.trustChipTxt, { color: colors.brand }]}>{product.supplierTrust}% Trust</Text>
                </View>
              </View>
              <Text style={[styles.supplierDeals, { color: colors.mutedForeground }]}>{product.supplierDeals.toLocaleString()} completed deals</Text>
            </View>
            <TouchableOpacity
              style={[styles.chatBtn, { backgroundColor: colors.brandBg }]}
              onPress={() => {
                // find or create conversation
                router.push('/messages' as any);
              }}
            >
              <Ionicons name="chatbubble-outline" size={18} color={colors.brand} />
              <Text style={[styles.chatBtnTxt, { color: colors.brand }]}>Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>About this Product</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
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
            <Text style={styles.orderBtnTxt}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageWrap: { height: 300, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingBottom: 16 },
  imgBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  imgRight: { flexDirection: 'row', gap: 8 },
  cartBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#ef4444', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  cartBadgeTxt: { fontSize: 9, color: '#fff', fontFamily: 'Inter_700Bold' },
  photoBadge: { position: 'absolute', bottom: 16, left: 16, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  photoBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },

  content: { borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, padding: 20, minHeight: 400 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  name: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold', lineHeight: 28, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginLeft: 4 },
  reviewsTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  soldTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  price: { fontSize: 26, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  perUnit: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  originalPrice: { fontSize: 14, fontFamily: 'Inter_400Regular', textDecorationLine: 'line-through', marginTop: 2 },
  moqBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  moqTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  divider: { height: 1, marginVertical: 16 },
  sectionLabel: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 12 },

  variants: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  variantBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  variantTxt: { fontSize: 13, fontFamily: 'Inter_500Medium' },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  qtyBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  qtyDisplay: { width: 72, height: 42, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  qtyTxt: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  totalBox: { flex: 1, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  totalTxt: { fontSize: 14, fontFamily: 'Inter_700Bold' },

  bulkTable: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  bulkHeader: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 14 },
  bulkHeaderTxt: { flex: 1, fontSize: 11, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  bulkRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 14 },
  bulkCell: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  infoIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  infoVal: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

  supplierCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 20 },
  supplierAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  supplierAvatarTxt: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  supplierName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  supplierMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  supplierMetaTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  trustChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  trustChipTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  supplierDeals: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  chatBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  chatBtnTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  description: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  bottomTotal: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  bottomQty: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  ctaBtns: { flexDirection: 'row', gap: 10 },
  addCartBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 2 },
  addCartTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  orderBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, justifyContent: 'center' },
  orderBtnTxt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#ffffff' },

  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundTxt: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  backLinkTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
