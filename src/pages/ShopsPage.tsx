import { useState, useMemo, useEffect } from 'react';
import { shops, markets } from '@/data/mockData';
import { ShopCard } from '@/components/ShopCard';
import { Search, Filter, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PAGE_SIZE = 6; // Set to 6 so pagination is visible with mock data

export default function ShopsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeMarket, setActiveMarket] = useState<string>('All Markets');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const categories = ['All', 'Electronics', 'Phones & Accessories', 'Fabrics & Fashion', 'Home Appliances', 'Auto Parts', 'Beauty'];
  
  const filteredShops = useMemo(() => {
    let result = activeCategory === 'All' 
      ? shops 
      : shops.filter(s => s.category.includes(activeCategory.split(' ')[0])); // Simple matching

    if (activeMarket !== 'All Markets') {
      result = result.filter(s => s.market === activeMarket);
    }

    if (searchQuery) {
      result = result.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'Top Rated': return b.rating - a.rating;
        case 'Most Products': return b.productCount - a.productCount;
        case 'Recommended':
        default: return 0;
      }
    });

    return result;
  }, [activeCategory, activeMarket, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredShops.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeMarket, searchQuery, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedShops = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredShops.slice(start, start + PAGE_SIZE);
  }, [filteredShops, currentPage]);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Browse Alaba Shops</h1>
            <p className="text-muted-foreground text-lg">
              Explore {shops.length} verified sellers offering the best prices on authentic goods directly from the market.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Market
            </h3>
            <select
              value={activeMarket}
              onChange={e => setActiveMarket(e.target.value)}
              className="w-full bg-card border border-border text-sm rounded-lg px-3 py-2.5 font-medium focus:outline-none focus:border-primary"
            >
              <option value="All Markets">All Markets</option>
              {markets.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <h3 className="font-bold mb-4">Rating</h3>
            <div className="space-y-3">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="flex items-center gap-1 text-sm text-foreground">
                    {rating} Stars & Up
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-bold text-sm">Open Now</span>
              <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 translate-x-4 rounded-full bg-white transition" />
              </div>
            </label>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="flex-grow">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shops..." 
                className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-card border border-border text-sm rounded-lg px-3 py-2 font-medium focus:outline-none w-full sm:w-auto"
              >
                <option>Recommended</option>
                <option>Top Rated</option>
                <option>Most Products</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedShops.map((shop, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={shop.id}
              >
                <ShopCard shop={shop} />
              </motion.div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pb-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                    }`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
