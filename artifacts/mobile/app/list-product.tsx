import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import {
  CATEGORIES,
  getCategoryTaxonomy,
  hasCompleteSellerProfile,
  type ProductListingDraft,
} from '@/constants/data';
import { useColors } from '@/hooks/useColors';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=80',
];

const parseNumber = (value: string) => Number(value.replace(/,/g, '').trim());

function ChoiceChips({
  items,
  selected,
  onSelect,
  colors,
}: {
  items: { id: string; name: string }[];
  selected: string;
  onSelect: (id: string) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {items.map(item => {
        const active = item.id === selected;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.chip,
              { borderColor: active ? colors.brand : colors.border, backgroundColor: active ? colors.brandBg : colors.card },
            ]}
          >
            <Text style={[styles.chipText, { color: active ? colors.brandDark : colors.mutedForeground }]}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function ListProduct() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, createProductListing } = useApp();
  const [categoryId, setCategoryId] = useState('textiles');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('');
  const [unit, setUnit] = useState('units');
  const [stock, setStock] = useState('');
  const [variants, setVariants] = useState('');
  const [delivery, setDelivery] = useState('');
  const [escrow, setEscrow] = useState(true);
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [imageUrl, setImageUrl] = useState('');

  const taxonomy = useMemo(() => getCategoryTaxonomy(categoryId), [categoryId]);
  const activeSubcategory = taxonomy.subcategories.find(item => item.id === subcategoryId) ?? taxonomy.subcategories[0];
  const activeType = activeSubcategory?.types.find(item => item.id === typeId) ?? activeSubcategory?.types[0];
  const profileComplete = hasCompleteSellerProfile(user);
  const categoryName = CATEGORIES.find(item => item.id === categoryId)?.name ?? categoryId;

  const selectCategory = (id: string) => {
    setCategoryId(id);
    setSubcategoryId('');
    setTypeId('');
  };

  const selectSubcategory = (id: string) => {
    setSubcategoryId(id);
    setTypeId('');
  };

  const addImageUrl = () => {
    const next = imageUrl.trim();
    if (!next) return;
    setImages(prev => [...prev, next]);
    setImageUrl('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const handleSubmit = () => {
    if (user.role !== 'seller') {
      Alert.alert('Seller account required', 'Only seller accounts can publish goods on AFRIQ.');
      return;
    }
    if (!profileComplete) {
      Alert.alert(
        'Complete Business Profile',
        'Add your public country and full store address before submitting a listing.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Go to Business Profile', onPress: () => router.push('/(tabs)/profile?edit=business' as any) },
        ],
      );
      return;
    }

    const selectedVariants = variants.split(',').map(value => value.trim()).filter(Boolean);
    const draft: ProductListingDraft = {
      name,
      category: categoryId,
      subcategory: activeSubcategory?.name ?? '',
      type: activeType?.name ?? '',
      brand,
      model,
      price: parseNumber(price),
      moq: parseNumber(moq),
      unit,
      stock: parseNumber(stock),
      variants: selectedVariants,
      images,
      delivery,
      escrow,
    };
    const result = createProductListing(draft);
    if (!result.ok) {
      Alert.alert('Listing needs attention', result.error ?? 'Review the listing details and try again.');
      return;
    }
    Alert.alert('Product listed', 'Your good is now ready to appear on the AFRIQ marketplace.', [
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>List a product</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>Create a public wholesale listing</Text>
        </View>
        <View style={[styles.stepPill, { backgroundColor: colors.brandBg }]}>
          <Text style={[styles.stepPillText, { color: colors.brandDark }]}>1 of 1</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 36 }}
      >
        {user.role === 'seller' && !profileComplete && (
          <View style={[styles.gate, { backgroundColor: colors.goldBg, borderColor: colors.goldDark + '45' }]}>
            <Ionicons name="lock-closed-outline" size={19} color={colors.goldDark} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.gateTitle, { color: colors.foreground }]}>Business Profile needed before publishing</Text>
              <Text style={[styles.gateText, { color: colors.mutedForeground }]}>Buyers see your country and store address on every listing.</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile?edit=business' as any)}>
                <Text style={[styles.gateLink, { color: colors.goldDark }]}>Complete Business Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.brandBg }]}>
              <Ionicons name="layers-outline" size={18} color={colors.brand} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Product identity</Text>
              <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>Help buyers find the right good</Text>
            </View>
          </View>
          <Field label="Listing title" value={name} onChangeText={setName} placeholder="e.g. Premium Ankara Wax Fabrics" colors={colors} />
          <Text style={[styles.label, { color: colors.foreground }]}>Category</Text>
          <ChoiceChips items={CATEGORIES.filter(item => item.id !== 'all').slice(0, 10)} selected={categoryId} onSelect={selectCategory} colors={colors} />
          <Text style={[styles.label, { color: colors.foreground }]}>Subcategory</Text>
          <ChoiceChips items={taxonomy.subcategories} selected={activeSubcategory?.id ?? ''} onSelect={selectSubcategory} colors={colors} />
          <Text style={[styles.label, { color: colors.foreground }]}>Product type</Text>
          <ChoiceChips items={activeSubcategory?.types ?? []} selected={activeType?.id ?? ''} onSelect={setTypeId} colors={colors} />
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Field label="Brand" value={brand} onChangeText={setBrand} placeholder="Brand name" colors={colors} />
            </View>
            <View style={styles.column}>
              <Field label="Model / grade" value={model} onChangeText={setModel} placeholder="Model or grade" colors={colors} />
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.goldBg }]}>
              <Ionicons name="pricetag-outline" size={18} color={colors.goldDark} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Trade terms</Text>
              <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>Keep stock and MOQ aligned</Text>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}><Field label="Price per unit (₦)" value={price} onChangeText={setPrice} placeholder="0" keyboardType="numeric" colors={colors} /></View>
            <View style={styles.column}><Field label="Unit" value={unit} onChangeText={setUnit} placeholder="units" colors={colors} /></View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}><Field label="Minimum order (MOQ)" value={moq} onChangeText={setMoq} placeholder="0" keyboardType="numeric" colors={colors} /></View>
            <View style={styles.column}><Field label="Available stock" value={stock} onChangeText={setStock} placeholder="0" keyboardType="numeric" colors={colors} /></View>
          </View>
          <Field label="Variants (comma separated)" value={variants} onChangeText={setVariants} placeholder="Blue / Gold, Red / Green" colors={colors} />
          <Field label="Delivery details" value={delivery} onChangeText={setDelivery} placeholder="e.g. 3–5 days across Lagos" colors={colors} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchTitle, { color: colors.foreground }]}>Eligible for escrow</Text>
              <Text style={[styles.switchHint, { color: colors.mutedForeground }]}>Let buyers protect this order with AFRIQ escrow.</Text>
            </View>
            <Switch value={escrow} onValueChange={setEscrow} trackColor={{ false: colors.border, true: colors.brandLight }} thumbColor={escrow ? colors.brand : colors.mutedForeground} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.navyBg }]}>
              <Ionicons name="images-outline" size={18} color={colors.navy} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Product images</Text>
              <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>Show buyers what they will receive</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
            {images.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.imageWrap}>
                <Image source={{ uri }} style={styles.productImage} contentFit="cover" />
                <TouchableOpacity style={styles.removeImage} onPress={() => setImages(prev => prev.filter((_, imageIndex) => imageIndex !== index))}>
                  <Ionicons name="close" size={13} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={[styles.addImage, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={pickImage}>
              <Ionicons name="camera-outline" size={22} color={colors.brand} />
              <Text style={[styles.addImageText, { color: colors.brand }]}>Add photo</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.urlRow}>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="Or paste an image URL"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.urlInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TouchableOpacity style={[styles.addUrlButton, { backgroundColor: colors.brand }]} onPress={addImageUrl}>
              <Ionicons name="add" size={19} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.previewCard, { backgroundColor: colors.brandDeep }]}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewEyebrow}>BUYER PREVIEW</Text>
              <Text style={styles.previewTitle}>{name.trim() || 'Your product title'}</Text>
            </View>
            <Ionicons name="eye-outline" size={22} color="#ffffff" />
          </View>
          <View style={styles.previewMeta}>
            <View style={styles.previewMetaItem}><Ionicons name="location-outline" size={14} color="#fbbf24" /><Text style={styles.previewMetaText}>{user.residentCountry || 'Public country not set'}</Text></View>
            <View style={styles.previewMetaItem}><Ionicons name="storefront-outline" size={14} color="#fbbf24" /><Text style={styles.previewMetaText}>{user.storeAddress || 'Store address not set'}</Text></View>
          </View>
          <View style={styles.previewDivider} />
          <Text style={styles.previewSupplier}>{user.businessName} · {categoryName}</Text>
          <Text style={styles.previewLocation}>{user.storeLocation || user.location}</Text>
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.brand }]} onPress={handleSubmit} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle-outline" size={21} color="#ffffff" />
          <Text style={styles.submitText}>{user.role === 'seller' ? 'Submit listing for review' : 'Seller account required'}</Text>
        </TouchableOpacity>
        <Text style={[styles.submitHint, { color: colors.mutedForeground }]}>
          {user.role === 'seller' && profileComplete
            ? 'Your public country and store address will appear on the listing.'
            : 'Complete your seller account and public business profile to publish.'}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  colors,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  colors: ReturnType<typeof useColors>;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backButton: { width: 34, justifyContent: 'center' },
  headerTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  headerSubtitle: { fontSize: 11, marginTop: 2, fontFamily: 'Inter_400Regular' },
  stepPill: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  stepPillText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  gate: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, borderWidth: 1, padding: 13, marginBottom: 14 },
  gateTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  gateText: { fontSize: 11, lineHeight: 16, marginTop: 3, fontFamily: 'Inter_400Regular' },
  gateLink: { fontSize: 12, fontFamily: 'Inter_700Bold', marginTop: 8 },
  section: { borderRadius: 16, padding: 15, marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  sectionHint: { fontSize: 10, marginTop: 2, fontFamily: 'Inter_400Regular' },
  field: { flex: 1, marginBottom: 12 },
  label: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, fontSize: 12, fontFamily: 'Inter_400Regular' },
  twoColumns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1 },
  chipRow: { gap: 7, paddingBottom: 4 },
  chip: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8 },
  chipText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 2 },
  switchTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  switchHint: { fontSize: 10, marginTop: 2, lineHeight: 14, fontFamily: 'Inter_400Regular' },
  imageRow: { gap: 9, paddingBottom: 10 },
  imageWrap: { width: 82, height: 82, borderRadius: 11, overflow: 'hidden', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  removeImage: { position: 'absolute', top: 4, right: 4, width: 19, height: 19, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  addImage: { width: 82, height: 82, borderRadius: 11, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 5 },
  addImageText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  urlRow: { flexDirection: 'row', gap: 8 },
  urlInput: { flex: 1, height: 42, borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, fontSize: 11, fontFamily: 'Inter_400Regular' },
  addUrlButton: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  previewCard: { borderRadius: 16, padding: 16, marginBottom: 14 },
  previewHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  previewEyebrow: { color: '#fbbf24', fontSize: 9, letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  previewTitle: { color: '#ffffff', fontSize: 18, lineHeight: 24, marginTop: 6, fontFamily: 'Inter_700Bold' },
  previewMeta: { gap: 7, marginTop: 15 },
  previewMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  previewMetaText: { flex: 1, color: 'rgba(255,255,255,0.82)', fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  previewDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 13 },
  previewSupplier: { color: '#ffffff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  previewLocation: { color: 'rgba(255,255,255,0.62)', fontSize: 10, marginTop: 3, fontFamily: 'Inter_400Regular' },
  submitButton: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  submitText: { color: '#ffffff', fontSize: 14, fontFamily: 'Inter_700Bold' },
  submitHint: { textAlign: 'center', fontSize: 10, lineHeight: 15, marginTop: 8, paddingHorizontal: 18, fontFamily: 'Inter_400Regular' },
});