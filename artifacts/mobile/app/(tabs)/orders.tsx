import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { fmt, type Order } from '@/constants/data';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#0284c7',
  shipped: '#8b5cf6',
  in_transit: '#f59e0b',
  delivered: '#059669',
  completed: '#059669',
  disputed: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  completed: 'Completed',
  disputed: 'Disputed',
};

const FILTERS = ['All', 'Active', 'Completed', 'Disputed'] as const;
type Filter = typeof FILTERS[number];

export default function Orders() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useApp();
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = orders.filter(o => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !['completed', 'disputed'].includes(o.status);
    if (filter === 'Completed') return o.status === 'completed';
    if (filter === 'Disputed') return o.status === 'disputed';
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Orders</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.countBadge, { backgroundColor: colors.brandBg, color: colors.brand }]}>
            {orders.length} total
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={[styles.filterRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && { borderBottomColor: colors.brand, borderBottomWidth: 2 }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTxt, { color: filter === f ? colors.brand : colors.mutedForeground }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom, gap: 12 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={56} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No orders yet</Text>
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>Your orders will appear here</Text>
          </View>
        }
        renderItem={({ item }: { item: Order }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/order/${item.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.cardTop}>
              <Image source={{ uri: item.image }} style={styles.productImg} contentFit="cover" />
              <View style={styles.cardInfo}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
                  <Text style={[styles.statusTxt, { color: STATUS_COLORS[item.status] }]}>
                    {STATUS_LABELS[item.status]}
                  </Text>
                  <Text style={[styles.orderId, { color: colors.mutedForeground }]}>{item.id}</Text>
                </View>
                <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>{item.productName}</Text>
                <Text style={[styles.supplierTxt, { color: colors.mutedForeground }]}>{item.supplier}</Text>
                <Text style={[styles.dateTxt, { color: colors.mutedForeground }]}>Ordered: {item.createdAt}</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={[styles.progressBg, { backgroundColor: colors.background }]}>
              <View style={[styles.progressFill, { backgroundColor: STATUS_COLORS[item.status], width: `${item.progress}%` as any }]} />
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.qtyPriceRow}>
                <Text style={[styles.qtyTxt, { color: colors.mutedForeground }]}>Qty: {item.quantity} · {item.variant}</Text>
                <Text style={[styles.totalTxt, { color: colors.brand }]}>{fmt(item.grandTotal)}</Text>
              </View>
              <View style={styles.arrowRow}>
                <Text style={[styles.trackTxt, { color: colors.navy }]}>Track order</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.navy} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countBadge: { fontSize: 12, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  filterRow: { flexDirection: 'row', borderBottomWidth: 1 },
  filterBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  card: { borderRadius: 14, padding: 14, elevation: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' } as any,
  cardTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  productImg: { width: 72, height: 72, borderRadius: 10 },
  cardInfo: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  orderId: { fontSize: 11, fontFamily: 'Inter_400Regular', marginLeft: 'auto' },
  productName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', lineHeight: 18, marginBottom: 3 },
  supplierTxt: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  dateTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },

  progressBg: { height: 5, borderRadius: 3, marginBottom: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },

  cardBottom: { gap: 4 },
  qtyPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  totalTxt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  arrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2 },
  trackTxt: { fontSize: 12, fontFamily: 'Inter_500Medium' },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  emptyTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
