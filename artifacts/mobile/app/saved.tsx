import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { fmt, type CartItem } from '@/constants/data';

export default function SavedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savedItems, moveSavedToCart, removeSavedItem } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Saved List</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {savedItems.length} item{savedItems.length === 1 ? '' : 's'} saved for later
          </Text>
        </View>
        <Ionicons name="bookmark" size={22} color={colors.brand} />
      </View>

      <FlatList
        data={savedItems}
        keyExtractor={item => `${item.productId}-${item.variant}`}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.brandBg }]}>
              <Ionicons name="bookmark-outline" size={38} color={colors.brand} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your saved list is ready</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Save goods from your cart or product pages so you can compare and come back when you are ready to buy.
            </Text>
            <TouchableOpacity style={[styles.browseBtn, { backgroundColor: colors.brand }]} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.browseTxt}>Browse marketplace</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }: { item: CartItem }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.cardMain} onPress={() => router.push(`/product/${item.productId}`)} activeOpacity={0.85}>
              <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.variant, { color: colors.mutedForeground }]}>{item.variant} · {item.supplier}</Text>
                <Text style={[styles.price, { color: colors.brand }]}>{fmt(item.price)} / {item.unit}</Text>
                <View style={styles.moqRow}>
                  <Ionicons name="cube-outline" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.moq, { color: colors.mutedForeground }]}>MOQ {item.moq} {item.unit}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
            </TouchableOpacity>
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.removeBtn, { borderColor: colors.border }]}
                onPress={() => Alert.alert('Remove saved item?', item.name, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeSavedItem(item.productId, item.variant) },
                ])}
              >
                <Ionicons name="trash-outline" size={15} color={colors.mutedForeground} />
                <Text style={[styles.removeTxt, { color: colors.mutedForeground }]}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cartBtn, { backgroundColor: colors.brand }]} onPress={() => moveSavedToCart(item)}>
                <Ionicons name="cart-outline" size={15} color="#ffffff" />
                <Text style={styles.cartTxt}>Move to cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn: { width: 34, height: 34, justifyContent: 'center' },
  title: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  card: { borderRadius: 15, borderWidth: 1, overflow: 'hidden' },
  cardMain: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12 },
  image: { width: 78, height: 78, borderRadius: 11 },
  name: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_600SemiBold' },
  variant: { fontSize: 10, marginTop: 3, fontFamily: 'Inter_400Regular' },
  price: { fontSize: 14, marginTop: 7, fontFamily: 'Inter_700Bold' },
  moqRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  moq: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  actions: { flexDirection: 'row', gap: 8, padding: 10, borderTopWidth: 1 },
  removeBtn: { flex: 1, height: 38, borderRadius: 10, borderWidth: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' },
  removeTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  cartBtn: { flex: 1.2, height: 38, borderRadius: 10, flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' },
  cartTxt: { color: '#ffffff', fontSize: 12, fontFamily: 'Inter_700Bold' },
  empty: { alignItems: 'center', paddingTop: 90, paddingHorizontal: 34, gap: 10 },
  emptyIcon: { width: 82, height: 82, borderRadius: 41, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  emptyText: { textAlign: 'center', fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  browseBtn: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  browseTxt: { color: '#ffffff', fontSize: 13, fontFamily: 'Inter_700Bold' },
});