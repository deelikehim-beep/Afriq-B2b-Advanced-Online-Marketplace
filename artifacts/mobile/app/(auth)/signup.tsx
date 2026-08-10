import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { AFRICAN_COUNTRIES } from '@/constants/data';
import { DEMO_MODE } from '@/constants/config';

export default function Signup() {
  const router = useRouter();
  const { login } = useAuth();
  const { updateUserProfile } = useApp();
  const insets = useSafeAreaInsets();
  const cardAnim = useRef(new Animated.Value(380)).current;
  const bgFade = useRef(new Animated.Value(0)).current;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [country, setCountry] = useState('NG');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [businessName, setBusinessName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardAnim, { toValue: 0, duration: 480, useNativeDriver: true, delay: 80 }),
      Animated.timing(bgFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAuth = async (method: string) => {
    setShowOnboarding(true);
  };

  const finishAuth = async (method: string) => {
    const selected = AFRICAN_COUNTRIES.find(item => item.code === country);
    updateUserProfile({
      residentCountry: selected?.name ?? 'Nigeria',
      residentCountryCode: country,
      businessName: businessName.trim() || (role === 'seller' ? 'My AFRIQ Store' : 'My Trading Business'),
      businessType: role === 'seller' ? 'Retailer & Supplier' : 'Buyer & Distributor',
      storeLocation: storeLocation.trim() || selected?.name,
      location: storeLocation.trim() || selected?.name || 'Africa',
    });
    await login(method);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Green top section */}
      <Animated.View style={{ opacity: bgFade }}>
        <LinearGradient colors={['#064e3b', '#059669']} style={[styles.topBg, { paddingTop: insets.top }]}>
          <View style={styles.topInner}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.75)" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoLetter}>A</Text>
              </View>
              <Text style={styles.logoWord}>AFRIQ</Text>
            </View>
            <Text style={styles.topTitle}>Africa's #1 B2B Marketplace</Text>
            <View style={styles.statsRow}>
              {[['500K+', 'Businesses'], ['₦2T+', 'Traded'], ['98%', 'Success Rate']].map(([v, l]) => (
                <View key={l} style={styles.stat}>
                  <Text style={styles.statVal}>{v}</Text>
                  <Text style={styles.statLbl}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      <Modal visible={showOnboarding} transparent animationType="slide" onRequestClose={() => setShowOnboarding(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.onboardingSheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.pill} />
            <Text style={styles.onboardingTitle}>Set up your AFRIQ profile</Text>
            <Text style={styles.onboardingSub}>This helps us rank nearby suppliers and tailor your trade workspace.</Text>
            <Text style={styles.onboardingLabel}>I am joining as</Text>
            <View style={styles.roleRow}>
              {(['buyer', 'seller'] as const).map(item => <TouchableOpacity key={item} onPress={() => setRole(item)} style={[styles.roleBtn, role === item && styles.roleBtnActive]}><Ionicons name={item === 'buyer' ? 'cart-outline' : 'storefront-outline'} size={18} color={role === item ? '#ffffff' : '#059669'} /><Text style={[styles.roleTxt, role === item && styles.roleTxtActive]}>{item === 'buyer' ? 'Buyer / importer' : 'Seller / supplier'}</Text></TouchableOpacity>)}
            </View>
            <Text style={styles.onboardingLabel}>Resident country</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 4 }}>
              {AFRICAN_COUNTRIES.filter(item => item.code !== 'all').map(item => <TouchableOpacity key={item.code} onPress={() => setCountry(item.code)} style={[styles.countryBtn, country === item.code && styles.countryBtnActive]}><Text style={styles.countryFlag}>{item.flag}</Text><Text style={[styles.countryTxt, country === item.code && styles.countryTxtActive]}>{item.name}</Text></TouchableOpacity>)}
            </ScrollView>
            <TextInput value={businessName} onChangeText={setBusinessName} placeholder={role === 'seller' ? 'Store or company name' : 'Business name (optional)'} placeholderTextColor="#9ca3af" style={styles.onboardingInput} />
            <TextInput value={storeLocation} onChangeText={setStoreLocation} placeholder="City, market or store location" placeholderTextColor="#9ca3af" style={styles.onboardingInput} />
            <TouchableOpacity style={styles.continueBtn} onPress={() => finishAuth('demo')}><Text style={styles.continueTxt}>Enter AFRIQ marketplace</Text><Ionicons name="arrow-forward" size={17} color="#ffffff" /></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: cardAnim }], paddingBottom: insets.bottom + 24 },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
          {/* Pill handle */}
          <View style={styles.pill} />

          {DEMO_MODE && (
            <View style={styles.demoBanner}>
              <Ionicons name="flash-outline" size={14} color="#d97706" />
              <Text style={styles.demoTxt}>Demo Mode — tap any option to enter instantly</Text>
            </View>
          )}

          <Text style={styles.cardTitle}>Create your account</Text>
          <Text style={styles.cardSub}>Start trading in minutes — no paperwork required</Text>

          {/* Google */}
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleAuth('google')} activeOpacity={0.8}>
            <View style={[styles.socialIcon, { backgroundColor: '#fff0f0' }]}>
              <Ionicons name="logo-google" size={20} color="#ea4335" />
            </View>
            <Text style={styles.socialTxt}>Continue with Google</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>

          {/* Apple — iOS only */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={[styles.socialBtn, styles.appleBtn]} onPress={() => handleAuth('apple')} activeOpacity={0.8}>
              <View style={[styles.socialIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Ionicons name="logo-apple" size={22} color="#ffffff" />
              </View>
              <Text style={[styles.socialTxt, { color: '#ffffff' }]}>Continue with Apple</Text>
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}

          {/* WhatsApp */}
          <TouchableOpacity style={[styles.socialBtn, styles.waBtn]} onPress={() => handleAuth('whatsapp')} activeOpacity={0.8}>
            <View style={[styles.socialIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
            </View>
            <Text style={[styles.socialTxt, { color: '#ffffff' }]}>Continue with WhatsApp</Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divRow}>
            <View style={styles.divLine} />
            <Text style={styles.divTxt}>or</Text>
            <View style={styles.divLine} />
          </View>

          {/* Email */}
          <TouchableOpacity style={[styles.socialBtn, styles.emailBtn]} onPress={() => handleAuth('email')} activeOpacity={0.8}>
            <View style={[styles.socialIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="mail-outline" size={20} color="#059669" />
            </View>
            <Text style={[styles.socialTxt, { color: '#059669' }]}>Continue with Email or Phone</Text>
            <Ionicons name="chevron-forward" size={16} color="#059669" />
          </TouchableOpacity>

          {/* Sign in link */}
          <View style={styles.signinRow}>
            <Text style={styles.signinTxt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to AFRIQ's{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#064e3b' },
  topBg: { minHeight: 240 },
  topInner: { paddingHorizontal: 24, paddingBottom: 24 },
  backBtn: { marginBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  logoBox: { width: 40, height: 40, borderRadius: 11, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center' },
  logoLetter: { fontSize: 22, fontWeight: '800', color: '#064e3b', fontFamily: 'Inter_700Bold' },
  logoWord: { fontSize: 26, fontWeight: '800', color: '#ffffff', fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  topTitle: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 20, fontFamily: 'Inter_400Regular' },
  statsRow: { flexDirection: 'row', gap: 0 },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '700', color: '#f59e0b', fontFamily: 'Inter_700Bold' },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', marginTop: 2 },

  card: {
    flex: 1, backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -24, paddingTop: 12, paddingHorizontal: 24,
  },
  pill: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },

  demoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fef3c7', borderRadius: 10, padding: 10, marginBottom: 16,
  },
  demoTxt: { fontSize: 12, color: '#d97706', fontFamily: 'Inter_500Medium', flex: 1 },

  cardTitle: { fontSize: 24, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  cardSub: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_400Regular', marginBottom: 24 },

  socialBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 16, marginBottom: 12, backgroundColor: '#ffffff',
  },
  appleBtn: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  waBtn: { backgroundColor: '#25D366', borderColor: '#25D366' },
  emailBtn: { borderColor: '#059669', borderStyle: 'dashed' },
  socialIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  socialTxt: { flex: 1, fontSize: 15, fontWeight: '500', color: '#111827', fontFamily: 'Inter_500Medium' },

  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  divLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  divTxt: { fontSize: 13, color: '#9ca3af', fontFamily: 'Inter_400Regular' },

  signinRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signinTxt: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  signinLink: { fontSize: 14, color: '#059669', fontFamily: 'Inter_600SemiBold', fontWeight: '600' },

  terms: { fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 18, marginTop: 12, fontFamily: 'Inter_400Regular' },
  termsLink: { color: '#059669', fontFamily: 'Inter_500Medium' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  onboardingSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 22, paddingTop: 12 },
  onboardingTitle: { fontSize: 21, color: '#111827', fontFamily: 'Inter_700Bold' },
  onboardingSub: { fontSize: 12, lineHeight: 18, color: '#6b7280', fontFamily: 'Inter_400Regular', marginTop: 5, marginBottom: 17 },
  onboardingLabel: { fontSize: 12, color: '#111827', fontFamily: 'Inter_600SemiBold', marginBottom: 8, marginTop: 8 },
  roleRow: { flexDirection: 'row', gap: 8 },
  roleBtn: { flex: 1, height: 48, borderRadius: 11, borderWidth: 1, borderColor: '#d1fae5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  roleBtnActive: { backgroundColor: '#059669', borderColor: '#059669' },
  roleTxt: { color: '#047857', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  roleTxtActive: { color: '#ffffff' },
  countryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 9, paddingVertical: 8, borderRadius: 16 },
  countryBtnActive: { backgroundColor: '#ecfdf5', borderColor: '#059669' },
  countryFlag: { fontSize: 14 },
  countryTxt: { color: '#374151', fontSize: 10, fontFamily: 'Inter_500Medium' },
  countryTxtActive: { color: '#047857' },
  onboardingInput: { height: 45, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, fontSize: 13, color: '#111827', marginTop: 10 },
  continueBtn: { height: 49, borderRadius: 12, backgroundColor: '#059669', marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  continueTxt: { color: '#ffffff', fontSize: 14, fontFamily: 'Inter_700Bold' },
});
