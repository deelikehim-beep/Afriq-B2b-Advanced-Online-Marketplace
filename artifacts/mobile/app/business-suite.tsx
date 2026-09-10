import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';

const MODULES = [
  { title: 'Inventory command centre', desc: 'Stock levels, reorder points, transfers and supplier lead times.', icon: 'cube-outline', color: '#059669', badge: 'Connected workspace' },
  { title: 'Invoices & procurement', desc: 'Create purchase orders, reconcile invoices and track supplier spend.', icon: 'document-text-outline', color: '#0284c7', badge: 'Ready to configure' },
  { title: 'Demand intelligence', desc: 'Live best-seller, slow-mover and five-day discovery signals.', icon: 'analytics-outline', color: '#7c3aed', badge: 'Live insight' },
  { title: 'Warehouse & fleet', desc: 'Coordinate receiving, dispatch, delivery milestones and proof of delivery.', icon: 'car-outline', color: '#d97706', badge: 'Connected workspace' },
  { title: 'Inventory sync subscriptions', desc: 'Connect multiple stores and keep catalog quantities aligned across channels.', icon: 'sync-outline', color: '#db2777', badge: 'Coming soon' },
  { title: 'Cross-border trade desk', desc: 'Escrow, currency conversion, customs documents and landed-cost planning.', icon: 'globe-outline', color: '#0d9488', badge: 'Connected workspace' },
];

