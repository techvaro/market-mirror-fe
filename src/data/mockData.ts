export type Shop = {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  description: string;
  location: string;
  hours: string;
  bannerGradient: string;
  market: string;
  city: string;
  phone: string;
  shopNumber: string;
  images: string[];
};

export type Product = {
  id: number;
  shopId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  variants: string[];
  stock: boolean;
  rating: number;
  color: string;
};

export type Review = {
  id: number;
  shopId: number;
  reviewerName: string;
  rating: number;
  text: string;
};

export type Building = {
  id: number;
  name: string;
  description: string;
  location: string;
  shopCount: number;
  category: string;
  bannerGradient: string;
};

export type Service = {
  id: number;
  shopId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
};

export const shops: Shop[] = [
  {
    id: 1,
    name: 'TechCity Electronics',
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 342,
    productCount: 156,
    description: 'Your premium destination for authentic electronics, home theater systems, and smart home devices. We import directly from manufacturers.',
    location: 'Zone A Block 12, Alaba International Market',
    hours: '8am - 6pm (Mon - Sat)',
    bannerGradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    market: 'Alaba International Market',
    city: 'Lagos',
    phone: '+234 803 123 4567',
    shopNumber: 'Zone A, Suite 12',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    id: 2,
    name: 'PhoneHub Plus',
    category: 'Phones & Accessories',
    rating: 4.9,
    reviewCount: 892,
    productCount: 320,
    description: 'Latest smartphones, tablets, and premium accessories. Authorized dealer for Apple, Samsung, and Xiaomi.',
    location: 'Shop 14, Computer Village',
    hours: '8am - 6pm (Mon - Sat)',
    bannerGradient: 'linear-gradient(135deg, #4c1d95, #8b5cf6)',
    market: 'Computer Village',
    city: 'Lagos',
    phone: '+234 812 987 6543',
    shopNumber: 'Shop 14',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    id: 3,
    name: 'GlobalFabrics',
    category: 'Fabrics & Fashion',
    rating: 4.5,
    reviewCount: 128,
    productCount: 850,
    description: 'High-quality Ankara, lace, Senator materials, and pure cotton fabrics. Wholesale and retail available.',
    location: 'Hall 3 Shop 22, Trade Fair Complex',
    hours: '8am - 6pm (Mon - Sat)',
    bannerGradient: 'linear-gradient(135deg, #be123c, #f43f5e)',
    market: 'Trade Fair Complex',
    city: 'Lagos',
    phone: '+234 802 333 4444',
    shopNumber: 'Hall 3, Shop 22',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    id: 4,
    name: 'Kemis Home Appliances',
    category: 'Home Appliances',
    rating: 4.2,
    reviewCount: 245,
    productCount: 89,
    description: 'Durable and affordable home appliances: refrigerators, washing machines, microwaves, and blenders.',
    location: 'Zone D Block 8, Alaba International Market',
    hours: '8am - 6pm (Mon - Sat)',
    bannerGradient: 'linear-gradient(135deg, #047857, #10b981)',
    market: 'Alaba International Market',
    city: 'Lagos',
    phone: '+234 807 444 9900',
    shopNumber: 'Zone D, Suite 7',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1601752943749-7dd8d89f407a?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    id: 5,
    name: 'AutoParts Direct',
    category: 'Auto Parts',
    rating: 4.7,
    reviewCount: 412,
    productCount: 540,
    description: 'Genuine Toyota, Honda, and Mercedes spare parts. Engines, suspensions, and electrical components.',
    location: 'Zone E Block 15, Alaba International Market',
    hours: '8am - 6pm (Mon - Sat)',
    bannerGradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    market: 'Alaba International Market',
    city: 'Lagos',
    phone: '+234 809 666 3344',
    shopNumber: 'Zone E, Suite 15',
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    id: 6,
    name: 'BeautyGlow Lagos',
    category: 'Beauty',
    rating: 4.6,
    reviewCount: 560,
    productCount: 230,
    description: 'Original cosmetics, skincare, and fragrances. Professional beauty supplies for salons and individuals.',
    location: 'Hall 1 Shop 9, Trade Fair Complex',
    hours: '8am - 6pm (Mon - Sat)',
    bannerGradient: 'linear-gradient(135deg, #be185d, #ec4899)',
    market: 'Trade Fair Complex',
    city: 'Lagos',
    phone: '+234 806 222 8811',
    shopNumber: 'Hall 1, Shop 9',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=500&q=80',
    ],
  }
];

