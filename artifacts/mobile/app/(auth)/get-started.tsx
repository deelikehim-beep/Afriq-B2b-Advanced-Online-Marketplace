import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'shield-checkmark' as const,
    title: 'Trade with Confidence',
    subtitle: "Every deal protected by AFRIQ Escrow — your money stays safe until delivery is confirmed",
  },
  {
    id: '2',
    icon: 'globe' as const,
    title: '500K+ Verified Suppliers',
    subtitle: "From Lagos to Cairo, Nairobi to Accra — Africa's largest B2B wholesale marketplace",
  },
  {
    id: '3',
    icon: 'wallet' as const,
    title: 'Smart Wallet & Payments',
    subtitle: "Multi-currency wallet, instant bank transfers, mobile money — zero hidden fees",
  },
];

export default function GetStarted() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeSlide + 1) % SLIDES.length;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveSlide(next);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#064e3b', '#022c22']} style={StyleSheet.absoluteFill} />

      {/* Decorative geometry */}
      <View style={[styles.decoCircle, { width: 300, height: 300, top: -100, right: -100 }]} />
      <View style={[styles.decoCircle, { width: 200, height: 200, bottom: 160, left: -80, opacity: 0.08 }]} />
      <View style={[styles.decoCircle, { width: 100, height: 100, top: 200, left: -30, backgroundColor: 'rgba(245,158,11,0.12)' }]} />

      <Animated.View
        style={[
          styles.inner,
          { paddingTop: insets.top + 36, paddingBottom: insets.bottom + 32, opacity: fadeAnim, transform: [{ translateY: slideUp }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>A</Text>
          </View>
          <Text style={styles.logoWord}>AFRIQ</Text>
        </View>
        <Text style={styles.logoTagline}>Africa's #1 B2B Wholesale Marketplace</Text>

        {/* Slides */}
        <FlatList
          ref={flatRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveSlide(idx);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={52} color="#f59e0b" />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSub}>{item.subtitle}</Text>
            </View>
          )}
          style={styles.slideList}
        />

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
          ))}
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/(auth)/signup')} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryTxt}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#064e3b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
            <Text style={styles.btnGhostTxt}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#064e3b' },
  inner: { flex: 1, paddingHorizontal: 0 },
  decoCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(5,150,105,0.15)' },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 28 },
  logoBox: { width: 46, height: 46, borderRadius: 13, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center' },
  logoLetter: { fontSize: 26, fontWeight: '800', color: '#064e3b', fontFamily: 'Inter_700Bold' },
  logoWord: { fontSize: 30, fontWeight: '800', color: '#ffffff', fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  logoTagline: { fontSize: 13, color: 'rgba(255,255,255,0.55)', paddingHorizontal: 28, marginTop: 4, fontFamily: 'Inter_400Regular' },

  slideList: { marginTop: 56, flexGrow: 0, height: 260 },
  slide: { paddingHorizontal: 36, alignItems: 'center' },
  iconWrap: { width: 104, height: 104, borderRadius: 52, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
  slideTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', textAlign: 'center', marginBottom: 14, fontFamily: 'Inter_700Bold' },
  slideSub: { fontSize: 15, color: 'rgba(255,255,255,0.62)', textAlign: 'center', lineHeight: 23, fontFamily: 'Inter_400Regular' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { backgroundColor: '#f59e0b', width: 26, borderRadius: 4 },

  btnGroup: { paddingHorizontal: 24, gap: 12 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#f59e0b', height: 58, borderRadius: 16 },
  btnPrimaryTxt: { fontSize: 17, fontWeight: '700', color: '#064e3b', fontFamily: 'Inter_700Bold' },
  btnGhost: { height: 48, justifyContent: 'center', alignItems: 'center' },
  btnGhostTxt: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
});
