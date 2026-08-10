import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Store, Phone, MapPin, ChevronLeft, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap, Rectangle } from 'leaflet';
import { floorZones, findShopById, type FloorZone, type FloorShop } from '@/data/marketFloorData';

export type MarketFloorMapRef = {
  openShopPopup: (shopId: string) => void;
};

type PopupState =
  | null
  | { level: 1; zone: FloorZone }
  | { level: 2; shop: FloorShop; zone: FloorZone };

// Load Pannellum from CDN once
function loadPannellum(): Promise<void> {
  if ((window as any).pannellum) return Promise.resolve();
  return new Promise((resolve, reject) => {
    // CSS
    if (!document.querySelector('link[href*="pannellum"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }
    // JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const WALKTHROUGH_SCENES = [
  'https://pannellum.org/images/alma.jpg',
  'https://pannellum.org/images/bma-1.jpg',
];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MarketFloorMapProps {}

const MarketFloorMap = forwardRef<MarketFloorMapRef, MarketFloorMapProps>((_props, ref) => {
  const [, setLocation] = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pannellumContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const pannellumViewerRef = useRef<any>(null);

  const [popupState, setPopupState] = useState<PopupState>(null);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  const [walkthroughLoading, setWalkthroughLoading] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    openShopPopup(shopId: string) {
      const result = findShopById(shopId);
      if (result) setPopupState({ level: 2, shop: result.shop, zone: result.zone });
    },
  }));

  // ── Initialise Leaflet map ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    import('leaflet').then(L => {
      // Fix default icon paths for Vite
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!, {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 3,
        zoomSnap: 0.25,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      const mapBounds: [[number, number], [number, number]] = [[-100, 0], [0, 100]];
      map.fitBounds(mapBounds, { padding: [20, 20] });

      // ── Background fill ─────────────────────────────────────────────────
      L.rectangle(mapBounds, {
        color: '#d1d5db',
        weight: 1,
        fillColor: '#ffffff',
        fillOpacity: 1,
      }).addTo(map);

      // ── Decorative roads ─────────────────────────────────────────────────
      // Vertical road ~x=34
      L.rectangle([[-100, 33], [0, 37]], {
        color: '#e5e7eb', weight: 0, fillColor: '#f3f4f6', fillOpacity: 1,
      }).addTo(map);
      // Horizontal road ~y=52
      L.rectangle([[-54, 0], [-50, 100]], {
        color: '#e5e7eb', weight: 0, fillColor: '#f3f4f6', fillOpacity: 1,
      }).addTo(map);

      // ── Zone rectangles ───────────────────────────────────────────────────
      floorZones.forEach(zone => {
        const rect = L.rectangle(zone.bounds, {
          color: zone.color,
          weight: 2,
          fillColor: zone.color,
          fillOpacity: 0.15,
          className: 'zone-rect',
        }).addTo(map);

        rect.on('mouseover', () => rect.setStyle({ fillOpacity: 0.28 }));
        rect.on('mouseout',  () => rect.setStyle({ fillOpacity: 0.15 }));
        rect.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setPopupState({ level: 1, zone });
        });

        // Zone label marker (centred in rectangle)
        const [[s, w], [n, e]] = zone.bounds;
        const centerLat = (s + n) / 2;
        const centerLng = (w + e) / 2;

        const labelIcon = L.divIcon({
          className: '',
          html: `<div style="
            display:flex;flex-direction:column;align-items:center;gap:4px;
            pointer-events:none;user-select:none;
          ">
            <span style="font-weight:800;font-size:14px;color:${zone.color};
              text-shadow:0 1px 3px rgba(255,255,255,0.9),0 0 6px rgba(255,255,255,0.7);
              white-space:nowrap;font-family:inherit;">
              ${zone.name}
            </span>
            <span style="
              background:#fff;border:1px solid ${zone.color}40;
              color:#374151;font-size:10px;font-weight:600;
              padding:2px 8px;border-radius:999px;
              box-shadow:0 1px 4px rgba(0,0,0,0.1);white-space:nowrap;
            ">${zone.category}</span>
          </div>`,
          iconAnchor: [0, 0],
        });
        L.marker([centerLat, centerLng], { icon: labelIcon, interactive: false }).addTo(map);

        // Shop pin markers
        zone.shops.forEach((shop, i) => {
          const pinLat = s + (n - s) * (0.3 + i * 0.25);
          const pinLng = w + (e - w) * (0.2 + i * 0.3);

          const pinIcon = L.divIcon({
            className: '',
            html: `<div title="${shop.name}" style="
              width:24px;height:24px;border-radius:50%;
              background:${zone.color};
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 2px 6px rgba(0,0,0,0.3);
              border:2px solid white;
              cursor:pointer;
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([pinLat, pinLng], { icon: pinIcon }).addTo(map);
          marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            setPopupState({ level: 2, shop, zone });
          });
        });
      });

      leafletMapRef.current = map;
    });

    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // ── Walkthrough ──────────────────────────────────────────────────────────
  const enterWalkthrough = async () => {
    setWalkthroughLoading(true);
    await loadPannellum();
    setWalkthroughMode(true);
    setWalkthroughLoading(false);

    // Wait for the container to render before initialising pannellum
    setTimeout(() => {
      if (!pannellumContainerRef.current) return;
      try {
        if (pannellumViewerRef.current) {
          pannellumViewerRef.current.destroy();
        }
        pannellumViewerRef.current = (window as any).pannellum.viewer(pannellumContainerRef.current, {
          type: 'equirectangular',
          panorama: WALKTHROUGH_SCENES[sceneIndex],
          autoLoad: true,
          showControls: false,
          compass: false,
          hfov: 100,
        });
      } catch (e) {
        console.error('Pannellum init error', e);
      }
    }, 100);
  };

  const exitWalkthrough = () => {
    if (pannellumViewerRef.current) {
      try { pannellumViewerRef.current.destroy(); } catch (_) {}
      pannellumViewerRef.current = null;
    }
    setWalkthroughMode(false);
  };

  const switchScene = (idx: number) => {
    setSceneIndex(idx);
    if (pannellumViewerRef.current) {
      pannellumViewerRef.current.loadScene(idx.toString());
      // Fallback: just reinit
      try {
        pannellumViewerRef.current.destroy();
      } catch (_) {}
      setTimeout(() => {
        if (!pannellumContainerRef.current) return;
        pannellumViewerRef.current = (window as any).pannellum.viewer(pannellumContainerRef.current, {
          type: 'equirectangular',
          panorama: WALKTHROUGH_SCENES[idx],
          autoLoad: true,
          showControls: false,
          compass: false,
          hfov: 100,
        });
      }, 50);
    }
  };

  // ── Navigate to shop page ────────────────────────────────────────────────
  const goToOwner = (shop: FloorShop) => {
    setLocation(`/shop/${shop.shopPageId}`);
  };

  return (
    <div className="absolute inset-0 p-4 md:p-8">
      <div className="w-full h-full bg-white rounded-2xl shadow-inner border border-gray-200 relative overflow-hidden">

        {/* ── Leaflet map canvas ──────────────────────────────────────── */}
        <AnimatePresence>
          {!walkthroughMode && (
            <motion.div
              key="leaflet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              ref={mapContainerRef}
              className="absolute inset-0 z-0"
              style={{ borderRadius: '1rem' }}
            />
          )}
        </AnimatePresence>

        {/* ── Pannellum 360° viewer ───────────────────────────────────── */}
        <AnimatePresence>
          {walkthroughMode && (
            <motion.div
              key="pannellum"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 rounded-2xl overflow-hidden"
            >
              <div ref={pannellumContainerRef} className="w-full h-full" />

              {/* Scene switcher */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/50 backdrop-blur px-3 py-2 rounded-full">
                {WALKTHROUGH_SCENES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => switchScene(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${sceneIndex === i ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/60 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur">
                Drag to look around · scroll to zoom
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Map Legend (bottom-left) ────────────────────────────────── */}
        {!walkthroughMode && (
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-lg text-sm pointer-events-none">
            <div className="flex items-center gap-2 mb-2 font-bold text-gray-700">
              <Info className="w-4 h-4" /> Computer Village Map Guide
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {floorZones.map(z => (
                <div key={z.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: z.color }} />
                  <span className="text-xs text-gray-600">{z.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Walkthrough FAB (bottom-right) ─────────────────────────── */}
        <button
          onClick={walkthroughMode ? exitWalkthrough : enterWalkthrough}
          disabled={walkthroughLoading}
          className={`absolute bottom-4 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold shadow-xl transition-all
            ${walkthroughMode
              ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
              : 'bg-secondary text-white hover:bg-secondary/90 shadow-secondary/30'
            } disabled:opacity-60`}
        >
          {walkthroughLoading ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full" />
          ) : walkthroughMode ? (
            <>🗺️ Back to 2D Map</>
          ) : (
            <>🚶‍♂️ Go to Walkthrough</>
          )}
        </button>

        {/* ── Multi-level Modal Popup ─────────────────────────────────── */}
        <AnimatePresence>
          {popupState && (
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-2xl"
              onClick={() => setPopupState(null)}
            >
              <motion.div
                key={`modal-${popupState.level}`}
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 max-h-[80vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
              >

                {/* ── Level 1: Zone block popup ─────────────────────── */}
                {popupState.level === 1 && (
                  <>
                    {/* Header */}
                    <div
                      className="px-5 pt-5 pb-4 border-b border-gray-100"
                      style={{ borderTop: `4px solid ${popupState.zone.color}` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-bold text-xl text-gray-900">{popupState.zone.name}</h3>
                          <span
                            className="text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block"
                            style={{ background: `${popupState.zone.color}20`, color: popupState.zone.color }}
                          >
                            {popupState.zone.category}
                          </span>
                        </div>
                        <button
                          onClick={() => setPopupState(null)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Shop list */}
                    <div className="overflow-y-auto max-h-72 p-2">
                      {popupState.zone.shops.map(shop => (
                        <button
                          key={shop.id}
                          onClick={() => setPopupState({ level: 2, shop, zone: popupState.zone })}
                          className="w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: `${popupState.zone.color}15` }}
                            >
                              <Store className="w-4 h-4" style={{ color: popupState.zone.color }} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900 leading-tight">{shop.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{shop.stall}</p>
                            </div>
                          </div>
                          <ArrowRight
                            className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="px-4 pb-4 pt-2 text-xs text-gray-400 text-center">
                      {popupState.zone.shops.length} shop{popupState.zone.shops.length !== 1 ? 's' : ''} in this block
                    </div>
                  </>
                )}

                {/* ── Level 2: Shop profile popup ───────────────────── */}
                {popupState.level === 2 && (
                  <>
                    {/* Shop photo */}
                    <div className="relative h-40">
                      <img
                        src={popupState.shop.image}
                        alt={popupState.shop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        onClick={() => setPopupState({ level: 1, zone: popupState.zone })}
                        className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 hover:bg-black/60 text-white text-xs font-medium px-2.5 py-1.5 rounded-full backdrop-blur transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Back
                      </button>
                      <button
                        onClick={() => setPopupState(null)}
                        className="absolute top-3 right-3 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-3 left-4">
                        <p className="text-white font-display font-bold text-base leading-tight drop-shadow">
                          {popupState.shop.name}
                        </p>
                        <p className="text-white/80 text-xs">{popupState.shop.stall}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {popupState.shop.description}
                      </p>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {popupState.shop.stall}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {popupState.shop.phone}
                        </div>
                      </div>

                      <button
                        onClick={() => goToOwner(popupState.shop)}
                        className="w-full h-10 rounded-xl text-sm font-bold text-white transition-colors"
                        style={{ background: '#2563eb' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
                      >
                        Check Shop Details &amp; Owner →
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

MarketFloorMap.displayName = 'MarketFloorMap';
export default MarketFloorMap;
