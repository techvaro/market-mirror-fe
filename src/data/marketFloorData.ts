// Rich floor-plan data for the interactive market map.
// Each zone maps to a list of shops with owner/stall details.

export type FloorShop = {
  id: string;
  /** Corresponding mockData shop page id — used to navigate to /shop/:shopPageId */
  shopPageId: number;
  name: string;
  owner: string;
  stall: string;
  phone: string;
  category: string;
  description: string;
  image: string;
};

export type FloorZone = {
  id: string;
  name: string;
  category: string;
  color: string;
  /** Leaflet CRS.Simple bounds [[southLat, westLng], [northLat, eastLng]] */
  bounds: [[number, number], [number, number]];
  shops: FloorShop[];
};

export const floorZones: FloorZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A',
    category: 'Electronics',
    color: '#3b82f6',
    bounds: [[-70, 20], [-30, 50]],
    shops: [
      {
        id: 'techcity',
        shopPageId: 1,
        name: 'TechCity Electronics',
        owner: 'Chief Linus Okafor',
        stall: 'Zone A Suite 12',
        phone: '+234 803 123 4567',
        category: 'Electronics',
        description: 'Premium electronics dealer specialising in televisions, laptops, and computer accessories. Serving customers across Lagos since 2005.',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'phonehub',
        shopPageId: 2,
        name: 'PhoneHub Plus',
        owner: 'Alhaji Musa Ibrahim',
        stall: 'Zone A Suite 22',
        phone: '+234 812 987 6543',
        category: 'Electronics',
        description: 'Your one-stop destination for smartphones, tablets, and accessories at the best prices in Computer Village. Authorised reseller for Samsung & Tecno.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    id: 'zone-b',
    name: 'Zone B',
    category: 'Phones & Gadgets',
    color: '#8b5cf6',
    bounds: [[-45, 55], [-15, 90]],
    shops: [
      {
        id: 'globalfabrics',
        shopPageId: 3,
        name: 'GlobalFabrics',
        owner: 'Mrs. Chioma Adebayo',
        stall: 'Zone B Suite 5',
        phone: '+234 802 333 4444',
        category: 'Phones & Gadgets',
        description: 'Wide selection of quality fabrics, lace, ankara and designer textiles imported from across West Africa and beyond.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'gadgetworld',
        shopPageId: 2,
        name: 'GadgetWorld NG',
        owner: 'Mr. Taiwo Salami',
        stall: 'Zone B Suite 11',
        phone: '+234 806 555 7890',
        category: 'Phones & Gadgets',
        description: 'Dealers in smart watches, Bluetooth accessories, power banks, and all mobile phone peripherals at wholesale prices.',
        image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    id: 'zone-c',
    name: 'Zone C',
    category: 'Fabrics',
    color: '#f43f5e',
    bounds: [[-95, 15], [-75, 40]],
    shops: [
      {
        id: 'abuja-fabrics',
        shopPageId: 3,
        name: 'Abuja Fabrics Hub',
        owner: 'Hajia Fatima Bello',
        stall: 'Zone C Suite 3',
        phone: '+234 805 222 1111',
        category: 'Fabrics',
        description: 'Specialising in high-end Nigerian fabrics including aso-oke, george, and quality imported lace and embroidered materials.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'lagos-lace',
        shopPageId: 3,
        name: 'Lagos Lace Gallery',
        owner: 'Mrs. Ngozi Okonkwo',
        stall: 'Zone C Suite 9',
        phone: '+234 803 888 2222',
        category: 'Fabrics',
        description: 'Exclusive collection of Swiss voile, French lace, and tailored fabrics for weddings, ceremonies, and everyday fashion.',
        image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    id: 'zone-d',
    name: 'Zone D',
    category: 'Home Appliances',
    color: '#10b981',
    bounds: [[-90, 45], [-55, 70]],
    shops: [
      {
        id: 'kemis',
        shopPageId: 4,
        name: 'Kemis Home Appliances',
        owner: 'Mr. Emeka Eze',
        stall: 'Zone D Suite 7',
        phone: '+234 807 444 9900',
        category: 'Home Appliances',
        description: 'Authorised dealer for Hisense, Samsung, and LG washing machines, refrigerators, and kitchen appliances with warranty.',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'powermax',
        shopPageId: 4,
        name: 'PowerMax Generators',
        owner: 'Chief Adewale Ogundimu',
        stall: 'Zone D Suite 18',
        phone: '+234 812 777 0011',
        category: 'Home Appliances',
        description: 'Nigeria\'s trusted source for Firman, Sumec, and Elepaq generators — sales, servicing, and installation across Lagos.',
        image: 'https://images.unsplash.com/photo-1601752943749-7dd8d89f407a?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    id: 'zone-e',
    name: 'Zone E',
    category: 'Auto Parts',
    color: '#f59e0b',
    bounds: [[-90, 75], [-60, 95]],
    shops: [
      {
        id: 'autoparts',
        shopPageId: 5,
        name: 'AutoParts Direct',
        owner: 'Chief Babatunde Adeyemi',
        stall: 'Zone E Suite 2',
        phone: '+234 809 666 3344',
        category: 'Auto Parts',
        description: 'Dealers in genuine and after-market spare parts for Toyota, Honda, Mercedes, and other top vehicle brands at competitive prices.',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
];

/** Flat list of all shops across all zones — used by the sidebar. */
export const allFloorShops: FloorShop[] = floorZones.flatMap(z => z.shops);

/** Find a shop and its parent zone by shop id. */
export function findShopById(id: string): { shop: FloorShop; zone: FloorZone } | null {
  for (const zone of floorZones) {
    const shop = zone.shops.find(s => s.id === id);
    if (shop) return { shop, zone };
  }
  return null;
}

/** Find a shop by name (case-insensitive, partial match). */
export function findShopByName(name: string): { shop: FloorShop; zone: FloorZone } | null {
  const lower = name.toLowerCase();
  for (const zone of floorZones) {
    const shop = zone.shops.find(s => s.name.toLowerCase().includes(lower));
    if (shop) return { shop, zone };
  }
  return null;
}
