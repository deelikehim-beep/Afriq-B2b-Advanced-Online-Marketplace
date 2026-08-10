import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { type Conversation } from '@/constants/data';

export default function Messages() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, unreadMessages } = useApp();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(c =>
    !search || c.with.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Messages</Text>
          {unreadMessages > 0 && (
            <Text style={[styles.unreadTxt, { color: colors.brand }]}>{unreadMessages} unread</Text>
          )}
        </View>
        <TouchableOpacity style={[styles.composeBtn, { backgroundColor: colors.brandBg }]}>
          <Ionicons name="create-outline" size={20} color={colors.brand} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.card }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search suppliers…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={52} color={colors.mutedForeground} />
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No conversations yet</Text>
          </View>
        }
        renderItem={({ item }: { item: Conversation }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/chat/${item.id}`)}
            activeOpacity={0.85}
          >
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: colors.brandBg }]}>
                <Text style={[styles.avatarTxt, { color: colors.brand }]}>{item.avatar}</Text>
              </View>
              {item.online && <View style={[styles.onlineDot, { borderColor: colors.card }]} />}
            </View>

            {/* Content */}
            <View style={styles.rowContent}>
              {item.productName && (
                <View style={[styles.productContext, { backgroundColor: colors.brandBg }]}>
                  {item.productImage && <Image source={{ uri: item.productImage }} style={styles.productThumb} />}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.productContextLabel, { color: colors.brand }]}>Inquiry about</Text>
                    <Text numberOfLines={1} style={[styles.productContextName, { color: colors.foreground }]}>{item.productName}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={13} color={colors.brand} />
                </View>
              )}
              <View style={styles.rowTop}>
                <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{item.with}</Text>
                <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.time}</Text>
              </View>
              <View style={styles.rowBottom}>
                <Text
                  style={[styles.preview, { color: item.unread > 0 ? colors.foreground : colors.mutedForeground, fontFamily: item.unread > 0 ? 'Inter_500Medium' : 'Inter_400Regular' }]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.brand }]}>
                    <Text style={styles.unreadBadgeTxt}>{item.unread}</Text>
                  </View>
                )}
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
  unreadTxt: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  composeBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  separator: { height: 1, marginLeft: 84 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2 },
  rowContent: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1, marginRight: 8 },
  time: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preview: { flex: 1, fontSize: 13, lineHeight: 18 },
  productContext: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 6, borderRadius: 9, marginBottom: 6 },
  productThumb: { width: 28, height: 28, borderRadius: 5 },
  productContextLabel: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  productContextName: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadBadgeTxt: { fontSize: 11, color: '#ffffff', fontFamily: 'Inter_700Bold' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
