import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const cardAnim = useRef(new Animated.Value(380)).current;
  const bgFade = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardAnim, { toValue: 0, duration: 480, useNativeDriver: true, delay: 80 }),
      Animated.timing(bgFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const createAccount = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      Alert.alert('Enter your email', 'Use a valid email address to create your AFRIQ account.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password is too short', 'Your password must contain at least 8 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(normalizedEmail, password, 'AFRIQ member');
      router.replace('/account-setup');
    } catch (error) {
      Alert.alert(
        'Unable to create account',
        error instanceof Error ? error.message : 'Please check your details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const explainProvider = () => {
    Alert.alert(
      'Email sign-up available',
      'Create your AFRIQ account with an email and password. You can add your company details immediately after.',
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.View style={{ opacity: bgFade }}>
        <LinearGradient colors={['#064e3b', '#059669']} style={[styles.topBg, { paddingTop: insets.top }]}>
          <View style={styles.topInner}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.75)" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}><Text style={styles.logoLetter}>A</Text></View>
              <Text style={styles.logoWord}>AFRIQ</Text>
            </View>
            <Text style={styles.topTitle}>Africa's #1 B2B Marketplace</Text>
            <View style={styles.statsRow}>
              {[['500K+', 'Businesses'], ['₦2T+', 'Traded'], ['98%', 'Success Rate']].map(([value, label]) => (
                <View key={label} style={styles.stat}>
                  <Text style={styles.statVal}>{value}</Text>
                  <Text style={styles.statLbl}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.card, { transform: [{ translateY: cardAnim }], paddingBottom: insets.bottom + 24 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.cardContent}
        >
          <View style={styles.pill} />
          <Text style={styles.cardTitle}>Create your account</Text>
          <Text style={styles.cardSub}>First, secure your account. We’ll collect your company details next.</Text>

          <Text style={styles.label}>Email address</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#9ca3af" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <TouchableOpacity onPress={() => setShowPassword(current => !current)} hitSlop={10}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={19} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={isSubmitting}
            style={[styles.createBtn, isSubmitting && styles.disabledBtn]}
            onPress={createAccount}
            activeOpacity={0.85}
          >
            <Text style={styles.createBtnText}>{isSubmitting ? 'Creating account…' : 'Create account'}</Text>
            {!isSubmitting && <Ionicons name="arrow-forward" size={18} color="#ffffff" />}
          </TouchableOpacity>

          <View style={styles.nextStep}>
            <View style={styles.nextIcon}><Ionicons name="briefcase-outline" size={17} color="#059669" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextTitle}>Next: complete your company profile</Text>
              <Text style={styles.nextText}>Role, country, business details, address and contact information.</Text>
            </View>
          </View>

          <View style={styles.divRow}>
            <View style={styles.divLine} /><Text style={styles.divTxt}>or</Text><View style={styles.divLine} />
          </View>

          <TouchableOpacity style={styles.providerBtn} onPress={explainProvider} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={19} color="#ea4335" />
            <Text style={styles.providerText}>Other sign-in providers</Text>
            <Ionicons name="information-circle-outline" size={17} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.signinLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.terms}>
            By continuing, you agree to AFRIQ's <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
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
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '700', color: '#f59e0b', fontFamily: 'Inter_700Bold' },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  card: { flex: 1, backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingTop: 12, paddingHorizontal: 24 },
  cardContent: { paddingBottom: 24 },
  pill: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  cardSub: { fontSize: 14, lineHeight: 20, color: '#6b7280', fontFamily: 'Inter_400Regular', marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', fontFamily: 'Inter_600SemiBold', marginBottom: 6, marginTop: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 54, marginBottom: 8 },
  input: { flex: 1, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },
  createBtn: { backgroundColor: '#059669', height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 9, marginTop: 16 },
  disabledBtn: { opacity: 0.65 },
  createBtnText: { fontSize: 16, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  nextStep: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ecfdf5', borderRadius: 13, padding: 12, marginTop: 16 },
  nextIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  nextTitle: { fontSize: 12, color: '#065f46', fontFamily: 'Inter_700Bold' },
  nextText: { fontSize: 11, lineHeight: 16, color: '#047857', marginTop: 2, fontFamily: 'Inter_400Regular' },
  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
  divLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  divTxt: { fontSize: 13, color: '#9ca3af', fontFamily: 'Inter_400Regular' },
  providerBtn: { height: 50, borderRadius: 13, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  providerText: { color: '#374151', fontSize: 14, fontFamily: 'Inter_500Medium' },
  signinRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  signinText: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  signinLink: { fontSize: 14, color: '#059669', fontFamily: 'Inter_600SemiBold' },
  terms: { fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 18, marginTop: 14, fontFamily: 'Inter_400Regular' },
  termsLink: { color: '#059669', fontFamily: 'Inter_500Medium' },
});