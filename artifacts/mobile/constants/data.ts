// ─────────────────────────────────────────────────────────────
// AFRIQ Data Types & Demo Data
// ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface BulkTier {
  qty: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  unit: string;
  stock: number;
  supplier: string;
  supplierId: string;
  supplierTrust: number;
  supplierDeals: number;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  sold: number;
  description: string;
  variants: string[];
  delivery: string;
  escrow: boolean;
  bulkPricing: BulkTier[];
  featured?: boolean;
  badge?: string;
}

export interface OrderStep {
  name: string;
  done: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  supplier: string;
  supplierId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  escrowFee: number;
  grandTotal: number;
  deliveryFee: number;
  variant: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'completed' | 'disputed';
  progress: number;
  createdAt: string;
  deliveryDate: string;
  trackingId: string;
  steps: OrderStep[];
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  type: 'text' | 'order';
}

export interface Conversation {
  id: string;
  with: string;
  avatar: string;
  online: boolean;
  supplierId: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'escrow_lock' | 'release' | 'fee';
  amount: number;
  desc: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  balance: number;
}

export interface Notif {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
  variant: string;
  supplier: string;
  supplierId: string;
  image: string;
  delivery: string;
  moq: number;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
  escrowLocked: number;
  trustScore: number;
  verified: boolean;
  location: string;
  businessName: string;
  businessType: string;
  memberSince: string;
  totalDeals: number;
  successRate: number;
  avatar: string;
  bankName: string;
  accountNumber: string;
}

// ─── Formatters ──────────────────────────────────────────────
export const fmt = (n: number) => '₦' + n.toLocaleString('en-NG');
export const fmtShort = (n: number) =>
  n >= 1_000_000
    ? '₦' + (n / 1_000_000).toFixed(1) + 'M'
    : n >= 1_000
    ? '₦' + (n / 1_000).toFixed(0) + 'K'
    : '₦' + n;

// ─── Demo User ───────────────────────────────────────────────
export const DEMO_USER: AppUser = {
  id: 'user_001',
  name: 'Chinedu Okafor',
  phone: '+234 803 456 7890',
  email: 'chinedu@okafortrading.com',
  balance: 2_450_000,
  escrowLocked: 850_000,
  trustScore: 94,
  verified: true,
  location: 'Lagos, Nigeria',
  businessName: 'Okafor Trading Ltd',
  businessType: 'Importer & Distributor',
  memberSince: '2023',
  totalDeals: 147,
  successRate: 98,
  avatar: 'CO',
  bankName: 'GTBank',
  accountNumber: '0123456789',
};

// ─── Categories ──────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: 'grid', count: 2400 },
  { id: 'textiles', name: 'Textiles', icon: 'shirt', count: 340 },
  { id: 'electronics', name: 'Electronics', icon: 'phone-portrait', count: 210 },
  { id: 'agriculture', name: 'Agriculture', icon: 'leaf', count: 180 },
  { id: 'beauty', name: 'Beauty', icon: 'flower', count: 145 },
  { id: 'home', name: 'Home & Furniture', icon: 'home', count: 280 },
  { id: 'auto', name: 'Auto Parts', icon: 'car', count: 195 },
  { id: 'food', name: 'Food & Beverages', icon: 'restaurant', count: 310 },
  { id: 'construction', name: 'Construction', icon: 'construct', count: 220 },
  { id: 'fashion', name: 'Fashion', icon: 'bag-handle', count: 400 },
  { id: 'health', name: 'Health & Medical', icon: 'medkit', count: 165 },
  { id: 'office', name: 'Office Supplies', icon: 'briefcase', count: 130 },
  { id: 'sports', name: 'Sports & Fitness', icon: 'barbell', count: 95 },
  { id: 'chemicals', name: 'Chemicals', icon: 'flask', count: 78 },
  { id: 'machinery', name: 'Machinery', icon: 'cog', count: 112 },
  { id: 'packaging', name: 'Packaging', icon: 'cube', count: 89 },
  { id: 'toys', name: 'Toys & Baby', icon: 'happy', count: 145 },
  { id: 'jewelry', name: 'Jewelry', icon: 'diamond', count: 156 },
  { id: 'cleaning', name: 'Cleaning', icon: 'water', count: 67 },
  { id: 'energy', name: 'Energy & Solar', icon: 'sunny', count: 88 },
];

