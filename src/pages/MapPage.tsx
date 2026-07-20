import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, Map as MapIcon, List, MapPin, Star, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketFloorMap, { type MarketFloorMapRef } from '@/components/MarketFloorMap';
import { allFloorShops, findShopById } from '@/data/marketFloorData';

export default function MapPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [activeShopId, setActiveShopId] = useState<string | null>(null);
  const mapRef = useRef<MarketFloorMapRef>(null);

  const filteredMobileShops = allFloorShops.filter(s =>
    s.name.toLowerCase().includes(directorySearch.toLowerCase()),
  );
  const filteredSidebarShops = allFloorShops.filter(s =>
    s.name.toLowerCase().includes(sidebarSearch.toLowerCase()),
  );

  const handleSidebarShopClick = (shopId: string) => {
    setActiveShopId(shopId);
    if (viewMode !== 'map') setViewMode('map');
    // small delay so the map view renders before we open the popup
    setTimeout(() => mapRef.current?.openShopPopup(shopId), 80);
  };

  const handleMobileShopClick = (shopId: string) => {
    const result = findShopById(shopId);
    if (!result) return;
    const { shop } = result;
    const q = new URLSearchParams({
      id: shop.id, name: shop.name, owner: shop.owner, stall: shop.stall,
      phone: shop.phone, category: shop.category, image: shop.image, desc: shop.description,
    });
    setLocation(`/owner?${q.toString()}`);
    setDirectoryOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-3 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 w-full max-w-md">
            <h2 className="font-display font-bold text-lg text-foreground">Market Map</h2>
          </div>

          {/* Desktop: Map / Directory toggle */}
          <div className="hidden md:flex items-center gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors
                ${viewMode === 'map' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors
                ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="w-4 h-4" /> <span className="hidden sm:inline">Directory</span>
            </button>
          </div>

          {/* Mobile: Directory dropdown trigger */}
          <button
            onClick={() => setDirectoryOpen(o => !o)}
            className={`md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors
              ${directoryOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted border-border text-foreground'}`}
          >
            <List className="w-4 h-4" /> Directory
            <ChevronDown className={`w-4 h-4 transition-transform ${directoryOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Directory Dropdown Panel */}
        <AnimatePresence>
          {directoryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border bg-card"
            >
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={e => setDirectorySearch(e.target.value)}
                    placeholder="Find a shop..."
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {filteredMobileShops.map(shop => (
                  <div
                    key={shop.id}
                    onClick={() => handleMobileShopClick(shop.id)}
                    className="p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group hover:bg-muted border border-transparent"
                  >
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{shop.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{shop.category}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                ))}
                {filteredMobileShops.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No shops found.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-128px)]">

        {/* Mobile: Interactive Google Map */}
        <div className="md:hidden flex-grow relative">
          <iframe
            title="Market location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent('Alaba International Market, Nigeria')}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Desktop Main Area */}
        <div className="hidden md:block flex-grow relative bg-[#e5e5f7] order-2 md:order-1"
             style={{ backgroundImage: 'radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)', backgroundSize: '10px 10px' }}>

          {viewMode === 'map' ? (
            /* ── Interactive Leaflet Floor Map ── */
            <div className="absolute inset-0">
              <MarketFloorMap ref={mapRef} />
            </div>
          ) : (
            /* ── Directory grid view ── */
            <div className="p-3 md:p-6 h-full overflow-y-auto bg-background">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-7xl mx-auto">
                {allFloorShops.map(shop => (
                  <div
                    key={shop.id}
                    className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setViewMode('map');
                      setTimeout(() => handleSidebarShopClick(shop.id), 80);
                    }}
                  >
                    <div className="flex gap-4">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{shop.name}</h3>
                        <p className="text-primary text-sm font-medium">{shop.category}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{shop.stall}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {shop.stall}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Directory */}
        <div className="hidden md:flex md:w-80 lg:w-96 bg-card border-l border-border flex-col h-full order-1 md:order-2">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-bold text-lg mb-3">Directory</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
                placeholder="Find a shop..."
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-2">
            {filteredSidebarShops.map(shop => (
              <div
                key={shop.id}
                onClick={() => handleSidebarShopClick(shop.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group
                  ${activeShopId === shop.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted border border-transparent'}`}
              >
                <div>
                  <h4 className="font-medium text-sm text-foreground">{shop.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{shop.category}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform
                    ${activeShopId === shop.id ? 'translate-x-1 text-primary' : ''}`}
                />
              </div>
            ))}
            {filteredSidebarShops.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No shops found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
