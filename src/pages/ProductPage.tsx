import { useParams, Link, useLocation } from 'wouter';
import { useState } from 'react';
import { products, shops } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, MapPin, Store, ChevronRight, Minus, Plus, ShoppingCart, Heart, Phone, MessageCircle, Video, Clock, Zap } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function ProductPage() {
  const { id } = useParams();
  const productId = parseInt(id || '1');
  const product = products.find(p => p.id === productId) || products[0];
  const shop = shops.find(s => s.id === product.shopId)!;
  
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();
  
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedVariant, quantity);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setLocation('/checkout');
  };
  
  const relatedProducts = products.filter(p => p.shopId === product.shopId && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container mx-auto px-3">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 md:mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop/${shop.id}`} className="hover:text-primary">{shop.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          
          {/* Image Gallery - Compact */}
          <div className="space-y-3">
            <div 
              className="aspect-square w-full rounded-xl border border-border shadow-sm flex items-center justify-center bg-gray-200"
            >
              <div className="text-gray-400 font-display text-3xl md:text-4xl font-bold tracking-widest uppercase">
                {product.category}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-lg border-2 cursor-pointer transition-all bg-gray-200 ${i === 1 ? 'border-gray-400' : 'border-border opacity-70 hover:opacity-100'}`}
                  style={{ filter: `brightness(${1 - (i-1)*0.1})` }}
                />
              ))}
            </div>
          </div>
          
          {/* Product Details - Compact */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="w-3.5 h-3.5 fill-muted-foreground text-muted-foreground" />
                {product.rating}
              </div>
            </div>
            
            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground leading-tight">
              {product.name}
            </h1>
            
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {formatNaira(product.price)}
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {product.description}
            </p>
            
            <div className="space-y-3">
              {/* Variants */}
              <div>
                <h4 className="font-bold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Options</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1.5 rounded-lg border font-medium text-xs transition-all ${
                        selectedVariant === variant 
                          ? 'border-gray-400 bg-muted text-foreground shadow-sm' 
                          : 'border-border bg-card text-foreground hover:border-gray-400'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div>
                <h4 className="font-bold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Quantity</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-foreground">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <span className="text-xs font-medium">
                    {product.stock ? (
                      <span className="text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> In Stock</span>
                    ) : (
                      <span className="text-destructive">Out of Stock</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-grow h-12 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                onClick={handleBuyNow}
                disabled={!product.stock}
              >
                <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Buy Now</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className={`flex-grow h-12 text-sm font-bold transition-all ${isAdding ? 'bg-secondary hover:bg-secondary' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.stock}
              >
                {isAdding ? (
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Added to Cart</span>
                ) : (
                  <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Add to Cart</span>
                )}
              </Button>
              <Button size="lg" variant="outline" className="h-12 w-12 p-0 shrink-0 bg-card">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Shop Details Section */}
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Shop Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-14 h-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border overflow-hidden"
                >
                  {shop.images[0] ? (
                    <img src={shop.images[0]} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{shop.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-muted-foreground text-muted-foreground" /> {shop.rating} Rating
                    <span className="text-border">|</span>
                    <ShieldCheck className="w-3 h-3 text-muted-foreground" /> Verified Vendor
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{shop.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">{shop.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{shop.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Store className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{shop.shopNumber}</span>
                </div>
              </div>
            </div>
            
            {/* Shop Images */}
            <div className="flex gap-2 shrink-0">
              {shop.images.slice(0, 3).map((img, i) => (
                <div key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted border border-border overflow-hidden">
                  <img src={img} alt={`${shop.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            <Link href={`/shop/${shop.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Store className="w-4 h-4" /> Visit Shop
              </Button>
            </Link>
            <Link href={`/chat/${shop.id}`} onClick={() => sessionStorage.setItem('chatReferrer', 'shop')}>
              <Button size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" /> Chat with Vendor
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(`tel:${shop.phone.replace(/\s/g, '')}`)}>
              <Phone className="w-4 h-4" /> Call
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(`tel:${shop.phone.replace(/\s/g, '')}`)}>
              <Video className="w-4 h-4" /> Video Call
            </Button>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-8">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-6">More from this shop</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
        
      </div>

      {/* Floating Chat Button */}
      <Link 
        href={`/chat/${shop.id}`} 
        onClick={() => sessionStorage.setItem('chatReferrer', 'shop')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
