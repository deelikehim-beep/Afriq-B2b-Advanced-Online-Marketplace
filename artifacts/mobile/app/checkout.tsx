import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { fmt } from '@/constants/data';
import { ESCROW_FEE_RATE, DELIVERY_FEE_PER_SUPPLIER } from '@/constants/config';

export default function Checkout() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, user, placeOrder } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const suppliers = [...new Set(cart.map(i => i.supplierId))];
  const escrowFee = Math.round(cartTotal * ESCROW_FEE_RATE);
  const deliveryFee = suppliers.length * DELIVERY_FEE_PER_SUPPLIER;
  const grandTotal = cartTotal + escrowFee + deliveryFee;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate processing
    const id = placeOrder();
    setOrderId(id);
    setLoading(false);
    setSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (success) {
    return (
      <View style={[styles.successScreen, { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 }]}>
        <View style={[styles.successCircle, { backgroundColor: colors.brandBg }]}>
          <Ionicons name="checkmark-circle" size={72} color={colors.brand} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Order Placed!</Text>
        <Text style={[styles.successId, { color: colors.mutedForeground }]}>{orderId}</Text>
        <Text style={[styles.successMsg, { color: colors.mutedForeground }]}>
          Your payment of {fmt(grandTotal)} has been locked in escrow. It will be released to the supplier upon delivery confirmation.
        </Text>
        <View style={[styles.successEscrow, { backgroundColor: colors.brandBg }]}>
          <Ionicons name="shield-checkmark" size={20} color={colors.brand} />
          <Text style={[styles.successEscrowTxt, { color: colors.brand }]}>Protected by AFRIQ Escrow</Text>
        </View>
        <TouchableOpacity
          style={[styles.viewOrdersBtn, { backgroundColor: colors.brand }]}
          onPress={() => router.replace('/(tabs)/orders')}
          activeOpacity={0.85}
        >
          <Text style={styles.viewOrdersBtnTxt}>View My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueShopping} onPress={() => router.replace('/(tabs)')}>
          <Text style={[styles.continueShoppingTxt, { color: colors.mutedForeground }]}>Continue Shopping</Text>
        </TouchableOpacity>
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
        <Text style={[styles.title, { color: colors.foreground }]}>Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 160 + insets.bottom, gap: 14 }}>
        {/* Items */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order Items ({cart.length})</Text>
          {cart.map(item => (
            <View key={item.productId + item.variant} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImg} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.variant} · {item.qty} {item.unit}</Text>
                <Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.supplier}</Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.brand }]}>{fmt(item.price * item.qty)}</Text>
            </View>
          ))}
        </View>

        {/* Delivery */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Delivery Address</Text>
          <View style={styles.deliveryRow}>
            <View style={[styles.deliveryIcon, { backgroundColor: colors.navyBg }]}>
              <Ionicons name="location" size={20} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.deliveryName, { color: colors.foreground }]}>{user.name}</Text>
              <Text style={[styles.deliveryAddr, { color: colors.mutedForeground }]}>{user.location}</Text>
              <Text style={[styles.deliveryPhone, { color: colors.mutedForeground }]}>{user.phone}</Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.changeTxt, { color: colors.brand }]}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Escrow info */}
        <View style={[styles.escrowInfo, { backgroundColor: colors.brandBg, borderColor: colors.brandLight }]}>
          <View style={styles.escrowHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.brand} />
            <Text style={[styles.escrowTitle, { color: colors.brand }]}>AFRIQ Escrow Protection</Text>
          </View>
          <Text style={[styles.escrowDesc, { color: colors.brandDark }]}>
            Your payment is held securely in escrow. It's only released to the supplier after you confirm delivery. If there's a problem, our dispute team resolves it.
          </Text>
          <View style={styles.escrowSteps}>
            {['You pay into Escrow', 'Supplier ships order', 'You confirm delivery', 'Payment released'].map((step, i) => (
              <View key={i} style={styles.escrowStep}>
                <View style={[styles.escrowStepNum, { backgroundColor: colors.brand }]}>
                  <Text style={styles.escrowStepNumTxt}>{i + 1}</Text>
                </View>
                <Text style={[styles.escrowStepTxt, { color: colors.brandDark }]}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment breakdown */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Payment Summary</Text>
          {[
            { label: 'Subtotal', val: fmt(cartTotal) },
            { label: `Escrow Fee (${(ESCROW_FEE_RATE * 100).toFixed(1)}%)`, val: fmt(escrowFee), sub: 'One-time protection fee' },
            { label: `Delivery (${suppliers.length} supplier${suppliers.length > 1 ? 's' : ''})`, val: fmt(deliveryFee) },
          ].map(row => (
            <View key={row.label} style={styles.payRow}>
              <View>
                <Text style={[styles.payLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                {row.sub && <Text style={[styles.paySubLabel, { color: colors.mutedForeground }]}>{row.sub}</Text>}
              </View>
              <Text style={[styles.payVal, { color: colors.foreground }]}>{row.val}</Text>
            </View>
          ))}
          <View style={[styles.payDivider, { backgroundColor: colors.border }]} />
          <View style={styles.payRow}>
            <Text style={[styles.payTotal, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.payTotalVal, { color: colors.brand }]}>{fmt(grandTotal)}</Text>
          </View>

          {/* Wallet */}
          <View style={[styles.walletRow, { backgroundColor: colors.background }]}>
            <Ionicons name="wallet-outline" size={16} color={colors.brand} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.walletLabel, { color: colors.foreground }]}>AFRIQ Wallet</Text>
              <Text style={[styles.walletBal, { color: colors.mutedForeground }]}>Balance: {fmt(user.balance)}</Text>
            </View>
            <View style={[styles.walletSufficient, { backgroundColor: colors.brandBg }]}>
              <Ionicons name="checkmark-circle" size={14} color={colors.brand} />
              <Text style={[styles.walletSufficientTxt, { color: colors.brand }]}>Sufficient</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm bar */}
      <View style={[styles.confirmBar, { backgroundColor: colors.card, paddingBottom: insets.bottom + 20, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.confirmTotal, { color: colors.brand }]}>{fmt(grandTotal)}</Text>
          <Text style={[styles.confirmSub, { color: colors.mutedForeground }]}>from wallet · escrow protected</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: loading ? colors.muted : colors.brand }]}
          onPress={handleConfirm}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color="#ffffff" />
              <Text style={styles.confirmBtnTxt}>Confirm & Pay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 18, fontFamily: 'Inter_700Bold' },

  section: { borderRadius: 14, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  itemRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  itemImg: { width: 56, height: 56, borderRadius: 10 },
  itemName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', lineHeight: 18, marginBottom: 3 },
  itemMeta: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 1 },
  itemPrice: { fontSize: 14, fontFamily: 'Inter_700Bold' },

  deliveryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  deliveryIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  deliveryName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 3 },
  deliveryAddr: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  deliveryPhone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  changeTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  escrowInfo: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 12 },
  escrowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  escrowTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  escrowDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  escrowSteps: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  escrowStep: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '47%' },
  escrowStepNum: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  escrowStepNumTxt: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#ffffff' },
  escrowStepTxt: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },

  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  payLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  paySubLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  payVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  payDivider: { height: 1, marginVertical: 4 },
  payTotal: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  payTotalVal: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  walletRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, marginTop: 4 },
  walletLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  walletBal: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  walletSufficient: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  walletSufficientTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  confirmBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  confirmTotal: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  confirmSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, minWidth: 160, justifyContent: 'center' },
  confirmBtnTxt: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#ffffff' },

  successScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 32 },
  successCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  successTitle: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  successId: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  successMsg: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
  successEscrow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  successEscrowTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  viewOrdersBtn: { width: '100%', height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  viewOrdersBtnTxt: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#ffffff' },
  continueShopping: { paddingVertical: 12 },
  continueShoppingTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
