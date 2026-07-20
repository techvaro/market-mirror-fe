import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfirmationPage() {
  const { clearCart } = useCart();
  const { getOrderById, lastOrderId } = useOrders();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const order = lastOrderId ? getOrderById(lastOrderId) : null;

  if (!order) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No recent order found.</p>
          <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-12">
      <div className="container mx-auto px-3 max-w-2xl">
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-lg"
        >
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-secondary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Order Successful!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your payment is held securely in escrow. Vendors are now preparing your items.
          </p>
          
          <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-6 border-b border-border">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                <div className="font-bold text-lg">{order.orderNumber}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
                <div className="font-bold text-lg">{order.estimatedDelivery}</div>
              </div>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-5 left-6 bottom-5 w-0.5 bg-border z-0"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-card">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold">Order Confirmed</h4>
                    <p className="text-sm text-muted-foreground">Payment verified and held in escrow</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center flex-shrink-0 shadow-sm outline outline-4 outline-card">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-primary">Vendors Packing</h4>
                    <p className="text-sm text-muted-foreground">Sellers are preparing your items at Alaba</p>
                  </div>
                </div>
                
                <div className="flex gap-4 opacity-50">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border-4 border-card">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold">{order.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup'}</h4>
                    <p className="text-sm text-muted-foreground">{order.deliveryMethod === 'delivery' ? 'Rider picked up from market' : 'Items ready at designated shops'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/orders/${order.id}`} className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-14 px-8">
              Track Order
            </Link>
            <Link href="/" className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-14 px-8 font-bold">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
