import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { fmt } from '@/constants/data';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', processing: '#0284c7', shipped: '#8b5cf6',
  in_transit: '#f59e0b', delivered: '#059669', completed: '#059669', disputed: '#ef4444',
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
  in_transit: 'In Transit', delivered: 'Awaiting Confirmation', completed: 'Completed', disputed: 'Under Dispute',
};

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, confirmDelivery } = useApp();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.notFoundContent}>
          <Text style={[styles.notFoundTxt, { color: colors.mutedForeground }]}>Order not found</Text>
        </View>
      </View>
    );
  }

  const handleConfirmDelivery = () => {
    Alert.alert(
      'Confirm Delivery',
      'By confirming, you acknowledge receipt of the goods and authorize payment release to the supplier. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Delivery',
          onPress: () => {
            confirmDelivery(order.id);
            Alert.alert('Confirmed', 'Payment has been released to the supplier. Thank you for using AFRIQ!');
          },
        },
      ]
    );
  };

  const handleDispute = () => {
    Alert.alert(
      'Open Dispute',
      'Describe the issue with this order and our team will investigate within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Dispute', style: 'destructive', onPress: () => Alert.alert('Dispute Filed', 'Our team will contact you within 24 hours.') },
      ]
    );
  };

  const statusColor = STATUS_COLORS[order.status];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Order Details</Text>
          <Text style={[styles.orderId, { color: colors.mutedForeground }]}>{order.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
          <Text style={[styles.statusTxt, { color: statusColor }]}>{STATUS_LABELS[order.status]}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 140 + insets.bottom, gap: 14 }}>
        {/* Progress tracker */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order Progress</Text>
          <View style={styles.stepsWrap}>
            {order.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[
                    styles.stepCircle,
                    step.done && { backgroundColor: colors.brand, borderColor: colors.brand },
                    step.current && !step.done && { borderColor: colors.brand },
                    !step.done && !step.current && { borderColor: colors.border },
                  ]}>
                    {step.done ? (
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    ) : step.current ? (
                      <View style={[styles.stepCurrentDot, { backgroundColor: colors.brand }]} />
                    ) : null}
                  </View>
                  {i < order.steps.length - 1 && (
                    <View style={[styles.stepLine, { backgroundColor: step.done ? colors.brand : colors.border }]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepName, { color: step.done || step.current ? colors.foreground : colors.mutedForeground, fontFamily: step.current ? 'Inter_700Bold' : 'Inter_600SemiBold' }]}>
                    {step.name}
                  </Text>
                  {step.current && (
                    <View style={[styles.currentChip, { backgroundColor: statusColor + '18' }]}>
                      <View style={[styles.currentDot, { backgroundColor: statusColor }]} />
                      <Text style={[styles.currentChipTxt, { color: statusColor }]}>Current Stage</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tracking */}
        <View style={[styles.trackCard, { backgroundColor: colors.navyBg, borderColor: colors.navyLight }]}>
          <View style={styles.trackRow}>
            <Ionicons name="cube-outline" size={20} color={colors.navy} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.trackLabel, { color: colors.navy }]}>Tracking ID</Text>
              <Text style={[styles.trackId, { color: colors.navyDark }]}>{order.trackingId}</Text>
            </View>
            <TouchableOpacity style={[styles.copyBtn, { backgroundColor: colors.navy }]}>
              <Ionicons name="copy-outline" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.trackDates}>
            <View>
              <Text style={[styles.trackDateLabel, { color: colors.mutedForeground }]}>Ordered</Text>
              <Text style={[styles.trackDateVal, { color: colors.foreground }]}>{order.createdAt}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.mutedForeground} />
            <View>
              <Text style={[styles.trackDateLabel, { color: colors.mutedForeground }]}>Est. Delivery</Text>
              <Text style={[styles.trackDateVal, { color: colors.foreground }]}>{order.deliveryDate}</Text>
            </View>
          </View>
        </View>

        {/* Product */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Product Details</Text>
          <View style={styles.productRow}>
            <Image source={{ uri: order.image }} style={styles.productImg} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>{order.productName}</Text>
              <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>{order.supplier}</Text>
              <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>Variant: {order.variant}</Text>
              <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>Qty: {order.quantity} units</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Payment Breakdown</Text>
          {[
            { label: `Subtotal (${order.quantity} units)`, val: fmt(order.totalAmount) },
            { label: 'Escrow Fee (2.5%)', val: fmt(order.escrowFee) },
            { label: 'Delivery', val: fmt(order.deliveryFee) },
          ].map(row => (
            <View key={row.label} style={styles.payRow}>
              <Text style={[styles.payLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
              <Text style={[styles.payVal, { color: colors.foreground }]}>{row.val}</Text>
            </View>
          ))}
          <View style={[styles.payDivider, { backgroundColor: colors.border }]} />
          <View style={styles.payRow}>
            <Text style={[styles.payTotal, { color: colors.foreground }]}>Total Paid</Text>
            <Text style={[styles.payTotalVal, { color: colors.brand }]}>{fmt(order.grandTotal)}</Text>
          </View>
          <View style={[styles.escrowStatus, { backgroundColor: colors.goldBg }]}>
            <Ionicons name="lock-closed" size={14} color={colors.gold} />
            <Text style={[styles.escrowStatusTxt, { color: colors.goldDark }]}>
              {order.status === 'completed' ? 'Escrow released to supplier' : `₦${order.totalAmount.toLocaleString('en-NG')} held in escrow`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action bar */}
      {['delivered', 'processing', 'shipped', 'in_transit'].includes(order.status) && (
        <View style={[styles.actionBar, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.disputeBtn, { borderColor: '#ef4444' }]} onPress={handleDispute} activeOpacity={0.8}>
            <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
            <Text style={styles.disputeBtnTxt}>Dispute</Text>
          </TouchableOpacity>
          {order.status === 'delivered' && (
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.brand }]} onPress={handleConfirmDelivery} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              <Text style={styles.confirmBtnTxt}>Confirm Delivery</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.chatBtn, { backgroundColor: colors.navyBg }]}
            onPress={() => router.push(`/chat/conv_002` as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-outline" size={16} color={colors.navy} />
            <Text style={[styles.chatBtnTxt, { color: colors.navy }]}>Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1 },
  backBtn: { padding: 16 },
  notFoundContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundTxt: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  orderId: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  section: { borderRadius: 14, padding: 16, gap: 10 },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 4 },

  stepsWrap: { gap: 0 },
  stepRow: { flexDirection: 'row', gap: 16 },
  stepLeft: { alignItems: 'center', width: 32 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', zIndex: 1 },
  stepCurrentDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 2, flex: 1, minHeight: 24, marginTop: 0 },
  stepContent: { flex: 1, paddingTop: 6, paddingBottom: 20 },
  stepName: { fontSize: 14, lineHeight: 20 },
  currentChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 },
  currentDot: { width: 6, height: 6, borderRadius: 3 },
  currentChipTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  trackCard: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 14 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trackLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 3 },
  trackId: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  copyBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  trackDates: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trackDateLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 3 },
  trackDateVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  productRow: { flexDirection: 'row', gap: 12 },
  productImg: { width: 72, height: 72, borderRadius: 10 },
  productName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', lineHeight: 19, marginBottom: 6 },
  productMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

  payRow: { flexDirection: 'row', justifyContent: 'space-between' },
  payLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  payVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  payDivider: { height: 1, marginVertical: 6 },
  payTotal: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  payTotalVal: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  escrowStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, marginTop: 4 },
  escrowStatusTxt: { fontSize: 13, fontFamily: 'Inter_500Medium' },

  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 14, borderTopWidth: 1 },
  disputeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  disputeBtnTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#ef4444' },
  confirmBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12 },
  confirmBtnTxt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#ffffff' },
  chatBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 },
  chatBtnTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