export default function BusinessSuite() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, listedProducts, setProductListingStatus } = useApp();
  const activeListings = listedProducts.filter(product => product.status !== 'closed');
  const openListing = () => {
    if (user.role === 'seller' && (!user.storeAddress?.trim() || !user.residentCountry?.trim())) {
      router.push('/(tabs)/profile?edit=business' as any);
      return;
    }
    router.push('/list-product' as any);
  };
  const changeListingStatus = async (productId: string, status: 'active' | 'closed') => {
    const result = await setProductListingStatus(productId, status);
    if (!result.ok) Alert.alert('Could not update listing', result.error ?? 'Please try again.');
  };
  const closeListing = (productId: string, productName: string) => {
    Alert.alert(
      'Close this product ad?',
      `${productName} will disappear from buyer search, but you can reopen it later.`,
      [
        { text: 'Keep it open', style: 'cancel' },
        { text: 'Close ad', style: 'destructive', onPress: () => { void changeListingStatus(productId, 'closed'); } },
      ],
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={22} color={colors.foreground} /></TouchableOpacity>
        <View style={{ flex: 1 }}><Text style={[styles.title, { color: colors.foreground }]}>Merchant Suite</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Tools to run your trade business</Text></View>
        <View style={[styles.demoPill, { backgroundColor: colors.brandBg }]}><Ionicons name="checkmark-circle-outline" size={12} color={colors.brand} /><Text style={[styles.demoPillTxt, { color: colors.brand }]}>LIVE</Text></View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 35 }}>
        <View style={[styles.hero, { backgroundColor: colors.brandDeep }]}>
          <View style={styles.heroOrb} />
          <View style={[styles.heroIcon, { backgroundColor: colors.brand }]}><Ionicons name="business-outline" size={25} color="#ffffff" /></View>
          <Text style={styles.heroTitle}>One operating layer for African trade</Text>
          <Text style={styles.heroDesc}>Bring orders, stock, suppliers, payments and delivery into one clear workspace connected to your account.</Text>
          <View style={styles.heroStats}><View><Text style={styles.heroStatValue}>147</Text><Text style={styles.heroStatLabel}>trade deals</Text></View><View><Text style={styles.heroStatValue}>98%</Text><Text style={styles.heroStatLabel}>success rate</Text></View><View><Text style={styles.heroStatValue}>12</Text><Text style={styles.heroStatLabel}>active SKUs</Text></View></View>
        </View>
        <TouchableOpacity style={[styles.listCta, { backgroundColor: colors.card, borderColor: colors.brandLight }]} onPress={openListing} activeOpacity={0.85}>
          <View style={[styles.listCtaIcon, { backgroundColor: colors.brandBg }]}>
            <Ionicons name="add-circle-outline" size={25} color={colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.listCtaTitle, { color: colors.foreground }]}>List a product</Text>
            <Text style={[styles.listCtaDesc, { color: colors.mutedForeground }]}>Publish a good with your public store details, stock and delivery terms.</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color={colors.brand} />
        </TouchableOpacity>
        <View style={[styles.tipsCard, { backgroundColor: colors.goldBg, borderColor: colors.goldDark + '35' }]}>
          <View style={[styles.tipsIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="bulb-outline" size={19} color={colors.goldDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Seller tips</Text>
            <Text style={[styles.tipsText, { color: colors.foreground }]}>Use the saved brand and model, show the exact condition, disclose every known problem, and use clear photos of the actual stock.</Text>
            <Text style={[styles.tipsText, { color: colors.mutedForeground }]}>Accurate details help buyers compare quickly and reduce returns or repeated questions.</Text>
          </View>
        </View>
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My product ads</Text>
          <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>{activeListings.length} open · {listedProducts.length} total</Text>
        </View>
        {listedProducts.length === 0 ? (
          <View style={[styles.emptyListings, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="cube-outline" size={25} color={colors.mutedForeground} />
            <Text style={[styles.emptyListingsTitle, { color: colors.foreground }]}>No product ads yet</Text>
            <Text style={[styles.emptyListingsText, { color: colors.mutedForeground }]}>Products you publish will appear here so you can edit or close them.</Text>
          </View>
        ) : (
          <View style={styles.listings}>
            {listedProducts.map(product => {
              const closed = product.status === 'closed';
              return (
                <View key={product.id} style={[styles.listingCard, { backgroundColor: colors.card, borderColor: closed ? colors.border : colors.brandLight, opacity: closed ? 0.78 : 1 }]}>
                  <Image source={{ uri: product.image }} style={styles.listingImage} contentFit="cover" />
                  <View style={styles.listingBody}>
                    <View style={styles.listingTitleRow}>
                      <Text numberOfLines={2} style={[styles.listingTitle, { color: colors.foreground }]}>{product.name}</Text>
                      <View style={[styles.statusPill, { backgroundColor: closed ? colors.background : colors.brandBg }]}>
                        <Text style={[styles.statusText, { color: closed ? colors.mutedForeground : colors.brand }]}>{closed ? 'Closed' : 'Open'}</Text>
                      </View>
                    </View>
                    <Text style={[styles.listingMeta, { color: colors.mutedForeground }]}>
                      {product.model ?? 'Catalog product'} · {product.stock.toLocaleString()} {product.unit} · ₦{product.price.toLocaleString('en-NG')}
                    </Text>
                    <View style={styles.listingActions}>
                      <TouchableOpacity style={[styles.editButton, { borderColor: colors.border }]} onPress={() => router.push(`/list-product?edit=${encodeURIComponent(product.id)}` as any)}>
                        <Ionicons name="create-outline" size={14} color={colors.brand} />
                        <Text style={[styles.editButtonText, { color: colors.brand }]}>Edit</Text>
                      </TouchableOpacity>
                      {closed ? (
                        <TouchableOpacity style={[styles.openButton, { backgroundColor: colors.brand }]} onPress={() => { void changeListingStatus(product.id, 'active'); }}>
                          <Ionicons name="eye-outline" size={14} color="#ffffff" />
                          <Text style={styles.openButtonText}>Reopen ad</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={[styles.closeButton, { borderColor: '#fecaca' }]} onPress={() => closeListing(product.id, product.name)}>
                          <Ionicons name="eye-off-outline" size={14} color="#b91c1c" />
                          <Text style={styles.closeButtonText}>Close ad</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Operations</Text><Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>Tap a module to preview</Text></View>
        <View style={styles.grid}>
          {MODULES.map(module => (
            <TouchableOpacity key={module.title} style={[styles.module, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push('/business-suite' as any)} activeOpacity={0.85}>
              <View style={styles.moduleTop}><View style={[styles.moduleIcon, { backgroundColor: module.color + '18' }]}><Ionicons name={module.icon as any} size={21} color={module.color} /></View><Ionicons name="arrow-forward-circle-outline" size={18} color={colors.mutedForeground} /></View>
              <Text style={[styles.moduleTitle, { color: colors.foreground }]}>{module.title}</Text>
              <Text style={[styles.moduleDesc, { color: colors.mutedForeground }]}>{module.desc}</Text>
              <View style={[styles.moduleBadge, { backgroundColor: module.color + '14' }]}><Text style={[styles.moduleBadgeTxt, { color: module.color }]}>{module.badge}</Text></View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.notice, { backgroundColor: colors.navyBg }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.navy} />
          <Text style={[styles.noticeTxt, { color: colors.foreground }]}>Your workspace is connected to your AFRIQ account. Provider-specific actions remain subject to the services configured for your account.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  back: { width: 34, justifyContent: 'center' },
  title: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 11, marginTop: 2, fontFamily: 'Inter_400Regular' },
  demoPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  demoPillTxt: { fontSize: 9, fontFamily: 'Inter_700Bold' },
  hero: { borderRadius: 18, padding: 18, overflow: 'hidden', marginBottom: 20 },
  heroOrb: { position: 'absolute', width: 170, height: 170, borderRadius: 85, right: -70, top: -65, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  heroTitle: { color: '#ffffff', fontSize: 21, lineHeight: 27, fontFamily: 'Inter_700Bold', maxWidth: 280 },
  heroDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 8 },
  heroStats: { flexDirection: 'row', gap: 30, marginTop: 17, paddingTop: 13, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  heroStatValue: { color: '#f59e0b', fontSize: 16, fontFamily: 'Inter_700Bold' },
  heroStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2, fontFamily: 'Inter_400Regular' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  sectionHint: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  module: { width: '48.5%', minHeight: 194, borderRadius: 14, borderWidth: 1, padding: 12 },
  moduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  moduleIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { fontSize: 13, lineHeight: 17, fontFamily: 'Inter_700Bold' },
  moduleDesc: { fontSize: 10, lineHeight: 15, marginTop: 5, fontFamily: 'Inter_400Regular' },
  moduleBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4, marginTop: 11 },
  moduleBadgeTxt: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 12, marginTop: 16 },
  noticeTxt: { flex: 1, fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular' },
  listCta: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 22 },
  listCtaIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  listCtaTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  listCtaDesc: { fontSize: 11, lineHeight: 16, marginTop: 3, fontFamily: 'Inter_400Regular' },
  tipsCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 15, borderWidth: 1, padding: 13, marginBottom: 22 },
  tipsIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  tipsTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  tipsText: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  listings: { gap: 10, marginBottom: 22 },
  listingCard: { flexDirection: 'row', gap: 11, borderRadius: 14, borderWidth: 1, padding: 10 },
  listingImage: { width: 70, height: 70, borderRadius: 10 },
  listingBody: { flex: 1, minWidth: 0 },
  listingTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  listingTitle: { flex: 1, fontSize: 12, lineHeight: 16, fontFamily: 'Inter_700Bold' },
  statusPill: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  statusText: { fontSize: 9, fontFamily: 'Inter_700Bold' },
  listingMeta: { fontSize: 10, lineHeight: 14, marginTop: 4, fontFamily: 'Inter_400Regular' },
  listingActions: { flexDirection: 'row', gap: 7, marginTop: 8 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  editButtonText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  openButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  openButtonText: { color: '#ffffff', fontSize: 10, fontFamily: 'Inter_700Bold' },
  closeButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  closeButtonText: { color: '#b91c1c', fontSize: 10, fontFamily: 'Inter_700Bold' },
  emptyListings: { alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 22, marginBottom: 22 },
  emptyListingsTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginTop: 8 },
  emptyListingsText: { fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 4, fontFamily: 'Inter_400Regular' },
});