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
  country?: string;        // ISO country code e.g. 'NG', 'GH'
  image: string;
  images?: string[];       // multi-image gallery
  videoUrl?: string;       // optional video (use 'demo' for demo mode)
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

// ─── African Countries ────────────────────────────────────────
export interface AfricanCountry {
  code: string;
  name: string;
  flag: string;
}

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  { code: 'all', name: 'All Africa', flag: '🌍' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
];

// ─── Supplier Profile Types ───────────────────────────────────
export interface SupplierCertificate {
  id: string;
  name: string;
  issuer: string;
  number: string;
  issuedDate: string;
  expiryDate: string;
  type: 'registration' | 'quality' | 'safety' | 'export' | 'organic';
  verified: boolean;
  aiExtracted?: {
    businessName: string;
    rcNumber: string;
    directors: string[];
    address: string;
    businessType: string;
    status: 'Active' | 'Inactive' | 'Expired';
  };
}

export interface SupplierReview {
  id: string;
  buyer: string;
  buyerInitials: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  product: string;
}

export interface SupplierProfile {
  id: string;
  name: string;
  initials: string;
  avatarImage?: string;
  coverImage: string;
  description: string;
  location: string;
  storeAddress?: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  established: number;
  businessType: string;
  mainCategory: string;
  trustScore: number;
  totalDeals: number;
  successRate: number;
  responseTime: string;
  responseRate: number;
  deliveryRate: number;
  annualRevenue: string;
  employees: string;
  mainProducts: string[];
  certificates: SupplierCertificate[];
  galleryImages: string[];
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  verified: boolean;
  goldSupplier: boolean;
  tradeCapacity: {
    monthlyCapacity: string;
    exportCountries: string[];
    minOrder: string;
    leadTime: string;
    paymentTerms: string[];
  };
  reviews: SupplierReview[];
  overallRating: number;
  totalReviews: number;
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
  productId?: string;
  productName?: string;
  productImage?: string;
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
  weightKg?: number;
  sizeClass?: 'small' | 'medium' | 'large' | 'oversized';
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
  avatarImage?: string;
  role?: 'buyer' | 'seller';
  bankName: string;
  accountNumber: string;
  residentCountry?: string;
  residentCountryCode?: string;
  storeLocation?: string;
  storeAddress?: string;
  website?: string;
  businessDescription?: string;
}

export interface ProductLogistics {
  weightKg: number;
  sizeClass: 'small' | 'medium' | 'large' | 'oversized';
  originCountry: string;
}

export const PRODUCT_LOGISTICS: Record<string, ProductLogistics> = {
  '1': { weightKg: 0.4, sizeClass: 'small', originCountry: 'NG' },
  '2': { weightKg: 0.5, sizeClass: 'small', originCountry: 'NG' },
  '3': { weightKg: 50, sizeClass: 'large', originCountry: 'NG' },
  '4': { weightKg: 0.8, sizeClass: 'small', originCountry: 'NG' },
  '5': { weightKg: 3, sizeClass: 'medium', originCountry: 'NG' },
  '6': { weightKg: 2, sizeClass: 'medium', originCountry: 'NG' },
  '7': { weightKg: 25, sizeClass: 'large', originCountry: 'NG' },
  '8': { weightKg: 2, sizeClass: 'medium', originCountry: 'NG' },
  '9': { weightKg: 5, sizeClass: 'large', originCountry: 'NG' },
  '10': { weightKg: 0.4, sizeClass: 'small', originCountry: 'NG' },
  '11': { weightKg: 1, sizeClass: 'medium', originCountry: 'NG' },
  '12': { weightKg: 8, sizeClass: 'large', originCountry: 'NG' },
  '13': { weightKg: 18, sizeClass: 'large', originCountry: 'NG' },
  '14': { weightKg: 20, sizeClass: 'large', originCountry: 'NG' },
  '15': { weightKg: 1, sizeClass: 'small', originCountry: 'NG' },
  '16': { weightKg: 0.3, sizeClass: 'small', originCountry: 'NG' },
  '17': { weightKg: 0.2, sizeClass: 'small', originCountry: 'NG' },
  '18': { weightKg: 0.7, sizeClass: 'small', originCountry: 'NG' },
  '19': { weightKg: 10, sizeClass: 'large', originCountry: 'NG' },
  '20': { weightKg: 0.5, sizeClass: 'small', originCountry: 'GH' },
  '21': { weightKg: 0.3, sizeClass: 'small', originCountry: 'NG' },
  '22': { weightKg: 8, sizeClass: 'large', originCountry: 'NG' },
  '23': { weightKg: 0.2, sizeClass: 'small', originCountry: 'NG' },
  '24': { weightKg: 2, sizeClass: 'medium', originCountry: 'NG' },
  '25': { weightKg: 0.3, sizeClass: 'small', originCountry: 'NG' },
  '26': { weightKg: 25, sizeClass: 'large', originCountry: 'NG' },
  '27': { weightKg: 50, sizeClass: 'large', originCountry: 'NG' },
  '28': { weightKg: 35, sizeClass: 'large', originCountry: 'NG' },
  '29': { weightKg: 80, sizeClass: 'oversized', originCountry: 'NG' },
  '30': { weightKg: 5, sizeClass: 'medium', originCountry: 'NG' },
  '31': { weightKg: 18, sizeClass: 'large', originCountry: 'NG' },
  '32': { weightKg: 1, sizeClass: 'small', originCountry: 'NG' },
  '33': { weightKg: 0.4, sizeClass: 'small', originCountry: 'NG' },
  '34': { weightKg: 12, sizeClass: 'large', originCountry: 'NG' },
  '35': { weightKg: 25, sizeClass: 'oversized', originCountry: 'NG' },
  '36': { weightKg: 25, sizeClass: 'large', originCountry: 'NG' },
  '37': { weightKg: 4, sizeClass: 'medium', originCountry: 'NG' },
  '38': { weightKg: 2, sizeClass: 'medium', originCountry: 'NG' },
  '39': { weightKg: 0.4, sizeClass: 'small', originCountry: 'NG' },
  '40': { weightKg: 60, sizeClass: 'oversized', originCountry: 'NG' },
};

export const CURRENCY_META: Record<string, { code: string; symbol: string; rateToNGN: number }> = {
  NG: { code: 'NGN', symbol: '₦', rateToNGN: 1 },
  GH: { code: 'GHS', symbol: 'GH₵', rateToNGN: 105 },
  KE: { code: 'KES', symbol: 'KSh', rateToNGN: 11.5 },
  ZA: { code: 'ZAR', symbol: 'R', rateToNGN: 86 },
  EG: { code: 'EGP', symbol: 'E£', rateToNGN: 30.5 },
};

export function convertFromNGN(amount: number, countryCode: string) {
  const currency = CURRENCY_META[countryCode] ?? CURRENCY_META.NG;
  return amount / currency.rateToNGN;
}

export function calculateShippingFee(weightKg: number, sizeClass: ProductLogistics['sizeClass'], distanceKm: number, qty = 1) {
  const sizeMultiplier = { small: 1, medium: 1.35, large: 1.8, oversized: 2.8 }[sizeClass];
  const distanceBand = distanceKm <= 100 ? 1 : distanceKm <= 500 ? 1.35 : distanceKm <= 1500 ? 1.9 : 2.7;
  return Math.max(3500, Math.round((3500 + weightKg * 180 * qty) * sizeMultiplier * distanceBand));
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
  role: 'buyer',
  bankName: 'GTBank',
  accountNumber: '0123456789',
  residentCountry: 'Nigeria',
  residentCountryCode: 'NG',
  storeLocation: 'Balogun Market, Lagos Island',
  storeAddress: '12 Martins Street, Lagos Island, Lagos',
  website: 'www.okafortrading.com',
  businessDescription: 'Importer and distributor serving independent retailers across West Africa.',
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

// ─── Category taxonomy ────────────────────────────────────────
// The marketplace keeps discovery hierarchical: category → subcategory →
// type → brand → model. This is demo catalog data until seller catalog APIs
// are connected, but the shape is intentionally ready for those APIs.
export interface CategoryBrand {
  id: string;
  name: string;
  models: { id: string; name: string }[];
}

export interface CategoryType {
  id: string;
  name: string;
  count: number;
  brands: CategoryBrand[];
}

export interface CategorySubcategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  types: CategoryType[];
}

export interface CategoryTaxonomy {
  categoryId: string;
  subcategories: CategorySubcategory[];
}

const taxonomyBrand = (id: string, name: string, models: string[]): CategoryBrand => ({
  id,
  name,
  models: models.map((model, index) => ({ id: `${id}-${index + 1}`, name: model })),
});

const taxonomyType = (id: string, name: string, count: number, brands: CategoryBrand[]): CategoryType => ({
  id, name, count, brands,
});

const genericTaxonomy = (categoryId: string, labels: string[]): CategoryTaxonomy => ({
  categoryId,
  subcategories: labels.map((label, index) => ({
    id: `${categoryId}-${index + 1}`,
    name: label,
    icon: ['cube-outline', 'layers-outline', 'grid-outline'][index % 3],
    count: Math.max(24, 120 - index * 23),
    types: [
      taxonomyType(`${categoryId}-${index + 1}-standard`, 'Standard', 68 - index * 8, [
        taxonomyBrand(`${categoryId}-${index + 1}-brand-a`, 'AFRIQ Select', ['Trade Series', 'Pro Series']),
        taxonomyBrand(`${categoryId}-${index + 1}-brand-b`, 'Market Choice', ['Classic', 'Premium']),
      ]),
      taxonomyType(`${categoryId}-${index + 1}-premium`, 'Premium', 42 - index * 5, [
        taxonomyBrand(`${categoryId}-${index + 1}-brand-c`, 'Heritage', ['Signature', 'Executive']),
        taxonomyBrand(`${categoryId}-${index + 1}-brand-d`, 'Nova', ['Plus', 'Max']),
      ]),
    ],
  })),
});

type TaxonomySpec = {
  name: string;
  icon: string;
  types: {
    name: string;
    brands: { name: string; models: string[] }[];
  }[];
}[];

const curatedTaxonomy = (categoryId: string, specs: TaxonomySpec): CategoryTaxonomy => ({
  categoryId,
  subcategories: specs.map((subcategory, subcategoryIndex) => ({
    id: `${categoryId}-${subcategoryIndex + 1}`,
    name: subcategory.name,
    icon: subcategory.icon,
    count: subcategory.types.reduce((sum, type) => sum + type.brands.reduce((brandSum, brand) => brandSum + brand.models.length * 24, 0), 0),
    types: subcategory.types.map((type, typeIndex) => ({
      id: `${categoryId}-${subcategoryIndex + 1}-${typeIndex + 1}`,
      name: type.name,
      count: type.brands.reduce((sum, brand) => sum + brand.models.length * 24, 0),
      brands: type.brands.map((brand, brandIndex) => ({
        id: `${categoryId}-${subcategoryIndex + 1}-${typeIndex + 1}-brand-${brandIndex + 1}`,
        name: brand.name,
        models: brand.models.map((model, modelIndex) => ({
          id: `${categoryId}-${subcategoryIndex + 1}-${typeIndex + 1}-${brandIndex + 1}-${modelIndex + 1}`,
          name: model,
        })),
      })),
    })),
  })),
});

