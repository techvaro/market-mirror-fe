import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Package, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Sign in to view your orders</h2>
        <p className="text-muted-foreground mb-8">You need an account to track and manage your orders.</p>
        <Link href="/sign-in" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8">
          Sign In
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'packing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">In Progress</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600">On The Way</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">My Orders</h1>
            <p className="text-muted-foreground text-lg">
              Track your purchases and view your order history.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-8 flex-grow">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">You haven't placed any orders yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Start shopping to see your orders here.
            </p>
            <Link href="/products">
              <Button className="rounded-full px-8">Shop All Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={order.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg">{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Placed on {new Date(order.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-bold text-lg">{formatNaira(order.total)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.map((item, i) => (
                      <div 
                        key={`${item.productId}-${i}`} 
                        className="w-10 h-10 rounded-full border-2 border-card flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      />
                    ))}
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      View Details <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
