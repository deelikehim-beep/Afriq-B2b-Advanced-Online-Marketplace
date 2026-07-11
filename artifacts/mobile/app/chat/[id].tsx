import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { type ChatMessage } from '@/constants/data';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, sendMessage, markMessagesRead } = useApp();
  const [text, setText] = useState('');
  const flatRef = useRef<FlatList>(null);

  const conv = conversations.find(c => c.id === id);

  React.useEffect(() => {
    if (id) markMessagesRead(id);
  }, [id]);

  if (!conv) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFoundTxt, { color: colors.mutedForeground }]}>Conversation not found</Text>
      </View>
    );
  }

  const reversed = [...conv.messages].reverse();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(conv.id, trimmed);
    setText('');
    flatRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: colors.brandBg }]}>
          <Text style={[styles.headerAvatarTxt, { color: colors.brand }]}>{conv.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerName, { color: colors.foreground }]}>{conv.with}</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: conv.online ? '#22c55e' : '#9ca3af' }]} />
            <Text style={[styles.onlineTxt, { color: colors.mutedForeground }]}>{conv.online ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="call-outline" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={reversed}
          keyExtractor={msg => msg.id}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 8, gap: 4 }}
          renderItem={({ item }: { item: ChatMessage }) => (
            <MessageBubble item={item} colors={colors} />
          )}
        />

        {/* Input bar */}
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Platform.OS === 'ios' ? 8 : insets.bottom + 8 }]}>
          <TouchableOpacity style={styles.inputAction}>
            <Ionicons name="attach-outline" size={22} color={colors.mutedForeground} />
          </TouchableOpacity>
          <View style={[styles.inputWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Type a message…"
              placeholderTextColor={colors.mutedForeground}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.brand : colors.muted }]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Ionicons name="send" size={16} color={text.trim() ? '#ffffff' : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function MessageBubble({ item, colors }: { item: ChatMessage; colors: any }) {
  const isMe = item.sender === 'me';
  const isOrder = item.type === 'order';

  return (
    <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
      {isOrder ? (
        <View style={[styles.orderMsg, { backgroundColor: colors.goldBg, borderColor: colors.goldLight, maxWidth: '85%' }]}>
          <View style={styles.orderMsgHeader}>
            <Ionicons name="cube-outline" size={14} color={colors.gold} />
            <Text style={[styles.orderMsgLabel, { color: colors.goldDark }]}>Order Update</Text>
          </View>
          <Text style={[styles.orderMsgTxt, { color: colors.foreground }]}>{item.text}</Text>
          <Text style={[styles.msgTime, { color: colors.mutedForeground }]}>{item.time}</Text>
        </View>
      ) : (
        <View style={[
          styles.bubble,
          isMe
            ? [styles.bubbleMe, { backgroundColor: colors.brand }]
            : [styles.bubbleThem, { backgroundColor: colors.card, borderColor: colors.border }],
        ]}>
          <Text style={[styles.bubbleTxt, { color: isMe ? '#ffffff' : colors.foreground }]}>{item.text}</Text>
          <Text style={[styles.msgTime, { color: isMe ? 'rgba(255,255,255,0.65)' : colors.mutedForeground, textAlign: 'right' }]}>{item.time}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1 },
  backBtn: { padding: 16 },
  notFoundTxt: { fontSize: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 40 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  headerAvatarTxt: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  headerName: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineTxt: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  headerBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  msgRow: { flexDirection: 'row', marginVertical: 2 },
  msgRowMe: { justifyContent: 'flex-end' },

  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, gap: 3 },
  bubbleMe: { borderBottomRightRadius: 4 },
  bubbleThem: { borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleTxt: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  msgTime: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 2 },

  orderMsg: { maxWidth: '85%', padding: 12, borderRadius: 14, borderWidth: 1, gap: 6 },
  orderMsgHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  orderMsgLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  orderMsgTxt: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1 },
  inputAction: { width: 38, height: 42, justifyContent: 'center', alignItems: 'center' },
  inputWrap: { flex: 1, borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8, maxHeight: 120 },
  input: { fontSize: 14, fontFamily: 'Inter_400Regular', maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
});
