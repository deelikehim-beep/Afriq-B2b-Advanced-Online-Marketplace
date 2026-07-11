import React, { createContext, useContext, useState } from 'react';
import { DEMO_MODE, ESCROW_FEE_RATE, DELIVERY_FEE_PER_SUPPLIER } from '@/constants/config';
import {
  DEMO_ORDERS, DEMO_CONVERSATIONS, DEMO_TRANSACTIONS, DEMO_NOTIFICATIONS, DEMO_USER,
  type CartItem, type Order, type Conversation, type Transaction, type Notif, type AppUser,
} from '@/constants/data';

interface AppContextType {
  user: AppUser;
  cart: CartItem[];
  orders: Order[];
  conversations: Conversation[];
  transactions: Transaction[];
  notifications: Notif[];
  cartCount: number;
  cartTotal: number;
  unreadMessages: number;
  unreadNotifs: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateCartQty: (productId: string, variant: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: () => string;
  confirmDelivery: (orderId: string) => void;
  sendMessage: (convId: string, text: string) => void;
  markMessagesRead: (convId: string) => void;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number) => void;
  transfer: (amount: number, recipient: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser>(DEMO_USER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEMO_MODE ? DEMO_ORDERS : []);
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_MODE ? DEMO_CONVERSATIONS : []);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_MODE ? DEMO_TRANSACTIONS : []);
  const [notifications, setNotifications] = useState<Notif[]>(DEMO_MODE ? DEMO_NOTIFICATIONS : []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const unreadMessages = conversations.reduce((s, c) => s + c.unread, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId && c.variant === item.variant);
      if (existing) {
        return prev.map(c =>
          c.productId === item.productId && c.variant === item.variant ? { ...c, qty: item.qty } : c
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart(prev => prev.filter(c => !(c.productId === productId && c.variant === variant)));
  };

  const updateCartQty = (productId: string, variant: string, qty: number) => {
    setCart(prev =>
      prev.map(c => c.productId === productId && c.variant === variant ? { ...c, qty } : c)
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    const orderId = 'ORD-' + Date.now().toString().slice(-9);
    const escrowFee = Math.round(cartTotal * ESCROW_FEE_RATE);
    const deliveryFee = DELIVERY_FEE_PER_SUPPLIER;
    const grandTotal = cartTotal + escrowFee + deliveryFee;

    const newOrders: Order[] = cart.map(item => ({
      id: orderId,
      productId: item.productId,
      productName: item.name,
      supplier: item.supplier,
      supplierId: item.supplierId,
      quantity: item.qty,
      unitPrice: item.price,
      totalAmount: item.price * item.qty,
      escrowFee: Math.round(item.price * item.qty * ESCROW_FEE_RATE),
      grandTotal: item.price * item.qty + Math.round(item.price * item.qty * ESCROW_FEE_RATE) + DELIVERY_FEE_PER_SUPPLIER,
      deliveryFee: DELIVERY_FEE_PER_SUPPLIER,
      variant: item.variant,
      status: 'processing' as const,
      progress: 20,
      createdAt: 'Just now',
      deliveryDate: 'Pending',
      trackingId: 'AFQ-TRK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      image: item.image,
      steps: [
        { name: 'Order Placed', done: true, current: false },
        { name: 'Payment Confirmed', done: true, current: true },
        { name: 'Shipped', done: false, current: false },
        { name: 'In Transit', done: false, current: false },
        { name: 'Delivered', done: false, current: false },
      ],
    }));

    setOrders(prev => [...newOrders, ...prev]);
    setUser(prev => ({
      ...prev,
      balance: prev.balance - grandTotal,
      escrowLocked: prev.escrowLocked + cartTotal,
    }));
    setTransactions(prev => [{
      id: 'TXN-' + Date.now(),
      type: 'escrow_lock' as const,
      amount: grandTotal,
      desc: `Escrow ${orderId}`,
      date: 'Just now',
      status: 'pending' as const,
      balance: user.balance - grandTotal,
    }, ...prev]);
    clearCart();
    return orderId;
  };

  const confirmDelivery = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    setOrders(prev => prev.map(o =>
      o.id === orderId ? {
        ...o, status: 'completed' as const, progress: 100,
        steps: o.steps.map(s => ({ ...s, done: true, current: false })),
      } : o
    ));
    if (order) {
      setUser(prev => ({ ...prev, escrowLocked: Math.max(0, prev.escrowLocked - order.totalAmount) }));
      setTransactions(prev => [{
        id: 'TXN-' + Date.now(),
        type: 'release' as const,
        amount: order.totalAmount,
        desc: `Released to ${order.supplier}`,
        date: 'Just now',
        status: 'completed' as const,
        balance: user.balance,
      }, ...prev]);
      setNotifications(prev => [{
        id: 'n' + Date.now(),
        title: 'Escrow Released',
        desc: `Payment of ₦${order.totalAmount.toLocaleString('en-NG')} released to ${order.supplier}`,
        time: 'Just now', read: false, icon: 'checkmark-circle', color: '#059669',
      }, ...prev]);
    }
  };

  const sendMessage = (convId: string, text: string) => {
    const msgId = 'm' + Date.now().toString();
    setConversations(prev => prev.map(c =>
      c.id === convId ? {
        ...c, lastMessage: text, time: 'Just now',
        messages: [...c.messages, { id: msgId, sender: 'me' as const, text, time: 'Just now', type: 'text' as const }],
      } : c
    ));
    // Simulate supplier reply after 2 seconds
    setTimeout(() => {
      const replies = [
        'Thanks for your inquiry! Let us check availability.',
        'Yes, we have that in stock. How would you like to proceed?',
        'Great! We can arrange delivery. Escrow payment accepted.',
        'Thank you. We will prepare your order now.',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setConversations(prev => prev.map(c =>
        c.id === convId ? {
          ...c, lastMessage: reply, time: 'Just now', unread: c.unread + 1,
          messages: [...c.messages, {
            id: 'm' + (Date.now() + 1).toString(),
            sender: 'them' as const, text: reply, time: 'Just now', type: 'text' as const,
          }],
        } : c
      ));
    }, 2000);
  };

  const markMessagesRead = (convId: string) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c));
  };

  const markNotifRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deposit = (amount: number, method: string) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    setTransactions(prev => [{
      id: 'TXN-' + Date.now(),
      type: 'deposit' as const,
      amount,
      desc: `Deposit via ${method}`,
      date: 'Just now',
      status: 'completed' as const,
      balance: user.balance + amount,
    }, ...prev]);
  };

  const withdraw = (amount: number) => {
    setUser(prev => ({ ...prev, balance: prev.balance - amount }));
    setTransactions(prev => [{
      id: 'TXN-' + Date.now(),
      type: 'withdrawal' as const,
      amount,
      desc: `Withdrawal to ${user.bankName} ****${user.accountNumber.slice(-4)}`,
      date: 'Just now',
      status: 'completed' as const,
      balance: user.balance - amount,
    }, ...prev]);
  };

  const transfer = (amount: number, recipient: string) => {
    setUser(prev => ({ ...prev, balance: prev.balance - amount }));
    setTransactions(prev => [{
      id: 'TXN-' + Date.now(),
      type: 'withdrawal' as const,
      amount,
      desc: `Transfer to ${recipient}`,
      date: 'Just now',
      status: 'completed' as const,
      balance: user.balance - amount,
    }, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user, cart, orders, conversations, transactions, notifications,
      cartCount, cartTotal, unreadMessages, unreadNotifs,
      addToCart, removeFromCart, updateCartQty, clearCart,
      placeOrder, confirmDelivery,
      sendMessage, markMessagesRead,
      markNotifRead, markAllNotifsRead,
      deposit, withdraw, transfer,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