export const markets: string[] = [
  'Alaba International Market',
  'Computer Village',
  'Trade Fair Complex'
];

export const cities: string[] = [
  'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City',
  'Kaduna', 'Enugu', 'Aba', 'Onitsha', 'Warri', 'Calabar',
  'Jos', 'Abeokuta', 'Ogbomoso', 'Sokoto', 'Zaria', 'Ilorin'
];

export const cityMarkets: Record<string, string[]> = {
  'Lagos': ['Alaba International Market', 'Computer Village', 'Trade Fair Complex', 'Aspamda Market', 'Brotherhood Market'],
  'Abuja': ['Wuse Market', 'Garki Market', 'Kurudu Market', 'Nyanya Market'],
  'Kano': ['Kurmi Market', 'Sabon Gari Market', 'Singer Market', 'Dawanau Market'],
  'Ibadan': ['Bodija Market', 'Oje Market', 'Agbeni Market', 'Mokola Market'],
  'Port Harcourt': ['Mile 3 Market', 'D/Line Market', 'Artillery Market', 'Oil Mill Market'],
  'Benin City': ['Oba Market', 'Isonu Market', 'Oliha Market'],
  'Kaduna': ['Kurmi Market', 'Sabon Tasha Market', 'Singa Market'],
  'Enugu': ['Ogbete Market', 'Artisan Market', 'New Haven Market'],
  'Aba': ['Aba Main Market', 'Ahia Ohuru', 'Cemetery Market'],
  'Onitsha': ['Onitsha Main Market', 'Bridges Head Market', 'Ose-Okwodu Market'],
  'Warri': ['Effurun Market', 'Agbassa Market', 'Pessu Market'],
  'Calabar': ['Marian Market', 'Eight Miles Market', 'Ekpo Abasi Market'],
  'Jos': ['Terminus Market', 'Ahmadu Bello Way Market'],
  'Abeokuta': ['Kuto Market', 'Ita-Eko Market', 'Lafenwa Market'],
  'Ogbomoso': ['Sabongari Market', 'Oke-Ladipo Market'],
  'Sokoto': ['Kantho Market', 'Dambuwa Market'],
  'Zaria': ['Sabon Gari Market', 'Kwalker Market'],
  'Ilorin': ['Ole Market', 'Iddele Market', 'Tanke Market'],
};