// ─── Products ────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: '1', name: 'Premium Hollandais Ankara Wax Fabrics', category: 'textiles',
    price: 4200, moq: 50, unit: 'yards', stock: 5000,
    supplier: 'Aba Textile Hub', supplierId: 'sup_001', supplierTrust: 97, supplierDeals: 2340,
    location: 'Aba, Abia State',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&q=80',
    rating: 4.8, reviews: 128, sold: 3420,
    description: 'Original Hollandais wax prints. Vibrant colors, durable cotton. Perfect for fashion designers and retail shops. Bulk pricing available for 500+ yards.',
    variants: ['Blue/Gold', 'Red/Green', 'Purple/Yellow', 'Black/White', 'Orange/Navy'],
    delivery: '3–5 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 4000 }, { qty: 500, price: 3800 }, { qty: 1000, price: 3500 }],
    featured: true,
  },
  {
    id: '2', name: 'Samsung Galaxy A14 5G — 64GB Bulk', category: 'electronics',
    price: 85000, moq: 10, unit: 'units', stock: 350,
    supplier: 'Alaba Direct Electronics', supplierId: 'sup_002', supplierTrust: 91, supplierDeals: 890,
    location: 'Alaba, Lagos',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80',
    rating: 4.6, reviews: 64, sold: 890,
    description: 'Brand new Samsung Galaxy A14 5G. 64GB storage, 4GB RAM. Sealed boxes with 1-year warranty. Perfect for phone retailers and corporate bulk orders.',
    variants: ['Black', 'Green', 'Silver'],
    delivery: 'Same day (Lagos)', escrow: true,
    bulkPricing: [{ qty: 50, price: 82000 }, { qty: 100, price: 79000 }],
    featured: true,
  },
  {
    id: '3', name: 'Nigerian Long Grain Rice — 50kg Bags', category: 'agriculture',
    price: 42000, moq: 20, unit: 'bags', stock: 2000,
    supplier: 'Kebbi Farms Cooperative', supplierId: 'sup_003', supplierTrust: 95, supplierDeals: 1560,
    location: 'Birnin Kebbi, Kebbi',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    rating: 4.9, reviews: 312, sold: 5600,
    description: 'Premium long grain rice. Direct from farmers in Kebbi State. 50kg bags. Fresh harvest. Stone-free, sorted. Nationwide delivery via AFRIQ logistics.',
    variants: ['Standard', 'Premium Organic'],
    delivery: '5–7 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 40000 }, { qty: 500, price: 38000 }],
  },
  {
    id: '4', name: 'Brazilian Human Hair Bundles — Virgin', category: 'beauty',
    price: 35000, moq: 5, unit: 'bundles', stock: 800,
    supplier: 'Lekki Beauty Wholesale', supplierId: 'sup_004', supplierTrust: 88, supplierDeals: 430,
    location: 'Lekki, Lagos',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
    rating: 4.7, reviews: 89, sold: 1200,
    description: '100% unprocessed Brazilian virgin human hair. Can be dyed and bleached. Double weft, no shedding. 12–30 inches in all textures.',
    variants: ['Body Wave', 'Straight', 'Deep Curl', 'Kinky Curly'],
    delivery: '2–3 days', escrow: true,
    bulkPricing: [{ qty: 20, price: 32000 }, { qty: 50, price: 29000 }],
  },
  {
    id: '5', name: 'Heavy-Duty Plastic Event Chairs', category: 'home',
    price: 2800, moq: 100, unit: 'pieces', stock: 5000,
    supplier: 'Onitsha Plastics Ltd', supplierId: 'sup_005', supplierTrust: 92, supplierDeals: 2100,
    location: 'Onitsha, Anambra',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb5f0?w=500&q=80',
    rating: 4.5, reviews: 256, sold: 8900,
    description: 'Heavy-duty event chairs. Stackable up to 50 units. UV resistant, weather-proof. Perfect for event centers, churches, schools, and rental businesses.',
    variants: ['White', 'Blue', 'Red', 'Gold'],
    delivery: '3–4 days', escrow: true,
    bulkPricing: [{ qty: 500, price: 2600 }, { qty: 1000, price: 2400 }],
  },
  {
    id: '6', name: 'Genuine Toyota Brake Pads — OEM', category: 'auto',
    price: 15000, moq: 20, unit: 'sets', stock: 600,
    supplier: 'Ladipo Spare Parts Hub', supplierId: 'sup_006', supplierTrust: 89, supplierDeals: 780,
    location: 'Ladipo, Lagos',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&q=80',
    rating: 4.6, reviews: 145, sold: 2100,
    description: 'Genuine OEM Toyota brake pads. Fits Corolla, Camry, RAV4, Highlander. Asbestos-free. Bulk pricing for mechanics and auto parts dealers.',
    variants: ['Corolla 2008–2013', 'Corolla 2014+', 'Camry 2012+', 'RAV4 All'],
    delivery: '1–2 days (Lagos)', escrow: true,
    bulkPricing: [{ qty: 100, price: 13500 }],
  },
  {
    id: '7', name: 'Pure Red Palm Oil — 25L Jerrycans', category: 'food',
    price: 18000, moq: 30, unit: 'cans', stock: 1200,
    supplier: 'Delta Palm Oil Mill', supplierId: 'sup_007', supplierTrust: 96, supplierDeals: 1890,
    location: 'Warri, Delta',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80',
    rating: 4.9, reviews: 203, sold: 4500,
    description: '100% pure red palm oil. Cold pressed, no additives. 25L jerrycans. Direct from mill in Delta State. Export quality.',
    variants: ['Standard Grade', 'Premium Organic'],
    delivery: '4–6 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 17000 }, { qty: 500, price: 16000 }],
  },
  {
    id: '8', name: '32-inch Smart LED TV — Android OS', category: 'electronics',
    price: 65000, moq: 5, unit: 'units', stock: 200,
    supplier: 'Alaba Direct Electronics', supplierId: 'sup_002', supplierTrust: 91, supplierDeals: 890,
    location: 'Alaba, Lagos',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
    rating: 4.4, reviews: 52, sold: 340,
    description: '32-inch Smart LED TV with Android OS. Netflix, YouTube pre-installed. HD display. Perfect for hotels, offices, and retail electronics.',
    variants: ['32 inch', '43 inch', '55 inch'],
    delivery: 'Same day (Lagos)', escrow: true,
    bulkPricing: [{ qty: 20, price: 62000 }, { qty: 50, price: 58000 }],
  },
  {
    id: '9', name: 'Portland Cement — Dangote 50kg', category: 'construction',
    price: 5200, moq: 100, unit: 'bags', stock: 10000,
    supplier: 'Dangote Direct Partners', supplierId: 'sup_008', supplierTrust: 99, supplierDeals: 5600,
    location: 'Ibeshe, Ogun',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80',
    rating: 4.9, reviews: 890, sold: 45000,
    description: 'Dangote Portland cement 50kg bags. Grade 42.5R. Direct from factory. Delivery with AFRIQ logistics. Perfect for construction companies and block makers.',
    variants: ['42.5R Standard'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 500, price: 5000 }, { qty: 1000, price: 4800 }],
    featured: true,
  },
  {
    id: '10', name: "Men's Plain T-Shirts — Cotton Bulk", category: 'fashion',
    price: 1200, moq: 200, unit: 'pieces', stock: 8000,
    supplier: 'Aba Garment Cluster', supplierId: 'sup_001', supplierTrust: 90, supplierDeals: 1200,
    location: 'Aba, Abia State',
    image: 'https://images.unsplash.com/photo-1521572163474-6863f1d88fbf?w=500&q=80',
    rating: 4.5, reviews: 178, sold: 5600,
    description: 'High-quality cotton plain t-shirts. Round neck and V-neck. Perfect for screen printing, branding, and retail. All sizes S to XXL.',
    variants: ['White', 'Black', 'Navy', 'Red', 'Grey'],
    delivery: '3–5 days', escrow: true,
    bulkPricing: [{ qty: 500, price: 1100 }, { qty: 1000, price: 1000 }],
  },
  {
    id: '11', name: 'N95 Medical Face Masks — Bulk Pack', category: 'health',
    price: 450, moq: 500, unit: 'pieces', stock: 50000,
    supplier: 'Lagos Medical Supplies', supplierId: 'sup_009', supplierTrust: 94, supplierDeals: 670,
    location: 'Ikeja, Lagos',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    rating: 4.7, reviews: 234, sold: 12000,
    description: 'CE certified N95 respirator face masks. 5-layer filtration, 95% particulate protection. Perfect for hospitals, pharmacies, and safety distributors.',
    variants: ['Standard', 'With Valve', 'Children Size'],
    delivery: '1–2 days', escrow: true,
    bulkPricing: [{ qty: 1000, price: 420 }, { qty: 5000, price: 390 }],
  },
  {
    id: '12', name: 'Executive Office Chair — Ergonomic', category: 'office',
    price: 45000, moq: 20, unit: 'pieces', stock: 300,
    supplier: 'Lagos Office Furnishers', supplierId: 'sup_010', supplierTrust: 87, supplierDeals: 340,
    location: 'Ikeja, Lagos',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80',
    rating: 4.5, reviews: 67, sold: 780,
    description: 'Ergonomic executive office chair with lumbar support. Adjustable height, 360° swivel, padded armrests. Breathable mesh back.',
    variants: ['Black', 'Grey', 'Blue'],
    delivery: '2–4 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 42000 }, { qty: 100, price: 39000 }],
  },
  {
    id: '13', name: 'Diesel Generator — 10KVA Silent', category: 'machinery',
    price: 850000, moq: 1, unit: 'unit', stock: 50,
    supplier: 'Power Zone Nigeria', supplierId: 'sup_013', supplierTrust: 91, supplierDeals: 421,
    location: 'Ojo, Lagos',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80',
    rating: 4.6, reviews: 78, sold: 320,
    description: 'Silent diesel generator, 10KVA single-phase. Auto start, AVR system. 18L fuel tank, 6–8 hours runtime. Perfect for offices and small factories.',
    variants: ['10KVA Single Phase', '15KVA Single Phase', '20KVA Three Phase'],
    delivery: '2–3 days', escrow: true,
    bulkPricing: [{ qty: 5, price: 820000 }],
    badge: 'HOT',
  },
  {
    id: '14', name: 'Caustic Soda Flakes — Industrial Grade', category: 'chemicals',
    price: 12500, moq: 50, unit: 'kg', stock: 5000,
    supplier: 'Apapa Chemical Traders', supplierId: 'sup_012', supplierTrust: 85, supplierDeals: 289,
    location: 'Apapa, Lagos',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80',
    rating: 4.3, reviews: 45, sold: 890,
    description: 'Industrial grade caustic soda flakes (NaOH 98%). Used in soap making, water treatment, textile processing. 25kg bags. NAFDAC certified.',
    variants: ['25kg Bag', '50kg Bag'],
    delivery: '3–5 days', escrow: true,
    bulkPricing: [{ qty: 200, price: 11500 }, { qty: 500, price: 10500 }],
  },
  {
    id: '15', name: 'Brown Kraft Carton Boxes — Custom Print', category: 'packaging',
    price: 850, moq: 500, unit: 'pieces', stock: 100000,
    supplier: 'Yaba Packaging Solutions', supplierId: 'sup_014', supplierTrust: 93, supplierDeals: 567,
    location: 'Yaba, Lagos',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80',
    rating: 4.5, reviews: 123, sold: 45000,
    description: 'High-quality brown kraft carton boxes. Custom printing available for 2000+ units. Strong 3-ply corrugated. Multiple sizes.',
    variants: ['Small 30×20×15cm', 'Medium 40×30×20cm', 'Large 50×40×30cm'],
    delivery: '2–4 days', escrow: true,
    bulkPricing: [{ qty: 1000, price: 780 }, { qty: 5000, price: 720 }],
  },
  {
    id: '16', name: 'Pampers Baby Diapers — Bulk Case', category: 'toys',
    price: 28000, moq: 50, unit: 'packs', stock: 2000,
    supplier: 'Baby Care Distributors', supplierId: 'sup_015', supplierTrust: 92, supplierDeals: 345,
    location: 'Gbagada, Lagos',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80',
    rating: 4.8, reviews: 189, sold: 3400,
    description: 'Original Pampers baby diapers. Sizes Newborn to XXL. 12-hour protection, wetness indicator. Bulk cases for pharmacies and supermarkets.',
    variants: ['Newborn (0–5kg)', 'Small (3–8kg)', 'Medium (6–11kg)', 'Large (9–14kg)', 'XL (12–17kg)'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 26500 }, { qty: 200, price: 25000 }],
  },
  {
    id: '17', name: '18K Gold Plated Jewelry Set', category: 'jewelry',
    price: 22000, moq: 30, unit: 'sets', stock: 800,
    supplier: 'Balogun Jewelry Market', supplierId: 'sup_016', supplierTrust: 84, supplierDeals: 234,
    location: 'Balogun, Lagos',
    image: 'https://images.unsplash.com/photo-1617197336240-46c9e17f7f36?w=500&q=80',
    rating: 4.3, reviews: 56, sold: 1200,
    description: '18K gold-plated fashion jewelry set (necklace + earrings + bracelet). Anti-tarnish coating. 6-month color guarantee. Perfect for jewelry boutiques.',
    variants: ['Gold', 'Rose Gold', 'Silver Tone'],
    delivery: '2–3 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 20000 }, { qty: 300, price: 18500 }],
  },
  {
    id: '18', name: 'Floor Cleaner Disinfectant — 25L Industrial', category: 'cleaning',
    price: 8500, moq: 20, unit: 'cans', stock: 1500,
    supplier: 'Clean Pro Distributors', supplierId: 'sup_017', supplierTrust: 88, supplierDeals: 412,
    location: 'Mushin, Lagos',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80',
    rating: 4.5, reviews: 87, sold: 2300,
    description: 'Industrial-grade floor cleaner and disinfectant. Kills 99.9% bacteria. 25L concentrate (dilute 1:20). NAFDAC certified.',
    variants: ['Pine Fresh', 'Lavender', 'Original'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 8000 }, { qty: 100, price: 7500 }],
  },
  {
    id: '19', name: '300W Monocrystalline Solar Panel', category: 'energy',
    price: 95000, moq: 5, unit: 'units', stock: 500,
    supplier: 'GreenPower Nigeria', supplierId: 'sup_018', supplierTrust: 93, supplierDeals: 289,
    location: 'Abuja, FCT',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80',
    rating: 4.8, reviews: 112, sold: 890,
    description: '300W monocrystalline solar panel. 21.5% efficiency, 25-year output warranty. Perfect for solar installers and energy companies.',
    variants: ['300W Mono', '400W Mono', '500W Mono'],
    delivery: '3–5 days', escrow: true,
    bulkPricing: [{ qty: 20, price: 90000 }, { qty: 50, price: 85000 }],
    featured: true,
  },
  {
    id: '20', name: 'Kente Cloth Woven Fabric — Ghana', category: 'textiles',
    price: 8500, moq: 20, unit: 'yards', stock: 1200,
    supplier: 'Kumasi Weave House', supplierId: 'sup_019', supplierTrust: 91, supplierDeals: 678,
    location: 'Accra, Ghana',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&q=80',
    rating: 4.9, reviews: 89, sold: 1450,
    description: 'Authentic hand-woven Kente cloth from Ghana. Vibrant patterns, 100% cotton. Ideal for cultural clothing, designer fashion, and gift shops.',
    variants: ['Multi-Color Traditional', 'Gold & Black', 'Red & Gold', 'Green & Blue'],
    delivery: '7–10 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 7800 }, { qty: 500, price: 7200 }],
  },
  {
    id: '21', name: 'Dry Stockfish — Premium Norway Grade', category: 'food',
    price: 35000, moq: 10, unit: 'cartons', stock: 500,
    supplier: 'Onitsha Fish Wholesale', supplierId: 'sup_020', supplierTrust: 90, supplierDeals: 1120,
    location: 'Onitsha, Anambra',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80',
    rating: 4.7, reviews: 167, sold: 2800,
    description: 'Premium Norway dry stockfish. Grade A quality. 10kg cartons. Perfect for supermarkets, restaurants, and food wholesale distributors.',
    variants: ['Grade A Large', 'Grade A Medium', 'Grade B'],
    delivery: '2–4 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 33000 }, { qty: 100, price: 31000 }],
  },
  {
    id: '22', name: '12mm Iron Rods — Building Steel Y12', category: 'construction',
    price: 3200, moq: 200, unit: 'lengths', stock: 15000,
    supplier: 'Steel Masters Nigeria', supplierId: 'sup_021', supplierTrust: 94, supplierDeals: 2100,
    location: 'Oshodi, Lagos',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80',
    rating: 4.8, reviews: 456, sold: 28000,
    description: 'Y12 deformed iron rods for building reinforcement. 6-metre lengths, 12mm diameter. ASTM certified. Perfect for construction companies.',
    variants: ['Y10 (10mm)', 'Y12 (12mm)', 'Y16 (16mm)', 'Y20 (20mm)'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 500, price: 3000 }, { qty: 1000, price: 2800 }],
  },
  {
    id: '23', name: 'Raw Shea Butter — Unrefined Grade A', category: 'beauty',
    price: 2800, moq: 30, unit: 'kg', stock: 3000,
    supplier: 'Northern Shea Cooperative', supplierId: 'sup_022', supplierTrust: 93, supplierDeals: 780,
    location: 'Kano, Nigeria',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80',
    rating: 4.9, reviews: 245, sold: 4500,
    description: 'Grade A unrefined shea butter, cold-pressed from Kano shea nuts. Ivory/yellow color. Perfect for cosmetics manufacturers and beauty brands.',
    variants: ['Grade A Ivory', 'Grade A Yellow', 'Grade B'],
    delivery: '4–6 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 2600 }, { qty: 500, price: 2400 }],
  },
  {
    id: '24', name: 'Commercial Treadmill — Heavy Duty', category: 'sports',
    price: 380000, moq: 2, unit: 'units', stock: 45,
    supplier: 'Lagos Fitness Equipment', supplierId: 'sup_011', supplierTrust: 86, supplierDeals: 156,
    location: 'Lekki, Lagos',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
    rating: 4.4, reviews: 32, sold: 145,
    description: 'Commercial-grade treadmill. 3.0HP motor, 20km/h max speed, 180kg capacity. Built for gyms, hotels, and fitness centers. 1-year motor warranty.',
    variants: ['3HP Basic', '4HP Premium'],
    delivery: '5–7 days', escrow: true,
    bulkPricing: [{ qty: 5, price: 360000 }],
  },
  {
    id: '25', name: 'iPhone 14 Pro Max — Refurbished Grade A', category: 'electronics',
    price: 450000, moq: 3, unit: 'units', stock: 80,
    supplier: 'Lagos iPhone Hub', supplierId: 'sup_023', supplierTrust: 87, supplierDeals: 345,
    location: 'VI, Lagos',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80',
    rating: 4.5, reviews: 43, sold: 280,
    description: 'Grade A refurbished iPhone 14 Pro Max. 256GB, 6.7-inch Super Retina display. Battery health 90%+. 6-month warranty.',
    variants: ['128GB Space Black', '256GB Deep Purple', '512GB Gold'],
    delivery: '1–2 days', escrow: true,
    bulkPricing: [{ qty: 10, price: 430000 }],
    badge: 'NEW',
  },
];

