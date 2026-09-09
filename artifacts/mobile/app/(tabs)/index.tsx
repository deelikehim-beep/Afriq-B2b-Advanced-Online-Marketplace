import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Dimensions, FlatList, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import {
  BANNERS, CATEGORIES, PRODUCTS, AFRICAN_COUNTRIES, PRODUCT_COUNTRY,
  fmt, type Banner, type Product,
} from '@/constants/data';

// ─── Category visual metadata ────────────────────────────────
const CATEGORY_META: Record<string, { gradient: [string, string]; emoji: string }> = {
  all:          { gradient: ['#059669', '#047857'], emoji: '🌍' },
  textiles:     { gradient: ['#7c3aed', '#5b21b6'], emoji: '🧵' },
  electronics:  { gradient: ['#0284c7', '#0369a1'], emoji: '📱' },
  agriculture:  { gradient: ['#16a34a', '#15803d'], emoji: '🌾' },
  beauty:       { gradient: ['#db2777', '#be185d'], emoji: '💄' },
  home:         { gradient: ['#ea580c', '#c2410c'], emoji: '🏠' },
  auto:         { gradient: ['#64748b', '#334155'], emoji: '🚗' },
  food:         { gradient: ['#d97706', '#b45309'], emoji: '🍽️' },
  construction: { gradient: ['#92400e', '#78350f'], emoji: '🏗️' },
  fashion:      { gradient: ['#e11d48', '#be123c'], emoji: '👗' },
  health:       { gradient: ['#0d9488', '#0f766e'], emoji: '🏥' },
  office:       { gradient: ['#4f46e5', '#3730a3'], emoji: '💼' },
  machinery:    { gradient: ['#374151', '#1f2937'], emoji: '⚙️' },
  chemicals:    { gradient: ['#0891b2', '#0e7490'], emoji: '🧪' },
  packaging:    { gradient: ['#78716c', '#57534e'], emoji: '📦' },
  toys:         { gradient: ['#ca8a04', '#a16207'], emoji: '🧸' },
  jewelry:      { gradient: ['#b45309', '#78350f'], emoji: '💍' },
  cleaning:     { gradient: ['#0369a1', '#1d4ed8'], emoji: '🧹' },
  energy:       { gradient: ['#65a30d', '#3f6212'], emoji: '⚡' },
  sports:       { gradient: ['#dc2626', '#b91c1c'], emoji: '🏋️' },
};

const TRENDING_SEARCHES = [
  '🔥 Ankara fabric', '🔥 Samsung phones', '🔥 Palm oil',
  '📈 Solar panels', '🔥 Cement bags', '📈 Iron rods', '🔥 Rice 50kg',
];

// live count from actual data for selected category
const catLiveCount = (catId: string, products: Product[]) =>
  catId === 'all' ? products.length : products.filter(p => p.category === catId).length;

