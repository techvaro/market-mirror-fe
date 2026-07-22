import { Link, useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const [, setLocation] = useLocation();

  const deliveryFee = 1500;
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything from the market yet.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-3">
        <h1 className="text-3xl font-display font-bold mb-8">Your Cart ({items.length} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-3 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      key={`${item.product.id}-${item.variant}`}
                      className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center gap-4 w-full">
                        <div 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: item.product.color }}
                        />
                        <div className="flex-grow">
                          <Link href={`/product/${item.product.id}`} className="font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">Variant: {item.variant}</div>
                          <div className="text-xs font-medium text-primary mt-2">from Shop ID {item.product.shopId}</div>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="col-span-2 flex justify-center w-full sm:w-auto mt-4 sm:mt-0">
                        <div className="flex items-center border border-border rounded-lg bg-background">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.variant, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.variant, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-3 text-right font-bold w-full sm:w-auto mt-2 sm:mt-0 flex justify-between sm:block">
                        <span className="sm:hidden text-muted-foreground font-normal">Subtotal:</span>
                        {formatNaira(item.product.price * item.quantity)}
                      </div>
                      
                      {/* Remove */}
                      <div className="col-span-1 flex justify-end w-full sm:w-auto absolute sm:relative right-4 top-4 sm:right-auto sm:top-auto">
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="font-bold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee (Lagos)</span>
                  <span className="font-bold">{formatNaira(deliveryFee)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatNaira(total)}</span>
              </div>
              
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-bold"
                onClick={() => setLocation('/checkout')}
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                Secure checkout. Money held in escrow until delivery.
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}