export const products: Product[] = [
  // TechCity Electronics
  { id: 1, shopId: 1, name: 'LG 65-inch 4K Smart TV', description: 'Ultra HD smart television with webOS and Magic Remote.', category: 'Electronics', price: 450000, variants: ['65-inch', '75-inch'], stock: true, rating: 4.8, color: '#3b82f6' },
  { id: 2, shopId: 1, name: 'Sony PlayStation 5', description: 'Next-gen gaming console with DualSense controller.', category: 'Electronics', price: 380000, variants: ['Disc Edition', 'Digital Edition'], stock: true, rating: 4.9, color: '#1e3a8a' },
  { id: 3, shopId: 1, name: 'JBL PartyBox 310', description: 'Portable party speaker with built-in lights and powerful bass.', category: 'Electronics', price: 210000, variants: ['Black'], stock: false, rating: 4.7, color: '#2563eb' },
  { id: 4, shopId: 1, name: 'Hisense 1.5HP Inverter AC', description: 'Energy-saving air conditioner with copper condenser.', category: 'Electronics', price: 185000, variants: ['1.5HP', '2.0HP'], stock: true, rating: 4.5, color: '#60a5fa' },
  
  // PhoneHub Plus
  { id: 5, shopId: 2, name: 'iPhone 15 Pro Max', description: 'Titanium design, A17 Pro chip, 48MP main camera.', category: 'Phones & Accessories', price: 1250000, variants: ['256GB', '512GB', '1TB'], stock: true, rating: 4.9, color: '#8b5cf6' },
  { id: 6, shopId: 2, name: 'Samsung Galaxy S24 Ultra', description: 'AI-powered smartphone with S-Pen.', category: 'Phones & Accessories', price: 1150000, variants: ['256GB', '512GB'], stock: true, rating: 4.8, color: '#4c1d95' },
  { id: 7, shopId: 2, name: 'Oraimo Freepods 4', description: 'Active Noise Cancellation wireless earbuds.', category: 'Phones & Accessories', price: 25000, variants: ['Black', 'White'], stock: true, rating: 4.4, color: '#a78bfa' },
  { id: 8, shopId: 2, name: 'Anker 20000mAh Power Bank', description: 'Fast-charging portable charger.', category: 'Phones & Accessories', price: 18500, variants: ['Black'], stock: true, rating: 4.6, color: '#7c3aed' },

  // GlobalFabrics
  { id: 9, shopId: 3, name: 'Premium Swiss Lace (6 Yards)', description: 'High-quality Swiss voil lace for special occasions.', category: 'Fabrics', price: 35000, variants: ['White', 'Gold', 'Blue'], stock: true, rating: 4.7, color: '#f43f5e' },
  { id: 10, shopId: 3, name: 'Vlisco Hollandais Ankara', description: 'Original guaranteed Dutch wax print.', category: 'Fabrics', price: 28000, variants: ['6 Yards'], stock: true, rating: 4.8, color: '#be123c' },
  { id: 11, shopId: 3, name: 'Senator Material', description: 'Premium cashmere wool for men\'s native wear.', category: 'Fabrics', price: 15000, variants: ['Navy', 'Black', 'Grey'], stock: true, rating: 4.5, color: '#fb7185' },
  { id: 12, shopId: 3, name: 'Aso-Oke Gele', description: 'Hand-woven traditional headtie.', category: 'Fabrics', price: 12000, variants: ['Silver', 'Champagne'], stock: true, rating: 4.6, color: '#e11d48' },

  // Kemis Home Appliances
  { id: 13, shopId: 4, name: 'Haier Thermocool Chest Freezer', description: 'Fast-freeze technology, 100-hour cooling retention.', category: 'Home Appliances', price: 285000, variants: ['250L', '319L'], stock: true, rating: 4.5, color: '#10b981' },
  { id: 14, shopId: 4, name: 'Binatone Industrial Fan', description: 'High-speed standing fan for large spaces.', category: 'Home Appliances', price: 45000, variants: ['18-inch', '20-inch'], stock: true, rating: 4.3, color: '#047857' },
  { id: 15, shopId: 4, name: 'Kenwood Food Processor', description: 'Multi-functional blender, chopper, and mixer.', category: 'Home Appliances', price: 85000, variants: ['Silver'], stock: false, rating: 4.6, color: '#34d399' },
  { id: 16, shopId: 4, name: 'Century Gas Cooker', description: '4-burner table top gas cooker with stainless steel body.', category: 'Home Appliances', price: 32000, variants: ['Standard'], stock: true, rating: 4.2, color: '#059669' },

  // AutoParts Direct
  { id: 17, shopId: 5, name: 'Toyota Camry Shock Absorber', description: 'Original front shock absorbers for 2007-2011 models.', category: 'Auto Parts', price: 42000, variants: ['Front Pair', 'Rear Pair'], stock: true, rating: 4.7, color: '#f59e0b' },
  { id: 18, shopId: 5, name: 'Michelin Tyres 205/65R15', description: 'Durable tubeless tyres with excellent grip.', category: 'Auto Parts', price: 65000, variants: ['Single', 'Set of 4'], stock: true, rating: 4.8, color: '#b45309' },
  { id: 19, shopId: 5, name: 'Bosch Spark Plugs', description: 'Iridium spark plugs for better engine performance.', category: 'Auto Parts', price: 12000, variants: ['Set of 4', 'Set of 6'], stock: true, rating: 4.5, color: '#fbbf24' },
  { id: 20, shopId: 5, name: 'Honda Accord Brake Pads', description: 'Ceramic brake pads for smooth stopping.', category: 'Auto Parts', price: 18500, variants: ['Front', 'Rear'], stock: true, rating: 4.6, color: '#d97706' },

  // BeautyGlow Lagos
  { id: 21, shopId: 6, name: 'Fenty Beauty Foundation', description: 'Pro Filt\'r Soft Matte Longwear Foundation.', category: 'Beauty', price: 38000, variants: ['Shade 420', 'Shade 430', 'Shade 440'], stock: true, rating: 4.8, color: '#ec4899' },
  { id: 22, shopId: 6, name: 'Victoria\'s Secret Body Mist', description: 'Bare Vanilla fragrance mist.', category: 'Beauty', price: 15000, variants: ['250ml'], stock: true, rating: 4.7, color: '#be185d' },
  { id: 23, shopId: 6, name: 'MAC Ruby Woo Lipstick', description: 'Iconic vivid blue-red matte lipstick.', category: 'Beauty', price: 18500, variants: ['Standard'], stock: true, rating: 4.9, color: '#f472b6' },
  { id: 24, shopId: 6, name: 'Cerave Hydrating Cleanser', description: 'Face and body wash with ceramides and hyaluronic acid.', category: 'Beauty', price: 12500, variants: ['236ml', '473ml'], stock: true, rating: 4.6, color: '#db2777' },
];

