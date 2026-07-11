import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
  Dimensions, FlatList, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { BANNERS, CATEGORIES, PRODUCTS, fmt, type Banner, type Product } from '@/constants/data';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36 - 12) / 2;

export default function Marketplace() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartCount, unreadNotifs } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerRef = useRef<FlatList>(null);

  // Auto-scroll banners
  useEffect(() => {
    const t = setInterval(() => {
      const next = (bannerIdx + 1) % BANNERS.length;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setBannerIdx(next);
    }, 4500);
    return () => clearInterval(t);
  }, [bannerIdx]);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchQ = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const header = (
    <>
      {/* Status bar spacer */}
      <View style={{ height: insets.top, backgroundColor: colors.brandDeep }} />

      {/* Top Header */}
      <LinearGradient colors={[colors.brandDeep, colors.brand]} style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>A</Text>
          </View>
          <View>
            <Text style={styles.logoWord}>AFRIQ</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.7)" />
              <Text style={styles.locationTxt}>Lagos, Nigeria</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#ffffff" />
            {unreadNotifs > 0 && <View style={styles.badge}><Text style={styles.badgeTxt}>{unreadNotifs}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={24} color="#ffffff" />
            {cartCount > 0 && <View style={styles.badge}><Text style={styles.badgeTxt}>{cartCount}</Text></View>}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search bar */}
      <View style={[styles.searchWrap, { backgroundColor: colors.card }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Search products, suppliers…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Banner carousel */}
      <FlatList
        ref={bannerRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={b => b.id.toString()}
        onMomentumScrollEnd={e => setBannerIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }: { item: Banner }) => (
          <LinearGradient colors={item.colors} style={[styles.banner, { width }]}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Ionicons name={item.icon as any} size={32} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSub}>{item.subtitle}</Text>
              </View>
            </View>
          </LinearGradient>
        )}
        style={{ marginHorizontal: 16, marginTop: 12, borderRadius: 14, overflow: 'hidden' }}
      />

      {/* Banner dots */}
      <View style={styles.bannerDots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.bannerDot, i === bannerIdx && { backgroundColor: colors.brand, width: 20 }]} />
        ))}
      </View>

      {/* Categories */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catPill, category === cat.id && { backgroundColor: colors.brand, borderColor: colors.brand }]}
            onPress={() => setCategory(cat.id)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={(cat.icon + '-outline') as any}
              size={14}
              color={category === cat.id ? '#ffffff' : colors.mutedForeground}
            />
            <Text style={[styles.catTxt, { color: category === cat.id ? '#ffffff' : colors.foreground }]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products header */}
      <View style={styles.productsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 0 }]}>
          {search ? `Results for "${search}"` : category === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === category)?.name}
        </Text>
        <Text style={[styles.countTxt, { color: colors.mutedForeground }]}>{filtered.length} items</Text>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={p => p.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.grid, { paddingBottom: 120 + insets.bottom }]}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No products found</Text>
          </View>
        }
        renderItem={({ item }: { item: Product }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, width: CARD_WIDTH }]}
            onPress={() => router.push(`/product/${item.id}`)}
            activeOpacity={0.88}
          >
            <View style={styles.imgWrap}>
              <Image source={{ uri: item.image }} style={styles.img} contentFit="cover" />
              {item.badge && (
                <View style={[styles.imgBadge, { backgroundColor: item.badge === 'HOT' ? '#ef4444' : colors.navy }]}>
                  <Text style={styles.imgBadgeTxt}>{item.badge}</Text>
                </View>
              )}
              {item.featured && (
                <View style={[styles.imgBadge, { right: 8, left: undefined, backgroundColor: '#f59e0b' }]}>
                  <Ionicons name="star" size={10} color="#ffffff" />
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[styles.cardSupplier, { color: colors.mutedForeground }]} numberOfLines={1}>{item.supplier}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={[styles.ratingTxt, { color: colors.foreground }]}>{item.rating}</Text>
                <Text style={[styles.reviewsTxt, { color: colors.mutedForeground }]}>({item.reviews})</Text>
              </View>
              <Text style={[styles.price, { color: colors.brand }]}>{fmt(item.price)}</Text>
              <Text style={[styles.moq, { color: colors.mutedForeground }]}>MOQ: {item.moq} {item.unit}</Text>
              {item.escrow && (
                <View style={styles.escrowRow}>
                  <Ionicons name="shield-checkmark" size={10} color={colors.brand} />
                  <Text style={[styles.escrowTxt, { color: colors.brand }]}>Escrow</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center' },
  logoLetter: { fontSize: 20, fontWeight: '800', color: '#064e3b', fontFamily: 'Inter_700Bold' },
  logoWord: { fontSize: 20, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationTxt: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  headerRight: { flexDirection: 'row', gap: 4 },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#ef4444', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  badgeTxt: { fontSize: 10, color: '#ffffff', fontFamily: 'Inter_700Bold' },

  searchWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },

  banner: { height: 96, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 20 },
  bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bannerIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
  bannerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db' },

  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  catScroll: { paddingHorizontal: 16, gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff' },
  catTxt: { fontSize: 12, fontFamily: 'Inter_500Medium' },

  productsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  countTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  row: { paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  grid: {},

  card: { borderRadius: 14, overflow: 'hidden', elevation: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } as any,
  imgWrap: { position: 'relative', height: 130 },
  img: { width: '100%', height: '100%' },
  imgBadge: { position: 'absolute', top: 8, left: 8, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3 },
  imgBadgeTxt: { fontSize: 9, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  cardBody: { padding: 10 },
  cardName: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 3, lineHeight: 17 },
  cardSupplier: { fontSize: 10, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 5 },
  ratingTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  reviewsTxt: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  price: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 2 },
  moq: { fontSize: 10, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  escrowRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  escrowTxt: { fontSize: 10, fontFamily: 'Inter_500Medium' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
