import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_MODE } from '@/constants/config';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const phoneRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    await login('email');
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>A</Text>
            </View>
            <Text style={styles.logoWord}>AFRIQ</Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue trading</Text>

          {DEMO_MODE && (
            <View style={styles.demoBanner}>
              <Ionicons name="flash-outline" size={14} color="#d97706" />
              <Text style={styles.demoTxt}>Demo Mode — tap Sign In to enter instantly</Text>
            </View>
          )}

          {/* Phone/Email */}
          <Text style={styles.label}>Phone or Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={DEMO_MODE ? 'chinedu@okafortrading.com' : 'Enter phone or email'}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              ref={phoneRef}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={DEMO_MODE ? '••••••••' : 'Enter password'}
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotTxt}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity style={styles.signinBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.signinBtnTxt}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divRow}>
            <View style={styles.divLine} />
            <Text style={styles.divTxt}>or</Text>
            <View style={styles.divLine} />
          </View>

          {/* WhatsApp */}
          <TouchableOpacity style={styles.waBtn} onPress={() => { login('whatsapp'); router.replace('/(tabs)'); }} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.waBtnTxt}>Sign in with WhatsApp</Text>
          </TouchableOpacity>

          {/* Create account */}
          <View style={styles.createRow}>
            <Text style={styles.createTxt}>New to AFRIQ? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
              <Text style={styles.createLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 28 },
  logoBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },
  logoLetter: { fontSize: 24, fontWeight: '800', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  logoWord: { fontSize: 28, fontWeight: '800', color: '#059669', fontFamily: 'Inter_700Bold', letterSpacing: 1 },

  title: { fontSize: 28, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#6b7280', fontFamily: 'Inter_400Regular', marginBottom: 24 },

  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fef3c7', borderRadius: 10, padding: 10, marginBottom: 20 },
  demoTxt: { fontSize: 12, color: '#d97706', fontFamily: 'Inter_500Medium', flex: 1 },

  label: { fontSize: 13, fontWeight: '600', color: '#374151', fontFamily: 'Inter_600SemiBold', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827', fontFamily: 'Inter_400Regular' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 },
  forgotTxt: { fontSize: 13, color: '#059669', fontFamily: 'Inter_500Medium' },

  signinBtn: { backgroundColor: '#059669', height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  signinBtnTxt: { fontSize: 16, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },

  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  divTxt: { fontSize: 13, color: '#9ca3af', fontFamily: 'Inter_400Regular' },

  waBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: '#25D366', marginBottom: 32 },
  waBtnTxt: { fontSize: 15, fontWeight: '600', color: '#25D366', fontFamily: 'Inter_600SemiBold' },

  createRow: { flexDirection: 'row', justifyContent: 'center' },
  createTxt: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  createLink: { fontSize: 14, color: '#059669', fontFamily: 'Inter_600SemiBold' },
});
