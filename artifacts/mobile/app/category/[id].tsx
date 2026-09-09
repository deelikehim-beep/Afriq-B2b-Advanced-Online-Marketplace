import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import {
  AFRICAN_COUNTRIES, CATEGORIES, PRODUCTS, PRODUCT_COUNTRY, fmt,
  getCategoryTaxonomy, type CategoryBrand, type CategorySubcategory,
  type CategoryType, type Product,
} from '@/constants/data';

const CATEGORY_COLORS: Record<string, string> = {
  textiles: '#7c3aed', electronics: '#0284c7', agriculture: '#16a34a',
  beauty: '#db2777', home: '#ea580c', auto: '#475569', food: '#d97706',
  health: '#0d9488', office: '#4f46e5', machinery: '#374151', sports: '#dc2626',
};

const catLiveCount = (catId: string, products: Product[]) =>
  catId === 'all' ? products.length : products.filter(product => product.category === catId).length;

function FilterSheet({
  visible, onClose, country, setCountry, maxPrice, setMaxPrice, rating, setRating,
  inStock, setInStock, escrow, setEscrow, onReset,
}: {
  visible: boolean; onClose: () => void; country: string; setCountry: (v: string) => void;
  maxPrice: string; setMaxPrice: (v: string) => void; rating: number; setRating: (v: number) => void;
  inStock: boolean; setInStock: (v: boolean) => void; escrow: boolean; setEscrow: (v: boolean) => void;
  onReset: () => void;
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Refine results</Text>
              <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>Filter this category like a pro buyer</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={colors.mutedForeground} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.filterLabel, { color: colors.foreground }]}>Supplier country</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {AFRICAN_COUNTRIES.slice(0, 8).map(c => (
                <TouchableOpacity
                  key={c.code}
                  onPress={() => setCountry(c.code)}
                  style={[styles.filterChip, { borderColor: country === c.code ? colors.brand : colors.border, backgroundColor: country === c.code ? colors.brandBg : colors.card }]}
                >
                  <Text style={styles.flag}>{c.flag}</Text>
                  <Text style={[styles.chipTxt, { color: country === c.code ? colors.brand : colors.foreground }]}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.filterLabel, { color: colors.foreground }]}>Maximum unit price (₦)</Text>
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="e.g. 100000"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              style={[styles.filterInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
            />

            <Text style={[styles.filterLabel, { color: colors.foreground }]}>Minimum supplier rating</Text>
            <View style={styles.ratingOptions}>
              {[0, 4, 4.5, 4.8].map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setRating(value)}
                  style={[styles.ratingOption, { borderColor: rating === value ? colors.brand : colors.border, backgroundColor: rating === value ? colors.brandBg : colors.card }]}
                >
                  <Ionicons name="star" size={13} color="#f59e0b" />
                  <Text style={[styles.chipTxt, { color: rating === value ? colors.brand : colors.foreground }]}>{value === 0 ? 'Any' : `${value}+`}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {[
              { label: 'Only items in stock', value: inStock, set: setInStock, icon: 'cube-outline' },
              { label: 'Escrow-protected suppliers', value: escrow, set: setEscrow, icon: 'shield-checkmark-outline' },
            ].map(option => (
              <TouchableOpacity key={option.label} style={[styles.toggleRow, { borderBottomColor: colors.border }]} onPress={() => option.set(!option.value)}>
                <View style={[styles.toggleIcon, { backgroundColor: colors.brandBg }]}><Ionicons name={option.icon as any} size={17} color={colors.brand} /></View>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>{option.label}</Text>
                <View style={[styles.checkbox, { borderColor: option.value ? colors.brand : colors.border, backgroundColor: option.value ? colors.brand : colors.card }]}>
                  {option.value && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.sheetActions}>
            <TouchableOpacity onPress={onReset} style={[styles.resetBtn, { borderColor: colors.border }]}><Text style={[styles.resetTxt, { color: colors.foreground }]}>Reset</Text></TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.applyBtn, { backgroundColor: colors.brand }]}><Text style={styles.applyTxt}>Show results</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function CategoryScreen() {
  const { id = 'all' } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { marketplaceProducts } = useApp();
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [escrow, setEscrow] = useState(false);
  const [sort, setSort] = useState<'relevance' | 'price' | 'rating'>('relevance');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const category = CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0];
  const [selectedCategoryId, setSelectedCategoryId] = useState(id === 'all' ? (CATEGORIES.find(item => item.id !== 'all')?.id ?? 'textiles') : id);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(id !== 'all');
  const browseCategoryId = id === 'all' ? selectedCategoryId : id;
  const taxonomy = useMemo(() => getCategoryTaxonomy(browseCategoryId), [browseCategoryId]);
  const browseCategory = CATEGORIES.find(item => item.id === browseCategoryId) ?? category;
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  const activeSubcategory: CategorySubcategory | undefined =
    taxonomy.subcategories.find(item => item.id === selectedSubcategoryId) ?? taxonomy.subcategories[0];
  const activeType: CategoryType | undefined =
    activeSubcategory?.types.find(item => item.id === selectedTypeId) ?? activeSubcategory?.types[0];
  const activeBrand: CategoryBrand | undefined =
    activeType?.brands.find(item => item.id === selectedBrandId);
  const activeModel = activeBrand?.models.find(item => item.id === selectedModelId);

  const selectSubcategory = (subcategory: CategorySubcategory) => {
    setSelectedSubcategoryId(subcategory.id);
    setSelectedTypeId('');
    setSelectedBrandId('');
    setSelectedModelId('');
  };
  const selectType = (type: CategoryType) => {
    setSelectedTypeId(type.id);
    setSelectedBrandId('');
    setSelectedModelId('');
  };
  const selectBrand = (brand: CategoryBrand) => {
    setSelectedBrandId(value => value === brand.id ? '' : brand.id);
    setSelectedModelId('');
  };

  const catalogProducts = [...marketplaceProducts, ...PRODUCTS.filter(product => !marketplaceProducts.some(item => item.id === product.id))];
  const filtered = useMemo(() => {
    const result = catalogProducts.filter(p => {
       const categoryMatch = id === 'all' && !hasSelectedCategory ? true : p.category === browseCategoryId;
      const textMatch = !query || `${p.name} ${p.supplier} ${p.description}`.toLowerCase().includes(query.toLowerCase());
      const countryMatch = country === 'all' || (PRODUCT_COUNTRY[p.id] ?? p.country ?? 'NG') === country;
      const priceMatch = !maxPrice || p.price <= Number(maxPrice);
      const ratingMatch = p.rating >= rating;
      const stockMatch = !inStock || p.stock > 0;
      const escrowMatch = !escrow || p.escrow;
      const hierarchyText = `${p.name} ${p.description} ${p.supplier}`.toLowerCase();
      // Seller catalog records will eventually carry taxonomy IDs. Demo
      // products still respond to brand/model terms when those are visible.
      const brandMatch = !activeBrand || hierarchyText.includes(activeBrand.name.toLowerCase()) || hierarchyText.includes('samsung') && activeBrand.name === 'Samsung';
      const modelMatch = !activeModel || hierarchyText.includes(activeModel.name.toLowerCase().replace(/\s+/g, ' ')) || hierarchyText.includes(activeModel.name.split(' ')[0].toLowerCase());
      return categoryMatch && textMatch && countryMatch && priceMatch && ratingMatch && stockMatch && escrowMatch && brandMatch && modelMatch;
    });
    return result.sort((a, b) => sort === 'price' ? a.price - b.price : sort === 'rating' ? b.rating - a.rating : Number(b.featured) - Number(a.featured));
  }, [catalogProducts, id, hasSelectedCategory, browseCategoryId, query, country, maxPrice, rating, inStock, escrow, sort, activeBrand, activeModel]);

  const reset = () => { setCountry('all'); setMaxPrice(''); setRating(0); setInStock(false); setEscrow(false); };

  const catalogHeader = (
    <>
      <View style={[styles.catalogExplorer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.explorerTitleRow}>
          <View>
            <Text style={[styles.explorerEyebrow, { color: colors.brand }]}>Browse by catalog</Text>
            <Text style={[styles.explorerTitle, { color: colors.foreground }]}>{id === 'all' ? 'Categories' : 'Subcategories'}</Text>
          </View>
          <View style={[styles.depthBadge, { backgroundColor: colors.brandBg }]}>
            <Ionicons name="git-branch-outline" size={12} color={colors.brand} />
            <Text style={[styles.depthBadgeText, { color: colors.brand }]}>Category → type → brand → model</Text>
          </View>
        </View>

        {id === 'all' && (
          <View style={styles.categoryDirectory}>
            {CATEGORIES.filter(item => item.id !== 'all').map(item => {
              const active = item.id === browseCategoryId;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setSelectedCategoryId(item.id);
                    setHasSelectedCategory(true);
                    setSelectedSubcategoryId('');
                    setSelectedTypeId('');
                    setSelectedBrandId('');
                    setSelectedModelId('');
                  }}
                  style={[styles.categoryDirectoryItem, { backgroundColor: active ? colors.brandBg : colors.background, borderColor: active ? colors.brand : colors.border }]}
                >
                  <View style={[styles.categoryDirectoryIcon, { backgroundColor: active ? colors.brand : colors.card }]}>
                    <Ionicons name={`${item.icon}-outline` as any} size={18} color={active ? '#ffffff' : colors.brand} />
                  </View>
                  <Text numberOfLines={2} style={[styles.categoryDirectoryName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.categoryDirectoryCount, { color: colors.mutedForeground }]}>{catLiveCount(item.id, catalogProducts)} goods</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {id === 'all' && (
          <Text style={[styles.catalogSubheading, { color: colors.foreground }]}>
            {browseCategory.name} subcategories
          </Text>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subcategoryRow}>
          {taxonomy.subcategories.map(subcategory => {
            const active = activeSubcategory?.id === subcategory.id;
            return (
              <TouchableOpacity
                key={subcategory.id}
                onPress={() => selectSubcategory(subcategory)}
                style={[styles.subcategoryCard, { backgroundColor: active ? colors.brandBg : colors.background, borderColor: active ? colors.brand : colors.border }]}
              >
                <View style={[styles.subcategoryIcon, { backgroundColor: active ? colors.brand : colors.card }]}>
                  <Ionicons name={subcategory.icon as any} size={18} color={active ? '#ffffff' : colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={[styles.subcategoryName, { color: colors.foreground }]}>{subcategory.name}</Text>
                  <Text style={[styles.subcategoryCount, { color: colors.mutedForeground }]}>{subcategory.count.toLocaleString()} listings</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={active ? colors.brand : colors.mutedForeground} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeSubcategory && (
          <View style={[styles.typePanel, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.typePanelHeader}>
              <View>
                <Text style={[styles.typePanelEyebrow, { color: colors.mutedForeground }]}>{browseCategory.name} / {activeSubcategory.name}</Text>
                <Text style={[styles.typePanelTitle, { color: colors.foreground }]}>Choose a type</Text>
              </View>
              <Text style={[styles.typePanelHint, { color: colors.brand }]}>{activeSubcategory.types.length} types</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
              {activeSubcategory.types.map(type => {
                const active = activeType?.id === type.id;
                return (
                  <TouchableOpacity key={type.id} onPress={() => selectType(type)} style={[styles.typeChip, { backgroundColor: active ? colors.brand : colors.card, borderColor: active ? colors.brand : colors.border }]}>
                    <Text style={[styles.typeChipName, { color: active ? '#ffffff' : colors.foreground }]}>{type.name}</Text>
                    <Text style={[styles.typeChipCount, { color: active ? 'rgba(255,255,255,0.72)' : colors.mutedForeground }]}>{type.count.toLocaleString()}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {activeType && (
        <View style={[styles.brandStrip, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.brandStripHeader}>
            <View>
              <Text style={[styles.brandEyebrow, { color: colors.brand }]}>Type: {activeType.name}</Text>
              <Text style={[styles.brandTitle, { color: colors.foreground }]}>Brands & models</Text>
            </View>
            {(activeBrand || activeModel) && (
              <TouchableOpacity onPress={() => { setSelectedBrandId(''); setSelectedModelId(''); }}>
                <Text style={[styles.clearSelection, { color: colors.brand }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
            {activeType.brands.map(brand => {
              const brandActive = activeBrand?.id === brand.id;
              return (
                <View key={brand.id} style={[styles.brandGroup, { borderColor: brandActive ? colors.brand : colors.border, backgroundColor: brandActive ? colors.brandBg : colors.background }]}>
                  <TouchableOpacity onPress={() => selectBrand(brand)} style={styles.brandButton}>
                    <View style={[styles.brandLogo, { backgroundColor: brandActive ? colors.brand : colors.card }]}>
                      <Text style={[styles.brandLogoText, { color: brandActive ? '#ffffff' : colors.brand }]}>{brand.name.slice(0, 1)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={[styles.brandName, { color: colors.foreground }]}>{brand.name}</Text>
                      <Text style={[styles.brandModelsCount, { color: colors.mutedForeground }]}>{brand.models.length} models</Text>
                    </View>
                    <Ionicons name={brandActive ? 'chevron-up' : 'chevron-down'} size={14} color={colors.mutedForeground} />
                  </TouchableOpacity>
                  {brandActive && (
                    <View style={[styles.modelList, { borderTopColor: colors.border }]}>
                      {brand.models.map(model => (
                        <TouchableOpacity key={model.id} onPress={() => setSelectedModelId(value => value === model.id ? '' : model.id)} style={[styles.modelChip, { backgroundColor: selectedModelId === model.id ? colors.brand : colors.card, borderColor: selectedModelId === model.id ? colors.brand : colors.border }]}>
                          <Text style={[styles.modelText, { color: selectedModelId === model.id ? '#ffffff' : colors.foreground }]}>{model.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
          {(activeBrand || activeModel) && (
            <View style={[styles.pathBar, { backgroundColor: colors.navyBg }]}>
              <Ionicons name="navigate-outline" size={14} color={colors.navy} />
              <Text numberOfLines={1} style={[styles.pathText, { color: colors.foreground }]}>
                {browseCategory.name} / {activeSubcategory?.name} / {activeType.name} / {activeBrand?.name ?? 'All brands'}{activeModel ? ` / ${activeModel.name}` : ''}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.sortRow}>
        <Text style={[styles.resultTxt, { color: colors.mutedForeground }]}>Showing the best matches</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptions}>
          {(['relevance', 'price', 'rating'] as const).map(option => (
            <TouchableOpacity key={option} onPress={() => setSort(option)} style={[styles.sortChip, { borderColor: sort === option ? colors.brand : colors.border, backgroundColor: sort === option ? colors.brandBg : colors.card }]}>
              <Text style={[styles.sortTxt, { color: sort === option ? colors.brand : colors.foreground }]}>{option === 'price' ? 'Lowest price' : option[0].toUpperCase() + option.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Ionicons name="arrow-back" size={22} color={colors.foreground} /></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>{category.name}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{filtered.length} wholesale listings · updated with marketplace signals</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/saved')} style={styles.headerIcon}><Ionicons name="bookmark-outline" size={21} color={colors.foreground} /></TouchableOpacity>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.card }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={17} color={colors.mutedForeground} />
          <TextInput value={query} onChangeText={setQuery} placeholder={`Search ${category.name.toLowerCase()}…`} placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} />
        </View>
        <TouchableOpacity onPress={() => setFiltersVisible(true)} style={[styles.filterBtn, { backgroundColor: colors.brand }]}>
          <Ionicons name="options-outline" size={17} color="#ffffff" />
          <Text style={styles.filterBtnTxt}>Filters</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={p => p.id}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={catalogHeader}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="search-outline" size={44} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No matching goods</Text><Text style={[styles.emptySub, { color: colors.mutedForeground }]}>Try widening your filters or send a supplier inquiry.</Text></View>}
        renderItem={({ item }: { item: Product }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={() => router.push(`/product/${item.id}`)} activeOpacity={0.88}>
            <View style={styles.imageWrap}><Image source={{ uri: item.image }} style={styles.image} contentFit="cover" /><View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[item.category] ?? colors.brand }]}><Ionicons name="cube-outline" size={11} color="#ffffff" /></View></View>
            <View style={styles.cardBody}><Text numberOfLines={2} style={[styles.productName, { color: colors.foreground }]}>{item.name}</Text><Text numberOfLines={1} style={[styles.supplier, { color: colors.mutedForeground }]}>{item.supplier}</Text><View style={styles.rating}><Ionicons name="star" size={11} color="#f59e0b" /><Text style={[styles.ratingTxt, { color: colors.foreground }]}>{item.rating}</Text><Text style={[styles.ratingTxt, { color: colors.mutedForeground }]}>({item.reviews})</Text></View><Text style={[styles.price, { color: colors.brand }]}>{fmt(item.price)}</Text><Text style={[styles.moq, { color: colors.mutedForeground }]}>MOQ {item.moq} {item.unit}</Text></View>
          </TouchableOpacity>
        )}
      />
      <FilterSheet visible={filtersVisible} onClose={() => setFiltersVisible(false)} country={country} setCountry={setCountry} maxPrice={maxPrice} setMaxPrice={setMaxPrice} rating={rating} setRating={setRating} inStock={inStock} setInStock={setInStock} escrow={escrow} setEscrow={setEscrow} onReset={reset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  backBtn: { width: 34, height: 34, justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  headerIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', gap: 8, padding: 12 },
  searchBar: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  filterBtn: { height: 44, borderRadius: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 5 },
  filterBtnTxt: { color: '#ffffff', fontSize: 12, fontFamily: 'Inter_700Bold' },
  catalogExplorer: { paddingTop: 13, paddingBottom: 11, borderBottomWidth: 1 },
  explorerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 9 },
  explorerEyebrow: { fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: 'Inter_700Bold' },
  explorerTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 2 },
  catalogSubheading: { fontSize: 12, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, marginBottom: 8 },
  depthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 6, borderRadius: 9, maxWidth: 155 },
  depthBadgeText: { fontSize: 8, lineHeight: 11, fontFamily: 'Inter_600SemiBold' },
  categoryDirectory: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  categoryDirectoryItem: { width: '30.5%', minHeight: 98, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 8 },
  categoryDirectoryIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryDirectoryName: { fontSize: 10, lineHeight: 13, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  categoryDirectoryCount: { fontSize: 8, marginTop: 3, fontFamily: 'Inter_400Regular' },
  subcategoryRow: { gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  subcategoryCard: { width: 192, minHeight: 62, borderRadius: 12, borderWidth: 1, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  subcategoryIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  subcategoryName: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  subcategoryCount: { fontSize: 9, marginTop: 3, fontFamily: 'Inter_400Regular' },
  typePanel: { marginHorizontal: 16, borderRadius: 13, borderWidth: 1, padding: 10 },
  typePanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  typePanelEyebrow: { fontSize: 9, fontFamily: 'Inter_400Regular' },
  typePanelTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginTop: 2 },
  typePanelHint: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  typeRow: { gap: 7 },
  typeChip: { minWidth: 105, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  typeChipName: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  typeChipCount: { fontSize: 9, marginTop: 3, fontFamily: 'Inter_400Regular' },
  brandStrip: { paddingTop: 11, paddingBottom: 10, borderBottomWidth: 1 },
  brandStripHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  brandEyebrow: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  brandTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginTop: 2 },
  clearSelection: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  brandRow: { gap: 8, paddingHorizontal: 16 },
  brandGroup: { width: 174, borderRadius: 11, borderWidth: 1, overflow: 'hidden' },
  brandButton: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 8 },
  brandLogo: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  brandLogoText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  brandName: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  brandModelsCount: { fontSize: 9, marginTop: 2, fontFamily: 'Inter_400Regular' },
  modelList: { borderTopWidth: 1, padding: 7, gap: 5 },
  modelChip: { borderRadius: 7, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 6 },
  modelText: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  pathBar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 16, marginTop: 10, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 9 },
  pathText: { flex: 1, fontSize: 10, fontFamily: 'Inter_500Medium' },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  resultTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  sortOptions: { gap: 6 },
  sortChip: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  sortTxt: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  gridRow: { gap: 12, marginBottom: 12 },
  card: { flex: 1, borderRadius: 14, overflow: 'hidden', elevation: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } as any,
  imageWrap: { height: 128, position: 'relative' },
  image: { width: '100%', height: '100%' },
  categoryDot: { position: 'absolute', top: 8, left: 8, width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 10 },
  productName: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_600SemiBold', minHeight: 34 },
  supplier: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  ratingTxt: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  price: { fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 5 },
  moq: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 30, gap: 9 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  emptySub: { textAlign: 'center', fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  sheetOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { maxHeight: '86%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18 },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', alignSelf: 'center', marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  sheetTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  sheetSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
  filterLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 16, marginBottom: 9 },
  chips: { gap: 7 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 17, borderWidth: 1 },
  flag: { fontSize: 14 },
  chipTxt: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  filterInput: { height: 44, borderRadius: 11, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  ratingOptions: { flexDirection: 'row', gap: 8 },
  ratingOption: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1 },
  toggleIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  toggleLabel: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  sheetActions: { flexDirection: 'row', gap: 10, paddingTop: 14 },
  resetBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  resetTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  applyBtn: { flex: 2, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  applyTxt: { fontSize: 14, color: '#ffffff', fontFamily: 'Inter_700Bold' },
});