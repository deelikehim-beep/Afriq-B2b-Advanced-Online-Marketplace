import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/contexts/AppContext';
import { fmt, fmtShort, type Transaction } from '@/constants/data';

type ActiveModal = null | 'deposit' | 'withdraw' | 'send' | 'escrow';

const DEPOSIT_METHODS = [
  { id: 'bank', label: 'Bank Transfer', icon: 'business', desc: 'GTBank, Access, etc.' },
  { id: 'mobile', label: 'Mobile Money', icon: 'phone-portrait', desc: 'OPay, Kuda, Palmpay' },
  { id: 'agent', label: 'Cash Agent', icon: 'people', desc: 'AFRIQ agents near you' },
  { id: 'crypto', label: 'Crypto', icon: 'logo-bitcoin', desc: 'USDT, BTC, ETH' },
];

const TX_ICONS: Record<string, { icon: string; color: string }> = {
  deposit: { icon: 'arrow-down-circle', color: '#059669' },
  withdrawal: { icon: 'arrow-up-circle', color: '#ef4444' },
  escrow_lock: { icon: 'lock-closed', color: '#f59e0b' },
  release: { icon: 'lock-open', color: '#0284c7' },
  fee: { icon: 'remove-circle', color: '#6b7280' },
};

export default function Wallet() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, transactions, orders, deposit, withdraw, transfer } = useApp();
  const [modal, setModal] = useState<ActiveModal>(null);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [recipient, setRecipient] = useState('');
  const [showBalance, setShowBalance] = useState(true);

  const activeEscrows = orders.filter(o => ['processing', 'shipped', 'in_transit', 'delivered'].includes(o.status));

  const confirmAction = () => {
    const val = parseInt(amount.replace(/,/g, ''), 10);
    if (!val || val < 100) { Alert.alert('Invalid amount', 'Enter a valid amount.'); return; }
    if (modal === 'deposit') {
      deposit(val, DEPOSIT_METHODS.find(m => m.id === selectedMethod)?.label || 'Bank Transfer');
      Alert.alert('Deposit Successful', `₦${val.toLocaleString('en-NG')} added to your wallet.`);
    } else if (modal === 'withdraw') {
      if (val > user.balance) { Alert.alert('Insufficient balance'); return; }
      withdraw(val);
      Alert.alert('Withdrawal Initiated', `₦${val.toLocaleString('en-NG')} will reach your bank in 5 minutes.`);
    } else if (modal === 'send') {
      if (val > user.balance) { Alert.alert('Insufficient balance'); return; }
      if (!recipient.trim()) { Alert.alert('Enter recipient phone or AFRIQ ID'); return; }
      transfer(val, recipient);
      Alert.alert('Transfer Sent', `₦${val.toLocaleString('en-NG')} sent to ${recipient}`);
    }
    setModal(null);
    setAmount('');
    setRecipient('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Wallet</Text>
        <TouchableOpacity style={[styles.historyBtn, { backgroundColor: colors.brandBg }]}>
          <Ionicons name="time-outline" size={18} color={colors.brand} />
          <Text style={[styles.historyTxt, { color: colors.brand }]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        {/* Balance card */}
        <LinearGradient colors={[colors.brandDeep, colors.brand]} style={styles.balanceCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.balanceCircle1} />
          <View style={styles.balanceCircle2} />
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity onPress={() => setShowBalance(s => !s)} style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>
                  {showBalance ? fmt(user.balance) : '₦ ••••••'}
                </Text>
                <Ionicons name={showBalance ? 'eye' : 'eye-off'} size={18} color="rgba(255,255,255,0.65)" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={[styles.verifiedBadge]}>
              <Ionicons name="shield-checkmark" size={14} color="#f59e0b" />
              <Text style={styles.verifiedTxt}>Secured</Text>
            </View>
          </View>
          <View style={styles.subBalances}>
            <View style={styles.subBalance}>
              <Text style={styles.subLabel}>Available</Text>
              <Text style={styles.subVal}>{showBalance ? fmtShort(user.balance) : '•••'}</Text>
            </View>
            <View style={styles.subDivider} />
            <View style={styles.subBalance}>
              <Text style={styles.subLabel}>In Escrow</Text>
              <Text style={styles.subVal}>{showBalance ? fmtShort(user.escrowLocked) : '•••'}</Text>
            </View>
            <View style={styles.subDivider} />
            <View style={styles.subBalance}>
              <Text style={styles.subLabel}>Total</Text>
              <Text style={styles.subVal}>{showBalance ? fmtShort(user.balance + user.escrowLocked) : '•••'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
          {[
            { id: 'deposit' as ActiveModal, label: 'Deposit', icon: 'arrow-down-circle', color: colors.brand, bg: colors.brandBg },
            { id: 'withdraw' as ActiveModal, label: 'Withdraw', icon: 'arrow-up-circle', color: '#ef4444', bg: '#fef2f2' },
            { id: 'send' as ActiveModal, label: 'Send', icon: 'send', color: colors.navy, bg: colors.navyBg },
            { id: 'escrow' as ActiveModal, label: 'Escrow', icon: 'shield', color: '#f59e0b', bg: colors.goldBg },
          ].map(a => (
            <TouchableOpacity key={a.id} style={styles.actionItem} onPress={() => setModal(a.id)} activeOpacity={0.75}>
              <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon as any} size={24} color={a.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Escrows */}
        {activeEscrows.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Escrows ({activeEscrows.length})</Text>
            {activeEscrows.map(o => (
              <View key={o.id} style={[styles.escrowCard, { backgroundColor: colors.card, borderColor: '#fef3c7' }]}>
                <View style={[styles.escrowIcon, { backgroundColor: colors.goldBg }]}>
                  <Ionicons name="lock-closed" size={18} color={colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.escrowName, { color: colors.foreground }]} numberOfLines={1}>{o.productName}</Text>
                  <Text style={[styles.escrowSub, { color: colors.mutedForeground }]}>{o.supplier} · {o.id}</Text>
                </View>
                <Text style={[styles.escrowAmt, { color: colors.gold }]}>{fmt(o.totalAmount)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Transactions</Text>
          {transactions.slice(0, 12).map(tx => {
            const meta = TX_ICONS[tx.type] || { icon: 'swap-horizontal', color: colors.brand };
            return (
              <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card }]}>
                <View style={[styles.txIcon, { backgroundColor: meta.color + '18' }]}>
                  <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txDesc, { color: colors.foreground }]} numberOfLines={1}>{tx.desc}</Text>
                  <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{tx.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.txAmt, { color: ['deposit', 'release'].includes(tx.type) ? colors.brand : '#ef4444' }]}>
                    {['deposit', 'release'].includes(tx.type) ? '+' : '-'}{fmt(tx.amount)}
                  </Text>
                  <Text style={[styles.txStatus, { color: tx.status === 'pending' ? colors.gold : colors.mutedForeground }]}>
                    {tx.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={modal !== null && modal !== 'escrow'} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModal(null)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.modalPill} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {modal === 'deposit' ? 'Add Money' : modal === 'withdraw' ? 'Withdraw' : 'Send Money'}
            </Text>
            <Text style={[styles.modalBal, { color: colors.mutedForeground }]}>Available: {fmt(user.balance)}</Text>

            {modal === 'deposit' && (
              <View style={styles.methodGrid}>
                {DEPOSIT_METHODS.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.methodItem, { borderColor: selectedMethod === m.id ? colors.brand : colors.border, backgroundColor: selectedMethod === m.id ? colors.brandBg : colors.background }]}
                    onPress={() => setSelectedMethod(m.id)}
                  >
                    <Ionicons name={m.icon as any} size={22} color={selectedMethod === m.id ? colors.brand : colors.mutedForeground} />
                    <Text style={[styles.methodLabel, { color: selectedMethod === m.id ? colors.brand : colors.foreground }]}>{m.label}</Text>
                    <Text style={[styles.methodDesc, { color: colors.mutedForeground }]}>{m.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {modal === 'send' && (
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Phone number or AFRIQ ID"
                  placeholderTextColor={colors.mutedForeground}
                  value={recipient}
                  onChangeText={setRecipient}
                />
              </View>
            )}

            <View style={[styles.amountWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Text style={[styles.naira, { color: colors.brand }]}>₦</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.foreground }]}
                placeholder="0.00"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.quickAmounts}>
              {['5,000', '20,000', '50,000', '100,000'].map(v => (
                <TouchableOpacity key={v} style={[styles.quickAmt, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => setAmount(v)}>
                  <Text style={[styles.quickAmtTxt, { color: colors.foreground }]}>₦{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.brand }]} onPress={confirmAction} activeOpacity={0.85}>
              <Text style={styles.confirmBtnTxt}>
                {modal === 'deposit' ? 'Add Money' : modal === 'withdraw' ? 'Withdraw Now' : 'Send Money'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={modal === 'escrow'} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <View style={styles.escrowModalOverlay}>
          <View style={[styles.escrowModal, { backgroundColor: colors.card, paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.modalPill} />
            <View style={styles.escrowModalTitleRow}>
              <View style={[styles.escrowModalIcon, { backgroundColor: colors.goldBg }]}>
                <Ionicons name="shield-checkmark" size={24} color={colors.goldDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>AFRIQ Escrow</Text>
                <Text style={[styles.modalBal, { color: colors.mutedForeground }]}>Your cross-border trade protection layer</Text>
              </View>
              <TouchableOpacity onPress={() => setModal(null)}><Ionicons name="close" size={21} color={colors.mutedForeground} /></TouchableOpacity>
            </View>
            <View style={[styles.escrowHighlight, { backgroundColor: colors.brandBg }]}>
              <Text style={[styles.escrowHighlightLabel, { color: colors.mutedForeground }]}>Currently held in escrow</Text>
              <Text style={[styles.escrowHighlightValue, { color: colors.brand }]}>{fmt(user.escrowLocked)}</Text>
              <Text style={[styles.escrowHighlightSub, { color: colors.mutedForeground }]}>Released only after delivery confirmation</Text>
            </View>
            {[
              ['lock-closed', 'Pay safely', 'Funds stay protected while your supplier prepares the order.'],
              ['navigate-outline', 'Track the trade', 'Follow shipping, customs and delivery milestones in one place.'],
              ['checkmark-circle-outline', 'Release or dispute', 'Confirm delivery to release funds, or open a demo dispute.'],
            ].map(([icon, title, desc]) => (
              <View key={title} style={styles.escrowStepRow}>
                <View style={[styles.escrowStepIcon, { backgroundColor: colors.background }]}><Ionicons name={icon as any} size={17} color={colors.brand} /></View>
                <View style={{ flex: 1 }}><Text style={[styles.escrowStepTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.escrowStepDesc, { color: colors.mutedForeground }]}>{desc}</Text></View>
              </View>
            ))}
            <View style={[styles.bvnNotice, { backgroundColor: colors.goldBg }]}>
              <Ionicons name="time-outline" size={18} color={colors.goldDark} />
              <Text style={[styles.bvnNoticeText, { color: colors.goldDeep }]}>Demo policy: wallets with no activity for 5 months may require a fresh BVN/KYC check before transfers are re-enabled.</Text>
            </View>
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.brand }]} onPress={() => setModal(null)}>
              <Text style={styles.confirmBtnTxt}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  historyTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  balanceCard: { margin: 16, borderRadius: 20, padding: 24, overflow: 'hidden', position: 'relative' },
  balanceCircle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -60 },
  balanceCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -40, left: 40 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular', marginBottom: 6 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter_700Bold' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  verifiedTxt: { fontSize: 12, color: '#f59e0b', fontFamily: 'Inter_600SemiBold' },
  subBalances: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 14 },
  subBalance: { flex: 1, alignItems: 'center' },
  subLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular', marginBottom: 4 },
  subVal: { fontSize: 14, color: '#ffffff', fontFamily: 'Inter_700Bold' },
  subDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 8 },

  actionsCard: { marginHorizontal: 16, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-around', elevation: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' } as any,
  actionItem: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },

  section: { marginTop: 20, paddingHorizontal: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 4 },

  escrowCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  escrowIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  escrowName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  escrowSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  escrowAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },

  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txDesc: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  txDate: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  txAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  txStatus: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 2, textTransform: 'capitalize' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  escrowModalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  escrowModal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  escrowModalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  escrowModalIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  escrowHighlight: { borderRadius: 14, padding: 14, marginBottom: 14 },
  escrowHighlightLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  escrowHighlightValue: { fontSize: 23, fontFamily: 'Inter_700Bold', marginTop: 3 },
  escrowHighlightSub: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  escrowStepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 13 },
  escrowStepIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  escrowStepTitle: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  escrowStepDesc: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 2 },
  bvnNotice: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 11, borderRadius: 11, marginTop: 1, marginBottom: 16 },
  bvnNoticeText: { flex: 1, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_500Medium' },
  modalPill: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  modalBal: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 20 },

  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  methodItem: { width: '47%', borderWidth: 1.5, borderRadius: 14, padding: 14, gap: 6, alignItems: 'center' },
  methodLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  methodDesc: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },

  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },

  amountWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 14, paddingHorizontal: 16, height: 64, marginBottom: 16 },
  naira: { fontSize: 24, fontFamily: 'Inter_700Bold', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontFamily: 'Inter_700Bold' },

  quickAmounts: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  quickAmt: { flex: 1, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1 },
  quickAmtTxt: { fontSize: 12, fontFamily: 'Inter_500Medium' },

  confirmBtn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  confirmBtnTxt: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#ffffff' },
});
