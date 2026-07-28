import { useState, useMemo, useEffect } from 'react';
import { Link, useSearch, useLocation } from 'wouter';
import { Search, Map as MapIcon, Store, Wrench, Building2, LayoutGrid, Star, ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
import { products, shops, buildings, services, Product, Shop, Building, Service } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { ShopCard } from '@/components/ShopCard';
import { formatNaira } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchResultsPage() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  const q = searchParams.get('q') || '';
  const query = q.trim().toLowerCase();

  const [searchInput, setSearchInput] = useState(q);
  const [activeTab, setActiveTab] = useState<'All' | 'Products' | 'Shops' | 'Markets' | 'Services'>('All');

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const searchResults = useMemo(() => {
    if (!query) {
      return { products: [], shops: [], buildings: [], services: [], total: 0 };
    }

    const matchedProducts = products.filter(
      p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );

    const matchedShops = shops.filter(
      s => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query) || s.description.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
    );

    const matchedBuildings = buildings.filter(
      b => b.name.toLowerCase().includes(query) || b.description.toLowerCase().includes(query) || b.location.toLowerCase().includes(query) || b.category.toLowerCase().includes(query)
    );

    const matchedServices = services.filter(
      s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query) || s.category.toLowerCase().includes(query)
    );

    return {
      products: matchedProducts,
      shops: matchedShops,
      buildings: matchedBuildings,
      services: matchedServices,
      total: matchedProducts.length + matchedShops.length + matchedBuildings.length + matchedServices.length
    };
  }, [query]);

  useEffect(() => {
    if (activeTab === 'Products' && searchResults.products.length === 0) setActiveTab('All');
    if (activeTab === 'Shops' && searchResults.shops.length === 0) setActiveTab('All');
    if (activeTab === 'Markets' && searchResults.buildings.length === 0) setActiveTab('All');
    if (activeTab === 'Services' && searchResults.services.length === 0) setActiveTab('All');
  }, [query, searchResults]);

  if (!query) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-card border-b border-border py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">Search Markets</h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-6">Enter a search term to find markets, shops, products, and services around the world.</p>
            <form 
              onSubmit={(e) => { e.preventDefault(); if (searchInput.trim()) setLocation(`/search?q=${encodeURIComponent(searchInput.trim())}`); }}
              className="flex gap-2"
            >
              <div className="flex-1 flex items-center gap-3 bg-background border border-input rounded-xl px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search markets, shops, products..." 
                  className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground h-full text-sm sm:text-base font-medium min-w-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0">
                Search
              </Button>
            </form>
          </div>
        </div>
        <div className="container mx-auto px-3 py-16 flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md w-full bg-card rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">Find markets near you</h3>
            <p className="text-muted-foreground mb-6">
              Search for markets by name, location, or category. Discover verified vendors worldwide.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/search?q=Alaba"><Button variant="outline" size="sm" className="rounded-full">Alaba Market</Button></Link>
              <Link href="/search?q=Trade Fair"><Button variant="outline" size="sm" className="rounded-full">Trade Fair</Button></Link>
              <Link href="/search?q=Computer Village"><Button variant="outline" size="sm" className="rounded-full">Computer Village</Button></Link>
              <Link href="/search?q=electronics"><Button variant="outline" size="sm" className="rounded-full">Electronics</Button></Link>
              <Link href="/search?q=fabrics"><Button variant="outline" size="sm" className="rounded-full">Fabrics</Button></Link>
              <Link href="/shops"><Button variant="outline" size="sm" className="rounded-full">All Shops</Button></Link>
              <Link href="/map"><Button size="sm" className="rounded-full">View Market Map</Button></Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'All', label: 'All Results', count: searchResults.total, icon: Search },
    { id: 'Markets', label: 'Markets', count: searchResults.buildings.length, icon: Building2 },
    { id: 'Shops', label: 'Shops', count: searchResults.shops.length, icon: Store },
    { id: 'Products', label: 'Products', count: searchResults.products.length, icon: LayoutGrid },
    { id: 'Services', label: 'Services', count: searchResults.services.length, icon: Wrench },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Band */}
      <div className="bg-card border-b border-border py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground mb-3 sm:mb-4">
              Search results for "{q}"
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg mb-5 sm:mb-6">
              Found {searchResults.total} result{searchResults.total !== 1 ? 's' : ''} across markets, shops, products, and services.
            </p>
            <form 
              onSubmit={(e) => { e.preventDefault(); if (searchInput.trim()) setLocation(`/search?q=${encodeURIComponent(searchInput.trim())}`); }}
              className="flex gap-2"
            >
              <div className="flex-1 flex items-center gap-3 bg-background border border-input rounded-xl px-4 h-11 sm:h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for products, services, shops..." 
                  className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground h-full text-sm sm:text-base font-medium min-w-0"
                />
              </div>
              <Button type="submit" size="sm" className="h-11 sm:h-12 px-4 sm:px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base shrink-0">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-8 flex-grow">
        {searchResults.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-border h-full min-h-[400px]">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No results found for "{q}"</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              We couldn't find any markets, shops, or products matching your search. Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <Link href="/shops">
                <Button variant="outline" className="rounded-full px-5">Browse Shops</Button>
              </Link>
              <Link href="/map">
                <Button className="rounded-full px-5">View Market Map</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="rounded-full px-5">Shop All Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={tab.count === 0 && tab.id !== 'All'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : tab.count === 0
                        ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                        : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted-foreground/10'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Results Grids */}
            <div className="space-y-12">
              
              {/* Markets Section */}
              {(activeTab === 'All' || activeTab === 'Markets') && searchResults.buildings.length > 0 && (
                <div>
                  {activeTab === 'All' && <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Markets ({searchResults.buildings.length})</h2>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.buildings.map((building, idx) => {
                      const marketShops = shops.filter(s => s.market === building.name);
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                          key={building.id}
                          className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
                        >
                          <div className="h-20 w-full relative" style={{ background: building.bannerGradient }}>
                            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/30 to-transparent"></div>
                          </div>
                          <div className="p-5 flex-grow flex flex-col">
                            <h3 className="font-display font-bold text-lg leading-tight mb-1">{building.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {building.location}</span>
                              <span className="flex items-center gap-1"><Store className="w-3 h-3" /> {building.shopCount}+ shops</span>
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{building.description}</p>
                            
                            {/* Shops in this market */}
                            {marketShops.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Featured shops in this market:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {marketShops.slice(0, 3).map(s => (
                                    <Link key={s.id} href={`/shop/${s.id}`}>
                                      <span className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                                        {s.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                              <Link href="/map" className="flex-1">
                                <Button variant="outline" className="w-full" size="sm">
                                  <MapIcon className="w-3.5 h-3.5 mr-1" /> View Map
                                </Button>
                              </Link>
                              <Link href={`/search?q=${encodeURIComponent(building.name)}`} className="flex-1">
                                <Button className="w-full" size="sm">
                                  Browse Shops <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shops Section */}
              {(activeTab === 'All' || activeTab === 'Shops') && searchResults.shops.length > 0 && (
                <div>
                  {activeTab === 'All' && <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Store className="w-5 h-5 text-primary" /> Shops ({searchResults.shops.length})</h2>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.shops.map((shop, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                        key={shop.id}
                      >
                        <ShopCard shop={shop} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {(activeTab === 'All' || activeTab === 'Products') && searchResults.products.length > 0 && (
                <div>
                  {activeTab === 'All' && <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-primary" /> Products ({searchResults.products.length})</h2>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.products.map((product, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                        key={product.id}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Section */}
              {(activeTab === 'All' || activeTab === 'Services') && searchResults.services.length > 0 && (
                <div>
                  {activeTab === 'All' && <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Wrench className="w-5 h-5 text-primary" /> Services ({searchResults.services.length})</h2>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.services.map((service, idx) => {
                      const shop = shops.find(s => s.id === service.shopId);
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                          key={service.id}
                          className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all flex flex-col group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">{service.name}</h3>
                              <p className="text-muted-foreground text-xs mt-1 bg-muted inline-block px-2 py-0.5 rounded-full">{service.category}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                              <Star className="w-3 h-3 fill-current" /> {service.rating}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mt-3 mb-4 line-clamp-2 flex-grow">{service.description}</p>
                          
                          <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Starting from</div>
                              <div className="font-bold text-lg">{formatNaira(service.price)}</div>
                            </div>
                            {shop && (
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground mb-1">Provided by</div>
                                <div className="font-medium text-sm truncate max-w-[120px]" title={shop.name}>{shop.name}</div>
                              </div>
                            )}
                          </div>
                          
                          <Link href={`/shop/${service.shopId}`} className="mt-4 w-full">
                            <Button className="w-full">
                              View Provider <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
