import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { products, shops } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { 
  Smartphone, Tv, Shirt, Plug, Car, Paintbrush, 
  ShoppingBag, ArrowRight, CheckCircle2,
  Apple, Play, MapPin, Mail, Phone,
  Search, Star, ShieldCheck, Zap, Crosshair, Map as MapIcon, Lock, Truck, Clock
} from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import type { Product, Shop } from '@/data/mockData';

// Assets
import heroBg from '@/assets/hero-market.jpg';
import shop1Img from '@/assets/shop-1.jpg';
import shop2Img from '@/assets/shop-2.jpg';
import shop3Img from '@/assets/shop-3.jpg';
import shop4Img from '@/assets/shop-4.jpg';
import shop5Img from '@/assets/shop-5.jpg';
import shop6Img from '@/assets/shop-6.jpg';

const shopImages: Record<number, string> = {
  1: shop1Img,
  2: shop2Img,
  3: shop3Img,
  4: shop4Img,
  5: shop5Img,
  6: shop6Img,
};

const categories = [
  { name: 'Electronics', icon: Tv },
  { name: 'Phones & Gadgets', icon: Smartphone },
  { name: 'Fabrics', icon: Shirt },
  { name: 'Home Appliances', icon: Plug },
  { name: 'Auto Parts', icon: Car },
  { name: 'Beauty', icon: Paintbrush },
  { name: 'Groceries', icon: ShoppingBag },
];