// ─── Demo Orders ─────────────────────────────────────────────
export const DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-240709-001',
    productId: '2', productName: 'Samsung Galaxy A14 5G — 64GB Bulk',
    supplier: 'Alaba Direct Electronics', supplierId: 'sup_002',
    quantity: 15, unitPrice: 85000, totalAmount: 1275000, escrowFee: 31875,
    grandTotal: 1331875, deliveryFee: 25000, variant: 'Black',
    status: 'shipped', progress: 60,
    createdAt: 'Jul 9, 2024', deliveryDate: 'Jul 12, 2024', trackingId: 'AFQ-TRK-445-LGS',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80',
    steps: [
      { name: 'Order Placed', done: true, current: false },
      { name: 'Payment Confirmed', done: true, current: false },
      { name: 'Shipped', done: true, current: true },
      { name: 'In Transit', done: false, current: false },
      { name: 'Delivered', done: false, current: false },
    ],
  },
  {
    id: 'ORD-240708-002',
    productId: '1', productName: 'Premium Hollandais Ankara Wax Fabrics',
    supplier: 'Aba Textile Hub', supplierId: 'sup_001',
    quantity: 200, unitPrice: 4200, totalAmount: 840000, escrowFee: 21000,
    grandTotal: 886000, deliveryFee: 25000, variant: 'Blue/Gold',
    status: 'delivered', progress: 80,
    createdAt: 'Jul 8, 2024', deliveryDate: 'Jul 11, 2024', trackingId: 'AFQ-TRK-332-ABA',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&q=80',
    steps: [
      { name: 'Order Placed', done: true, current: false },
      { name: 'Payment Confirmed', done: true, current: false },
      { name: 'Shipped', done: true, current: false },
      { name: 'In Transit', done: true, current: false },
      { name: 'Delivered', done: true, current: true },
    ],
  },
  {
    id: 'ORD-240705-003',
    productId: '3', productName: 'Nigerian Long Grain Rice — 50kg Bags',
    supplier: 'Kebbi Farms Cooperative', supplierId: 'sup_003',
    quantity: 50, unitPrice: 42000, totalAmount: 2100000, escrowFee: 52500,
    grandTotal: 2177500, deliveryFee: 25000, variant: 'Standard',
    status: 'completed', progress: 100,
    createdAt: 'Jul 5, 2024', deliveryDate: 'Jul 10, 2024', trackingId: 'AFQ-TRK-118-KBB',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    steps: [
      { name: 'Order Placed', done: true, current: false },
      { name: 'Payment Confirmed', done: true, current: false },
      { name: 'Shipped', done: true, current: false },
      { name: 'In Transit', done: true, current: false },
      { name: 'Delivered', done: true, current: false },
    ],
  },
];