export const CATEGORY_TAXONOMY: Record<string, CategoryTaxonomy> = {
  textiles: {
    categoryId: 'textiles',
    subcategories: [
      { id: 'wax-fabrics', name: 'Wax Fabrics', icon: 'color-palette-outline', count: 340, types: [
        taxonomyType('ankara', 'Ankara / Wax Print', 156, [
          taxonomyBrand('hollandais', 'Hollandais', ['Premium Wax', 'Gold Edition', 'Vlisco Inspired']),
          taxonomyBrand('da viva', 'Da Viva', ['Classic Print', 'Royal Collection']),
          taxonomyBrand('super-wax', 'Super Wax', ['6 Yards', '12 Yards']),
        ]),
        taxonomyType('lace', 'Lace & Embroidery', 92, [
          taxonomyBrand('swiss-lace', 'Swiss Lace', ['Cord Lace', 'French Lace']),
          taxonomyBrand('austrian', 'Austrian', ['Crystal Lace', 'Floral Lace']),
        ]),
      ] },
      { id: 'ready-made', name: 'Ready-Made Garments', icon: 'shirt-outline', count: 210, types: [
        taxonomyType('dresses', 'Dresses', 94, [taxonomyBrand('afriq-fashion', 'AFRIQ Fashion', ['Maxi Dress', 'Kaftan']), taxonomyBrand('zara-trade', 'Zara Trade', ['Midi Dress', 'Work Dress'])]),
        taxonomyType('traditional-wear', 'Traditional Wear', 72, [taxonomyBrand('aso-oke', 'Aso Oke House', ['Agbada', 'Iro & Buba']), taxonomyBrand('kente-house', 'Kente House', ['Two Piece', 'Stole'])]),
      ] },
      { id: 'home-textiles', name: 'Home Textiles', icon: 'bed-outline', count: 128, types: [
        taxonomyType('curtains', 'Curtains & Blinds', 54, [taxonomyBrand('royal-drape', 'Royal Drape', ['Blackout', 'Sheer']), taxonomyBrand('home-luxe', 'Home Luxe', ['Eyelet', 'Roman'])]),
        taxonomyType('bedding', 'Bedding & Linen', 74, [taxonomyBrand('sleepwell', 'SleepWell', ['Queen Set', 'King Set']), taxonomyBrand('cotton-house', 'Cotton House', ['Hotel Grade', 'Organic'])]),
      ] },
    ],
  },
  electronics: {
    categoryId: 'electronics',
    subcategories: [
      { id: 'computers', name: 'Laptops & Computers', icon: 'laptop-outline', count: 492, types: [
        taxonomyType('laptops', 'Laptop', 208, [
          taxonomyBrand('hp', 'HP', ['EliteBook 840', 'ProBook 450', 'Pavilion 15']),
          taxonomyBrand('lenovo', 'Lenovo', ['ThinkPad T14', 'IdeaPad 3', 'Legion 5']),
          taxonomyBrand('dell', 'Dell', ['Latitude 5420', 'Inspiron 15', 'XPS 13']),
          taxonomyBrand('apple', 'Apple', ['MacBook Air M2', 'MacBook Pro M3']),
        ]),
        taxonomyType('desktop', 'Desktop Computer', 114, [taxonomyBrand('hp-desktop', 'HP', ['ProDesk 600', 'EliteDesk 800']), taxonomyBrand('dell-desktop', 'Dell', ['OptiPlex 7090', 'Precision 365'])]),
        taxonomyType('servers', 'Server', 38, [taxonomyBrand('dell-server', 'Dell', ['PowerEdge R640', 'PowerEdge T150']), taxonomyBrand('hp-server', 'HPE', ['ProLiant DL380', 'MicroServer Gen10'])]),
      ] },
      { id: 'mobile-phones', name: 'Mobile Phones & Tablets', icon: 'phone-portrait-outline', count: 780, types: [
        taxonomyType('smartphones', 'Smartphones', 420, [
          taxonomyBrand('samsung', 'Samsung', ['Galaxy A14', 'Galaxy A24', 'Galaxy S23']),
          taxonomyBrand('apple-iphone', 'Apple', ['iPhone 11', 'iPhone 13', 'iPhone 15']),
          taxonomyBrand('infinix', 'Infinix', ['Hot 40', 'Note 30', 'Zero 30']),
          taxonomyBrand('tecno', 'Tecno', ['Spark 10', 'Camon 20', 'Phantom V']),
        ]),
        taxonomyType('tablets', 'Tablets', 126, [taxonomyBrand('samsung-tab', 'Samsung', ['Galaxy Tab A8', 'Galaxy Tab S9']), taxonomyBrand('ipad', 'Apple', ['iPad 9th Gen', 'iPad Air'])]),
        taxonomyType('feature-phones', 'Feature Phones', 74, [taxonomyBrand('nokia', 'Nokia', ['105', '110', '2660 Flip']), taxonomyBrand('itel', 'itel', ['2160', 'Magic 2'])]),
      ] },
      { id: 'tv-video', name: 'TV & Video Equipment', icon: 'tv-outline', count: 366, types: [
        taxonomyType('smart-tv', 'Smart TV', 212, [taxonomyBrand('lg', 'LG', ['43-inch UHD', '55-inch NanoCell']), taxonomyBrand('hisense', 'Hisense', ['50-inch 4K', '65-inch ULED']), taxonomyBrand('tcl', 'TCL', ['43-inch Android TV', '55-inch QLED'])]),
        taxonomyType('projectors', 'Projectors', 58, [taxonomyBrand('epson', 'Epson', ['EB-E01', 'CO-FH02']), taxonomyBrand('viewsonic', 'ViewSonic', ['PA503W', 'PX701'])]),
      ] },
      { id: 'audio', name: 'Audio & Music Equipment', icon: 'musical-notes-outline', count: 281, types: [
        taxonomyType('speakers', 'Speakers', 143, [taxonomyBrand('jbl', 'JBL', ['Charge 5', 'PartyBox 110']), taxonomyBrand('sony', 'Sony', ['SRS-XP500', 'XB23'])]),
        taxonomyType('headphones', 'Headphones & Earbuds', 138, [taxonomyBrand('airpods', 'Apple', ['AirPods 2', 'AirPods Pro']), taxonomyBrand('oraimo', 'Oraimo', ['FreePods 4', 'Riff 2'])]),
      ] },
      { id: 'cameras', name: 'Photo & Video Cameras', icon: 'camera-outline', count: 185, types: [
        taxonomyType('dslr', 'DSLR & Mirrorless', 86, [taxonomyBrand('canon', 'Canon', ['EOS 90D', 'EOS R50']), taxonomyBrand('nikon', 'Nikon', ['D7500', 'Z50']), taxonomyBrand('sony-camera', 'Sony', ['A6400', 'A7 III'])]),
        taxonomyType('security-cameras', 'Security Cameras', 99, [taxonomyBrand('hikvision', 'Hikvision', ['ColorVu 2MP', 'Dome 4MP']), taxonomyBrand('dahua', 'Dahua', ['HDCVI 2MP', 'WizSense'])]),
      ] },
    ],
  },
  auto: {
    categoryId: 'auto',
    subcategories: [
      { id: 'vehicle-parts', name: 'Vehicle Parts & Accessories', icon: 'construct-outline', count: 2174, types: [
        taxonomyType('engine-parts', 'Engine Parts', 720, [taxonomyBrand('toyota-parts', 'Toyota Genuine', ['Corolla Engine', 'Camry Engine']), taxonomyBrand('bosch', 'Bosch', ['Injector', 'Alternator'])]),
        taxonomyType('brake-parts', 'Brake System', 410, [taxonomyBrand('brembo', 'Brembo', ['Front Disc', 'Rear Disc']), taxonomyBrand('akebono', 'Akebono', ['Ceramic Pad', 'ProACT Pad'])]),
        taxonomyType('body-parts', 'Body Parts', 380, [taxonomyBrand('toyota-body', 'Toyota', ['Corolla Bumper', 'Camry Bumper']), taxonomyBrand('honda-body', 'Honda', ['Civic Headlamp', 'Accord Grille'])]),
      ] },
      { id: 'cars', name: 'Cars', icon: 'car-outline', count: 1091, types: [
        taxonomyType('sedan', 'Sedan', 410, [taxonomyBrand('toyota-cars', 'Toyota', ['Corolla', 'Camry', 'Avalon']), taxonomyBrand('honda-cars', 'Honda', ['Civic', 'Accord']), taxonomyBrand('mercedes', 'Mercedes-Benz', ['C-Class', 'E-Class'])]),
        taxonomyType('suv', 'SUV', 352, [taxonomyBrand('lexus', 'Lexus', ['RX 350', 'GX 460']), taxonomyBrand('toyota-suv', 'Toyota', ['RAV4', 'Highlander', 'Land Cruiser']), taxonomyBrand('kia', 'Kia', ['Sportage', 'Sorento'])]),
        taxonomyType('pickup', 'Pickup Trucks', 118, [taxonomyBrand('ford', 'Ford', ['Ranger', 'F-150']), taxonomyBrand('hilux', 'Toyota', ['Hilux 2.8', 'Hilux Revo'])]),
      ] },
      { id: 'motorcycles', name: 'Motorcycles & Scooters', icon: 'bicycle-outline', count: 380, types: [
        taxonomyType('motorbikes', 'Motorbikes', 212, [taxonomyBrand('honda-moto', 'Honda', ['CB125', 'Ace 125']), taxonomyBrand('bajaj', 'Bajaj', ['Boxer 100', 'Pulsar 150'])]),
        taxonomyType('scooters', 'Scooters', 168, [taxonomyBrand('sym', 'SYM', ['Jet 14', 'Orbit']), taxonomyBrand('vespa', 'Vespa', ['Primavera', 'Sprint'])]),
      ] },
      { id: 'trucks', name: 'Trucks & Trailers', icon: 'bus-outline', count: 614, types: [
        taxonomyType('haulage-trucks', 'Haulage Trucks', 268, [taxonomyBrand('sinotruk', 'Sinotruk', ['Howo 371', 'Howo 336']), taxonomyBrand('scania', 'Scania', ['R-Series', 'P-Series'])]),
        taxonomyType('trailers', 'Trailers', 346, [taxonomyBrand('afriq-trailers', 'AFRIQ Haulage', ['Flatbed', 'Tanker']), taxonomyBrand('schmitz', 'Schmitz', ['Curtainsider', 'Reefer'])]),
      ] },
    ],
  },
  agriculture: curatedTaxonomy('agriculture', [
    { name: 'Grains & Cereals', icon: 'leaf-outline', types: [
      { name: 'Rice', brands: [{ name: 'Kebbi Farms', models: ['Long Grain 50kg', 'Premium Parboiled', 'Organic Brown Rice'] }, { name: 'Olam', models: ['Mama Gold', 'Royal Stallion'] }] },
      { name: 'Maize & Corn', brands: [{ name: 'North Harvest', models: ['Yellow Maize', 'White Maize'] }, { name: 'FarmCo', models: ['Corn Flour', 'Popcorn Grade'] }] },
    ] },
    { name: 'Farm Produce', icon: 'nutrition-outline', types: [
      { name: 'Vegetables', brands: [{ name: 'Green Basket', models: ['Fresh Pepper', 'Tomatoes', 'Onions'] }, { name: 'Jos Fresh', models: ['Cabbage', 'Carrot'] }] },
      { name: 'Tubers & Roots', brands: [{ name: 'Kano Agro', models: ['Yam Tubers', 'Cassava'] }, { name: 'Harvest Link', models: ['Sweet Potato', 'Ginger'] }] },
    ] },
    { name: 'Livestock & Poultry', icon: 'paw-outline', types: [
      { name: 'Poultry', brands: [{ name: 'Farm Fresh', models: ['Broilers', 'Layers', 'Day-Old Chicks'] }, { name: 'Apex Feeds', models: ['Starter Chicks', 'Point of Lay'] }] },
      { name: 'Animal Feed', brands: [{ name: 'TopFeed', models: ['Grower Mash', 'Finisher Mash'] }, { name: 'Coppens', models: ['Fish Feed 2mm', 'Fish Feed 4mm'] }] },
    ] },
  ]),
  beauty: curatedTaxonomy('beauty', [
    { name: 'Hair & Wigs', icon: 'cut-outline', types: [
      { name: 'Human Hair Bundles', brands: [{ name: 'Lekki Beauty', models: ['Brazilian Body Wave', 'Peruvian Straight', 'Raw Burmese'] }, { name: 'Royal Hair', models: ['HD Lace', 'Transparent Lace'] }] },
      { name: 'Wigs', brands: [{ name: 'Luxe Crown', models: ['Bob Wig', 'Frontal Wig', 'Glueless Wig'] }, { name: 'Beauty Hub', models: ['Pixie Cut', 'Water Wave'] }] },
    ] },
    { name: 'Skincare', icon: 'sparkles-outline', types: [
      { name: 'Face Care', brands: [{ name: 'CeraVe', models: ['Foaming Cleanser', 'Moisturising Cream'] }, { name: 'The Ordinary', models: ['Niacinamide', 'Hyaluronic Acid'] }] },
      { name: 'Body Care', brands: [{ name: 'Nivea', models: ['Radiant Lotion', 'Cocoa Butter'] }, { name: 'Vaseline', models: ['Cocoa Radiant', 'Intensive Care'] }] },
    ] },
    { name: 'Makeup & Cosmetics', icon: 'color-palette-outline', types: [
      { name: 'Makeup', brands: [{ name: 'Maybelline', models: ['Fit Me Foundation', 'SuperStay Matte'] }, { name: 'MAC', models: ['Studio Fix', 'Ruby Woo'] }] },
      { name: 'Fragrance', brands: [{ name: 'Lattafa', models: ['Khamrah', 'Yara'] }, { name: 'Jovan', models: ['Musk Oil', 'White Musk'] }] },
    ] },
  ]),
  home: curatedTaxonomy('home', [
    { name: 'Furniture', icon: 'bed-outline', types: [
      { name: 'Living Room', brands: [{ name: 'Home Luxe', models: ['L-Shaped Sofa', '3-Seater Sofa', 'Accent Chair'] }, { name: 'IKEA Trade', models: ['KALLAX Shelf', 'POÄNG Chair'] }] },
      { name: 'Bedroom', brands: [{ name: 'SleepWell', models: ['5ft Bed Frame', 'King Bed Frame'] }, { name: 'Royal Furniture', models: ['Wardrobe', 'Dresser'] }] },
    ] },
    { name: 'Kitchen & Dining', icon: 'restaurant-outline', types: [
      { name: 'Kitchen Appliances', brands: [{ name: 'Binatone', models: ['Blender 1.5L', 'Air Fryer 5L'] }, { name: 'Scanfrost', models: ['Gas Cooker', 'Microwave'] }] },
      { name: 'Tableware', brands: [{ name: 'Duralex', models: ['Glass Set', 'Dinner Set'] }, { name: 'Royal Table', models: ['Ceramic Set', 'Cutlery Set'] }] },
    ] },
    { name: 'Home Decor', icon: 'color-palette-outline', types: [
      { name: 'Lighting', brands: [{ name: 'Philips', models: ['LED Bulb 12W', 'Downlight'] }, { name: 'Luma', models: ['Pendant Light', 'Wall Sconce'] }] },
      { name: 'Rugs & Curtains', brands: [{ name: 'Royal Drape', models: ['Blackout Curtain', 'Sheer Curtain'] }, { name: 'Persian House', models: ['Area Rug', 'Runner Rug'] }] },
    ] },
  ]),
  food: curatedTaxonomy('food', [
    { name: 'Staples & Grains', icon: 'basket-outline', types: [
      { name: 'Rice', brands: [{ name: 'Kebbi Farms', models: ['Long Grain 50kg', 'Parboiled 25kg'] }, { name: 'Royal Stallion', models: ['Premium Rice', 'Classic Rice'] }] },
      { name: 'Flour & Semolina', brands: [{ name: 'Golden Penny', models: ['Wheat Flour 50kg', 'Semolina 10kg'] }, { name: 'Honeywell', models: ['Bread Flour', 'Pasta Flour'] }] },
    ] },
    { name: 'Drinks & Beverages', icon: 'wine-outline', types: [
      { name: 'Soft Drinks', brands: [{ name: 'Coca-Cola', models: ['Coke 50cl', 'Fanta 50cl'] }, { name: 'Pepsi', models: ['Pepsi 50cl', '7Up 50cl'] }] },
      { name: 'Water & Juice', brands: [{ name: 'Eva', models: ['Table Water', 'Flavoured Water'] }, { name: 'Chivita', models: ['100% Juice', 'Active Juice'] }] },
    ] },
    { name: 'Spices & Ingredients', icon: 'flask-outline', types: [
      { name: 'Cooking Oils', brands: [{ name: 'Devon Kings', models: ['Vegetable Oil 5L', 'Palm Oil 5L'] }, { name: 'Power Oil', models: ['Classic Oil', 'Canola Oil'] }] },
      { name: 'Seasonings', brands: [{ name: 'Knorr', models: ['Chicken Cube', 'Beef Cube'] }, { name: 'Maggi', models: ['Star Cube', 'Chicken Cube'] }] },
    ] },
  ]),
  construction: curatedTaxonomy('construction', [
    { name: 'Building Materials', icon: 'construct-outline', types: [
      { name: 'Cement', brands: [{ name: 'Dangote', models: ['3X Cement 50kg', 'BlocMaster'] }, { name: 'BUA', models: ['BUA Cement 50kg', 'Power Cement'] }] },
      { name: 'Steel & Roofing', brands: [{ name: 'African Steel', models: ['Iron Rod 12mm', 'Iron Rod 16mm'] }, { name: 'Tower Aluminium', models: ['Longspan 0.45mm', 'Stone Coated'] }] },
    ] },
    { name: 'Tools & Equipment', icon: 'hammer-outline', types: [
      { name: 'Power Tools', brands: [{ name: 'Bosch', models: ['GSH 500 Hammer', 'GWS Grinder'] }, { name: 'Makita', models: ['Cordless Drill', 'Angle Grinder'] }] },
      { name: 'Hand Tools', brands: [{ name: 'Stanley', models: ['Tool Set', 'Tape Measure'] }, { name: 'Ingco', models: ['Spanner Set', 'Claw Hammer'] }] },
    ] },
    { name: 'Safety Gear', icon: 'shield-checkmark-outline', types: [
      { name: 'Protective Wear', brands: [{ name: '3M', models: ['Safety Helmet', 'Reflective Vest'] }, { name: 'ProSafe', models: ['Work Boots', 'Coverall'] }] },
      { name: 'Site Safety', brands: [{ name: 'SiteGuard', models: ['Safety Cone', 'Barrier Tape'] }, { name: 'Honeywell', models: ['Ear Protection', 'Goggles'] }] },
    ] },
  ]),
  fashion: curatedTaxonomy('fashion', [
    { name: 'Men’s Fashion', icon: 'shirt-outline', types: [
      { name: 'Traditional Wear', brands: [{ name: 'Aso Oke House', models: ['Agbada Set', 'Senator Wear'] }, { name: 'Kente House', models: ['Kente Two-Piece', 'Stole'] }] },
      { name: 'Casual Wear', brands: [{ name: 'AFRIQ Basics', models: ['Polo Shirt', 'Cargo Trousers'] }, { name: 'Urban Trade', models: ['Hoodie', 'Denim Jacket'] }] },
    ] },
    { name: 'Women’s Fashion', icon: 'woman-outline', types: [
      { name: 'Dresses', brands: [{ name: 'Lagos Label', models: ['Maxi Dress', 'Midi Dress'] }, { name: 'Zara Trade', models: ['Work Dress', 'Party Dress'] }] },
      { name: 'Two-Piece Sets', brands: [{ name: 'Style House', models: ['Linen Set', 'Knit Set'] }, { name: 'Nairobi Fashion', models: ['Co-ord Set', 'Skirt Set'] }] },
    ] },
    { name: 'Shoes & Bags', icon: 'bag-handle-outline', types: [
      { name: 'Footwear', brands: [{ name: 'Nike', models: ['Air Force 1', 'Air Max'] }, { name: 'Adidas', models: ['Samba', 'Ultraboost'] }] },
      { name: 'Bags', brands: [{ name: 'Michael Kors', models: ['Tote Bag', 'Crossbody'] }, { name: 'Leather Works', models: ['Laptop Bag', 'Travel Bag'] }] },
    ] },
  ]),
  health: curatedTaxonomy('health', [
    { name: 'Medical Equipment', icon: 'medkit-outline', types: [
      { name: 'Diagnostic Equipment', brands: [{ name: 'Omron', models: ['Blood Pressure Monitor', 'Thermometer'] }, { name: 'Mindray', models: ['Patient Monitor', 'Ultrasound'] }] },
      { name: 'Hospital Furniture', brands: [{ name: 'MedCare', models: ['Hospital Bed', 'Examination Couch'] }, { name: 'Steris', models: ['Instrument Trolley', 'Mayo Stand'] }] },
    ] },
    { name: 'Pharmacy Supplies', icon: 'flask-outline', types: [
      { name: 'Dispensary', brands: [{ name: 'AFRIQ Medical', models: ['Pill Bottle Pack', 'Syringe Pack'] }, { name: 'BD', models: ['Safety Syringe', 'Needle Pack'] }] },
      { name: 'Consumables', brands: [{ name: 'Nipro', models: ['IV Set', 'Blood Set'] }, { name: 'Medline', models: ['Gloves Box', 'Face Mask Box'] }] },
    ] },
    { name: 'Wellness Products', icon: 'heart-outline', types: [
      { name: 'Vitamins', brands: [{ name: 'Centrum', models: ['Women Multivitamin', 'Adults Multivitamin'] }, { name: 'Wellman', models: ['Original', 'Sport'] }] },
      { name: 'Fitness Recovery', brands: [{ name: 'TheraBand', models: ['Resistance Band', 'Recovery Kit'] }, { name: 'Wellness Hub', models: ['Massage Gun', 'Foam Roller'] }] },
    ] },
  ]),
  office: curatedTaxonomy('office', [
    { name: 'Stationery', icon: 'pencil-outline', types: [
      { name: 'Writing Supplies', brands: [{ name: 'BIC', models: ['Cristal Pen Box', 'Round Stic Box'] }, { name: 'Stabilo', models: ['Boss Highlighter', 'Point Pen'] }] },
      { name: 'Paper Products', brands: [{ name: 'PaperOne', models: ['A4 Ream', 'A3 Ream'] }, { name: 'Double A', models: ['Premium A4', 'Colour Paper'] }] },
    ] },
    { name: 'Office Furniture', icon: 'briefcase-outline', types: [
      { name: 'Desks & Tables', brands: [{ name: 'WorkSpace', models: ['Executive Desk', 'Workstation'] }, { name: 'IKEA Trade', models: ['Linnmon Desk', 'Meeting Table'] }] },
      { name: 'Chairs', brands: [{ name: 'ErgoPro', models: ['Ergonomic Chair', 'Mesh Chair'] }, { name: 'Office Hub', models: ['Visitor Chair', 'Executive Chair'] }] },
    ] },
    { name: 'Printing Supplies', icon: 'print-outline', types: [
      { name: 'Printers', brands: [{ name: 'HP', models: ['LaserJet Pro', 'DeskJet 2710'] }, { name: 'Canon', models: ['Pixma G3420', 'i-SENSYS'] }] },
      { name: 'Ink & Toner', brands: [{ name: 'HP Original', models: ['LaserJet 107A', 'DeskJet 305'] }, { name: 'Epson', models: ['003 Ink', '664 Ink'] }] },
    ] },
  ]),
  sports: curatedTaxonomy('sports', [
    { name: 'Fitness Equipment', icon: 'barbell-outline', types: [
      { name: 'Strength Training', brands: [{ name: 'Lagos Fitness', models: ['Dumbbell Set', 'Olympic Barbell'] }, { name: 'Decathlon', models: ['Kettlebell', 'Weight Plates'] }] },
      { name: 'Cardio Equipment', brands: [{ name: 'ProForm', models: ['Treadmill', 'Exercise Bike'] }, { name: 'FitLine', models: ['Elliptical', 'Rowing Machine'] }] },
    ] },
    { name: 'Team Sports', icon: 'football-outline', types: [
      { name: 'Football', brands: [{ name: 'Nike', models: ['Academy Ball', 'Flight Ball'] }, { name: 'Adidas', models: ['Al Rihla', 'UCL Ball'] }] },
      { name: 'Basketball', brands: [{ name: 'Spalding', models: ['TF-500', 'Excel Ball'] }, { name: 'Molten', models: ['BG4500', 'B7G3800'] }] },
    ] },
    { name: 'Outdoor & Recreation', icon: 'bicycle-outline', types: [
      { name: 'Cycling', brands: [{ name: 'Giant', models: ['Escape 3', 'Talon 2'] }, { name: 'Trek', models: ['Marlin 5', 'FX 2'] }] },
      { name: 'Camping', brands: [{ name: 'Coleman', models: ['4-Person Tent', 'Cooler Box'] }, { name: 'NatureHike', models: ['Cloud Up Tent', 'Sleeping Bag'] }] },
    ] },
  ]),
  chemicals: curatedTaxonomy('chemicals', [
    { name: 'Industrial Chemicals', icon: 'flask-outline', types: [
      { name: 'Solvents', brands: [{ name: 'ChemTrade', models: ['Acetone 25L', 'Ethanol 25L'] }, { name: 'BASF', models: ['Industrial Solvent', 'Thinner'] }] },
      { name: 'Acids & Alkalis', brands: [{ name: 'AfricaChem', models: ['Caustic Soda', 'Sulphuric Acid'] }, { name: 'Nouryon', models: ['Hydrochloric Acid', 'Sodium Hydroxide'] }] },
    ] },
    { name: 'Cleaning Chemicals', icon: 'water-outline', types: [
      { name: 'Disinfectants', brands: [{ name: 'Dettol', models: ['Antiseptic 1L', 'Disinfectant 5L'] }, { name: 'Hypo', models: ['Bleach 5L', 'Bleach 25L'] }] },
      { name: 'Detergents', brands: [{ name: 'Omo', models: ['Powder 25kg', 'Liquid 5L'] }, { name: 'Ariel', models: ['Powder 25kg', 'Professional Liquid'] }] },
    ] },
    { name: 'Agricultural Chemicals', icon: 'leaf-outline', types: [
      { name: 'Fertilizer', brands: [{ name: 'Notore', models: ['Urea 50kg', 'NPK 15-15-15'] }, { name: 'Indorama', models: ['Urea Premium', 'NPK Blend'] }] },
      { name: 'Crop Protection', brands: [{ name: 'Syngenta', models: ['Herbicide 1L', 'Fungicide 1L'] }, { name: 'ADAMA', models: ['Insecticide 1L', 'Weed Control'] }] },
    ] },
  ]),
  machinery: curatedTaxonomy('machinery', [
    { name: 'Manufacturing Machinery', icon: 'cog-outline', types: [
      { name: 'Processing Machines', brands: [{ name: 'Nigerian Machine Tools', models: ['Lathe Machine', 'Milling Machine'] }, { name: 'Caterpillar', models: ['Industrial Loader', 'Compressor'] }] },
      { name: 'Packaging Machines', brands: [{ name: 'AFRIQ Industrial', models: ['Sealing Machine', 'Filling Machine'] }, { name: 'Bosch Rexroth', models: ['Conveyor', 'Labeler'] }] },
    ] },
    { name: 'Agricultural Machinery', icon: 'leaf-outline', types: [
      { name: 'Tractors', brands: [{ name: 'John Deere', models: ['5075E', '5050D'] }, { name: 'Massey Ferguson', models: ['MF 385', 'MF 290'] }] },
      { name: 'Harvesting', brands: [{ name: 'New Holland', models: ['Combine Harvester', 'Baler'] }, { name: 'Kubota', models: ['Reaper', 'Rice Transplanter'] }] },
    ] },
    { name: 'Industrial Tools', icon: 'hammer-outline', types: [
      { name: 'Compressors', brands: [{ name: 'Atlas Copco', models: ['GA 15', 'G7 Compressor'] }, { name: 'Ingersoll Rand', models: ['UP6', 'Air Receiver'] }] },
      { name: 'Welding Equipment', brands: [{ name: 'Lincoln Electric', models: ['Inverter 200A', 'MIG Welder'] }, { name: 'Miller', models: ['Thunderbolt', 'Millermatic'] }] },
    ] },
  ]),
  packaging: curatedTaxonomy('packaging', [
    { name: 'Bottles & Containers', icon: 'flask-outline', types: [
      { name: 'Plastic Bottles', brands: [{ name: 'PackRight', models: ['500ml PET', '1L PET', '5L Jerrycan'] }, { name: 'Nampak', models: ['HDPE Bottle', 'Trigger Bottle'] }] },
      { name: 'Glass Containers', brands: [{ name: 'GlassWorks', models: ['250ml Jar', '500ml Bottle'] }, { name: 'Frigoglass', models: ['Food Jar', 'Sauce Bottle'] }] },
    ] },
    { name: 'Bags & Pouches', icon: 'bag-outline', types: [
      { name: 'Nylon & Poly Bags', brands: [{ name: 'Yaba Packaging', models: ['HDPE 100 Micron', 'Carrier Bag'] }, { name: 'FlexPack', models: ['Flat Bag', 'Courier Bag'] }] },
      { name: 'Stand-Up Pouches', brands: [{ name: 'PackFlex', models: ['Zip Pouch', 'Spout Pouch'] }, { name: 'Pouch House', models: ['Kraft Pouch', 'Foil Pouch'] }] },
    ] },
    { name: 'Boxes & Cartons', icon: 'cube-outline', types: [
      { name: 'Corrugated Boxes', brands: [{ name: 'Carton Hub', models: ['3-Ply Carton', '5-Ply Carton'] }, { name: 'WestPack', models: ['Mailer Box', 'Shipping Box'] }] },
      { name: 'Retail Packaging', brands: [{ name: 'PrintPack', models: ['Printed Box', 'Folding Carton'] }, { name: 'BoxCraft', models: ['Gift Box', 'Display Box'] }] },
    ] },
  ]),
  toys: curatedTaxonomy('toys', [
    { name: 'Educational Toys', icon: 'school-outline', types: [
      { name: 'Learning Sets', brands: [{ name: 'Fisher-Price', models: ['Activity Cube', 'Shape Sorter'] }, { name: 'LEGO', models: ['Classic Bricks', 'Duplo Set'] }] },
      { name: 'Books & Puzzles', brands: [{ name: 'Scholastic', models: ['Story Set', 'Activity Book'] }, { name: 'Melissa & Doug', models: ['Wooden Puzzle', 'Learning Board'] }] },
    ] },
    { name: 'Baby Care', icon: 'happy-outline', types: [
      { name: 'Baby Feeding', brands: [{ name: 'NAN', models: ['Comfort 1', 'Optipro 2'] }, { name: 'Aptamil', models: ['First Infant', 'Follow On'] }] },
      { name: 'Baby Accessories', brands: [{ name: 'Tommee Tippee', models: ['Feeding Bottle', 'Sterilizer'] }, { name: 'Philips Avent', models: ['Natural Bottle', 'Bottle Warmer'] }] },
    ] },
    { name: 'Outdoor Toys', icon: 'football-outline', types: [
      { name: 'Ride-On Toys', brands: [{ name: 'Kids Ride', models: ['Electric Car', 'Balance Bike'] }, { name: 'Razor', models: ['Kick Scooter', 'Electric Scooter'] }] },
      { name: 'Games', brands: [{ name: 'Hasbro', models: ['Monopoly', 'Connect 4'] }, { name: 'Mattel', models: ['UNO', 'Barbie Set'] }] },
    ] },
  ]),
  jewelry: curatedTaxonomy('jewelry', [
    { name: 'Gold & Fine Jewelry', icon: 'diamond-outline', types: [
      { name: 'Necklaces & Chains', brands: [{ name: 'Gold House', models: ['18K Chain', 'Pendant Necklace'] }, { name: 'Cartier Trade', models: ['Love Chain', 'Trinity Pendant'] }] },
      { name: 'Rings & Bracelets', brands: [{ name: 'Royal Gold', models: ['Signet Ring', 'Bangle'] }, { name: 'Tiffany Trade', models: ['Band Ring', 'Link Bracelet'] }] },
    ] },
    { name: 'Fashion Jewelry', icon: 'sparkles-outline', types: [
      { name: 'Costume Jewelry', brands: [{ name: 'Lagos Beads', models: ['Beaded Necklace', 'Statement Set'] }, { name: 'Style Jewelry', models: ['Hoop Earrings', 'Layered Set'] }] },
      { name: 'Bridal Jewelry', brands: [{ name: 'Bridal Luxe', models: ['Tiara', 'Crystal Set'] }, { name: 'Pearl House', models: ['Pearl Strand', 'Bridal Drop'] }] },
    ] },
    { name: 'Watches', icon: 'watch-outline', types: [
      { name: 'Smart Watches', brands: [{ name: 'Apple', models: ['Watch Series 9', 'Watch SE'] }, { name: 'Samsung', models: ['Galaxy Watch 6', 'Galaxy Watch 5'] }] },
      { name: 'Classic Watches', brands: [{ name: 'Casio', models: ['G-Shock', 'Edifice'] }, { name: 'Fossil', models: ['Grant Chronograph', 'Caroline'] }] },
    ] },
  ]),
  cleaning: curatedTaxonomy('cleaning', [
    { name: 'Household Cleaning', icon: 'home-outline', types: [
      { name: 'Surface Care', brands: [{ name: 'Dettol', models: ['Antibacterial Spray', 'Floor Cleaner'] }, { name: 'Mr Muscle', models: ['Glass Cleaner', 'Kitchen Cleaner'] }] },
      { name: 'Toilet Care', brands: [{ name: 'Harpic', models: ['Toilet Gel', 'Power Plus'] }, { name: 'Duck', models: ['Fresh Discs', 'Deep Action'] }] },
    ] },
    { name: 'Janitorial Supplies', icon: 'brush-outline', types: [
      { name: 'Cleaning Tools', brands: [{ name: 'Vileda', models: ['Microfiber Mop', 'Window Squeegee'] }, { name: 'ProClean', models: ['Mop Bucket', 'Broom Set'] }] },
      { name: 'Waste Management', brands: [{ name: 'BinPro', models: ['240L Wheelie Bin', '60L Bin'] }, { name: 'CleanCity', models: ['Bin Liner Pack', 'Waste Cart'] }] },
    ] },
    { name: 'Laundry Products', icon: 'water-outline', types: [
      { name: 'Laundry Detergent', brands: [{ name: 'Omo', models: ['Powder 25kg', 'Liquid 5L'] }, { name: 'Ariel', models: ['Powder 25kg', 'Professional Liquid'] }] },
      { name: 'Fabric Care', brands: [{ name: 'Comfort', models: ['Softener 5L', 'Concentrate'] }, { name: 'Vanish', models: ['Stain Remover', 'White Powder'] }] },
    ] },
  ]),
  energy: curatedTaxonomy('energy', [
    { name: 'Solar Panels', icon: 'sunny-outline', types: [
      { name: 'Monocrystalline', brands: [{ name: 'Canadian Solar', models: ['450W Mono', '550W Mono'] }, { name: 'JinkoSolar', models: ['Tiger Neo 440W', 'Tiger Pro 550W'] }] },
      { name: 'Polycrystalline', brands: [{ name: 'SunTech', models: ['330W Poly', '370W Poly'] }, { name: 'Trina Solar', models: ['Vertex 400W', 'Poly 280W'] }] },
    ] },
    { name: 'Inverters & Batteries', icon: 'battery-charging-outline', types: [
      { name: 'Inverters', brands: [{ name: 'Luminous', models: ['1.5KVA Inverter', '3.5KVA Hybrid'] }, { name: 'Victron', models: ['MultiPlus II', 'EasySolar'] }] },
      { name: 'Batteries', brands: [{ name: 'GEL Battery', models: ['200Ah GEL', '100Ah GEL'] }, { name: 'Pylontech', models: ['US3000C', 'US5000'] }] },
    ] },
    { name: 'Generators', icon: 'flash-outline', types: [
      { name: 'Petrol Generators', brands: [{ name: 'Elemax', models: ['SH3900EX', 'SH7600EX'] }, { name: 'Sumec Firman', models: ['SPG3000', 'SPG5000'] }] },
      { name: 'Diesel Generators', brands: [{ name: 'Mikano', models: ['20KVA Diesel', '100KVA Diesel'] }, { name: 'Cummins', models: ['C33', 'C110'] }] },
    ] },
  ]),
};

