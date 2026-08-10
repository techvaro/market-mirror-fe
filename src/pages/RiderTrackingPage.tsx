import { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Phone, MessageSquare, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function RiderTrackingPage() {
  const params = useParams();
  const { getOrderById } = useOrders();
  const { toast } = useToast();
  
  const orderId = params.id;
  const order = orderId ? getOrderById(orderId) : undefined;
  
  const [progress, setProgress] = useState(0);
  const [appModalOpen, setAppModalOpen] = useState(false);

  useEffect(() => {
    // Simulate rider movement
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        return p + 1;
      });
    }, 500); // 1% every 0.5s = 50s total simulation
    
    return () => clearInterval(interval);
  }, []);

  if (!order || order.deliveryMethod !== 'delivery') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <h2 className="text-2xl font-display font-bold mb-4">Tracking not available</h2>
        <p className="text-muted-foreground mb-8">This order cannot be tracked or does not exist.</p>
        <Link href="/orders">
          <Button>Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const handleActionClick = () => {
    setAppModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-3 max-w-3xl">
        <Link href={`/orders/${order.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Order Details
        </Link>
        
        <h1 className="text-3xl font-display font-bold mb-6">Live Delivery Tracking</h1>
        
        {/* Mock Map Area */}
        <div className="bg-muted/50 border border-border rounded-2xl h-80 md:h-[400px] mb-6 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          {/* Path line */}
          <div className="absolute left-1/4 top-1/4 right-1/4 bottom-1/4 border-t-4 border-l-4 border-dashed border-primary/40 rounded-tl-3xl z-0" />
          
          {/* Market Pin */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="bg-background border-2 border-foreground rounded-full p-2 shadow-lg">
              <MapPin className="w-5 h-5 text-foreground" />
            </div>
            <span className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold mt-1 shadow-sm">Computer Village</span>
          </div>

          {/* Destination Pin */}
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 z-10 flex flex-col items-center">
            <div className="bg-secondary border-2 border-secondary rounded-full p-2 shadow-lg">
              <MapPin className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold mt-1 shadow-sm">Your Location</span>
          </div>

          {/* Rider Marker (Animated) */}
          <div 
            className="absolute z-20 transition-all duration-500 ease-linear flex flex-col items-center"
            style={{ 
              // Simple path calculation: top left -> top right -> bottom right
              top: progress < 50 ? '25%' : `${25 + ((progress - 50) * 2)}%`,
              left: progress < 50 ? `${25 + (progress * 2)}%` : '75%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-xl border-2 border-background animate-bounce">
              <Navigation className="w-6 h-6 fill-current" />
            </div>
          </div>
          
          {/* ETA Overlay */}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-lg z-30">
            <div className="text-xs text-muted-foreground font-medium mb-0.5 uppercase tracking-wider">Estimated Arrival</div>
            <div className="text-xl font-display font-bold text-primary">
              {progress < 100 ? `${Math.ceil((100 - progress) / 2)} mins` : 'Arrived!'}
            </div>
          </div>
        </div>

        {/* Rider Info Card */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full overflow-hidden border-2 border-border flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">KO</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">Kabiru O.</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                  {progress < 100 ? 'On the way to you' : 'At your location'}
                </p>
                <div className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-md mt-2 inline-block">
                  Honda CG110 • ABC-123-XY
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button onClick={handleActionClick} variant="outline" className="flex-1 sm:flex-none gap-2 rounded-xl h-12">
                <MessageSquare className="w-4 h-4" /> Message
              </Button>
              <Button onClick={handleActionClick} className="flex-1 sm:flex-none gap-2 rounded-xl h-12">
                <Phone className="w-4 h-4" /> Call
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={appModalOpen} onOpenChange={setAppModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feature Coming Soon</DialogTitle>
            <DialogDescription>
              This action requires the Market Mirror mobile app to connect securely with riders. The app is currently in development and will be available soon on iOS and Android.
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