// ─── Demo Conversations ───────────────────────────────────────
export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_001', with: 'Aba Textile Hub', avatar: 'AT', online: true, supplierId: 'sup_001',
    lastMessage: 'Yes, we can do 200 yards at ₦4,200/yard. Escrow accepted.', time: '2m ago', unread: 2,
    messages: [
      { id: 'm1', sender: 'me', text: 'Hi, do you have Hollandais wax in stock?', time: '10:30 AM', type: 'text' },
      { id: 'm2', sender: 'them', text: 'Yes, all variants available. What quantity do you need?', time: '10:32 AM', type: 'text' },
      { id: 'm3', sender: 'me', text: 'I need 200 yards for my shop in Lagos', time: '10:35 AM', type: 'text' },
      { id: 'm4', sender: 'them', text: 'Yes, we can do 200 yards at ₦4,200/yard. Escrow accepted.', time: '10:38 AM', type: 'text' },
    ],
  },
  {
    id: 'conv_002', with: 'Alaba Direct Electronics', avatar: 'AD', online: false, supplierId: 'sup_002',
    lastMessage: 'Your order ORD-240709-001 has been shipped. Tracking: AFQ-TRK-445-LGS', time: '1h ago', unread: 1,
    messages: [
      { id: 'm5', sender: 'them', text: 'Your order ORD-240709-001 has been shipped. Tracking: AFQ-TRK-445-LGS', time: '9:15 AM', type: 'order' },
    ],
  },
  {
    id: 'conv_003', with: 'Kebbi Farms Cooperative', avatar: 'KF', online: true, supplierId: 'sup_003',
    lastMessage: 'New harvest just arrived. Fresh stock available for bulk orders.', time: '3h ago', unread: 0,
    messages: [
      { id: 'm6', sender: 'them', text: 'New harvest just arrived. Fresh stock available for bulk orders.', time: '7:30 AM', type: 'text' },
    ],
  },
  {
    id: 'conv_004', with: 'Dangote Direct Partners', avatar: 'DD', online: true, supplierId: 'sup_008',
    lastMessage: '10,000 bags in stock. Can deliver within 24 hours to Lagos.', time: '5h ago', unread: 0,
    messages: [
      { id: 'm7', sender: 'them', text: '10,000 bags of cement in stock. Can deliver within 24 hours to Lagos.', time: '6:00 AM', type: 'text' },
    ],
  },
  {
    id: 'conv_005', with: 'GreenPower Nigeria', avatar: 'GP', online: false, supplierId: 'sup_018',
    lastMessage: 'We have a special 10-unit bundle deal this week. Interested?', time: 'Yesterday', unread: 0,
    messages: [
      { id: 'm8', sender: 'them', text: 'We have a special 10-unit bundle deal this week. Interested?', time: 'Yesterday', type: 'text' },
    ],
  },
];

