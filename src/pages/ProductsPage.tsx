import { useState, useMemo, useEffect } from 'react';
import { products } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePriceBand, setActivePriceBand] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Recommended');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Extract distinct categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const priceBands = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₦50,000', min: 0, max: 50000 },
    { label: '₦50,000 - ₦200,000', min: 50000, max: 200000 },
    { label: 'Over ₦200,000', min: 200000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      
      // Stock filter
      if (inStockOnly && !p.stock) return false;
      
      // Search filter
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Price filter
      const band = priceBands.find(b => b.label === activePriceBand) || priceBands[0];
      if (p.price < band.min || p.price >= band.max) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Top Rated':
          return b.rating - a.rating;
        case 'Recommended':
        default:
          return 0; // Keeping original order for recommended
      }
    });
  }, [activeCategory, inStockOnly, searchQuery, activePriceBand, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  // Reset to page 1 whenever filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, inStockOnly, searchQuery, activePriceBand, sortBy]);

  // Clamp current page if filtered results shrink below it
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

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

  const clearFilters = () => {
    setActiveCategory('All');
    setActivePriceBand('All');
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('Recommended');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Shop All Products</h1>
            <p className="text-muted-foreground text-lg">
              Discover {products.length} products across all verified sellers in Alaba Market.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-8 flex flex-col md:flex-row gap-8 flex-grow">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
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
            <h3 className="font-bold mb-4 text-foreground">Price Range</h3>
            <div className="space-y-2">
              {priceBands.map(band => (
                <button
                  key={band.label}
                  onClick={() => setActivePriceBand(band.label)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePriceBand === band.label 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {band.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="font-bold text-sm text-foreground">In Stock Only</span>
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${inStockOnly ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${inStockOnly ? 'translate-x-4' : 'translate-x-1'}`} />
              </div>
            </label>
            {/* hidden checkbox for accessibility */}
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={inStockOnly} 
              onChange={(e) => setInStockOnly(e.target.checked)} 
            />
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="flex-grow flex flex-col">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border text-foreground rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-primary w-full sm:w-auto transition-colors"
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>
          
          {/* Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}
                  –{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                {paginatedProducts.map((product, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pb-12">
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-border h-full max-h-[400px]">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any products matching your current filters. Try adjusting your search or category.
              </p>
              <Button onClick={clearFilters} variant="outline" className="rounded-full">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