export const reviews: Review[] = [
  { id: 1, shopId: 1, reviewerName: 'Chinedu Okafor', rating: 5, text: 'Bought my TV here. Original product and they helped me test it before leaving. Very reliable guys.' },
  { id: 2, shopId: 1, reviewerName: 'Amina Bello', rating: 4, text: 'Good prices compared to the mall. The shop was a bit crowded but the service was fast.' },
  { id: 3, shopId: 1, reviewerName: 'Tunde Bakare', rating: 5, text: 'I only buy my electronics from TechCity. Always authentic with warranty.' },
  { id: 4, shopId: 1, reviewerName: 'Ngozi Eze', rating: 4, text: 'Got a discount on the home theatre. Will definitely recommend them to anyone visiting Alaba.' },
  { id: 5, shopId: 1, reviewerName: 'Emeka Uzo', rating: 5, text: 'Solid guys. The generator I bought works perfectly fine.' },

  { id: 6, shopId: 2, reviewerName: 'Sarah Johnson', rating: 5, text: 'Swapped my old iPhone here, got a great deal on the 15 Pro. The boys know their stuff.' },
  { id: 7, shopId: 2, reviewerName: 'Ibrahim Musa', rating: 4, text: 'Very large selection of phone cases and accessories.' },
  { id: 8, shopId: 2, reviewerName: 'Funmi Ade', rating: 5, text: 'Authentic AirPods, verified the serial number on Apple website right there in the shop.' },
  { id: 9, shopId: 2, reviewerName: 'Kelechi O.', rating: 5, text: 'Always my plug for gadgets.' },
  { id: 10, shopId: 2, reviewerName: 'David N.', rating: 4, text: 'Quick repairs and good prices on screen replacements.' },

  { id: 11, shopId: 3, reviewerName: 'Mrs. Olawale', rating: 5, text: 'The lace quality is superb. They have the latest designs before anyone else in Lagos.' },
  { id: 12, shopId: 3, reviewerName: 'Chioma Obi', rating: 4, text: 'Bought aso-ebi for my wedding here. They gave me a good wholesale discount.' },
  { id: 13, shopId: 3, reviewerName: 'Bisi F.', rating: 5, text: 'Beautiful materials. The shop is well air-conditioned and comfortable to browse.' },
  { id: 14, shopId: 3, reviewerName: 'Grace E.', rating: 4, text: 'Good quality Ankara, colors don\'t wash out.' },
  { id: 15, shopId: 3, reviewerName: 'Amaka D.', rating: 5, text: 'My tailor recommended them and they didn\'t disappoint.' },

  { id: 16, shopId: 4, reviewerName: 'Mr. Peters', rating: 4, text: 'Bought a washing machine. Working well after 6 months.' },
  { id: 17, shopId: 4, reviewerName: 'Janet O.', rating: 5, text: 'The blender is very powerful. Nice customer service.' },
  { id: 18, shopId: 4, reviewerName: 'Segun A.', rating: 3, text: 'Had a small issue with delivery timing, but the freezer is top notch.' },
  { id: 19, shopId: 4, reviewerName: 'Mercy I.', rating: 4, text: 'Affordable prices for genuine appliances.' },
  { id: 20, shopId: 4, reviewerName: 'Uche M.', rating: 5, text: 'They tested everything before packing. Very professional.' },

  { id: 21, shopId: 5, reviewerName: 'Kazeem', rating: 5, text: 'Genuine parts only. My mechanic confirmed the shock absorbers are standard.' },
  { id: 22, shopId: 5, reviewerName: 'Okafor J.', rating: 4, text: 'Got a fairly used engine here, still running smooth.' },
  { id: 23, shopId: 5, reviewerName: 'Chidi B.', rating: 5, text: 'They know exactly what fits your car. Very knowledgeable.' },
  { id: 24, shopId: 5, reviewerName: 'Ayo T.', rating: 4, text: 'Good prices on tyres and batteries.' },
  { id: 25, shopId: 5, reviewerName: 'Sunny', rating: 5, text: 'The best plug for Honda parts in Alaba.' },

  { id: 26, shopId: 6, reviewerName: 'Toke M.', rating: 5, text: 'All products are authentic. No fake makeup here.' },
  { id: 27, shopId: 6, reviewerName: 'Anita P.', rating: 5, text: 'The perfumes last long. Original designers.' },
  { id: 28, shopId: 6, reviewerName: 'Yewande', rating: 4, text: 'Good wholesale prices for my salon.' },
  { id: 29, shopId: 6, reviewerName: 'Zainab', rating: 5, text: 'I love the customer service, they help you choose the right shade.' },
  { id: 30, shopId: 6, reviewerName: 'Evelyn', rating: 4, text: 'Always stocked with the latest skincare trends.' },
];

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Alaba International Market',
    description: 'The largest electronics and home appliance market in West Africa.',
    location: 'Ojo, Lagos',
    shopCount: 5000,
    category: 'Market Complex',
    bannerGradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
  },
  {
    id: 2,
    name: 'Trade Fair Complex',
    description: 'Major hub for cosmetics, jewelry, fabrics, and fashion accessories.',
    location: 'Badagry Expressway, Lagos',
    shopCount: 3500,
    category: 'Market Complex',
    bannerGradient: 'linear-gradient(135deg, #4c1d95, #8b5cf6)'
  },
  {
    id: 3,
    name: 'Computer Village',
    description: 'The prime ICT accessories and mobile phone hub of Nigeria.',
    location: 'Ikeja, Lagos',
    shopCount: 4000,
    category: 'Market Complex',
    bannerGradient: 'linear-gradient(135deg, #047857, #10b981)'
  }
];