// ─── Demo Transactions ────────────────────────────────────────
export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-001', type: 'deposit', amount: 500000, desc: 'Bank Transfer — GTBank', date: 'Today, 9:00 AM', status: 'completed', balance: 2450000 },
  { id: 'TXN-002', type: 'escrow_lock', amount: 1331875, desc: 'Escrow ORD-240709-001 — Samsung A14', date: 'Yesterday, 2:30 PM', status: 'pending', balance: 1950000 },
  { id: 'TXN-003', type: 'release', amount: 886000, desc: 'Released to Aba Textile Hub', date: 'Jul 8, 6:00 PM', status: 'completed', balance: 1950000 },
  { id: 'TXN-004', type: 'fee', amount: 21000, desc: 'Escrow Fee (2.5%) — ORD-240708-002', date: 'Jul 8, 6:00 PM', status: 'completed', balance: 1950000 },
  { id: 'TXN-005', type: 'deposit', amount: 1200000, desc: 'Cash Deposit — AFRIQ Agent, Lagos', date: 'Jul 5, 4:15 PM', status: 'completed', balance: 1200000 },
  { id: 'TXN-006', type: 'withdrawal', amount: 200000, desc: 'Bank Transfer Out — GTBank', date: 'Jul 3, 10:00 AM', status: 'completed', balance: 1000000 },
];

