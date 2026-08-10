import { Link, useParams } from 'wouter';
import { useOrders } from '@/context/OrderContext';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle, Package, Truck, XCircle, Store, MapPin, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderTrackingPage() {
  const params = useParams();
  const { getOrderById } = useOrders();
  
  const orderId = params.id;
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <h2 className="text-2xl font-display font-bold mb-4">Order not found</h2>
        <p className="text-muted-foreground mb-8">The order you're looking for doesn't exist or you don't have access to it.</p>
        <Link href="/orders">
          <Button>Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const stages = ['confirmed', 'packing', 'out_for_delivery', 'delivered'];
  const isCancelled = order.status === 'cancelled';
  // If cancelled, current stage is whatever it reached before cancellation. For mockup, we can just say 'confirmed' if it's cancelled early.
  // In a real system, we'd have a timeline of state changes. Here, we'll assume it was confirmed then cancelled.
  
  const getStageIndex = () => {
    if (isCancelled) return 0; // Show confirmed, then cancelled
    return stages.indexOf(order.status);
  };
  const currentIndex = getStageIndex();

  const isCompleted = (index: number) => !isCancelled && currentIndex > index;
  const isCurrent = (index: number) => !isCancelled && currentIndex === index;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-3 max-w-4xl">
        
        <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Orders
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
            <div className="font-bold text-lg">{order.estimatedDelivery}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tracking Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-8">Tracking Status</h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-5 left-6 bottom-5 w-0.5 bg-border z-0"></div>
                
                <div className="space-y-8 relative z-10">
                  {/* Confirmed */}
                  <div className={`flex gap-4 ${isCancelled ? 'opacity-50' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-card ${isCompleted(0) || isCurrent(0) || isCancelled ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'}`}>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <h4 className={`font-bold ${isCurrent(0) ? 'text-primary' : ''}`}>Order Confirmed</h4>
                      <p className="text-sm text-muted-foreground">Payment verified and held in escrow</p>
                    </div>
                  </div>
                  
                  {isCancelled ? (
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive text-white flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-card outline outline-4 outline-card">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div className="pt-2">
                        <h4 className="font-bold text-destructive">Order Cancelled</h4>
                        <p className="text-sm text-muted-foreground">{order.cancellationReason || 'Cancelled by user'}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Packing */}
                      <div className={`flex gap-4 ${!isCompleted(0) && !isCurrent(1) ? 'opacity-50' : ''}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-card ${isCurrent(1) ? 'bg-background border-2 border-primary text-primary outline outline-4 outline-card' : isCompleted(1) ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="pt-2">
                          <h4 className={`font-bold ${isCurrent(1) ? 'text-primary' : ''}`}>Vendors Packing</h4>
                          <p className="text-sm text-muted-foreground">Sellers are preparing your items at Computer Village</p>
                        </div>
                      </div>
                      
                      {/* Out for Delivery / Ready for pickup */}
                      <div className={`flex gap-4 ${!isCompleted(1) && !isCurrent(2) ? 'opacity-50' : ''}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-card ${isCurrent(2) ? 'bg-background border-2 border-primary text-primary outline outline-4 outline-card' : isCompleted(2) ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'}`}>
                          {order.deliveryMethod === 'delivery' ? <Truck className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                        </div>
                        <div className="pt-2">
                          <h4 className={`font-bold ${isCurrent(2) ? 'text-primary' : ''}`}>{order.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup'}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{order.deliveryMethod === 'delivery' ? 'Rider picked up from market' : 'Items ready at designated shops'}</p>
                          {order.deliveryMethod === 'delivery' && (isCurrent(2) || isCompleted(2)) && (
                            <Link href={`/orders/${order.id}/tracking`}>
                              <Button size="sm" variant="outline" className="mt-1">Track Rider Live</Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Delivered */}
                      <div className={`flex gap-4 ${!isCompleted(2) && !isCurrent(3) ? 'opacity-50' : ''}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-card ${isCurrent(3) ? 'bg-secondary text-white outline outline-4 outline-card' : 'bg-muted text-muted-foreground'}`}>
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="pt-2">
                          <h4 className={`font-bold ${isCurrent(3) ? 'text-secondary' : ''}`}>{order.deliveryMethod === 'delivery' ? 'Delivered' : 'Picked Up'}</h4>
                          <p className="text-sm text-muted-foreground">{order.deliveryMethod === 'delivery' ? 'Order delivered to your address' : 'Order picked up from market'}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Items in Order</h2>
              <div className="divide-y divide-border">
                {order.items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex-shrink-0 border border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-grow">
                      <Link href={`/product/${item.productId}`} className="font-bold hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">Variant: {item.variant}</div>
                      <div className="text-xs font-medium text-primary mt-1">Sold by: {item.shopName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatNaira(item.price)}</div>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm mb-4 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatNaira(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">{order.deliveryFee > 0 ? formatNaira(order.deliveryFee) : 'Free'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg text-primary">{formatNaira(order.total)}</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Delivery Details
                </h3>
                {order.deliveryMethod === 'delivery' && order.address ? (
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, Lagos</p>
                    <p>{order.address.phone}</p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Computer Village Pickup</p>
                    <p>Pick up directly from the vendors.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" /> Payment Method
                </h3>
                <div className="text-sm text-muted-foreground capitalize">
                  {order.paymentMethod === 'paystack' ? 'Paystack (Card/Bank)' : 'Direct Transfer'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