export function getCategoryTaxonomy(categoryId: string): CategoryTaxonomy {
  if (categoryId === 'all') {
    return {
      categoryId: 'all',
      subcategories: CATEGORIES.filter(category => category.id !== 'all').map(category => ({
        id: category.id,
        name: category.name,
        icon: `${category.icon}-outline`,
        count: category.count,
        types: [taxonomyType(`${category.id}-catalog`, 'Browse catalog', category.count, [
          taxonomyBrand(`${category.id}-brand-a`, 'AFRIQ Select', ['Popular models', 'Trade series']),
          taxonomyBrand(`${category.id}-brand-b`, 'Market Choice', ['Classic', 'Premium']),
        ])],
      })),
    };
  }
  return CATEGORY_TAXONOMY[categoryId] ?? genericTaxonomy(categoryId, ['Popular Products', 'Trade Supplies', 'Professional Range']);
}

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
    location: 'VI, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80',
    rating: 4.5, reviews: 43, sold: 280,
    description: 'Grade A refurbished iPhone 14 Pro Max. 256GB, 6.7-inch Super Retina display. Battery health 90%+. 6-month warranty.',
    variants: ['128GB Space Black', '256GB Deep Purple', '512GB Gold'],
    delivery: '1–2 days', escrow: true,
    bulkPricing: [{ qty: 10, price: 430000 }],
    badge: 'NEW',
  },
  // ─── Extra products to fill sparse categories ────────────
  {
    id: '26', name: 'Premium Cassava Flour — 25kg Sacks', category: 'agriculture',
    price: 14500, moq: 20, unit: 'sacks', stock: 5000,
    supplier: 'Kebbi Farms Cooperative', supplierId: 'sup_003', supplierTrust: 95, supplierDeals: 1560,
    location: 'Birnin Kebbi, Kebbi', country: 'NG',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    rating: 4.6, reviews: 78, sold: 1800,
    description: 'Premium cassava flour, stone-free, finely milled. 25kg sacks. NAFDAC certified. Perfect for food manufacturers, bakeries, and restaurants.',
    variants: ['Standard Grade', 'Premium Sieved Grade'],
    delivery: '5–7 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 13500 }, { qty: 500, price: 12500 }],
  },
  {
    id: '27', name: 'Sesame Seeds — Export Grade, 50kg', category: 'agriculture',
    price: 55000, moq: 10, unit: 'bags', stock: 2000,
    supplier: 'Northern Shea Cooperative', supplierId: 'sup_022', supplierTrust: 93, supplierDeals: 780,
    location: 'Kano, Nigeria', country: 'NG',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80',
    rating: 4.8, reviews: 56, sold: 640,
    description: 'Export-grade white sesame seeds. Cleaned, sorted, 99.95% purity. Moisture < 6%. FDA/EU export documentation available. Perfect for international buyers.',
    variants: ['Hulled White', 'Natural Unhulled'],
    delivery: '4–7 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 52000 }, { qty: 200, price: 49000 }],
    badge: 'EXPORT',
  },
  {
    id: '28', name: 'Orthopedic Spring Mattress — 6×6ft Queen', category: 'home',
    price: 120000, moq: 5, unit: 'pieces', stock: 300,
    supplier: 'Lagos Office Furnishers', supplierId: 'sup_010', supplierTrust: 87, supplierDeals: 340,
    location: 'Ikeja, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    rating: 4.5, reviews: 89, sold: 560,
    description: 'High-density orthopedic spring mattress. 6×6ft queen size. Breathable pillow-top cover. 10-year spring warranty. Perfect for hotels, hostels, and residential furnishing.',
    variants: ['6×6ft Queen', '4×6ft Single', '5×6ft Standard'],
    delivery: '3–5 days', escrow: true,
    bulkPricing: [{ qty: 20, price: 112000 }, { qty: 50, price: 105000 }],
  },
  {
    id: '29', name: 'Modular Kitchen Cabinet Set — 10-piece', category: 'home',
    price: 350000, moq: 2, unit: 'sets', stock: 80,
    supplier: 'Lagos Office Furnishers', supplierId: 'sup_010', supplierTrust: 87, supplierDeals: 340,
    location: 'Ikeja, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80',
    rating: 4.4, reviews: 34, sold: 120,
    description: 'Modular 10-piece kitchen cabinet set. E1-grade MDF with anti-scratch laminate. Soft-close hinges. Perfect for developers, interior designers, and property managers.',
    variants: ['White Gloss', 'Grey Matt', 'Wood Grain Oak'],
    delivery: '5–8 days', escrow: true,
    bulkPricing: [{ qty: 5, price: 330000 }, { qty: 10, price: 310000 }],
    featured: true,
  },
  {
    id: '30', name: 'Castrol GTX 5W-30 Engine Oil — 5L', category: 'auto',
    price: 18000, moq: 50, unit: 'cans', stock: 4000,
    supplier: 'Ladipo Spare Parts Hub', supplierId: 'sup_006', supplierTrust: 89, supplierDeals: 780,
    location: 'Ladipo, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&q=80',
    rating: 4.8, reviews: 167, sold: 3400,
    description: 'Genuine Castrol GTX 5W-30 semi-synthetic engine oil. 5L cans. Suitable for petrol and diesel engines. Perfect for mechanics, fleet managers, and auto parts retailers.',
    variants: ['5W-30 5L', '20W-50 5L', '5W-40 Full Synthetic'],
    delivery: '1–2 days (Lagos)', escrow: true,
    bulkPricing: [{ qty: 100, price: 16500 }, { qty: 500, price: 15000 }],
  },
  {
    id: '31', name: 'Amaron Car Battery — 17 Plates 70Ah', category: 'auto',
    price: 58000, moq: 10, unit: 'units', stock: 500,
    supplier: 'Ladipo Spare Parts Hub', supplierId: 'sup_006', supplierTrust: 89, supplierDeals: 780,
    location: 'Ladipo, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80',
    rating: 4.7, reviews: 145, sold: 1200,
    description: 'Genuine Amaron Pro car battery. 70Ah, 17 plates, maintenance-free. 36-month warranty. Fits Toyota Camry, Corolla, Honda Accord, Kia and most sedans.',
    variants: ['70Ah Standard', '85Ah Heavy Duty', '100Ah Truck'],
    delivery: '1–2 days (Lagos)', escrow: true,
    bulkPricing: [{ qty: 30, price: 55000 }, { qty: 100, price: 52000 }],
  },
  {
    id: '32', name: 'Digital Blood Pressure Monitor — Arm Type', category: 'health',
    price: 32000, moq: 10, unit: 'units', stock: 800,
    supplier: 'Lagos Medical Supplies', supplierId: 'sup_009', supplierTrust: 94, supplierDeals: 670,
    location: 'Ikeja, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    rating: 4.6, reviews: 112, sold: 890,
    description: 'OMRON-certified digital blood pressure monitor. Arm type, auto-inflate. Memory for 2 users × 60 readings. WHO risk indicator. Perfect for pharmacies and clinics.',
    variants: ['Standard (arm)', 'Wrist Type', 'Professional Large Display'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 30000 }, { qty: 100, price: 28000 }],
  },
  {
    id: '33', name: 'Centrum Men Multivitamin — 120 Tablets Bulk', category: 'health',
    price: 22000, moq: 50, unit: 'bottles', stock: 3000,
    supplier: 'Lagos Medical Supplies', supplierId: 'sup_009', supplierTrust: 94, supplierDeals: 670,
    location: 'Ikeja, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80',
    rating: 4.7, reviews: 89, sold: 1400,
    description: 'Centrum Men multivitamin, 120 tablets per bottle. NAFDAC certified. Contains Vitamin D, B12, Zinc, and 22 key nutrients. For pharmacies, supermarkets, and wellness stores.',
    variants: ['Men 120-tab', 'Women 120-tab', 'Kids Chewable 60-tab'],
    delivery: '1–2 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 20000 }, { qty: 500, price: 18500 }],
  },
  {
    id: '34', name: 'Double A A4 Paper 80gsm — 5-Ream Box', category: 'office',
    price: 14500, moq: 50, unit: 'boxes', stock: 20000,
    supplier: 'Lagos Office Furnishers', supplierId: 'sup_010', supplierTrust: 87, supplierDeals: 340,
    location: 'Ikeja, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80',
    rating: 4.6, reviews: 234, sold: 12000,
    description: 'Double A 80gsm A4 copy paper. 500 sheets/ream, 5 reams/box. Jam-free, bright white (104% brightness). Perfect for offices, print shops, and schools.',
    variants: ['A4 80gsm (standard)', 'A3 80gsm', 'A4 75gsm Budget'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 200, price: 13500 }, { qty: 1000, price: 12800 }],
  },
  {
    id: '35', name: 'Honda GX200 Water Pump — 3-inch', category: 'machinery',
    price: 280000, moq: 1, unit: 'unit', stock: 120,
    supplier: 'Power Zone Nigeria', supplierId: 'sup_013', supplierTrust: 91, supplierDeals: 421,
    location: 'Ojo, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80',
    rating: 4.8, reviews: 67, sold: 340,
    description: 'Honda GX200-powered 3-inch centrifugal water pump. 1,100L/min flow rate, 26m max head. Suitable for construction sites, farms, and flood control.',
    variants: ['3-inch Standard', '4-inch Heavy Duty', '2-inch Lightweight'],
    delivery: '2–4 days', escrow: true,
    bulkPricing: [{ qty: 5, price: 265000 }],
  },
  {
    id: '36', name: 'Dulux Trade Weathershield Paint — 20L', category: 'chemicals',
    price: 65000, moq: 20, unit: 'buckets', stock: 2000,
    supplier: 'Apapa Chemical Traders', supplierId: 'sup_012', supplierTrust: 85, supplierDeals: 289,
    location: 'Apapa, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80',
    rating: 4.5, reviews: 78, sold: 450,
    description: 'Dulux Trade Weathershield exterior paint. 20L buckets. 15-year color guarantee. UV resistant, anti-algae, waterproof. Perfect for property developers and painting contractors.',
    variants: ['Brilliant White', 'Magnolia', 'Sandstone', 'Custom Color Mix'],
    delivery: '2–4 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 62000 }, { qty: 100, price: 59000 }],
  },
  {
    id: '37', name: 'HDPE Nylon Bags 100 Micron — 1,000 pcs', category: 'packaging',
    price: 12000, moq: 100, unit: 'packs', stock: 50000,
    supplier: 'Yaba Packaging Solutions', supplierId: 'sup_014', supplierTrust: 93, supplierDeals: 567,
    location: 'Yaba, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80',
    rating: 4.4, reviews: 89, sold: 8900,
    description: 'High-density HDPE nylon bags, 100 micron thickness. 1,000 pieces per pack. Sizes 8×12 to 16×24 inches. Food-grade certified. Perfect for retail, food packaging, and markets.',
    variants: ['8×12 inch', '10×14 inch', '12×18 inch', '16×24 inch'],
    delivery: '2–4 days', escrow: true,
    bulkPricing: [{ qty: 500, price: 11000 }, { qty: 1000, price: 10000 }],
  },
  {
    id: '38', name: "Fisher-Price Educational Toy Set — 3–6yrs", category: 'toys',
    price: 18000, moq: 20, unit: 'sets', stock: 500,
    supplier: 'Baby Care Distributors', supplierId: 'sup_015', supplierTrust: 92, supplierDeals: 345,
    location: 'Gbagada, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80',
    rating: 4.8, reviews: 134, sold: 1800,
    description: 'Fisher-Price educational toy set for ages 3–6. Includes shape sorter, stacking rings, and activity cube. BPA-free, non-toxic paint. NAFDAC approved.',
    variants: ['3–6 Years Set', '6–12 Months Set', '1–3 Years Set'],
    delivery: '1–3 days', escrow: true,
    bulkPricing: [{ qty: 50, price: 16500 }, { qty: 100, price: 15500 }],
  },
  {
    id: '39', name: 'NAN Comfort 1 Baby Formula — 400g (Case)', category: 'toys',
    price: 8500, moq: 50, unit: 'tins', stock: 5000,
    supplier: 'Baby Care Distributors', supplierId: 'sup_015', supplierTrust: 92, supplierDeals: 345,
    location: 'Gbagada, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80',
    rating: 4.9, reviews: 278, sold: 4500,
    description: 'NAN Comfort 1 starter baby formula for 0–6 months. 400g tins. NAFDAC registered. Reduced lactose formula for colic and gas. For pharmacies and supermarkets.',
    variants: ['Stage 1 (0–6m)', 'Stage 2 (6–12m)', 'Stage 3 (12m+)'],
    delivery: '1–2 days', escrow: true,
    bulkPricing: [{ qty: 100, price: 8000 }, { qty: 500, price: 7500 }],
  },
  {
    id: '40', name: 'Chrome Dumbbells Set — 5kg to 30kg Pairs', category: 'sports',
    price: 185000, moq: 2, unit: 'sets', stock: 80,
    supplier: 'Lagos Fitness Equipment', supplierId: 'sup_011', supplierTrust: 86, supplierDeals: 156,
    location: 'Lekki, Lagos', country: 'NG',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
    rating: 4.6, reviews: 45, sold: 230,
    description: 'Commercial chrome dumbbell set — 5kg to 30kg pairs (12 pairs total) with A-frame rack. Knurled grip, anti-roll end caps. Perfect for gyms, hotels, and corporate wellness.',
    variants: ['5–30kg with rack', '5–20kg compact set', '10–40kg pro set'],
    delivery: '5–7 days', escrow: true,
    bulkPricing: [{ qty: 5, price: 175000 }],
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
    productId: '1', productName: 'Premium Hollandais Ankara Wax Fabrics',
    productImage: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&q=80',
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
    productId: '2', productName: 'Samsung Galaxy A14 5G — 64GB Bulk',
    productImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80',
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

// ─── Product Gallery ──────────────────────────────────────────
// 3–4 images + optional videoUrl per product. Main image first.
const T1 = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80';
const T2 = 'https://images.unsplash.com/photo-1521572163474-6863f1d88fbf?w=800&q=80';
const T3 = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80&fit=crop&crop=entropy';
const E1 = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80';
const E2 = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80';
const E3 = 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80';
const F1 = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80';
const F2 = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80';
const F3 = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80';
const B1 = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80';
const B2 = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80';
const H1 = 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb5f0?w=800&q=80';
const H2 = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80';
const C1 = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80';
const C2 = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80';
const G1 = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80';
const S1 = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80';
const M1 = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80';
const P1 = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80';
const J1 = 'https://images.unsplash.com/photo-1617197336240-46c9e17f7f36?w=800&q=80';
const CL1 = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80';
const CH1 = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80';
const TR1 = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80';
const AU1 = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80';
const BB1 = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80';

export const PRODUCT_GALLERY: Record<string, { images: string[]; videoUrl?: string }> = {
  '1':  { images: [T1, T2, T3] },
  '2':  { images: [E1, E2, E3], videoUrl: 'demo' },
  '3':  { images: [F1, F2, F3] },
  '4':  { images: [B1, B2, B1] },
  '5':  { images: [H1, H2, H1] },
  '6':  { images: [AU1, G1, AU1] },
  '7':  { images: [F2, F1, F3] },
  '8':  { images: [E2, E1, E3] },
  '9':  { images: [C1, C2, C1] },
  '10': { images: [T2, T1, T3] },
  '11': { images: [M1, CL1, M1] },
  '12': { images: [H2, H1, H2] },
  '13': { images: [G1, S1, C1], videoUrl: 'demo' },
  '14': { images: [CH1, CL1, CH1] },
  '15': { images: [P1, C2, P1] },
  '16': { images: [BB1, M1, BB1] },
  '17': { images: [J1, B1, J1] },
  '18': { images: [CL1, CH1, CL1] },
  '19': { images: [S1, G1, S1], videoUrl: 'demo' },
  '20': { images: [T3, T2, T1] },
  '21': { images: [F3, F1, F2] },
  '22': { images: [C2, C1, C2] },
  '23': { images: [B2, B1, B2] },
  '24': { images: [TR1, G1, TR1], videoUrl: 'demo' },
  '25': { images: [E3, E1, E2], videoUrl: 'demo' },
  '26': { images: [F1, F2, F3] },
  '27': { images: [F3, F1, F2] },
  '28': { images: [H1, H2, H1] },
  '29': { images: [H2, H1, H2] },
  '30': { images: [AU1, G1, AU1] },
  '31': { images: [G1, AU1, G1] },
  '32': { images: [M1, B2, M1] },
  '33': { images: [B2, M1, B2] },
  '34': { images: [P1, H2, P1] },
  '35': { images: [G1, S1, G1], videoUrl: 'demo' },
  '36': { images: [CH1, CL1, CH1] },
  '37': { images: [P1, C2, P1] },
  '38': { images: [BB1, M1, BB1] },
  '39': { images: [BB1, B2, BB1] },
  '40': { images: [TR1, G1, TR1] },
};

// ─── Product Country Codes ────────────────────────────────────
export const PRODUCT_COUNTRY: Record<string, string> = {
  '1':'NG','2':'NG','3':'NG','4':'NG','5':'NG',
  '6':'NG','7':'NG','8':'NG','9':'NG','10':'NG',
  '11':'NG','12':'NG','13':'NG','14':'NG','15':'NG',
  '16':'NG','17':'NG','18':'NG','19':'NG','20':'GH',
  '21':'NG','22':'NG','23':'NG','24':'NG','25':'NG',
  '26':'NG','27':'NG','28':'NG','29':'NG','30':'NG',
  '31':'NG','32':'NG','33':'NG','34':'NG','35':'NG',
  '36':'NG','37':'NG','38':'NG','39':'NG','40':'NG',
};

// ─── Supplier Profiles ────────────────────────────────────────
export const SUPPLIERS: Record<string, SupplierProfile> = {
  'sup_001': {
    id: 'sup_001', name: 'Aba Textile Hub', initials: 'AT',
    coverImage: T1,
    description: 'Aba Textile Hub is one of Southeast Nigeria\'s largest wholesale fabric suppliers. Established in 2008 in Aba, Abia State — the fashion capital of West Africa. We specialize in Ankara wax prints, plain cotton fabrics, and bulk garments. Over 2,300 verified transactions with a 97% satisfaction rate.',
    location: 'Aba, Abia State', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 2008, businessType: 'Manufacturer & Wholesaler', mainCategory: 'textiles',
    trustScore: 97, totalDeals: 2340, successRate: 97, responseTime: '< 1 hour',
    responseRate: 96, deliveryRate: 98, annualRevenue: '₦500M–₦1B', employees: '51–200',
    mainProducts: ['Hollandais Ankara Wax Fabric', 'Plain Cotton Fabrics', 'Bulk T-Shirts', 'Lace Fabrics', 'Kente Cloth'],
    certificates: [
      { id: 'cert_at1', name: 'CAC Certificate of Incorporation', issuer: 'Corporate Affairs Commission, Nigeria', number: 'RC 1087234', issuedDate: 'Mar 12, 2008', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Aba Textile Hub Limited', rcNumber: 'RC 1087234', directors: ['Emmanuel Chijioke Eze', 'Ngozi Adaeze Eze'], address: '14 Factory Road, Aba, Abia State', businessType: 'Private Limited Company', status: 'Active' } },
      { id: 'cert_at2', name: 'SON Product Certification', issuer: 'Standards Organisation of Nigeria', number: 'SON/MANCAP/2022/04781', issuedDate: 'Jan 5, 2022', expiryDate: 'Jan 4, 2025', type: 'quality', verified: true,
        aiExtracted: { businessName: 'Aba Textile Hub Limited', rcNumber: 'RC 1087234', directors: ['Emmanuel Chijioke Eze'], address: '14 Factory Road, Aba, Abia State', businessType: 'Textile Manufacturer', status: 'Active' } },
    ],
    galleryImages: [T1, T2, T3, C2],
    phone: '+234 803 111 2340', whatsapp: '+2348031112340', email: 'sales@abatextilehub.com', website: 'www.abatextilehub.com',
    verified: true, goldSupplier: true,
    tradeCapacity: { monthlyCapacity: '500,000 yards', exportCountries: ['Nigeria', 'Ghana', 'Benin', 'Cameroon', 'UK'], minOrder: '50 yards', leadTime: '3–5 days', paymentTerms: ['Escrow', 'Bank Transfer', 'POS on pickup'] },
    reviews: [
      { id: 'r1', buyer: 'Fatima Abubakar Designs', buyerInitials: 'FA', rating: 5, comment: 'Best fabric supplier in Nigeria. Consistent quality every time. Fast delivery to Kano. Already placed 8 orders this year.', date: 'Jul 8, 2024', verified: true, product: 'Hollandais Ankara Wax Fabrics' },
      { id: 'r2', buyer: 'Chukwuemeka Stores Lagos', buyerInitials: 'CS', rating: 5, comment: 'Ordered 2,000 yards for our boutique. Arrived perfectly packed. Colors exactly as shown. Will order again next month.', date: 'Jun 20, 2024', verified: true, product: 'Hollandais Ankara Wax Fabrics' },
      { id: 'r3', buyer: 'Mama Africa Textiles GH', buyerInitials: 'MA', rating: 4, comment: 'Good quality but one batch had slight color variation from the sample. They replaced it promptly. Respect for their customer service.', date: 'Jun 5, 2024', verified: true, product: 'Plain Cotton Fabrics' },
      { id: 'r4', buyer: 'Taiwo Fashion House', buyerInitials: 'TF', rating: 5, comment: 'Using AFRIQ escrow gave me confidence for my first big order. ₦840,000 secured safely. Delivery confirmed in 4 days. Excellent!', date: 'May 28, 2024', verified: true, product: 'Hollandais Ankara Wax Fabrics' },
    ],
    overallRating: 4.8, totalReviews: 128,
  },
  'sup_002': {
    id: 'sup_002', name: 'Alaba Direct Electronics', initials: 'AD',
    coverImage: E1,
    description: 'Alaba Direct Electronics sources directly from Samsung, LG, and TCL regional distributors. Based in the world-famous Alaba International Market, Lagos. We supply mobile phones, TVs, and home electronics to retailers across West Africa with genuine warranty documentation.',
    location: 'Alaba, Lagos', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 2015, businessType: 'Authorized Distributor', mainCategory: 'electronics',
    trustScore: 91, totalDeals: 890, successRate: 93, responseTime: '< 30 mins',
    responseRate: 98, deliveryRate: 97, annualRevenue: '₦1B–₦5B', employees: '11–50',
    mainProducts: ['Samsung Galaxy Phones', 'Smart LED TVs', 'iPhone (Refurbished)', 'Home Theatres', 'Laptop Computers'],
    certificates: [
      { id: 'cert_ad1', name: 'CAC Certificate of Incorporation', issuer: 'Corporate Affairs Commission, Nigeria', number: 'RC 1456782', issuedDate: 'Aug 20, 2015', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Alaba Direct Electronics Limited', rcNumber: 'RC 1456782', directors: ['Chike Okonkwo', 'Blessing Okonkwo'], address: 'Shop 23, Zone B, Alaba International Market, Lagos', businessType: 'Private Limited Company', status: 'Active' } },
      { id: 'cert_ad2', name: 'NCC Dealer Authorization', issuer: 'Nigerian Communications Commission', number: 'NCC/DEALER/2023/0892', issuedDate: 'Feb 14, 2023', expiryDate: 'Feb 13, 2026', type: 'export', verified: true,
        aiExtracted: { businessName: 'Alaba Direct Electronics Limited', rcNumber: 'RC 1456782', directors: ['Chike Okonkwo'], address: 'Shop 23, Zone B, Alaba International Market, Lagos', businessType: 'Telecommunications Equipment Dealer', status: 'Active' } },
    ],
    galleryImages: [E1, E2, E3, G1],
    phone: '+234 805 222 3456', whatsapp: '+2348052223456', email: 'orders@alabadirect.ng',
    verified: true, goldSupplier: false,
    tradeCapacity: { monthlyCapacity: '2,000 units', exportCountries: ['Nigeria', 'Ghana', 'Benin', 'Togo', 'Cameroon'], minOrder: '5 units', leadTime: 'Same day (Lagos)', paymentTerms: ['Escrow', 'Bank Transfer', 'Cash on delivery (Lagos)'] },
    reviews: [
      { id: 'r5', buyer: 'Kano Phone Palace', buyerInitials: 'KP', rating: 5, comment: 'Ordered 30 Samsung A14 phones. All sealed, genuine IMEI, Nigerian warranty. Delivered to Kano in 2 days via AFRIQ logistics. Brilliant.', date: 'Jul 7, 2024', verified: true, product: 'Samsung Galaxy A14 5G' },
      { id: 'r6', buyer: 'Blessed Electronics PH', buyerInitials: 'BE', rating: 4, comment: 'Good products. Only complaint is the packaging could be better for long-distance delivery. 1 phone screen cracked in transit but they replaced it.', date: 'Jun 15, 2024', verified: true, product: 'Samsung Galaxy A14 5G' },
      { id: 'r7', buyer: 'Delta Tech Gadgets', buyerInitials: 'DT', rating: 5, comment: 'Best electronics supplier on AFRIQ. 5 orders, zero issues. Prices beat every market in Lagos.', date: 'May 30, 2024', verified: true, product: '32-inch Smart LED TV' },
    ],
    overallRating: 4.6, totalReviews: 64,
  },
  'sup_003': {
    id: 'sup_003', name: 'Kebbi Farms Cooperative', initials: 'KF',
    coverImage: F1,
    description: 'Kebbi Farms Cooperative is an association of 430+ rice farmers in Kebbi State, Nigeria — the rice bowl of West Africa. We sell premium long-grain parboiled rice directly from farm to market, cutting out middlemen. Every bag carries our seal of freshness and stone-free guarantee.',
    location: 'Birnin Kebbi, Kebbi State', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 2016, businessType: 'Farmers Cooperative', mainCategory: 'agriculture',
    trustScore: 95, totalDeals: 1560, successRate: 96, responseTime: '< 3 hours',
    responseRate: 91, deliveryRate: 96, annualRevenue: '₦500M–₦1B', employees: '51–200',
    mainProducts: ['Long Grain Parboiled Rice 50kg', 'Premium Organic Rice', 'Millet (50kg)', 'Sorghum', 'Maize'],
    certificates: [
      { id: 'cert_kf1', name: 'CAC Certificate (Cooperative Society)', issuer: 'Corporate Affairs Commission, Nigeria', number: 'CS 234891', issuedDate: 'May 3, 2016', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Kebbi State Integrated Farms Cooperative Society', rcNumber: 'CS 234891', directors: ['Alhaji Musa Aliyu (President)', 'Hajiya Ramatu Usman (Secretary)', 'Ibrahim Garba (Treasurer)'], address: 'No. 5 Farmers House Road, Birnin Kebbi, Kebbi State', businessType: 'Cooperative Society', status: 'Active' } },
      { id: 'cert_kf2', name: 'NAFDAC Product Registration', issuer: 'National Agency for Food & Drug Administration and Control', number: 'NAFDAC/FBR/2021/09234', issuedDate: 'Sep 1, 2021', expiryDate: 'Aug 31, 2024', type: 'safety', verified: true,
        aiExtracted: { businessName: 'Kebbi State Integrated Farms Cooperative Society', rcNumber: 'CS 234891', directors: ['Alhaji Musa Aliyu'], address: 'No. 5 Farmers House Road, Birnin Kebbi, Kebbi State', businessType: 'Food Producer & Wholesaler', status: 'Active' } },
    ],
    galleryImages: [F1, F2, F3, C2],
    phone: '+234 806 333 4567', whatsapp: '+2348063334567', email: 'info@kebbifarms.ng',
    verified: true, goldSupplier: true,
    tradeCapacity: { monthlyCapacity: '50,000 bags', exportCountries: ['Nigeria', 'Niger', 'Ghana', 'Senegal'], minOrder: '20 bags (50kg)', leadTime: '5–7 days', paymentTerms: ['Escrow', 'Bank Transfer', 'Cooperative Credit'] },
    reviews: [
      { id: 'r8', buyer: 'Abuja Supermart Ltd', buyerInitials: 'AS', rating: 5, comment: 'This rice is absolutely fresh. We\'ve been ordering 100 bags/month for 8 months. Stone-free, well parboiled. Our customers love it.', date: 'Jul 5, 2024', verified: true, product: 'Nigerian Long Grain Rice' },
      { id: 'r9', buyer: 'Chop Better Restaurants', buyerInitials: 'CB', rating: 5, comment: 'Best rice on AFRIQ. The organic variant is perfect for our premium menu. Delivery to Lekki was on time.', date: 'Jun 22, 2024', verified: true, product: 'Premium Organic Rice 50kg' },
      { id: 'r10', buyer: 'North Central Distributors', buyerInitials: 'NC', rating: 4, comment: 'Good quality, pricing is fair. One batch had slightly higher moisture content than usual. They offered a discount and it was resolved.', date: 'Jun 8, 2024', verified: true, product: 'Nigerian Long Grain Rice' },
    ],
    overallRating: 4.9, totalReviews: 312,
  },
  'sup_004': {
    id: 'sup_004', name: 'Lekki Beauty Wholesale', initials: 'LB',
    coverImage: B1,
    description: 'Lekki Beauty Wholesale is Lagos\'s premier B2B hair and cosmetics distributor. Directly importing from trusted manufacturers in Brazil, Vietnam, and India. We serve salons, beauty boutiques, and retail chains across Nigeria with guaranteed authentic products.',
    location: 'Lekki Phase 1, Lagos', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 2019, businessType: 'Importer & Distributor', mainCategory: 'beauty',
    trustScore: 88, totalDeals: 430, successRate: 91, responseTime: '< 2 hours',
    responseRate: 94, deliveryRate: 93, annualRevenue: '₦100M–₦500M', employees: '11–50',
    mainProducts: ['Brazilian Virgin Hair', 'Peruvian Hair Bundles', 'Cosmetics Wholesale', 'Shea Butter Products', 'Hair Care Sets'],
    certificates: [
      { id: 'cert_lb1', name: 'CAC Certificate of Incorporation', issuer: 'Corporate Affairs Commission, Nigeria', number: 'RC 1782345', issuedDate: 'Jun 15, 2019', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Lekki Beauty Wholesale Limited', rcNumber: 'RC 1782345', directors: ['Adaeze Osei-Mensah', 'Kelvin Osei-Mensah'], address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos', businessType: 'Private Limited Company', status: 'Active' } },
      { id: 'cert_lb2', name: 'NAFDAC Cosmetics Registration', issuer: 'National Agency for Food & Drug Administration and Control', number: 'NAFDAC/CPR/2022/06123', issuedDate: 'Apr 20, 2022', expiryDate: 'Apr 19, 2025', type: 'safety', verified: true,
        aiExtracted: { businessName: 'Lekki Beauty Wholesale Limited', rcNumber: 'RC 1782345', directors: ['Adaeze Osei-Mensah'], address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos', businessType: 'Cosmetics Importer & Distributor', status: 'Active' } },
    ],
    galleryImages: [B1, B2, J1, T2],
    phone: '+234 807 444 5678', whatsapp: '+2348074445678', email: 'orders@lekkibeauty.ng',
    verified: true, goldSupplier: false,
    tradeCapacity: { monthlyCapacity: '2,000 bundles', exportCountries: ['Nigeria', 'Ghana', 'South Africa'], minOrder: '5 bundles', leadTime: '2–3 days', paymentTerms: ['Escrow', 'Bank Transfer', 'Pay on Delivery (Lagos)'] },
    reviews: [
      { id: 'r11', buyer: 'Glam Studio Lagos', buyerInitials: 'GL', rating: 5, comment: 'Best quality Brazilian hair I\'ve ever resold. Clients keep coming back. Highly recommend for salon owners.', date: 'Jul 3, 2024', verified: true, product: 'Brazilian Human Hair Bundles' },
      { id: 'r12', buyer: 'Beauty Town Abuja', buyerInitials: 'BT', rating: 4, comment: 'Authentic hair, good quality. Delivery was slightly delayed but they communicated well. Overall solid supplier.', date: 'Jun 10, 2024', verified: true, product: 'Brazilian Human Hair Bundles' },
    ],
    overallRating: 4.7, totalReviews: 89,
  },
  'sup_007': {
    id: 'sup_007', name: 'Delta Palm Oil Mill', initials: 'DP',
    coverImage: F2,
    description: 'Delta Palm Oil Mill is a family-owned palm oil processing company in Warri, Delta State with over 30 years of operation. We produce 100% pure red palm oil and palm kernel oil directly from our 120-hectare plantation. Export certified, NAFDAC registered, and trusted by food manufacturers across Nigeria.',
    location: 'Warri, Delta State', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 1993, businessType: 'Manufacturer', mainCategory: 'food',
    trustScore: 96, totalDeals: 1890, successRate: 98, responseTime: '< 4 hours',
    responseRate: 90, deliveryRate: 97, annualRevenue: '₦500M–₦1B', employees: '51–200',
    mainProducts: ['Red Palm Oil 25L', 'Palm Kernel Oil', 'Organic Palm Oil', 'Palm Kernel Cake (Animal Feed)', 'Palmolein'],
    certificates: [
      { id: 'cert_dp1', name: 'CAC Certificate of Incorporation', issuer: 'Corporate Affairs Commission, Nigeria', number: 'RC 456712', issuedDate: 'Oct 8, 1993', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Delta Palm Oil Mill Company Limited', rcNumber: 'RC 456712', directors: ['Chief Ebinimi Johnson', 'Mrs Ebinimi Perekebina', 'Tamaradon Ebinimi'], address: '12 Mill Road, Effurun, Warri, Delta State', businessType: 'Private Limited Company', status: 'Active' } },
      { id: 'cert_dp2', name: 'NAFDAC Food Manufacturing License', issuer: 'National Agency for Food & Drug Administration and Control', number: 'NAFDAC/FML/1998/00345', issuedDate: 'Mar 14, 1998', expiryDate: 'Mar 13, 2026', type: 'safety', verified: true,
        aiExtracted: { businessName: 'Delta Palm Oil Mill Company Limited', rcNumber: 'RC 456712', directors: ['Chief Ebinimi Johnson'], address: '12 Mill Road, Effurun, Warri, Delta State', businessType: 'Food Manufacturer', status: 'Active' } },
      { id: 'cert_dp3', name: 'NXP Export Permit', issuer: 'Nigerian Export Promotion Council', number: 'NEPC/EXP/2023/07812', issuedDate: 'Feb 2, 2023', expiryDate: 'Feb 1, 2025', type: 'export', verified: true,
        aiExtracted: { businessName: 'Delta Palm Oil Mill Company Limited', rcNumber: 'RC 456712', directors: ['Chief Ebinimi Johnson'], address: '12 Mill Road, Effurun, Warri, Delta State', businessType: 'Agricultural Products Exporter', status: 'Active' } },
    ],
    galleryImages: [F2, F1, F3, C2],
    phone: '+234 803 555 6789', whatsapp: '+2348035556789', email: 'export@deltapalmoil.com',
    verified: true, goldSupplier: true,
    tradeCapacity: { monthlyCapacity: '5,000 jerrycans (25L)', exportCountries: ['Nigeria', 'Ghana', 'UK', 'Germany', 'USA'], minOrder: '30 cans', leadTime: '4–6 days', paymentTerms: ['Escrow', 'LC (Letter of Credit)', 'Bank Transfer'] },
    reviews: [
      { id: 'r13', buyer: 'Afrofoods Manufacturing', buyerInitials: 'AF', rating: 5, comment: '30-year-old company with impeccable quality. Our food factory has used their palm oil for 6 years. NAFDAC inspection always passes.', date: 'Jul 2, 2024', verified: true, product: 'Pure Red Palm Oil 25L' },
      { id: 'r14', buyer: 'Nourish Nigeria Ltd', buyerInitials: 'NN', rating: 5, comment: 'Export quality oil. Clean, no sediment, perfect color. The organic variant is even better. Fast nationwide delivery.', date: 'Jun 14, 2024', verified: true, product: 'Organic Palm Oil 25L' },
    ],
    overallRating: 4.9, totalReviews: 203,
  },
  'sup_008': {
    id: 'sup_008', name: 'Dangote Direct Partners', initials: 'DD',
    coverImage: C1,
    description: 'Dangote Direct Partners is an authorized distributor for Dangote Cement — Nigeria\'s #1 cement brand. We operate 3 distribution depots in Ogun State, serving construction companies, block manufacturers, and civil engineering firms. Factory-direct pricing, authentic Dangote brand.',
    location: 'Ibeshe, Ogun State', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 2010, businessType: 'Authorized Distributor', mainCategory: 'construction',
    trustScore: 99, totalDeals: 5600, successRate: 99, responseTime: '< 2 hours',
    responseRate: 99, deliveryRate: 99, annualRevenue: '> ₦5B', employees: '200+',
    mainProducts: ['Dangote Cement 42.5R 50kg', 'Dangote Cement 32.5R', 'Building Sand', 'Granite 3/4"', 'Iron Rods'],
    certificates: [
      { id: 'cert_dd1', name: 'CAC Certificate of Incorporation', issuer: 'Corporate Affairs Commission, Nigeria', number: 'RC 987234', issuedDate: 'Apr 22, 2010', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Dangote Direct Partners Nigeria Limited', rcNumber: 'RC 987234', directors: ['Bolaji Adeyemo', 'Funke Adeyemo', 'Tobi Adeyemo'], address: '2 Industrial Estate Road, Ibeshe, Ogun State', businessType: 'Private Limited Company', status: 'Active' } },
      { id: 'cert_dd2', name: 'SON Certification of Conformity', issuer: 'Standards Organisation of Nigeria', number: 'SON/COC/2023/01122', issuedDate: 'Jan 10, 2023', expiryDate: 'Jan 9, 2026', type: 'quality', verified: true,
        aiExtracted: { businessName: 'Dangote Direct Partners Nigeria Limited', rcNumber: 'RC 987234', directors: ['Bolaji Adeyemo'], address: '2 Industrial Estate Road, Ibeshe, Ogun State', businessType: 'Building Materials Distributor', status: 'Active' } },
    ],
    galleryImages: [C1, C2, G1, P1],
    phone: '+234 802 666 7890', whatsapp: '+2348026667890', email: 'bulk@dangotepartners.ng',
    verified: true, goldSupplier: true,
    tradeCapacity: { monthlyCapacity: '500,000 bags', exportCountries: ['Nigeria', 'Niger', 'Benin', 'Cameroon'], minOrder: '100 bags', leadTime: '1–3 days', paymentTerms: ['Escrow', 'Bank Transfer', 'Cash (depot pickup)'] },
    reviews: [
      { id: 'r15', buyer: 'Bricks & Steel Construction', buyerInitials: 'BS', rating: 5, comment: 'Been buying from Dangote Direct for 4 years. Price is factory-direct, delivery never fails. Over 200 orders on AFRIQ without a single issue.', date: 'Jul 6, 2024', verified: true, product: 'Portland Cement 50kg' },
      { id: 'r16', buyer: 'Federal Roads Contractors', buyerInitials: 'FR', rating: 5, comment: 'Largest cement order we\'ve placed — 50,000 bags for a major road project. Delivered in 3 batches within 5 days. Professional.', date: 'May 20, 2024', verified: true, product: 'Portland Cement 50kg' },
    ],
    overallRating: 4.9, totalReviews: 890,
  },
  'sup_018': {
    id: 'sup_018', name: 'GreenPower Nigeria', initials: 'GP',
    coverImage: S1,
    description: 'GreenPower Nigeria is Abuja\'s leading solar energy equipment wholesaler. We supply monocrystalline and polycrystalline solar panels, inverters, batteries, and complete solar kits to installers and energy companies across Nigeria. All products carry manufacturer warranties and SON certification.',
    location: 'Wuse 2, Abuja FCT', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    established: 2017, businessType: 'Importer & Wholesaler', mainCategory: 'energy',
    trustScore: 93, totalDeals: 289, successRate: 95, responseTime: '< 3 hours',
    responseRate: 93, deliveryRate: 96, annualRevenue: '₦100M–₦500M', employees: '11–50',
    mainProducts: ['Monocrystalline Solar Panels', 'Hybrid Inverters', 'Lithium Solar Batteries', 'Solar Street Lights', 'Complete Off-Grid Solar Kits'],
    certificates: [
      { id: 'cert_gp1', name: 'CAC Certificate of Incorporation', issuer: 'Corporate Affairs Commission, Nigeria', number: 'RC 1698234', issuedDate: 'Mar 30, 2017', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'GreenPower Nigeria Limited', rcNumber: 'RC 1698234', directors: ['Dr. Amaechi Nnaji', 'Chidera Nnaji'], address: 'Plot 7, Wuse Zone 5, Abuja FCT', businessType: 'Private Limited Company', status: 'Active' } },
      { id: 'cert_gp2', name: 'NERC Licensed Electricity Dealer', issuer: 'Nigerian Electricity Regulatory Commission', number: 'NERC/DL/2022/00456', issuedDate: 'Jul 15, 2022', expiryDate: 'Jul 14, 2025', type: 'quality', verified: true,
        aiExtracted: { businessName: 'GreenPower Nigeria Limited', rcNumber: 'RC 1698234', directors: ['Dr. Amaechi Nnaji'], address: 'Plot 7, Wuse Zone 5, Abuja FCT', businessType: 'Electricity Equipment Dealer', status: 'Active' } },
    ],
    galleryImages: [S1, G1, C1, E1],
    phone: '+234 809 777 8901', whatsapp: '+2348097778901', email: 'sales@greenpowernigeria.com',
    verified: true, goldSupplier: false,
    tradeCapacity: { monthlyCapacity: '500 panels', exportCountries: ['Nigeria', 'Niger', 'Chad', 'Cameroon'], minOrder: '5 units', leadTime: '3–5 days', paymentTerms: ['Escrow', 'Bank Transfer', 'Installment (50/50)'] },
    reviews: [
      { id: 'r17', buyer: 'Sun Energy Installers', buyerInitials: 'SE', rating: 5, comment: 'Top-notch monocrystalline panels. 21.5% efficiency as claimed. Our clients are very happy. Will order 100 more next month.', date: 'Jul 4, 2024', verified: true, product: '300W Monocrystalline Solar Panel' },
      { id: 'r18', buyer: 'Rural Light Foundation', buyerInitials: 'RL', rating: 5, comment: 'Donated 50 solar panels to 5 rural communities. All working perfectly after 6 months. Fast delivery to Nasarawa State.', date: 'Jun 18, 2024', verified: true, product: '300W Monocrystalline Solar Panel' },
    ],
    overallRating: 4.8, totalReviews: 112,
  },
  'sup_019': {
    id: 'sup_019', name: 'Kumasi Weave House', initials: 'KW',
    coverImage: T3,
    description: 'Kumasi Weave House is a certified artisan cooperative from Kumasi, Ghana — home of the world-famous Kente cloth. We export authentic hand-woven Kente fabric directly from master weavers. Each piece carries a weaver\'s certificate of authenticity and is registered with the Ghana Export Promotion Authority.',
    location: 'Kumasi, Ashanti Region', country: 'Ghana', countryCode: 'GH', countryFlag: '🇬🇭',
    established: 2003, businessType: 'Artisan Cooperative & Exporter', mainCategory: 'textiles',
    trustScore: 91, totalDeals: 678, successRate: 94, responseTime: '< 6 hours',
    responseRate: 87, deliveryRate: 92, annualRevenue: 'GH₵1M–₵5M', employees: '51–200',
    mainProducts: ['Hand-Woven Kente Cloth', 'Adinkra Fabric', 'Kente Accessories', 'Traditional Smock (Fugu)', 'Custom Ceremonial Kente'],
    certificates: [
      { id: 'cert_kw1', name: 'Registrar General Certificate (Ghana)', issuer: "Registrar General's Department, Ghana", number: 'CS042890', issuedDate: 'Nov 5, 2003', expiryDate: 'Perpetual', type: 'registration', verified: true,
        aiExtracted: { businessName: 'Kumasi Weavers Cooperative Society', rcNumber: 'CS042890', directors: ['Nana Kwame Asante (President)', 'Abena Boateng (Secretary)', 'Kofi Mensah (Treasurer)'], address: 'House No. 12, Kente Lane, Bonwire, Kumasi, Ashanti', businessType: 'Cooperative Society', status: 'Active' } },
      { id: 'cert_kw2', name: 'Ghana Export Promotion Certificate', issuer: 'Ghana Export Promotion Authority', number: 'GEPA/REG/2021/04512', issuedDate: 'Jan 12, 2021', expiryDate: 'Jan 11, 2026', type: 'export', verified: true,
        aiExtracted: { businessName: 'Kumasi Weavers Cooperative Society', rcNumber: 'CS042890', directors: ['Nana Kwame Asante'], address: 'House No. 12, Kente Lane, Bonwire, Kumasi, Ashanti', businessType: 'Textile Exporter', status: 'Active' } },
    ],
    galleryImages: [T3, T1, T2, B1],
    phone: '+233 24 111 2222', whatsapp: '+233241112222', email: 'export@kumasiweavehouse.gh',
    verified: true, goldSupplier: false,
    tradeCapacity: { monthlyCapacity: '5,000 yards', exportCountries: ['Ghana', 'Nigeria', 'UK', 'USA', 'Germany', 'France'], minOrder: '20 yards', leadTime: '7–10 days', paymentTerms: ['Escrow', 'Bank Transfer (USD/EUR/NGN)', 'PayPal'] },
    reviews: [
      { id: 'r19', buyer: 'Accra Fashion Week HQ', buyerInitials: 'AF', rating: 5, comment: 'The most authentic Kente I\'ve sourced for our fashion shows. The weaver certificates add so much credibility. Highly recommended.', date: 'Jun 30, 2024', verified: true, product: 'Kente Cloth Woven Fabric' },
      { id: 'r20', buyer: 'Diaspora Gifts London', buyerInitials: 'DG', rating: 4, comment: 'Beautiful traditional fabric. Shipping from Ghana took 10 days as expected. Packaging was excellent. Will order custom ceremonial piece next.', date: 'Jun 12, 2024', verified: true, product: 'Custom Ceremonial Kente' },
    ],
    overallRating: 4.9, totalReviews: 89,
  },
};
