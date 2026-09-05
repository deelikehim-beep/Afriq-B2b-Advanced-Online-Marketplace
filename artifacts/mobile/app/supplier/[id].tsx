import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Animated, Dimensions, FlatList, Linking, Modal, ScrollView,
  StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { SUPPLIERS, PRODUCTS, fmt, type SupplierProfile, type SupplierCertificate, type SupplierReview } from '@/constants/data';

const { width } = Dimensions.get('window');
type Tab = 'overview' | 'products' | 'reviews' | 'certificates';

// ─── AI Scan Modal ────────────────────────────────────────────
function AIScanModal({ visible, cert, onClose }: {
  visible: boolean;
  cert: SupplierCertificate | null;
  onClose: () => void;
}) {
  const colors = useColors();
  const progress = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && cert) {
      setPhase('scanning');
      progress.setValue(0);
      fadeAnim.setValue(0);
      scanLine.setValue(0);

      // Scan line loop
      const scanLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLine, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(scanLine, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      );
      scanLoop.start();

      // Progress fills in 2.5s
      Animated.timing(progress, {
        toValue: 1, duration: 2500, useNativeDriver: false,
      }).start(() => {
        scanLoop.stop();
        setPhase('done');
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }).start();
      });
    }
  }, [visible, cert]);

  if (!cert) return null;
  const d = cert.aiExtracted;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={scan.overlay}>
        <View style={[scan.sheet, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={scan.header}>
            <View style={scan.aiIcon}>
              <Ionicons name="scan" size={22} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[scan.title, { color: colors.foreground }]}>Certificate Analysis</Text>
              <Text style={[scan.sub, { color: colors.mutedForeground }]}>{cert.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={scan.closeBtn}>
              <Ionicons name="close" size={22} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Document preview with scan line */}
          <View style={[scan.docPreview, { backgroundColor: colors.background }]}>
            <View style={scan.docLines}>
              {[80, 60, 70, 50, 65, 45, 55].map((w, i) => (
                <View key={i} style={[scan.docLine, { width: `${w}%` as any, backgroundColor: colors.border }]} />
              ))}
              <View style={[scan.certBadgeBox, { borderColor: colors.brand }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.brand} />
                <Text style={[scan.certBadgeTxt, { color: colors.brand }]}>Official Document</Text>
              </View>
            </View>
            {phase === 'scanning' && (
              <Animated.View
                style={[
                  scan.scanLineEl,
                  {
                    backgroundColor: colors.brand + '99',
                    transform: [{
                      translateY: scanLine.interpolate({ inputRange: [0, 1], outputRange: [0, 140] }),
                    }],
                  },
                ]}
              />
            )}
            {phase === 'done' && (
              <View style={scan.doneOverlay}>
                <Ionicons name="checkmark-circle" size={40} color={colors.brand} />
              </View>
            )}
          </View>

          {/* Progress bar */}
          <View style={[scan.progressTrack, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[
                scan.progressFill,
                {
                  backgroundColor: colors.brand,
                  width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                },
              ]}
            />
          </View>
          <Text style={[scan.progressLabel, { color: colors.mutedForeground }]}>
            {phase === 'scanning' ? 'Analyzing document…' : 'Analysis complete'}
          </Text>

          {/* Extracted data */}
          {phase === 'done' && d && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={[scan.resultCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[scan.resultTitle, { color: colors.foreground }]}>Extracted Information</Text>
                {[
                  { label: 'Business Name', value: d.businessName, icon: 'business-outline' },
                  { label: 'RC / Registration No.', value: d.rcNumber, icon: 'barcode-outline' },
                  { label: 'Business Type', value: d.businessType, icon: 'briefcase-outline' },
                  { label: 'Registered Address', value: d.address, icon: 'location-outline' },
                  { label: 'Directors', value: d.directors.join(' · '), icon: 'people-outline' },
                ].map(item => (
                  <View key={item.label} style={scan.resultRow}>
                    <Ionicons name={item.icon as any} size={14} color={colors.mutedForeground} />
                    <View style={{ flex: 1 }}>
                      <Text style={[scan.resultLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                      <Text style={[scan.resultValue, { color: colors.foreground }]}>{item.value}</Text>
                    </View>
                  </View>
                ))}
                {/* Status */}
                <View style={scan.resultRow}>
                  <Ionicons name="checkmark-circle" size={14} color={d.status === 'Active' ? '#059669' : '#ef4444'} />
                  <View style={{ flex: 1 }}>
                    <Text style={[scan.resultLabel, { color: colors.mutedForeground }]}>Registration Status</Text>
                    <View style={[scan.statusPill, { backgroundColor: d.status === 'Active' ? '#dcfce7' : '#fee2e2' }]}>
                      <Text style={[scan.statusTxt, { color: d.status === 'Active' ? '#059669' : '#ef4444' }]}>
                        ● {d.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Verified badge */}
              <View style={[scan.verifiedBanner, { backgroundColor: colors.brandBg }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.brand} />
              <Text style={[scan.verifiedTxt, { color: colors.brand }]}>Verification complete · {new Date().toLocaleDateString('en-GB')}</Text>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Star Rating Row ──────────────────────────────────────────
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-outline'}
          size={size}
          color="#f59e0b"
        />
      ))}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────
export default function SupplierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [scanCert, setScanCert] = useState<SupplierCertificate | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const { followedSuppliers, toggleFollowSupplier } = useApp();

  const supplier: SupplierProfile | undefined = SUPPLIERS[id ?? ''];

  // Build a fallback from product data if no profile registered
  const products = PRODUCTS.filter(p => p.supplierId === id);
  const firstProduct = products[0];

  if (!supplier && !firstProduct) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="business-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundTxt, { color: colors.mutedForeground }]}>Supplier not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.brand }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use supplier profile or build a minimal one from product data
  const s: SupplierProfile = supplier ?? {
    id: id ?? '',
    name: firstProduct.supplier,
    initials: firstProduct.supplier.split(' ').map(w => w[0]).join('').slice(0, 2),
    coverImage: firstProduct.image,
    description: `${firstProduct.supplier} is a verified B2B supplier on AFRIQ, specialising in ${firstProduct.category} products. Based in ${firstProduct.location}.`,
    location: firstProduct.location,
    storeAddress: firstProduct.location,
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    established: 2018,
    businessType: 'Trading Company',
    mainCategory: firstProduct.category,
    trustScore: firstProduct.supplierTrust,
    totalDeals: firstProduct.supplierDeals,
    successRate: 96,
    responseTime: '< 4 hours',
    responseRate: 89,
    deliveryRate: 95,
    annualRevenue: '₦100M–₦500M',
    employees: '11–50',
    mainProducts: products.slice(0, 3).map(p => p.name),
    certificates: [],
    galleryImages: [firstProduct.image],
    phone: '+234 800 000 0000',
    whatsapp: '+2348000000000',
    email: 'info@supplier.com',
    verified: firstProduct.supplierTrust >= 90,
    goldSupplier: firstProduct.supplierTrust >= 95,
    tradeCapacity: {
      monthlyCapacity: '1,000 units',
      exportCountries: ['Nigeria'],
      minOrder: `${firstProduct.moq} ${firstProduct.unit}`,
      leadTime: firstProduct.delivery,
      paymentTerms: ['Escrow', 'Bank Transfer'],
    },
    reviews: [],
    overallRating: firstProduct.rating,
    totalReviews: firstProduct.reviews,
  };
  const publicStoreAddress = s.storeAddress ?? s.certificates.find(cert => cert.aiExtracted?.address)?.aiExtracted?.address ?? s.location;

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'business-outline' },
    { key: 'products', label: 'Products', icon: 'cube-outline' },
    { key: 'reviews', label: 'Reviews', icon: 'star-outline' },
    { key: 'certificates', label: 'Certs', icon: 'shield-checkmark-outline' },
  ];

  const stats = [
    { label: 'Trust Score', value: `${s.trustScore}%`, icon: 'shield-checkmark', color: colors.brand },
    { label: 'Response', value: `${s.responseRate}%`, icon: 'chatbubble-ellipses', color: colors.navy },
    { label: 'Delivery', value: `${s.deliveryRate}%`, icon: 'cube', color: '#8b5cf6' },
    { label: 'Deals', value: s.totalDeals.toLocaleString(), icon: 'checkmark-circle', color: '#f59e0b' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>

        {/* ── Cover + Identity ── */}
        <View style={styles.coverWrap}>
          <Image source={{ uri: s.coverImage }} style={styles.coverImg} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.coverGrad}
          />
          {/* Back button */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Avatar overlapping cover */}
          <View style={[styles.avatarWrap, { backgroundColor: colors.card }]}>
            <View style={[styles.avatar, { backgroundColor: colors.brandBg }]}>
              <Image source={{ uri: s.avatarImage ?? s.coverImage }} style={styles.avatarImage} contentFit="cover" />
            </View>
          </View>
        </View>

        {/* ── Identity Card ── */}
        <View style={[styles.identityCard, { backgroundColor: colors.card }]}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameChips}>
                <Text style={[styles.supplierName, { color: colors.foreground }]}>{s.name}</Text>
                {s.verified && (
                  <View style={[styles.verifiedChip, { backgroundColor: colors.brandBg }]}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.brand} />
                    <Text style={[styles.verifiedChipTxt, { color: colors.brand }]}>Verified</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[styles.followBtn, { borderColor: followedSuppliers.includes(s.id) ? colors.brand : colors.border, backgroundColor: followedSuppliers.includes(s.id) ? colors.brandBg : colors.card }]}
                onPress={() => toggleFollowSupplier(s.id)}
              >
                <Ionicons name={followedSuppliers.includes(s.id) ? 'heart' : 'heart-outline'} size={13} color={colors.brand} />
                <Text style={[styles.followBtnTxt, { color: colors.brand }]}>{followedSuppliers.includes(s.id) ? 'Following' : 'Follow supplier'}</Text>
              </TouchableOpacity>
              <View style={styles.locationRow}>
                <Text style={styles.countryFlag}>{s.countryFlag}</Text>
                <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
                <Text style={[styles.locationTxt, { color: colors.mutedForeground }]}>{s.location}</Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="storefront-outline" size={12} color={colors.mutedForeground} />
                <Text numberOfLines={2} style={[styles.locationTxt, { color: colors.mutedForeground }]}>Store address: {publicStoreAddress}</Text>
              </View>
            </View>
          </View>

          {/* Business type chips */}
          <View style={styles.chipRow}>
            <View style={[styles.chip, { backgroundColor: colors.navyBg }]}>
              <Ionicons name="briefcase-outline" size={11} color={colors.navy} />
              <Text style={[styles.chipTxt, { color: colors.navy }]}>{s.businessType}</Text>
            </View>
            {s.goldSupplier && (
              <View style={[styles.chip, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="star" size={11} color="#d97706" />
                <Text style={[styles.chipTxt, { color: '#d97706' }]}>Gold Supplier</Text>
              </View>
            )}
            <View style={[styles.chip, { backgroundColor: colors.background }]}>
              <Ionicons name="calendar-outline" size={11} color={colors.mutedForeground} />
              <Text style={[styles.chipTxt, { color: colors.mutedForeground }]}>Est. {s.established}</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            {stats.map(stat => (
              <View key={stat.label} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '22' }]}>
                  <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, activeTab === tab.key && { borderBottomColor: colors.brand }]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={activeTab === tab.key ? colors.brand : colors.mutedForeground}
              />
              <Text style={[styles.tabTxt, { color: activeTab === tab.key ? colors.brand : colors.mutedForeground }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab Content ── */}
        <View style={{ paddingBottom: 20 }}>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <View style={{ padding: 16, gap: 16 }}>
              {/* About */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About this Company</Text>
                <Text style={[styles.bodyTxt, { color: colors.textSecondary }]}>{s.description}</Text>
                <View style={[styles.publicAddress, { backgroundColor: colors.brandBg }]}>
                  <Ionicons name="storefront-outline" size={16} color={colors.brand} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.publicAddressLabel, { color: colors.brand }]}>Public store address</Text>
                    <Text style={[styles.publicAddressValue, { color: colors.foreground }]}>{publicStoreAddress}</Text>
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.infoGrid}>
                  {[
                    { label: 'Annual Revenue', value: s.annualRevenue, icon: 'trending-up-outline' },
                    { label: 'Employees', value: s.employees, icon: 'people-outline' },
                    { label: 'Response Time', value: s.responseTime, icon: 'time-outline' },
                    { label: 'Success Rate', value: `${s.successRate}%`, icon: 'checkmark-circle-outline' },
                  ].map(info => (
                    <View key={info.label} style={styles.infoGridItem}>
                      <Ionicons name={info.icon as any} size={16} color={colors.brand} />
                      <Text style={[styles.infoValue, { color: colors.foreground }]}>{info.value}</Text>
                      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{info.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Gallery */}
              {s.galleryImages.length > 0 && (
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Company Gallery</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
                    {s.galleryImages.map((img, i) => (
                      <View key={i} style={styles.galleryThumb}>
                        <Image source={{ uri: img }} style={styles.galleryImg} contentFit="cover" />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Trade Capacity */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Trade Capacity</Text>
                {[
                  { label: 'Monthly Capacity', value: s.tradeCapacity.monthlyCapacity },
                  { label: 'Minimum Order', value: s.tradeCapacity.minOrder },
                  { label: 'Lead Time', value: s.tradeCapacity.leadTime },
                  { label: 'Payment Terms', value: s.tradeCapacity.paymentTerms.join(' · ') },
                  { label: 'Export Countries', value: s.tradeCapacity.exportCountries.join(', ') },
                ].map(row => (
                  <View key={row.label} style={[styles.tradeRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.tradeLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                    <Text style={[styles.tradeValue, { color: colors.foreground }]}>{row.value}</Text>
                  </View>
                ))}
              </View>

              {/* Main Products */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Main Products</Text>
                {s.mainProducts.map((p, i) => (
                  <View key={i} style={styles.productBullet}>
                    <View style={[styles.bullet, { backgroundColor: colors.brand }]} />
                    <Text style={[styles.bodyTxt, { color: colors.textSecondary }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <View style={{ padding: 16 }}>
              {products.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="cube-outline" size={40} color={colors.mutedForeground} />
                  <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No products listed</Text>
                </View>
              ) : (
                <View style={styles.productGrid}>
                  {products.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.productCard, { backgroundColor: colors.card }]}
                      onPress={() => router.push(`/product/${p.id}`)}
                      activeOpacity={0.88}
                    >
                      <Image source={{ uri: p.image }} style={styles.productImg} contentFit="cover" />
                      <View style={styles.productCardBody}>
                        <Text style={[styles.productCardName, { color: colors.foreground }]} numberOfLines={2}>{p.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Ionicons name="star" size={11} color="#f59e0b" />
                          <Text style={[styles.productCardRating, { color: colors.foreground }]}>{p.rating}</Text>
                        </View>
                        <Text style={[styles.productCardPrice, { color: colors.brand }]}>{fmt(p.price)}/{p.unit}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <View style={{ padding: 16, gap: 12 }}>
              {/* Rating summary */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <View style={styles.ratingSummary}>
                  <View style={styles.ratingBig}>
                    <Text style={[styles.ratingBigNum, { color: colors.foreground }]}>{s.overallRating.toFixed(1)}</Text>
                    <Stars rating={s.overallRating} size={18} />
                    <Text style={[styles.ratingBigSub, { color: colors.mutedForeground }]}>{s.totalReviews} reviews</Text>
                  </View>
                  <View style={styles.ratingBars}>
                    {[5,4,3,2,1].map(star => {
                      const pct = star === 5 ? 0.65 : star === 4 ? 0.22 : star === 3 ? 0.08 : star === 2 ? 0.03 : 0.02;
                      return (
                        <View key={star} style={styles.ratingBarRow}>
                          <Text style={[styles.ratingBarLabel, { color: colors.mutedForeground }]}>{star}</Text>
                          <Ionicons name="star" size={10} color="#f59e0b" />
                          <View style={[styles.ratingBarTrack, { backgroundColor: colors.border }]}>
                            <View style={[styles.ratingBarFill, { width: `${pct * 100}%` as any, backgroundColor: '#f59e0b' }]} />
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {s.reviews.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="star-outline" size={40} color={colors.mutedForeground} />
                  <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No reviews yet</Text>
                </View>
              ) : (
                s.reviews.map(review => (
                  <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card }]}>
                    <View style={styles.reviewHeader}>
                      <View style={[styles.reviewAvatar, { backgroundColor: colors.brandBg }]}>
                        <Text style={[styles.reviewAvatarTxt, { color: colors.brand }]}>{review.buyerInitials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.reviewNameRow}>
                          <Text style={[styles.reviewName, { color: colors.foreground }]}>{review.buyer}</Text>
                          {review.verified && (
                            <View style={[styles.verifiedBuyerChip, { backgroundColor: colors.brandBg }]}>
                              <Ionicons name="checkmark-circle" size={10} color={colors.brand} />
                              <Text style={[styles.verifiedBuyerTxt, { color: colors.brand }]}>Verified Purchase</Text>
                            </View>
                          )}
                        </View>
                        <Stars rating={review.rating} />
                      </View>
                      <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{review.date}</Text>
                    </View>
                    <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>{review.comment}</Text>
                    <Text style={[styles.reviewProduct, { color: colors.mutedForeground }]}>Product: {review.product}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* CERTIFICATES */}
          {activeTab === 'certificates' && (
            <View style={{ padding: 16, gap: 12 }}>
              {/* Info banner */}
              <View style={[styles.aiInfoBanner, { backgroundColor: colors.brandBg }]}>
                <Ionicons name="sparkles" size={16} color={colors.brand} />
                <Text style={[styles.aiInfoTxt, { color: colors.brand }]}>
                    Certificates are scanned in the background to extract and verify business details. Tap "Scan Document" on any document to review the result.
                </Text>
              </View>

              {s.certificates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={40} color={colors.mutedForeground} />
                  <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No certificates uploaded</Text>
                </View>
              ) : (
                s.certificates.map(cert => (
                  <View key={cert.id} style={[styles.certCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.certHeader}>
                      <View style={[styles.certTypeIcon, {
                        backgroundColor:
                          cert.type === 'registration' ? colors.brandBg :
                          cert.type === 'quality' ? '#dbeafe' :
                          cert.type === 'safety' ? '#fef3c7' :
                          cert.type === 'organic' ? '#dcfce7' : colors.navyBg,
                      }]}>
                        <Ionicons
                          name={
                            cert.type === 'registration' ? 'business-outline' :
                            cert.type === 'quality' ? 'ribbon-outline' :
                            cert.type === 'safety' ? 'shield-outline' :
                            cert.type === 'organic' ? 'leaf-outline' : 'globe-outline'
                          }
                          size={20}
                          color={
                            cert.type === 'registration' ? colors.brand :
                            cert.type === 'quality' ? '#2563eb' :
                            cert.type === 'safety' ? '#d97706' :
                            cert.type === 'organic' ? '#059669' : colors.navy
                          }
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.certName, { color: colors.foreground }]}>{cert.name}</Text>
                        <Text style={[styles.certIssuer, { color: colors.mutedForeground }]}>{cert.issuer}</Text>
                      </View>
                      {cert.verified && (
                        <View style={[styles.certVerifiedChip, { backgroundColor: colors.brandBg }]}>
                          <Ionicons name="checkmark-circle" size={12} color={colors.brand} />
                          <Text style={[styles.certVerifiedTxt, { color: colors.brand }]}>Verified</Text>
                        </View>
                      )}
                    </View>

                    <View style={[styles.certDetails, { borderTopColor: colors.border }]}>
                      <View style={styles.certDetailRow}>
                        <Text style={[styles.certDetailLabel, { color: colors.mutedForeground }]}>Cert Number</Text>
                        <Text style={[styles.certDetailValue, { color: colors.foreground }]}>{cert.number}</Text>
                      </View>
                      <View style={styles.certDetailRow}>
                        <Text style={[styles.certDetailLabel, { color: colors.mutedForeground }]}>Issued</Text>
                        <Text style={[styles.certDetailValue, { color: colors.foreground }]}>{cert.issuedDate}</Text>
                      </View>
                      <View style={styles.certDetailRow}>
                        <Text style={[styles.certDetailLabel, { color: colors.mutedForeground }]}>Expires</Text>
                        <Text style={[styles.certDetailValue, { color: colors.foreground }]}>{cert.expiryDate}</Text>
                      </View>
                    </View>

                    {/* AI Scan button */}
                    {cert.aiExtracted && (
                      <TouchableOpacity
                        style={[styles.aiScanBtn, { backgroundColor: colors.brand }]}
                        onPress={() => setScanCert(cert)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="scan" size={16} color="#ffffff" />
                        <Text style={styles.aiScanTxt}>Scan Document</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: '#25D366' }]}
          onPress={() => Linking.openURL(`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`)}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#ffffff" />
          <Text style={styles.ctaBtnTxt}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: colors.brand }]}
          onPress={() => router.push('/(tabs)/messages' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#ffffff" />
          <Text style={styles.ctaBtnTxt}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctaCallBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
          onPress={() => Linking.openURL(`tel:${s.phone}`)}
          activeOpacity={0.85}
        >
          <Ionicons name="call-outline" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* AI Scan Modal */}
      <AIScanModal visible={!!scanCert} cert={scanCert} onClose={() => setScanCert(null)} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundTxt: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  backLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  // Cover
  coverWrap: { height: 280, position: 'relative' },
  coverImg: { width: '100%', height: '100%' },
  coverGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  avatarWrap: { position: 'absolute', bottom: -36, left: 20, borderRadius: 44, padding: 4, elevation: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } as any,
  avatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  avatarTxt: { fontSize: 26, fontWeight: '800', fontFamily: 'Inter_700Bold' },

  // Identity card
  identityCard: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 0, marginTop: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  nameChips: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  supplierName: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  verifiedChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  verifiedChipTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  countryFlag: { fontSize: 14 },
  locationTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  publicAddress: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 10, marginTop: 12 },
  publicAddressLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  publicAddressValue: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium', marginTop: 2 },
  followBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, borderWidth: 1, marginTop: 8 },
  followBtnTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipTxt: { fontSize: 11, fontFamily: 'Inter_500Medium' },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 16, paddingBottom: 16, marginTop: 16, borderTopWidth: 1 },
  statItem: { alignItems: 'center', gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, fontFamily: 'Inter_400Regular' },

  // Tabs
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginTop: 4 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  // Sections
  section: { borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 10 },
  bodyTxt: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  divider: { height: 1, marginVertical: 14 },

  // Info grid
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoGridItem: { width: '45%', gap: 3, alignItems: 'flex-start' },
  infoValue: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  infoLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },

  // Gallery
  galleryThumb: { width: 130, height: 96, borderRadius: 10, overflow: 'hidden' },
  galleryImg: { width: '100%', height: '100%' },

  // Trade
  tradeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  tradeLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  tradeValue: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'right', flex: 1, marginLeft: 8 },

  // Products tab
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: { width: (width - 32 - 12) / 2, borderRadius: 14, overflow: 'hidden', elevation: 1 },
  productImg: { width: '100%', height: 100 },
  productCardBody: { padding: 8, gap: 3 },
  productCardName: { fontSize: 11, fontFamily: 'Inter_600SemiBold', lineHeight: 16 },
  productCardRating: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  productCardPrice: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  // Reviews tab
  ratingSummary: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  ratingBig: { alignItems: 'center', gap: 6, minWidth: 80 },
  ratingBigNum: { fontSize: 40, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  ratingBigSub: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  ratingBars: { flex: 1, gap: 5 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingBarLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', width: 8 },
  ratingBarTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: '100%', borderRadius: 3 },
  reviewCard: { borderRadius: 16, padding: 14 },
  reviewHeader: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarTxt: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  reviewNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  reviewName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  verifiedBuyerChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  verifiedBuyerTxt: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  reviewDate: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  reviewComment: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19, marginBottom: 6 },
  reviewProduct: { fontSize: 11, fontFamily: 'Inter_400Regular' },

  // Certificates tab
  aiInfoBanner: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 12, alignItems: 'flex-start' },
  aiInfoTxt: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  certCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  certHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  certTypeIcon: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  certName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 3 },
  certIssuer: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  certVerifiedChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  certVerifiedTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  certDetails: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  certDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  certDetailLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  certDetailValue: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  aiScanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 14, marginTop: 4, paddingVertical: 12, borderRadius: 12 },
  aiScanTxt: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#ffffff' },

  // Bottom bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, elevation: 8 },
  ctaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  ctaBtnTxt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#ffffff' },
  ctaCallBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

  // Other
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  productBullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
});

// ─── AI Scan Modal Styles ─────────────────────────────────────
const scan = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  aiIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  closeBtn: { padding: 4 },

  docPreview: { height: 150, borderRadius: 12, overflow: 'hidden', padding: 16, justifyContent: 'center', marginBottom: 12 },
  docLines: { gap: 8 },
  docLine: { height: 6, borderRadius: 3 },
  certBadgeBox: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 10, alignSelf: 'flex-start' },
  certBadgeTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  scanLineEl: { position: 'absolute', left: 0, right: 0, height: 2, borderRadius: 1 },
  doneOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(5,150,105,0.1)' },

  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 12 },

  resultCard: { borderRadius: 12, padding: 14, gap: 12, borderWidth: 1, marginBottom: 10 },
  resultTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  resultRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  resultLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', marginBottom: 1 },
  resultValue: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginTop: 2 },
  statusTxt: { fontSize: 11, fontFamily: 'Inter_700Bold' },

  verifiedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12 },
  verifiedTxt: { fontSize: 13, fontFamily: 'Inter_700Bold' },
});