export const services: Service[] = [
  { id: 1, shopId: 1, name: 'TV Installation & Setup', description: 'Professional mounting and configuration of smart TVs and home theaters.', category: 'Installation', price: 15000, rating: 4.8 },
  { id: 2, shopId: 2, name: 'Phone Screen Repair', description: 'Fast screen replacement for iPhones and Android devices.', category: 'Repair', price: 25000, rating: 4.9 },
  { id: 3, shopId: 3, name: 'Fabric Tailoring & Alterations', description: 'Custom fitting and sewing for lace and Ankara fabrics.', category: 'Tailoring', price: 10000, rating: 4.5 },
  { id: 4, shopId: 4, name: 'AC Installation & Servicing', description: 'Professional installation, gas refilling, and maintenance for air conditioners.', category: 'Maintenance', price: 18000, rating: 4.7 },
  { id: 5, shopId: 5, name: 'Car Diagnosis & Scanning', description: 'Comprehensive computerized vehicle check.', category: 'Auto Repair', price: 12000, rating: 4.6 },
  { id: 6, shopId: 1, name: 'Generator Repair', description: 'Servicing and repair for all types of household and industrial generators.', category: 'Repair', price: 15000, rating: 4.4 },
  { id: 7, shopId: 2, name: 'Laptop Repair', description: 'Board repairs, screen replacement, and OS installation.', category: 'Repair', price: 20000, rating: 4.5 },
];
