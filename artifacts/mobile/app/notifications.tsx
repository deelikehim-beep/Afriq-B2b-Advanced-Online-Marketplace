import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { type Notif } from '@/constants/data';

export default function Notifications() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notifications, markNotifRead, markAllNotifsRead, unreadNotifs } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
          {unreadNotifs > 0 && <Text style={[styles.unreadCount, { color: colors.brand }]}>{unreadNotifs} new</Text>}
        </View>
        <TouchableOpacity onPress={markAllNotifsRead} disabled={unreadNotifs === 0}>
          <Text style={[styles.markAllTxt, { color: unreadNotifs > 0 ? colors.brand : colors.mutedForeground }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 + insets.bottom, gap: 10 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={52} color={colors.mutedForeground} />
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No notifications yet</Text>
          </View>
        }
        renderItem={({ item }: { item: Notif }) => (
          <TouchableOpacity
            style={[styles.notifCard, { backgroundColor: item.read ? colors.card : colors.background, borderColor: item.read ? colors.border : item.color + '30' }]}
            onPress={() => markNotifRead(item.id)}
            activeOpacity={0.8}
          >
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: item.color }]} />}
            <View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTop}>
                <Text style={[styles.notifTitle, { color: colors.foreground, fontFamily: item.read ? 'Inter_500Medium' : 'Inter_700Bold' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{item.time}</Text>
              </View>
              <Text style={[styles.notifDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{item.desc}</Text>
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
  title: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  unreadCount: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  markAllTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  notifCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, position: 'relative' },
  unreadDot: { position: 'absolute', top: 14, left: 6, width: 7, height: 7, borderRadius: 4 },
  iconWrap: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  notifContent: { flex: 1, gap: 5 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  notifTitle: { fontSize: 14, flex: 1, lineHeight: 19 },
  notifTime: { fontSize: 11, fontFamily: 'Inter_400Regular', flexShrink: 0 },
  notifDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
