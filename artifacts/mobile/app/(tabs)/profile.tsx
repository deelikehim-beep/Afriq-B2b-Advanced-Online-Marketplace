import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { AFRICAN_COUNTRIES, fmt } from '@/constants/data';

const SETTINGS = [
  { id: 'business', label: 'Business Profile', icon: 'briefcase-outline', desc: 'Edit company details' },
  { id: 'kyc', label: 'KYC Verification', icon: 'id-card-outline', desc: 'Upload business documents', badge: 'Verified' },
  { id: 'bank', label: 'Bank Accounts', icon: 'card-outline', desc: 'Manage linked banks' },
  { id: 'security', label: 'Security', icon: 'shield-outline', desc: 'PIN, biometrics, 2FA' },
  { id: 'notif', label: 'Notifications', icon: 'notifications-outline', desc: 'Alerts and preferences' },
  { id: 'referral', label: 'Refer & Earn', icon: 'gift-outline', desc: 'Get ₦5,000 per referral', badge: 'Earn' },
  { id: 'support', label: 'Help & Support', icon: 'help-circle-outline', desc: '24/7 live chat support' },
  { id: 'about', label: 'About AFRIQ', icon: 'information-circle-outline', desc: 'Version 1.0.0' },
];

export default function Profile() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, orders, transactions, savedItems, updateUserProfile } = useApp();
  const { logout } = useAuth();

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpent = transactions.filter(t => t.type === 'escrow_lock').reduce((s, t) => s + t.amount, 0);
  const [editVisible, setEditVisible] = useState(false);
  const [draft, setDraft] = useState({
    businessName: user.businessName,
    businessType: user.businessType,
    storeLocation: user.storeLocation ?? '',
    storeAddress: user.storeAddress ?? '',
    website: user.website ?? '',
    businessDescription: user.businessDescription ?? '',
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/get-started');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        {/* Identity card */}
        <LinearGradient colors={[colors.brandDeep, colors.brand]} style={styles.idCard}>
          <View style={styles.idCircle1} />
          <View style={styles.idCircle2} />
          <View style={styles.idTop}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.avatarLetter}>{user.avatar}</Text>
              </View>
              {user.verified && (
                <View style={styles.verifiedDot}>
                  <Ionicons name="checkmark-circle" size={18} color="#059669" />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.idName}>{user.name}</Text>
              <Text style={styles.idBiz}>{user.businessName}</Text>
              <Text style={styles.idType}>{user.businessType}</Text>
              <View style={styles.idLocation}>
                <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.idLocationTxt}>{user.residentCountry ?? user.location}</Text>
              </View>
              <Text style={styles.idAddress}>{user.storeAddress ? `Store: ${user.storeAddress}` : 'Store address not added yet'}</Text>
            </View>
          </View>

          {/* Trust score */}
          <View style={styles.trustRow}>
            <View style={styles.trustLeft}>
              <Text style={styles.trustLabel}>Trust Score</Text>
              <Text style={styles.trustScore}>{user.trustScore}/100</Text>
            </View>
            <View style={styles.trustBar}>
              <View style={[styles.trustFill, { width: `${user.trustScore}%` as any }]} />
            </View>
            <View style={[styles.trustBadge]}>
              <Ionicons name="shield-checkmark" size={12} color="#f59e0b" />
              <Text style={styles.trustBadgeTxt}>Trusted</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          {[
            { label: 'Total Deals', value: user.totalDeals.toString(), icon: 'cart', color: colors.brand },
            { label: 'Completed', value: completedOrders.toString(), icon: 'checkmark-circle', color: '#059669' },
            { label: 'Success Rate', value: user.successRate + '%', icon: 'trending-up', color: colors.navy },
            { label: 'Member Since', value: user.memberSince, icon: 'calendar', color: colors.gold },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Wallet summary */}
        <View style={[styles.walletSummary, { backgroundColor: colors.brandBg, borderColor: colors.brandLight }]}>
          <Ionicons name="wallet-outline" size={20} color={colors.brand} />
               <View style={{ flex: 1 }}>
            <Text style={[styles.walletLabel, { color: colors.brand }]}>Wallet Balance</Text>
            <Text style={[styles.walletBal, { color: colors.brandDark }]}>{fmt(user.balance)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.topUpBtn, { backgroundColor: colors.brand }]}
            onPress={() => router.push('/(tabs)/wallet')}
          >
            <Text style={styles.topUpTxt}>Top Up</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.quickLinks, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/saved')}>
            <View style={[styles.quickIcon, { backgroundColor: colors.goldBg }]}><Ionicons name="bookmark" size={18} color={colors.goldDark} /></View>
            <Text style={[styles.quickValue, { color: colors.foreground }]}>{savedItems.length}</Text>
            <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Saved goods</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/business-suite' as any)}>
            <View style={[styles.quickIcon, { backgroundColor: colors.navyBg }]}><Ionicons name="grid-outline" size={18} color={colors.navy} /></View>
            <Text style={[styles.quickValue, { color: colors.foreground }]}>Suite</Text>
            <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Merchant tools</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => setEditVisible(true)}>
            <View style={[styles.quickIcon, { backgroundColor: colors.brandBg }]}><Ionicons name="create-outline" size={18} color={colors.brand} /></View>
            <Text style={[styles.quickValue, { color: colors.foreground }]}>Edit</Text>
            <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Business profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings menu */}
        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          {SETTINGS.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.menuItem, i < SETTINGS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => {
                if (s.id === 'business') setEditVisible(true);
                if (s.id === 'support') Alert.alert('AFRIQ Support', 'Demo support desk: a trade specialist will respond within 4 hours.');
              }}
            >
               <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
                <Ionicons name={s.icon as any} size={20} color={colors.foreground} />
              </View>
               <View style={{ flex: 1 }}>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{s.label}</Text>
                <Text style={[styles.menuDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
              </View>
              {s.badge && (
                <View style={[styles.menuBadge, { backgroundColor: s.badge === 'Verified' ? colors.brandBg : colors.goldBg }]}>
                  <Text style={[styles.menuBadgeTxt, { color: s.badge === 'Verified' ? colors.brand : colors.goldDark }]}>{s.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: '#fee2e2', backgroundColor: '#fef2f2' }]} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutTxt}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionTxt, { color: colors.mutedForeground }]}>AFRIQ v1.0.0 · Africa's B2B Marketplace</Text>
      </ScrollView>

      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.editSheet, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.editHeader}>
              <View><Text style={[styles.editTitle, { color: colors.foreground }]}>Business profile</Text><Text style={[styles.editSub, { color: colors.mutedForeground }]}>Shown to buyers on your store page</Text></View>
              <TouchableOpacity onPress={() => setEditVisible(false)}><Ionicons name="close" size={22} color={colors.mutedForeground} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {([
                ['residentCountry', 'Resident country'],
                ['businessName', 'Business / store name'],
                ['businessType', 'Business type'],
                ['storeLocation', 'Market / city location'],
                ['storeAddress', 'Full store address'],
                ['website', 'Website (optional)'],
              ] as const).map(([key, label]) => (
                <View key={key} style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
                  <TextInput value={key === 'residentCountry' ? (user.residentCountry ?? '') : draft[key as keyof typeof draft]} onChangeText={value => key === 'residentCountry' ? updateUserProfile({ residentCountry: value }) : setDraft(prev => ({ ...prev, [key as keyof typeof draft]: value }))} placeholder={label} placeholderTextColor={colors.mutedForeground} style={[styles.fieldInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} />
                </View>
              ))}
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>About your company</Text>
              <TextInput value={draft.businessDescription} onChangeText={value => setDraft(prev => ({ ...prev, businessDescription: value }))} multiline placeholder="What do you sell and who do you serve?" placeholderTextColor={colors.mutedForeground} style={[styles.fieldInput, styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} />
              <TouchableOpacity style={[styles.saveProfileBtn, { backgroundColor: colors.brand }]} onPress={() => {
                if (user.role === 'seller' && !draft.storeAddress.trim()) {
                  Alert.alert('Store address required', 'Seller profiles must have a complete store address before goods can be listed for sale.');
                  return;
                }
                if (!user.residentCountry?.trim()) {
                  Alert.alert('Country required', 'Add your resident country so it is visible on your public profile.');
                  return;
                }
                updateUserProfile(draft);
                setEditVisible(false);
                Alert.alert('Profile updated', 'Your country and store details are now visible to other marketplace users.');
              }}>
                <Text style={styles.saveProfileTxt}>Save business details</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  idCard: { margin: 16, borderRadius: 20, padding: 20, overflow: 'hidden' },
  idCircle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -50 },
  idCircle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: 20 },
  idTop: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: 24, fontWeight: '700', color: '#064e3b', fontFamily: 'Inter_700Bold' },
  verifiedDot: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#fff', borderRadius: 10 },
  idName: { fontSize: 20, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  idBiz: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_500Medium', marginTop: 2 },
  idType: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular', marginTop: 1 },
  idLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  idLocationTxt: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  idAddress: { fontSize: 10, color: 'rgba(255,255,255,0.58)', fontFamily: 'Inter_400Regular', marginTop: 3 },

  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 },
  trustLeft: {},
  trustLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular' },
  trustScore: { fontSize: 16, fontWeight: '700', color: '#f59e0b', fontFamily: 'Inter_700Bold' },
  trustBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  trustFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 3 },
  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  trustBadgeTxt: { fontSize: 11, color: '#f59e0b', fontFamily: 'Inter_600SemiBold' },

  statsCard: { marginHorizontal: 16, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 6 },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statVal: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },

  walletSummary: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16, borderWidth: 1 },
  walletLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  walletBal: { fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 2 },
  topUpBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  topUpTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#ffffff' },

  menuCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  menuDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  menuBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  menuBadgeTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 16, height: 52, borderRadius: 14, borderWidth: 1 },
  logoutTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#ef4444' },
  versionTxt: { textAlign: 'center', fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 16 },
  quickLinks: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 12, flexDirection: 'row', justifyContent: 'space-around' },
  quickLink: { alignItems: 'center', gap: 4, flex: 1 },
  quickIcon: { width: 36, height: 36, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  quickValue: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  quickLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  editSheet: { maxHeight: '88%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18 },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginBottom: 14 },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  editTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  editSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 6 },
  fieldInput: { height: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 13, fontFamily: 'Inter_400Regular' },
  textArea: { height: 84, paddingTop: 11, textAlignVertical: 'top' },
  saveProfileBtn: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  saveProfileTxt: { color: '#ffffff', fontSize: 14, fontFamily: 'Inter_700Bold' },
});