// ─── Demo Notifications ───────────────────────────────────────
export const DEMO_NOTIFICATIONS: Notif[] = [
  { id: 'n1', title: 'Order Shipped', desc: 'Order ORD-240709-001 has been shipped by Alaba Direct Electronics', time: '2 hours ago', read: false, icon: 'cube', color: '#3b82f6' },
  { id: 'n2', title: 'Deposit Received', desc: '₦500,000 deposited via GTBank transfer', time: 'Today, 9:00 AM', read: false, icon: 'wallet', color: '#059669' },
  { id: 'n3', title: 'New Message', desc: 'Aba Textile Hub: Yes, we can do 200 yards at ₦4,200/yard', time: 'Today, 10:38 AM', read: true, icon: 'chatbubble', color: '#8b5cf6' },
  { id: 'n4', title: 'Delivery Confirmed', desc: 'Order ORD-240708-002 delivered. Confirm to release escrow.', time: 'Yesterday, 4:15 PM', read: false, icon: 'checkmark-circle', color: '#f59e0b' },
  { id: 'n5', title: 'Flash Deal Alert', desc: 'Samsung Galaxy A14 5G — Limited: ₦82,000 for orders of 50+', time: '1 day ago', read: true, icon: 'flash', color: '#ef4444' },
  { id: 'n6', title: 'Trust Score Update', desc: 'Your trust score increased to 94/100 after completing 5 deals', time: '2 days ago', read: true, icon: 'shield-checkmark', color: '#059669' },
];

// ─── Hero Banners ─────────────────────────────────────────────
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  colors: [string, string];
  icon: string;
}

export const BANNERS: Banner[] = [
  {
    id: 1, title: 'Trade with Confidence', subtitle: 'Escrow protection on every deal — your money stays safe',
    colors: ['#059669', '#047857'], icon: 'shield-checkmark',
  },
  {
    id: 2, title: '500K+ Verified Suppliers', subtitle: 'From Lagos to Cairo, Nairobi to Accra',
    colors: ['#0284c7', '#075985'], icon: 'globe',
  },
  {
    id: 3, title: 'Flash Deals Today', subtitle: 'Save up to 30% on bulk orders this week',
    colors: ['#d97706', '#b45309'], icon: 'flash',
  },
];
