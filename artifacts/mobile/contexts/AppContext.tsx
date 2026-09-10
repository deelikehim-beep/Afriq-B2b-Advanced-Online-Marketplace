import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ESCROW_FEE_RATE } from '@/constants/config';
import {
  LIVE_USER,
  type CartItem, type Order, type Conversation, type Transaction, type Notif, type AppUser, type Product, type ProductListingDraft,
  hasCompleteSellerProfile,
  PRODUCTS, PRODUCT_LOGISTICS, calculateShippingFee,
} from '@/constants/data';
import { useAuth } from '@/contexts/AuthContext';

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
  marketplaceProducts: Product[];
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
  createProductListing: (draft: ProductListingDraft) => Promise<{ ok: boolean; error?: string; product?: Product }>;
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
  const { isLoggedIn, user: authUser, getToken } = useAuth();
  const [user, setUser] = useState<AppUser>(LIVE_USER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [followedSuppliers, setFollowedSuppliers] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setHydrated(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const response = await fetch(`${domain ? `https://${domain}` : ''}/api/state`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok || cancelled) return;
      const payload = await response.json();
      const state = payload.state as Partial<{
        user: AppUser; cart: CartItem[]; savedItems: CartItem[]; followedSuppliers: string[];
        orders: Order[]; conversations: Conversation[]; transactions: Transaction[];
        notifications: Notif[]; listedProducts: Product[];
      }> | null;
      if (state) {
        if (state.user) setUser(prev => ({ ...prev, ...state.user }));
        if (state.cart) setCart(state.cart);
        if (state.savedItems) setSavedItems(state.savedItems);
        if (state.followedSuppliers) setFollowedSuppliers(state.followedSuppliers);
        if (state.orders) setOrders(state.orders);
        if (state.conversations) setConversations(state.conversations);
        if (state.transactions) setTransactions(state.transactions);
        if (state.notifications) setNotifications(state.notifications);
        if (state.listedProducts) setListedProducts(state.listedProducts);
      }
      if (authUser) setUser(prev => ({ ...prev, id: authUser.id, name: authUser.name, email: authUser.email }));
      setHydrated(true);
    })().catch(() => setHydrated(true));
    return () => { cancelled = true; };
  }, [isLoggedIn, getToken, authUser]);

  useEffect(() => {
    let cancelled = false;
    const loadMarketplaceListings = async () => {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const response = await fetch(`${domain ? `https://${domain}` : ''}/api/marketplace/listings`);
      if (!response.ok || cancelled) return;
      const payload = await response.json() as { listings?: Product[] };
      if (!cancelled) setMarketplaceProducts(payload.listings ?? []);
    };
    loadMarketplaceListings().catch(() => {});
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !hydrated) return;
    const timer = setTimeout(async () => {
      const token = await getToken();
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      await fetch(`${domain ? `https://${domain}` : ''}/api/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ state: { user, cart, savedItems, followedSuppliers, orders, conversations, transactions, notifications, listedProducts } }),
      }).catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  }, [isLoggedIn, hydrated, user, cart, savedItems, followedSuppliers, orders, conversations, transactions, notifications, listedProducts, getToken]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const unreadMessages = conversations.reduce((s, c) => s + c.unread, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const allMarketplaceProducts = [...marketplaceProducts, ...listedProducts, ...PRODUCTS];
  const getProductStock = (productId: string) => allMarketplaceProducts.find(product => product.id === productId)?.stock ?? 0;

  const addToCart = (item: CartItem) => {
    const product = allMarketplaceProducts.find(candidate => candidate.id === item.productId);
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
    const product = allMarketplaceProducts.find(candidate => candidate.id === productId);
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

  const createProductListing = async (draft: ProductListingDraft) => {
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
    if (draft.images.length === 0) {
      return { ok: false, error: 'Add at least one product image before publishing.' };
    }

    const product: Product = {
      id: `seller_${user.id}_${Date.now()}`,
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
      brand: draft.brand.trim(),
      brandId: draft.brandId,
      model: draft.model.trim(),
      modelId: draft.modelId,
      image: draft.images[0],
      images: draft.images,
      rating: 0,
      reviews: 0,
      sold: 0,
      description: `${draft.brand.trim()} ${draft.model.trim()} · ${draft.type.trim()} · ${draft.subcategory.trim()}${draft.condition ? ` · ${draft.condition}` : ''}`,
      specifications: draft.specifications,
      condition: draft.condition,
      problems: draft.problems,
      problemDescription: draft.problemDescription,
      variants: draft.variants.length > 0 ? draft.variants : ['Standard'],
      delivery: draft.delivery.trim() || 'Delivery arranged with seller',
      escrow: draft.escrow,
      bulkPricing: [],
    };
    const token = await getToken();
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    let response: Response;
    try {
      response = await fetch(`${domain ? `https://${domain}` : ''}/api/marketplace/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ product }),
      });
    } catch {
      return { ok: false, error: 'The marketplace could not be reached. Check your connection and try again.' };
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      return { ok: false, error: payload?.message ?? 'The listing could not be published. Please try again.' };
    }
    setListedProducts(prev => [product, ...prev]);
    setMarketplaceProducts(prev => [product, ...prev.filter(item => item.id !== product.id)]);
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
       user, cart, savedItems, followedSuppliers, orders, conversations, transactions, notifications, listedProducts, marketplaceProducts,
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