export default function Marketplace() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartCount, unreadNotifs, user, marketplaceProducts } = useApp();
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const numCols = isLandscape ? 3 : 2;
  const CARD_W = (width - 32 - 12 * (numCols - 1)) / numCols;

  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [category, setCategory] = useState('all');
  const [countryFilter, setCountryFilter] = useState(user.residentCountryCode || 'all');
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

  const browseProducts = [...marketplaceProducts, ...PRODUCTS.filter(product => !marketplaceProducts.some(item => item.id === product.id))];
  const filtered = browseProducts.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchQ = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCountry = countryFilter === 'all' || (p.country ?? 'NG') === countryFilter;
    return matchCat && matchQ && matchCountry;
  }).sort((a, b) => {
    const preferred = user.residentCountryCode;
    if (!preferred || countryFilter !== 'all') return 0;
    return Number((PRODUCT_COUNTRY[a.id] ?? a.country) === preferred) - Number((PRODUCT_COUNTRY[b.id] ?? b.country) === preferred);
  });

  // Social proof (deterministic per product)
  const viewsToday = (p: Product) => 20 + ((p.id.length * 13) % 60);

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
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: searchFocused ? colors.brand : colors.border }]}>
          <Ionicons name="search-outline" size={18} color={searchFocused ? colors.brand : colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Search products, suppliers, categories…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.aiSearchBadge, { backgroundColor: colors.brandBg }]}>
              <Ionicons name="sparkles" size={11} color={colors.brand} />
              <Text style={[styles.aiSearchTxt, { color: colors.brand }]}>Smart</Text>
            </View>
          )}
        </View>

        {/* AI trending suggestions */}
        {searchFocused && !search && (
          <View style={styles.trendsWrap}>
            <Text style={[styles.trendLabel, { color: colors.mutedForeground }]}>Trending now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }} contentContainerStyle={{ gap: 8 }}>
              {TRENDING_SEARCHES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.trendChip, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => { setSearch(t.replace(/[🔥📈]\s/, '')); setSearchFocused(false); }}
                >
                  <Text style={[styles.trendChipTxt, { color: colors.foreground }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Country filter */}
      <View style={[styles.countryWrap, { backgroundColor: colors.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.countryScroll}>
          {AFRICAN_COUNTRIES.map(c => {
            const active = countryFilter === c.code;
            return (
              <TouchableOpacity
                key={c.code}
                style={[styles.countryPill, active && { backgroundColor: colors.brand, borderColor: colors.brand }, !active && { borderColor: colors.border }]}
                onPress={() => setCountryFilter(c.code)}
                activeOpacity={0.75}
              >
                <Text style={styles.countryFlag}>{c.flag}</Text>
                <Text style={[styles.countryName, { color: active ? '#ffffff' : colors.foreground }]}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.sellCta, { backgroundColor: colors.brandBg, borderColor: colors.brandLight }]}
        onPress={() => router.push('/list-product')}
        activeOpacity={0.84}
      >
        <View style={[styles.sellCtaIcon, { backgroundColor: colors.brand }]}><Ionicons name="add" size={22} color="#ffffff" /></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sellCtaTitle, { color: colors.foreground }]}>Put your goods up for sale</Text>
          <Text style={[styles.sellCtaSub, { color: colors.mutedForeground }]}>Reach buyers across Africa with a public wholesale listing.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.brand} />
      </TouchableOpacity>

      {/* ── Category Explorer ── */}
      <View style={[styles.catSection, { backgroundColor: colors.card }]}>
          <View style={styles.catSectionHeader}>
          <Text style={[styles.catSectionTitle, { color: colors.foreground }]}>Categories</Text>
            <TouchableOpacity style={[styles.aiCatBadge, { backgroundColor: colors.brandBg }]} onPress={() => router.push('/category/all')}>
            <Ionicons name="sparkles" size={10} color={colors.brand} />
              <Text style={[styles.aiCatTxt, { color: colors.brand }]}>View all</Text>
            </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catTileScroll}>
          {CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat.id] ?? { gradient: ['#059669', '#047857'] as [string,string], emoji: '📦' };
            const active = category === cat.id;
            const liveCount = catLiveCount(cat.id, browseProducts);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catTile, active && styles.catTileActive]}
                onPress={() => router.push(`/category/${cat.id}`)}
                activeOpacity={0.82}
              >
                <LinearGradient
                  colors={meta.gradient}
                  style={[styles.catTileGrad, active && { borderWidth: 2, borderColor: '#ffffff' }]}
                >
                  {active && (
                    <View style={styles.catActiveCheck}>
                      <Ionicons name="checkmark" size={10} color="#ffffff" />
                    </View>
                  )}
                  <Text style={styles.catEmoji}>{meta.emoji}</Text>
                  <Text style={styles.catTileName} numberOfLines={1}>{cat.name.split(' ')[0]}</Text>
                  {liveCount > 0 && (
                    <View style={styles.catCountBadge}>
                      <Text style={styles.catCountTxt}>{liveCount}</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Banner carousel */}
      <View style={[styles.marketGroups, { backgroundColor: colors.card }]}>
        <View style={styles.marketGroupHeader}>
          <View>
            <Text style={[styles.marketGroupTitle, { color: colors.foreground }]}>What buyers are moving today</Text>
            <Text style={[styles.marketGroupSub, { color: colors.mutedForeground }]}>Top goods from multiple suppliers · refreshes every 24h</Text>
          </View>
          <Ionicons name="trending-up" size={18} color={colors.brand} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketGroupScroll}>
          {PRODUCTS.filter(p => p.sold > 800).slice(0, 7).map(product => (
            <TouchableOpacity key={product.id} style={[styles.miniTrend, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={() => router.push(`/product/${product.id}`)}>
              <Image source={{ uri: product.image }} style={styles.miniTrendImg} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={[styles.miniTrendName, { color: colors.foreground }]}>{product.name}</Text>
                <Text style={[styles.miniTrendSupplier, { color: colors.mutedForeground }]}>{product.supplier}</Text>
              </View>
              <View style={styles.miniTrendRank}><Text style={styles.miniTrendRankTxt}>#{product.sold > 2500 ? '1' : '2'}</Text></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={[styles.aiDiscovery, { backgroundColor: colors.navyBg }]}>
          <View style={[styles.aiDiscoveryIcon, { backgroundColor: colors.navy }]}><Ionicons name="sparkles" size={13} color="#ffffff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.aiDiscoveryTitle, { color: colors.foreground }]}>Long-tail picks</Text>
            <Text style={[styles.aiDiscoverySub, { color: colors.mutedForeground }]}>Less-bought categories with a 5-day discovery cycle</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={colors.navy} />
        </View>
      </View>

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
                <Ionicons name={item.icon as any} size={28} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSub}>{item.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnTxt}>Explore</Text>
                <Ionicons name="arrow-forward" size={12} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        style={{ marginHorizontal: 16, marginTop: 12, borderRadius: 16, overflow: 'hidden' }}
      />

      {/* Banner dots */}
      <View style={styles.bannerDots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.bannerDot, i === bannerIdx && { backgroundColor: colors.brand, width: 20 }]} />
        ))}
      </View>

      {/* Products header */}
      <View style={styles.productsHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {search ? `Results for "${search}"` : category === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === category)?.name ?? category}
          </Text>
          {countryFilter !== 'all' && (
            <Text style={[styles.filterTagTxt, { color: colors.mutedForeground }]}>
              {AFRICAN_COUNTRIES.find(c => c.code === countryFilter)?.flag} {AFRICAN_COUNTRIES.find(c => c.code === countryFilter)?.name}
            </Text>
          )}
        </View>
        <View style={styles.headerCountWrap}>
          <Text style={[styles.countTxt, { color: colors.mutedForeground }]}>{filtered.length} items</Text>
          {isLandscape && (
            <View style={[styles.landscapeChip, { backgroundColor: colors.brandBg }]}>
              <Ionicons name="grid-outline" size={11} color={colors.brand} />
              <Text style={[styles.landscapeTxt, { color: colors.brand }]}>Wide view</Text>
            </View>
          )}
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        key={`grid-${numCols}`}
        data={filtered}
        numColumns={numCols}
        keyExtractor={p => p.id}
        columnWrapperStyle={numCols > 1 ? [styles.row, { paddingHorizontal: 16, gap: 12, marginBottom: 12 }] : undefined}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.background }]}>
              <Ionicons name="search-outline" size={36} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No products found</Text>
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>Try a different category or country filter</Text>
            <TouchableOpacity
              style={[styles.emptyReset, { backgroundColor: colors.brand }]}
              onPress={() => { setSearch(''); setCategory('all'); setCountryFilter('all'); }}
            >
              <Text style={styles.emptyResetTxt}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }: { item: Product }) => {
          const views = viewsToday(item);
          const catMeta = CATEGORY_META[item.category];
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, width: CARD_W }]}
              onPress={() => router.push(`/product/${item.id}`)}
              activeOpacity={0.88}
            >
              {/* Image */}
              <View style={[styles.imgWrap, { height: numCols === 3 ? 100 : 130 }]}>
                <Image source={{ uri: item.image }} style={styles.img} contentFit="cover" />
                {/* Category color tag */}
                {catMeta && (
                  <View style={[styles.catTag, { backgroundColor: catMeta.gradient[0] }]}>
                    <Text style={styles.catTagEmoji}>{catMeta.emoji}</Text>
                  </View>
                )}
                {item.badge && (
                  <View style={[styles.imgBadge, { backgroundColor: item.badge === 'HOT' ? '#ef4444' : item.badge === 'NEW' ? colors.navy : item.badge === 'EXPORT' ? '#059669' : '#f59e0b' }]}>
                    <Text style={styles.imgBadgeTxt}>{item.badge}</Text>
                  </View>
                )}
                {item.featured && !item.badge && (
                  <View style={[styles.imgBadge, { right: 8, left: undefined, backgroundColor: '#f59e0b' }]}>
                    <Ionicons name="star" size={9} color="#ffffff" />
                  </View>
                )}
                {/* Country flag */}
                {item.country && item.country !== 'NG' && (
                  <View style={[styles.countryTag, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <Text style={styles.countryTagFlag}>
                      {AFRICAN_COUNTRIES.find(c => c.code === item.country)?.flag ?? '🌍'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Card body */}
              <View style={[styles.cardBody, numCols === 3 && { padding: 8 }]}>
                <Text style={[styles.cardName, { color: colors.foreground, fontSize: numCols === 3 ? 11 : 12 }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.cardSupplier, { color: colors.mutedForeground }]} numberOfLines={1}>{item.supplier}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={11} color="#f59e0b" />
                  <Text style={[styles.ratingTxt, { color: colors.foreground }]}>{item.rating}</Text>
                  <Text style={[styles.reviewsTxt, { color: colors.mutedForeground }]}>({item.reviews})</Text>
                </View>
                <Text style={[styles.price, { color: colors.brand, fontSize: numCols === 3 ? 12 : 14 }]}>{fmt(item.price)}</Text>
                <Text style={[styles.moq, { color: colors.mutedForeground }]}>MOQ: {item.moq} {item.unit}</Text>
                <View style={styles.cardBottom}>
                  {item.escrow && (
                    <View style={styles.escrowRow}>
                      <Ionicons name="shield-checkmark" size={9} color={colors.brand} />
                      <Text style={[styles.escrowTxt, { color: colors.brand }]}>Escrow</Text>
                    </View>
                  )}
                  {numCols < 3 && (
                    <Text style={[styles.viewsTxt, { color: colors.mutedForeground }]}>👁 {views}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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

  // Search
  searchWrap: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5 },
  searchInput: { flex: 1, fontSize: 14 },
  aiSearchBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  aiSearchTxt: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  trendsWrap: { paddingTop: 10, paddingBottom: 4 },
  trendLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  trendChip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  trendChipTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  // Country filter
  countryWrap: { paddingBottom: 10, paddingTop: 2 },
  countryScroll: { paddingHorizontal: 16, gap: 8 },
  countryPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  countryFlag: { fontSize: 14 },
  countryName: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  sellCta: { marginHorizontal: 16, marginTop: 2, marginBottom: 4, borderRadius: 14, borderWidth: 1, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  sellCtaIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sellCtaTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  sellCtaSub: { fontSize: 10, lineHeight: 14, marginTop: 2, fontFamily: 'Inter_400Regular' },

  // Category tiles
  catSection: { paddingBottom: 14 },
  catSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  catSectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  aiCatBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  aiCatTxt: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  catTileScroll: { paddingHorizontal: 16, gap: 10 },
  catTile: { alignItems: 'center', opacity: 1 },
  catTileActive: { transform: [{ scale: 1.06 }] },
  catTileGrad: { width: 70, height: 88, borderRadius: 18, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  catEmoji: { fontSize: 26, marginBottom: 4 },
  catTileName: { fontSize: 9, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold', textAlign: 'center', paddingHorizontal: 2 },
  catActiveCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  catCountBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2 },
  catCountTxt: { fontSize: 8, color: '#ffffff', fontFamily: 'Inter_700Bold' },

  // Banner
  marketGroups: { paddingTop: 14, paddingBottom: 2 },
  marketGroupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  marketGroupTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  marketGroupSub: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  marketGroupScroll: { gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  miniTrend: { width: 205, minHeight: 56, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 6 },
  miniTrendImg: { width: 44, height: 44, borderRadius: 7 },
  miniTrendName: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  miniTrendSupplier: { fontSize: 9, fontFamily: 'Inter_400Regular', marginTop: 2 },
  miniTrendRank: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  miniTrendRankTxt: { fontSize: 9, color: '#b45309', fontFamily: 'Inter_700Bold' },
  aiDiscovery: { marginHorizontal: 16, borderRadius: 11, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiDiscoveryIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  aiDiscoveryTitle: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  aiDiscoverySub: { fontSize: 9, fontFamily: 'Inter_400Regular', marginTop: 2 },
  banner: { height: 100, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 18 },
  bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bannerIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  bannerTitle: { fontSize: 15, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  bannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  bannerBtnTxt: { fontSize: 11, color: '#ffffff', fontFamily: 'Inter_600SemiBold' },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10, marginBottom: 4 },
  bannerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db' },

  // Products header
  productsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 18, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  filterTagTxt: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  headerCountWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  landscapeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  landscapeTxt: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },

  // Product card
  row: {},
  card: { borderRadius: 14, overflow: 'hidden', elevation: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } as any,
  imgWrap: { position: 'relative' },
  img: { width: '100%', height: '100%' },
  catTag: { position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' },
  catTagEmoji: { fontSize: 12 },
  imgBadge: { position: 'absolute', top: 8, left: 8, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  imgBadgeTxt: { fontSize: 9, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  countryTag: { position: 'absolute', bottom: 6, right: 6, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2 },
  countryTagFlag: { fontSize: 12 },

  cardBody: { padding: 10 },
  cardName: { fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 3, lineHeight: 17 },
  cardSupplier: { fontSize: 10, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 5 },
  ratingTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  reviewsTxt: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  price: { fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 2 },
  moq: { fontSize: 10, fontFamily: 'Inter_400Regular', marginBottom: 5 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  escrowRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  escrowTxt: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  viewsTxt: { fontSize: 9, fontFamily: 'Inter_400Regular' },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  emptyTxt: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  emptyReset: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  emptyResetTxt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#ffffff' },
});