const FeaturedShopCard = ({ shop }: { shop: Shop }) => {
  return (
    <Link href={`/shop/${shop.id}`}>
      <motion.div 
        whileHover={{ y: -6 }}
        className="group bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all cursor-pointer shadow-sm"
      >
        <div className="h-48 w-full relative overflow-hidden bg-muted">
          {shopImages[shop.id] ? (
            <img src={shopImages[shop.id]} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          ) : (
            <div className="w-full h-full" style={{ background: shop.bannerGradient }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {shop.category}
            </span>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/20 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {shop.rating}
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
            {shop.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
            {shop.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate max-w-[140px]">{shop.location.split(',')[0]}</span>
            </div>
            <span className="text-primary text-sm font-bold flex items-center gap-1 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Visit Shop <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const TrendingProductRow = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        whileHover={{ y: -2 }}
        className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer h-full"
      >
        <div 
          className="w-24 h-24 rounded-xl flex-shrink-0 relative overflow-hidden shadow-inner"
          style={{ backgroundColor: product.color }}
        >
          {!product.stock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-xs font-bold text-destructive rotate-[-15deg] border-2 border-destructive px-1.5 py-0.5 rounded-sm bg-background">OUT</span>
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0 flex flex-col justify-center py-1">
          <p className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1.5 truncate">{product.category}</p>
          <h4 className="font-semibold text-foreground text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-2">
            {product.name}
          </h4>
          <div className="font-display font-extrabold text-lg text-foreground mt-auto">
            {formatNaira(product.price)}
          </div>
        </div>
        <div className="pr-1 flex-shrink-0">
          <Button size="icon" variant="outline" className="w-10 h-10 rounded-full border-border bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </Link>
  );
};

export default function HomePage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchDialogOpen(false);
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAppStoreClick = () => {
    setAppModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full bg-secondary min-h-[600px] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background image with light darkening overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Bustling night market" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/50 to-secondary/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-secondary/30"></div>
        </div>

        <div className="container mx-auto px-3 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2"
            >
              <span className="text-[#F97316] text-base md:text-xl font-display font-extrabold tracking-widest uppercase">
                The mall of a Million Shops
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05]"
            >
              Digital Twin of the <br className="hidden md:block"/> Global Marketplace.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto font-medium"
            >
              Discover verified markets and trusted vendors from cities around the world — all in one place.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
            >
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  E-Commerce
                </Button>
              </Link>
              <Link href="/map" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 gap-2">
                  <MapIcon className="w-5 h-5" />
                  Market Maps
                </Button>
              </Link>
              <button onClick={() => setSearchDialogOpen(true)} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </Button>
              </button>
            </motion.div>

            {/* Live Stat Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 mt-8 hover:bg-white/10 transition-colors cursor-default"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-white tracking-wide">
                <strong className="text-primary font-bold text-base">12,400+</strong> Live Products Active Now
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 border-b border-border bg-card sticky top-0 z-40 shadow-sm overflow-hidden">
        <div className="container mx-auto px-3">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 -mb-2 hide-scrollbar mask-edges">
            {categories.map((cat, idx) => (
              <Link key={idx} href="/products">
                <button className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-muted/60 hover:bg-primary hover:text-primary-foreground text-foreground border border-transparent transition-all font-semibold text-sm shadow-sm group">
                  <cat.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  {cat.name}
                </button>
              </Link>
            ))}
            <Link href="/products">
              <button className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-primary font-bold text-sm hover:underline underline-offset-4 ml-2">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-3">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">Trending This Week</h2>
              <p className="text-muted-foreground mt-3 text-lg font-medium">Most demanded items across the market</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-primary font-bold hover:gap-2.5 transition-all bg-primary/10 px-5 py-2.5 rounded-full">
              View Inventory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {products.slice(0, 8).map((product, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={product.id}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-3">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">Featured Shops</h2>
              <p className="text-muted-foreground mt-3 text-lg font-medium">Verified vendors from the heart of the market</p>
            </div>
            <Link href="/shops" className="hidden sm:flex items-center gap-1.5 text-primary font-bold hover:gap-2.5 transition-all bg-primary/10 px-5 py-2.5 rounded-full">
              Explore All Shops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {shops.slice(0, 6).map(shop => (
              <FeaturedShopCard key={shop.id} shop={shop} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/shops" className="inline-flex items-center gap-2 text-primary font-bold bg-primary/10 px-6 py-3 rounded-full w-full justify-center">
              Explore All Shops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / Info Split */}
      <section className="py-12 md:py-20 bg-muted/50 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            
            {/* Newsletter */}
            <div className="bg-card border border-border p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2rem] shadow-sm flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold mb-3 md:mb-4 text-foreground tracking-tight">Stay in the Loop</h2>
              <p className="text-muted-foreground mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
                Get weekly updates on the best deals, new vendors, and market trends.
              </p>
              
              {isSubscribed ? (
                <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 p-4 md:p-6 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 border border-green-200 dark:border-green-900/50">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg mb-1">You're on the list!</h4>
                    <p className="text-xs md:text-sm opacity-90">Keep an eye on your inbox for market updates.</p>
                  </div>
                </div>
              ) : (
                <form 
                  className="flex flex-col sm:flex-row gap-3 min-w-0"
                  onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}
                >
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address" 
                    className="flex-1 min-w-0 h-12 md:h-14 px-4 md:px-5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-lg shadow-sm"
                  />
                  <Button type="submit" className="h-12 md:h-14 px-6 md:px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-base md:text-lg whitespace-nowrap shadow-md shrink-0">
                    Subscribe
                  </Button>
                </form>
              )}
              <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> We respect your privacy. No spam, ever.
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-secondary text-secondary-foreground p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 scale-150 translate-x-10 -translate-y-10">
                <MapIcon className="w-40 h-40 md:w-64 md:h-64 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10 text-white font-bold text-[10px] md:text-xs mb-5 md:mb-8 uppercase tracking-widest backdrop-blur-sm w-fit border border-white/10">
                  Headquarters
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold mb-5 md:mb-8 text-white tracking-tight">Visit Market Mirror</h3>
                <ul className="space-y-4 md:space-y-6 mt-auto">
                  <li className="flex items-start gap-3 md:gap-5 text-secondary-foreground/80 hover:text-white transition-colors">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-sm md:text-lg font-medium pt-2 md:pt-2.5 leading-snug">Zone A Block 12, Alaba Int'l Market<br/>Ojo, Lagos, Nigeria</span>
                  </li>
                  <li className="flex items-center gap-3 md:gap-5 text-secondary-foreground/80 hover:text-white transition-colors">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-sm md:text-lg font-medium">support@marketmirror.ng</span>
                  </li>
                  <li className="flex items-center gap-3 md:gap-5 text-secondary-foreground/80 hover:text-white transition-colors">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-sm md:text-lg font-medium">+234 (0) 800 123 4567</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-14 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="container mx-auto px-3 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 max-w-6xl mx-auto">
            
            <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] mb-4 md:mb-6 text-white tracking-tight">
                  Alaba Market, <br/> now in your pocket.
                </h2>
                <p className="text-base md:text-xl text-primary-foreground/90 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6 md:mb-10 font-medium">
                  Get real-time price updates, chat directly with vendors, and track your local deliveries on the go with our mobile app.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4">
                  <button onClick={handleAppStoreClick} className="flex items-center gap-3 md:gap-4 bg-background text-foreground px-5 md:px-6 py-3 md:py-4 rounded-2xl hover:scale-105 transition-transform w-full sm:w-auto justify-center shadow-2xl">
                    <Apple className="w-7 h-7 md:w-8 md:h-8" />
                    <div className="text-left">
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">Download on the</div>
                      <div className="text-lg md:text-xl font-bold font-display leading-none mt-1">App Store</div>
                    </div>
                  </button>
                  <button onClick={handleAppStoreClick} className="flex items-center gap-3 md:gap-4 bg-secondary text-white px-5 md:px-6 py-3 md:py-4 rounded-2xl hover:scale-105 transition-transform w-full sm:w-auto justify-center shadow-2xl">
                    <Play className="w-7 h-7 md:w-8 md:h-8" />
                    <div className="text-left">
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-80">Get it on</div>
                      <div className="text-lg md:text-xl font-bold font-display leading-none mt-1">Google Play</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Phone Mockups */}
            <div className="flex-1 flex justify-center items-center w-full order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[500px] flex justify-center"
              >
                {/* Decorative glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Back Phone - only visible on sm+ */}
                <div className="hidden sm:block absolute -left-2 md:left-0 top-8 md:top-12 w-[180px] md:w-[230px] h-[360px] md:h-[460px] bg-secondary rounded-[2rem] md:rounded-[2.5rem] border-[5px] md:border-[6px] border-secondary-foreground shadow-2xl overflow-hidden rotate-[-6deg] opacity-70 z-0">
                  <div className="absolute top-0 inset-x-0 h-5 md:h-6 bg-secondary-foreground rounded-b-xl w-20 md:w-28 mx-auto z-20"></div>
                  <div className="flex-1 bg-background/50 p-3 md:p-4 pt-10 md:pt-12 space-y-3 md:space-y-4">
                    <div className="h-20 md:h-28 bg-muted/60 rounded-xl md:rounded-2xl"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-14 md:h-20 bg-muted/60 rounded-lg"></div>
                      <div className="h-14 md:h-20 bg-muted/60 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 md:h-14 bg-muted/60 rounded-lg"></div>
                      <div className="h-10 md:h-14 bg-muted/60 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Front Phone */}
                <div className="relative w-[170px] sm:w-[200px] md:w-[250px] h-[340px] sm:h-[400px] md:h-[500px] bg-card rounded-[2rem] md:rounded-[2.5rem] border-[5px] md:border-[6px] border-foreground shadow-2xl overflow-hidden z-10">
                  {/* Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 md:h-7 bg-foreground rounded-b-2xl w-24 md:w-36 mx-auto z-20"></div>

                  {/* Screen Content */}
                  <div className="flex-1 h-full bg-muted/20 p-3 sm:p-4 md:p-5 pt-10 md:pt-12 flex flex-col gap-2.5 md:gap-3.5 relative overflow-hidden">
                    {/* App Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-primary flex items-center justify-center">
                          <ShoppingBag className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold text-foreground">Market Mirror</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground/30"></div>
                      </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="h-7 md:h-9 bg-background rounded-full w-full border border-border shadow-sm flex items-center px-2.5 md:px-3 gap-1.5">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-muted-foreground/20"></div>
                      <div className="h-1.5 md:h-2 bg-muted-foreground/15 rounded-full w-1/2"></div>
                    </div>
                    
                    {/* Hero Banner */}
                    <div className="h-16 sm:h-20 md:h-28 bg-gradient-to-br from-primary to-primary/80 rounded-xl md:rounded-2xl p-2.5 md:p-3.5 text-white flex flex-col justify-end relative overflow-hidden shadow-md">
                      <div className="absolute -right-3 -top-3 w-14 md:w-20 h-14 md:h-20 bg-white/15 rounded-full blur-lg"></div>
                      <div className="absolute right-4 bottom-3 w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-full blur-md"></div>
                      <div className="relative z-10">
                        <div className="text-[7px] md:text-[9px] font-bold uppercase tracking-wider text-white/70 mb-0.5 md:mb-1">Flash Sale</div>
                        <div className="w-16 md:w-24 h-1.5 md:h-2 bg-white/30 rounded-full mb-1 md:mb-1.5"></div>
                        <div className="w-20 md:w-28 h-2 md:h-2.5 bg-white/80 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Category Grid */}
                    <div className="grid grid-cols-4 gap-1 md:gap-1.5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex flex-col items-center gap-0.5 md:gap-1">
                          <div className="w-7 h-7 md:w-9 md:h-9 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-primary/30 rounded"></div>
                          </div>
                          <div className="w-6 md:w-8 h-1 md:h-1.5 bg-muted-foreground/15 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Product Cards */}
                    <div className="space-y-1.5 md:space-y-2">
                      {[1,2].map(i => (
                        <div key={i} className="flex gap-2 md:gap-2.5 bg-background p-1.5 md:p-2 rounded-lg md:rounded-xl border border-border shadow-sm">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-lg shrink-0 flex items-center justify-center">
                            <div className="w-5 h-5 md:w-7 md:h-7 bg-primary/25 rounded"></div>
                          </div>
                          <div className="flex-1 py-0.5 md:py-1 flex flex-col justify-between">
                            <div className="space-y-1 md:space-y-1.5">
                              <div className="h-1.5 md:h-2 bg-muted rounded-full w-full"></div>
                              <div className="h-1.5 md:h-2 bg-muted rounded-full w-3/5"></div>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <div className="h-2 md:h-2.5 bg-primary rounded-full w-8 md:w-12"></div>
                              <div className="w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Nav */}
                    <div className="absolute bottom-0 inset-x-0 h-11 md:h-14 bg-background border-t border-border flex items-center justify-around px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-primary/60"></div>
                        <div className="w-4 md:w-5 h-0.5 bg-primary rounded-full"></div>
                      </div>
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-muted-foreground/20"></div>
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-muted-foreground/20"></div>
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-muted-foreground/20"></div>
                    </div>
                  </div>
                </div>

                {/* Floating notification card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="hidden md:flex absolute -left-6 lg:-left-10 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-3 items-center gap-2.5 z-20 w-44 lg:w-52"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900 leading-tight">Order Delivered!</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Your package arrived</p>
                  </div>
                </motion.div>

                {/* Floating price card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="hidden md:flex absolute -right-4 lg:-right-8 bottom-16 md:bottom-24 bg-white rounded-xl shadow-2xl p-3 items-center gap-2.5 z-20 w-40 lg:w-48"
                >
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">Best Price</p>
                    <p className="text-[9px] text-orange-500 font-bold mt-0.5">₦45,000</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-border">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">Verified Sellers</h4>
              <p className="text-sm text-muted-foreground">Every vendor has a physical presence in the market.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">Direct Delivery</h4>
              <p className="text-sm text-muted-foreground">Fast, reliable logistics right from Alaba to your doorstep.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">Escrow Payment</h4>
              <p className="text-sm text-muted-foreground">Your money is safe until you confirm order receipt.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">We're here to help you resolve any issues instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Search Market Mirror</DialogTitle>
            <DialogDescription>
              Find products, shops, markets, and services across Nigeria.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleHeroSearch} className="flex gap-2 mt-4">
            <div className="flex-1 flex items-center gap-3 bg-background border border-input rounded-xl px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, shops, markets..."
                className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground h-full text-sm font-medium min-w-0"
                autoFocus
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0">
              Search
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={appModalOpen} onOpenChange={setAppModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mobile App Coming Soon</DialogTitle>
            <DialogDescription>
              We're hard at work building the Market Mirror native app. Leave your email in the newsletter section above to be notified when we launch on iOS and Android!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setAppModalOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}