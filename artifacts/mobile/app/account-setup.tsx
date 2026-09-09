import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { AFRICAN_COUNTRIES } from '@/constants/data';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';

const BUSINESS_TYPES = ['Importer / distributor', 'Manufacturer', 'Wholesaler', 'Retailer', 'Cooperative', 'Service business'];
const EMPLOYEE_COUNTS = ['Just me', '2–10', '11–50', '51–200', '201+'];

export default function AccountSetup() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { user, updateUserProfile } = useApp();
  const { user: authUser } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller'>(user.role ?? 'buyer');
  const [country, setCountry] = useState(user.residentCountryCode || 'NG');
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [businessType, setBusinessType] = useState(user.businessType || BUSINESS_TYPES[0]);
  const [industry, setIndustry] = useState(user.industry || '');
  const [registrationNumber, setRegistrationNumber] = useState(user.registrationNumber || '');
  const [taxId, setTaxId] = useState(user.taxId || '');
  const [employeeCount, setEmployeeCount] = useState(user.employeeCount || '');
  const [contactName, setContactName] = useState(user.contactName || authUser?.name || '');
  const [contactPhone, setContactPhone] = useState(user.contactPhone || user.phone || '');
  const [storeLocation, setStoreLocation] = useState(user.storeLocation || '');
  const [storeAddress, setStoreAddress] = useState(user.storeAddress || '');
  const [website, setWebsite] = useState(user.website || '');
  const [description, setDescription] = useState(user.businessDescription || '');

  const selectedCountry = useMemo(
    () => AFRICAN_COUNTRIES.find(item => item.code === country) ?? AFRICAN_COUNTRIES[1],
    [country],
  );
  const isEditing = edit === '1';

  const validateStep = () => {
    if (step === 0 && !country) {
      Alert.alert('Choose your country', 'Your resident country is shown to buyers and suppliers.');
      return false;
    }
    if (step === 1 && !businessName.trim()) {
      Alert.alert('Company name required', 'Add the name buyers should see on your AFRIQ profile.');
      return false;
    }
    if (step === 2) {
      if (!contactName.trim()) {
        Alert.alert('Contact name required', 'Add the person buyers can contact about this account.');
        return false;
      }
      if (role === 'seller' && !storeAddress.trim()) {
        Alert.alert('Store address required', 'Seller profiles need a complete address before goods can be listed.');
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(current => Math.min(3, current + 1));
  };

  const save = async () => {
    if (!validateStep()) return;
    setSaving(true);
    try {
      const initials = businessName.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase();
      updateUserProfile({
        role,
        residentCountry: selectedCountry.name,
        residentCountryCode: selectedCountry.code,
        businessName: businessName.trim(),
        businessType,
        industry: industry.trim(),
        registrationNumber: registrationNumber.trim(),
        taxId: taxId.trim(),
        employeeCount,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        storeLocation: storeLocation.trim() || selectedCountry.name,
        storeAddress: storeAddress.trim(),
        website: website.trim(),
        businessDescription: description.trim(),
        avatar: initials || user.avatar,
        setupComplete: true,
      });
      router.replace('/(tabs)');
    } finally {
      setSaving(false);
    }
  };

  const stepTitles = ['Trade profile', 'Company details', 'Location & contact', 'Review'];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => (step > 0 ? setStep(current => current - 1) : router.back())}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.eyebrow, { color: colors.brand }]}>AFRIQ ACCOUNT</Text>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{isEditing ? 'Edit company profile' : 'Set up your account'}</Text>
        </View>
        <Text style={[styles.stepCount, { color: colors.mutedForeground }]}>{step + 1}/4</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((step + 1) / 4) * 100}%`, backgroundColor: colors.brand }]} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.stepTitle, { color: colors.foreground }]}>{stepTitles[step]}</Text>
        <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
          {step === 0 && 'Tell us how you trade so AFRIQ can tailor your workspace.'}
          {step === 1 && 'These details build the public company profile buyers will trust.'}
          {step === 2 && 'Add practical contact and delivery details for smoother trade.'}
          {step === 3 && 'Review your details before opening your AFRIQ workspace.'}
        </Text>

        {step === 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>I am joining as</Text>
            <View style={styles.roleGrid}>
              {(['buyer', 'seller'] as const).map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setRole(item)}
                  style={[styles.roleCard, { borderColor: role === item ? colors.brand : colors.border, backgroundColor: role === item ? colors.brandBg : colors.card }]}
                >
                  <View style={[styles.roleIcon, { backgroundColor: role === item ? colors.brand : colors.background }]}>
                    <Ionicons name={item === 'buyer' ? 'cart-outline' : 'storefront-outline'} size={21} color={role === item ? '#ffffff' : colors.brand} />
                  </View>
                  <Text style={[styles.roleTitle, { color: colors.foreground }]}>{item === 'buyer' ? 'Buyer / importer' : 'Seller / supplier'}</Text>
                  <Text style={[styles.roleDescription, { color: colors.mutedForeground }]}>{item === 'buyer' ? 'Source goods for your business' : 'Sell wholesale goods to buyers'}</Text>
                  {role === item && <Ionicons name="checkmark-circle" size={20} color={colors.brand} style={styles.selectedIcon} />}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Resident country</Text>
            <View style={styles.countryGrid}>
              {AFRICAN_COUNTRIES.filter(item => item.code !== 'all').map(item => (
                <TouchableOpacity key={item.code} onPress={() => setCountry(item.code)} style={[styles.countryChip, { borderColor: country === item.code ? colors.brand : colors.border, backgroundColor: country === item.code ? colors.brandBg : colors.card }]}>
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={[styles.countryName, { color: country === item.code ? colors.brandDark : colors.foreground }]}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Company or store name" value={businessName} onChangeText={setBusinessName} placeholder="e.g. Okafor Trading Ltd" colors={colors} required />
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Business type</Text>
            <View style={styles.optionGrid}>
              {BUSINESS_TYPES.map(item => <Option key={item} label={item} selected={businessType === item} onPress={() => setBusinessType(item)} colors={colors} />)}
            </View>
            <Field label="Industry" value={industry} onChangeText={setIndustry} placeholder="e.g. Food distribution, electronics" colors={colors} />
            <Field label="Registration number" value={registrationNumber} onChangeText={setRegistrationNumber} placeholder="RC, cooperative or business number" colors={colors} />
            <Field label="Tax ID" value={taxId} onChangeText={setTaxId} placeholder="Optional" colors={colors} />
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Team size</Text>
            <View style={styles.optionGrid}>{EMPLOYEE_COUNTS.map(item => <Option key={item} label={item} selected={employeeCount === item} onPress={() => setEmployeeCount(item)} colors={colors} />)}</View>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Primary contact" value={contactName} onChangeText={setContactName} placeholder="Name of the person managing this account" colors={colors} required />
            <Field label="Contact phone" value={contactPhone} onChangeText={setContactPhone} placeholder="+234 800 000 0000" colors={colors} keyboardType="phone-pad" />
            <Field label="Market or city location" value={storeLocation} onChangeText={setStoreLocation} placeholder={`e.g. ${selectedCountry.name}`} colors={colors} />
            <Field label={role === 'seller' ? 'Full store / warehouse address' : 'Business address'} value={storeAddress} onChangeText={setStoreAddress} placeholder="Street, market, city, country" colors={colors} multiline required={role === 'seller'} />
            <Field label="Website" value={website} onChangeText={setWebsite} placeholder="https://yourcompany.com (optional)" colors={colors} keyboardType="url" autoCapitalize="none" />
            <Field label="About your company" value={description} onChangeText={setDescription} placeholder="What do you sell and who do you serve?" colors={colors} multiline />
          </>
        )}

        {step === 3 && (
          <View style={styles.reviewList}>
            <ReviewSection title="Trade profile" icon="briefcase-outline" colors={colors}>
              <ReviewRow label="Role" value={role === 'seller' ? 'Seller / supplier' : 'Buyer / importer'} colors={colors} />
              <ReviewRow label="Country" value={`${selectedCountry.flag} ${selectedCountry.name}`} colors={colors} />
            </ReviewSection>
            <ReviewSection title="Company" icon="business-outline" colors={colors}>
              <ReviewRow label="Name" value={businessName} colors={colors} />
              <ReviewRow label="Type" value={businessType} colors={colors} />
              <ReviewRow label="Industry" value={industry || 'Not added'} colors={colors} />
              <ReviewRow label="Registration" value={registrationNumber || 'Not added'} colors={colors} />
            </ReviewSection>
            <ReviewSection title="Contact & location" icon="location-outline" colors={colors}>
              <ReviewRow label="Contact" value={contactName} colors={colors} />
              <ReviewRow label="Phone" value={contactPhone || 'Not added'} colors={colors} />
              <ReviewRow label="Address" value={storeAddress || storeLocation || 'Not added'} colors={colors} />
            </ReviewSection>
            <TouchableOpacity onPress={() => setStep(1)} style={styles.editDetailsButton}><Ionicons name="create-outline" size={16} color={colors.brand} /><Text style={[styles.editDetailsText, { color: colors.brand }]}>Edit company details</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.card, paddingBottom: insets.bottom + 12 }]}>
        {step < 3 ? (
          <TouchableOpacity onPress={next} style={[styles.primaryButton, { backgroundColor: colors.brand }]}>
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled={saving} onPress={save} style={[styles.primaryButton, { backgroundColor: colors.brand, opacity: saving ? 0.65 : 1 }]}>
            {saving ? <ActivityIndicator color="#ffffff" /> : <><Text style={styles.primaryButtonText}>{isEditing ? 'Save company profile' : 'Open my AFRIQ workspace'}</Text><Ionicons name="checkmark" size={18} color="#ffffff" /></>}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChangeText, placeholder, colors, multiline = false, required = false, keyboardType, autoCapitalize }: {
  label: string; value: string; onChangeText: (value: string) => void; placeholder: string; colors: ReturnType<typeof useColors>;
  multiline?: boolean; required?: boolean; keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url'; autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}{required ? ' *' : ''}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} multiline={multiline} keyboardType={keyboardType} autoCapitalize={autoCapitalize} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }, multiline && styles.multiline]} />
    </View>
  );
}

function Option({ label, selected, onPress, colors }: { label: string; selected: boolean; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <TouchableOpacity onPress={onPress} style={[styles.option, { borderColor: selected ? colors.brand : colors.border, backgroundColor: selected ? colors.brandBg : colors.card }]}><Text style={[styles.optionText, { color: selected ? colors.brandDark : colors.foreground }]}>{label}</Text>{selected && <Ionicons name="checkmark" size={16} color={colors.brand} />}</TouchableOpacity>;
}

function ReviewSection({ title, icon, colors, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; colors: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.reviewHeader}><Ionicons name={icon} size={18} color={colors.brand} /><Text style={[styles.reviewTitle, { color: colors.foreground }]}>{title}</Text></View>{children}</View>;
}

function ReviewRow({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return <View style={styles.reviewRow}><Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.reviewValue, { color: colors.foreground }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { minHeight: 74, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, borderBottomWidth: 1 },
  headerButton: { width: 42, height: 42, justifyContent: 'center' },
  headerCenter: { flex: 1 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.1 },
  headerTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 2 },
  stepCount: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  progressTrack: { height: 4, backgroundColor: '#e5e7eb' },
  progressFill: { height: 4, borderRadius: 4 },
  content: { paddingHorizontal: 20, paddingTop: 26 },
  stepTitle: { fontSize: 27, fontFamily: 'Inter_700Bold' },
  stepSubtitle: { fontSize: 14, lineHeight: 21, marginTop: 7, marginBottom: 26, fontFamily: 'Inter_400Regular' },
  sectionLabel: { fontSize: 13, fontFamily: 'Inter_700Bold', marginTop: 12, marginBottom: 10 },
  roleGrid: { flexDirection: 'row', gap: 10 },
  roleCard: { flex: 1, borderWidth: 1.5, borderRadius: 16, padding: 14, minHeight: 142, position: 'relative' },
  roleIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  roleTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  roleDescription: { fontSize: 11, lineHeight: 16, marginTop: 5, fontFamily: 'Inter_400Regular' },
  selectedIcon: { position: 'absolute', right: 12, top: 12 },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countryChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 9 },
  countryFlag: { fontSize: 15 },
  countryName: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_700Bold', marginBottom: 7 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, fontFamily: 'Inter_400Regular' },
  multiline: { minHeight: 92, paddingTop: 13, textAlignVertical: 'top' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  option: { minHeight: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
  optionText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  reviewList: { gap: 12 },
  reviewCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  reviewTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  reviewRow: { flexDirection: 'row', gap: 12, marginTop: 9 },
  reviewLabel: { width: 82, fontSize: 12, fontFamily: 'Inter_400Regular' },
  reviewValue: { flex: 1, fontSize: 12, lineHeight: 17, fontFamily: 'Inter_600SemiBold' },
  editDetailsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 10 },
  editDetailsText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  footer: { borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 12 },
  primaryButton: { height: 54, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontFamily: 'Inter_700Bold' },
});