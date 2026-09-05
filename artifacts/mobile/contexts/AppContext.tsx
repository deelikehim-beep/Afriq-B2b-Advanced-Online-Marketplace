import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_MODE, ESCROW_FEE_RATE } from '@/constants/config';
import {
  DEMO_ORDERS, DEMO_CONVERSATIONS, DEMO_TRANSACTIONS, DEMO_NOTIFICATIONS, DEMO_USER,
  type CartItem, type Order, type Conversation, type Transaction, type Notif, type AppUser, type Product, type ProductListingDraft,
  hasCompleteSellerProfile,
  PRODUCTS, PRODUCT_LOGISTICS, calculateShippingFee,
} from '@/constants/data';

interface AppContextType {
  user: AppUser;
  cart: CartItem[];
  savedItems: CartItem[];
  followedSuppliers: string[];
  orders: Order[];
  conversations: Conversation[];
  transactions: Transaction[];
  notifications: Notif[];
  listedProducts: Product[];
  cartCount: number;
  cartTotal: number;
  unreadMessages: number;
  unreadNotifs: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateCartQty: (productId: string, variant: string, qty: number) => void;
  getProductStock: (productId: string) => number;
  saveItem: (item: CartItem) => void;
  removeSavedItem: (productId: string, variant: string) => void;
  moveSavedToCart: (item: CartItem) => void;
  isSaved: (productId: string, variant?: string) => boolean;
  updateUserProfile: (updates: Partial<AppUser>) => void;
  createProductListing: (draft: ProductListingDraft) => { ok: boolean; error?: string; product?: Product };
  toggleFollowSupplier: (supplierId: string) => void;
  startProductConversation: (product: Product) => string;
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
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [followedSuppliers, setFollowedSuppliers] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEMO_MODE ? DEMO_ORDERS : []);
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_MODE ? DEMO_CONVERSATIONS : []);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_MODE ? DEMO_TRANSACTIONS : []);
  const [notifications, setNotifications] = useState<Notif[]>(DEMO_MODE ? DEMO_NOTIFICATIONS : []);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('@afriq_saved_items').then(value => {
      if (value) setSavedItems(JSON.parse(value));
    }).catch(() => {});
    AsyncStorage.getItem('@afriq_profile').then(value => {
      if (value) setUser(prev => ({ ...prev, ...JSON.parse(value) }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@afriq_saved_items', JSON.stringify(savedItems)).catch(() => {});
  }, [savedItems]);

  useEffect(() => {
    AsyncStorage.setItem('@afriq_profile', JSON.stringify(user)).catch(() => {});
  }, [user]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const unreadMessages = conversations.reduce((s, c) => s + c.unread, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const getProductStock = (productId: string) => PRODUCTS.find(product => product.id === productId)?.stock ?? 0;

  const addToCart = (item: CartItem) => {
    const product = PRODUCTS.find(candidate => candidate.id === item.productId);
    if (!product || product.stock <= 0) return;
    const safeQty = Math.min(product.stock, Math.max(product.moq, item.qty));
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId && c.variant === item.variant);
      if (existing) {
        return prev.map(c =>
          c.productId === item.productId && c.variant === item.variant ? { ...c, qty: safeQty } : c
        );
      }
      return [...prev, { ...item, qty: safeQty }];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart(prev => prev.filter(c => !(c.productId === productId && c.variant === variant)));
  };

  const updateCartQty = (productId: string, variant: string, qty: number) => {
    const product = PRODUCTS.find(candidate => candidate.id === productId);
    if (!product) return;
    const safeQty = Math.min(product.stock, Math.max(product.moq, qty));
    setCart(prev =>
      prev.map(c => c.productId === productId && c.variant === variant ? { ...c, qty: safeQty } : c)
    );
  };

  const saveItem = (item: CartItem) => {
    setSavedItems(prev => prev.some(s => s.productId === item.productId && s.variant === item.variant)
      ? prev
      : [item, ...prev]);
  };

  const removeSavedItem = (productId: string, variant: string) => {
    setSavedItems(prev => prev.filter(s => !(s.productId === productId && s.variant === variant)));
  };

  const moveSavedToCart = (item: CartItem) => {
    addToCart(item);
    removeSavedItem(item.productId, item.variant);
  };

  const isSaved = (productId: string, variant = '') =>
    savedItems.some(s => s.productId === productId && (!variant || s.variant === variant));

  const updateUserProfile = (updates: Partial<AppUser>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const createProductListing = (draft: ProductListingDraft) => {
    if (user.role !== 'seller') {
      return { ok: false, error: 'Only seller accounts can publish goods. Update your account role before listing.' };
    }
    if (!hasCompleteSellerProfile(user)) {
      return {
        ok: false,
        error: 'Complete your public business profile with a country and full store address before listing a good.',
      };
    }
    if (!draft.name.trim() || !draft.category || !draft.subcategory || !draft.type || !draft.brand.trim() || !draft.model.trim()) {
      return { ok: false, error: 'Complete the product identity fields before submitting.' };
    }
    if (!Number.isFinite(draft.price) || draft.price <= 0) {
      return { ok: false, error: 'Enter a valid price greater than zero.' };
    }
    if (!Number.isInteger(draft.moq) || draft.moq <= 0) {
      return { ok: false, error: 'MOQ must be a whole number greater than zero.' };
    }
    if (!Number.isInteger(draft.stock) || draft.stock <= 0) {
      return { ok: false, error: 'Stock must be a whole number greater than zero.' };
    }
    if (draft.stock < draft.moq) {
      return { ok: false, error: 'Stock cannot be lower than the MOQ, just like cart quantity limits.' };
    }
    if (draft.variants.length === 0 || draft.images.length === 0 || !draft.delivery.trim()) {
      return { ok: false, error: 'Add at least one variant, one product image, and delivery details.' };
    }

    const product: Product = {
      id: `seller_${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category,
      price: draft.price,
      moq: draft.moq,
      unit: draft.unit.trim() || 'units',
      stock: draft.stock,
      supplier: user.businessName,
      supplierId: user.id,
      supplierTrust: user.trustScore,
      supplierDeals: user.totalDeals,
      location: user.storeLocation?.trim() || user.location,
      country: user.residentCountryCode,
      image: draft.images[0],
      images: draft.images,
      rating: 0,
      reviews: 0,
      sold: 0,
      description: `${draft.brand.trim()} ${draft.model.trim()} · ${draft.type.trim()} · ${draft.subcategory.trim()}`,
      variants: draft.variants,
      delivery: draft.delivery.trim(),
      escrow: draft.escrow,
      bulkPricing: [],
    };
    setListedProducts(prev => [product, ...prev]);
    return { ok: true, product };
  };

  const toggleFollowSupplier = (supplierId: string) => {
    setFollowedSuppliers(prev => prev.includes(supplierId)
      ? prev.filter(id => id !== supplierId)
      : [...prev, supplierId]);
  };

  const startProductConversation = (product: Product) => {
    const existing = conversations.find(c => c.supplierId === product.supplierId && c.productId === product.id);
    if (existing) return existing.id;
    const conversation: Conversation = {
      id: `conv_product_${product.id}_${product.supplierId}`,
      with: product.supplier,
      avatar: product.supplier.split(' ').map(w => w[0]).join('').slice(0, 2),
      online: true,
      supplierId: product.supplierId,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      lastMessage: `Inquiry about ${product.name}`,
      time: 'Just now',
      unread: 0,
      messages: [{
        id: `m_product_${product.id}`,
        sender: 'me',
        text: `Hi, I'm interested in "${product.name}". Please confirm stock, variant options, MOQ, and delivery time.`,
        time: 'Just now',
        type: 'text',
      }],
    };
    setConversations(prev => [conversation, ...prev]);
    return conversation.id;
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    const orderId = 'ORD-' + Date.now().toString().slice(-9);
    const escrowFee = Math.round(cartTotal * ESCROW_FEE_RATE);
    const deliveryFee = cart.reduce((sum, item) => {
      const logistics = PRODUCT_LOGISTICS[item.productId] ?? { weightKg: 1, sizeClass: 'small' as const };
      return sum + calculateShippingFee(logistics.weightKg, logistics.sizeClass, user.location.includes('Nigeria') ? 120 : 900, item.qty);
    }, 0);
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
       grandTotal: item.price * item.qty + Math.round(item.price * item.qty * ESCROW_FEE_RATE) + calculateShippingFee(
         (PRODUCT_LOGISTICS[item.productId] ?? { weightKg: 1, sizeClass: 'small' as const }).weightKg,
         (PRODUCT_LOGISTICS[item.productId] ?? { weightKg: 1, sizeClass: 'small' as const }).sizeClass,
         user.location.includes('Nigeria') ? 120 : 900,
         item.qty,
       ),
       deliveryFee: calculateShippingFee(
         (PRODUCT_LOGISTICS[item.productId] ?? { weightKg: 1, sizeClass: 'small' as const }).weightKg,
         (PRODUCT_LOGISTICS[item.productId] ?? { weightKg: 1, sizeClass: 'small' as const }).sizeClass,
         user.location.includes('Nigeria') ? 120 : 900,
         item.qty,
       ),
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
       user, cart, savedItems, followedSuppliers, orders, conversations, transactions, notifications, listedProducts,
      cartCount, cartTotal, unreadMessages, unreadNotifs,
        addToCart, removeFromCart, updateCartQty, getProductStock, saveItem, removeSavedItem, moveSavedToCart, isSaved,
       updateUserProfile, createProductListing, toggleFollowSupplier, startProductConversation, clearCart,
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
