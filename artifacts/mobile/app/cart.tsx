import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { calculateShippingFee, fmt, PRODUCT_LOGISTICS, type CartItem } from '@/constants/data';
import { ESCROW_FEE_RATE } from '@/constants/config';

export default function Cart() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, removeFromCart, updateCartQty, getProductStock, saveItem, user } = useApp();

  const suppliers = [...new Set(cart.map(i => i.supplierId))];
  const escrowFee = Math.round(cartTotal * ESCROW_FEE_RATE);
  const deliveryFee = cart.reduce((sum, item) => {
    const logistics = PRODUCT_LOGISTICS[item.productId] ?? { weightKg: 1, sizeClass: 'small' as const };
    return sum + calculateShippingFee(logistics.weightKg, logistics.sizeClass, user.location.includes('Nigeria') ? 120 : 900, item.qty);
  }, 0);
  const grandTotal = cartTotal + escrowFee + deliveryFee;

  const canCheckout = grandTotal <= user.balance;

  const handleRemove = (item: CartItem) => {
    const { productId, variant, name } = item;
    Alert.alert('Remove Item', `Remove "${name}" from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save for later', onPress: () => { saveItem(item); removeFromCart(productId, variant); } },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId, variant) },
    ]);
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.emptyContent}>
          <Ionicons name="cart-outline" size={72} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your cart is empty</Text>
          <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>Browse products and add items to get started</Text>
          <TouchableOpacity style={[styles.browseBtn, { backgroundColor: colors.brand }]} onPress={() => router.back()}>
            <Text style={styles.browseBtnTxt}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Cart ({cart.length})</Text>
        <TouchableOpacity onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
          { text: 'Cancel', style: 'cancel' },
        ])}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={item => item.productId + item.variant}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 220 + insets.bottom, gap: 12 }}
        renderItem={({ item }: { item: CartItem }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={styles.itemImg} contentFit="cover" />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[styles.itemVariant, { color: colors.mutedForeground }]}>{item.variant}</Text>
              <Text style={[styles.itemSupplier, { color: colors.mutedForeground }]}>{item.supplier}</Text>
              <View style={styles.itemDelivery}>
                <Ionicons name="cube-outline" size={12} color={colors.mutedForeground} />
                <Text style={[styles.itemDeliveryTxt, { color: colors.mutedForeground }]}>{item.delivery}</Text>
              </View>
              <View style={styles.itemBottom}>
                <Text style={[styles.itemPrice, { color: colors.brand }]}>{fmt(item.price * item.qty)}</Text>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                    onPress={() => {
                      const newQty = Math.max(item.moq, item.qty - Math.max(1, Math.ceil(item.moq / 5)));
                      updateCartQty(item.productId, item.variant, newQty);
                    }}
                  >
                    <Ionicons name="remove" size={14} color={colors.foreground} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyTxt, { color: colors.foreground }]}>{item.qty}</Text>
                  <TouchableOpacity
                    style={[styles.qtyBtn, { borderColor: colors.border, backgroundColor: item.qty >= getProductStock(item.productId) ? colors.muted : colors.brand }]}
                    onPress={() => {
                      const step = Math.max(1, Math.ceil(item.moq / 5));
                      const nextQty = Math.min(getProductStock(item.productId), item.qty + step);
                      if (nextQty === item.qty && item.qty >= getProductStock(item.productId)) {
                        Alert.alert('Maximum stock reached', `The seller only has ${getProductStock(item.productId).toLocaleString()} ${item.unit} available.`);
                        return;
                      }
                      updateCartQty(item.productId, item.variant, nextQty);
                    }}
                    disabled={getProductStock(item.productId) <= 0}
                  >
                    <Ionicons name="add" size={14} color={item.qty >= getProductStock(item.productId) ? colors.mutedForeground : "#ffffff"} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.stockHint, { color: colors.mutedForeground }]}>Available: {getProductStock(item.productId).toLocaleString()} {item.unit}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
              <Ionicons name="close" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Order Summary</Text>
            {[
              { label: `Subtotal (${cart.length} item${cart.length > 1 ? 's' : ''})`, val: fmt(cartTotal) },
              { label: `Escrow Fee (${(ESCROW_FEE_RATE * 100).toFixed(1)}%)`, val: fmt(escrowFee) },
              { label: `Delivery (${suppliers.length} supplier${suppliers.length > 1 ? 's' : ''})`, val: fmt(deliveryFee) },
            ].map(row => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                <Text style={[styles.summaryVal, { color: colors.foreground }]}>{row.val}</Text>
              </View>
            ))}
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
              <Text style={[styles.totalVal, { color: colors.brand }]}>{fmt(grandTotal)}</Text>
            </View>
            <View style={[styles.balanceRow, { backgroundColor: colors.background }]}>
              <Ionicons name="wallet-outline" size={14} color={canCheckout ? colors.brand : '#ef4444'} />
              <Text style={[styles.balanceTxt, { color: canCheckout ? colors.mutedForeground : '#ef4444' }]}>
                Wallet: {fmt(user.balance)} {!canCheckout ? '· Insufficient funds' : ''}
              </Text>
            </View>
          </View>
        }
      />

      {/* Checkout bar */}
      <View style={[styles.checkoutBar, { backgroundColor: colors.card, paddingBottom: insets.bottom + 20, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.checkoutTotal, { color: colors.brand }]}>{fmt(grandTotal)}</Text>
          <Text style={[styles.checkoutSub, { color: colors.mutedForeground }]}>Escrow protected</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: canCheckout ? colors.brand : colors.muted }]}
          onPress={() => canCheckout ? router.push('/checkout') : Alert.alert('Insufficient Balance', `Please top up your wallet. Need ${fmt(grandTotal - user.balance)} more.`)}
          activeOpacity={0.85}
        >
          <Ionicons name="shield-checkmark" size={16} color="#ffffff" />
          <Text style={styles.checkoutBtnTxt}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1 },
  backBtn: { padding: 16 },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  emptyTxt: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  browseBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  browseBtnTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#ffffff' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 18, fontFamily: 'Inter_700Bold' },

  cartItem: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 14, elevation: 1, boxShadow: '0px 1px 4px rgba(0,0,0,0.04)' } as any,
  itemImg: { width: 80, height: 80, borderRadius: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', lineHeight: 18, marginBottom: 3 },
  itemVariant: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  itemSupplier: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  itemDelivery: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  itemDeliveryTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemPrice: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  stockHint: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 5 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  qtyTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold', minWidth: 28, textAlign: 'center' },
  removeBtn: { padding: 4, marginLeft: 4 },

  summaryCard: { borderRadius: 14, padding: 16, gap: 10 },
  summaryTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  summaryVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  summaryDivider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  totalVal: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 10, marginTop: 4 },
  balanceTxt: { fontSize: 12, fontFamily: 'Inter_500Medium' },

  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  checkoutTotal: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  checkoutSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  checkoutBtnTxt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#ffffff' },
});
