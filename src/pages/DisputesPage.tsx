import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useDisputes } from '@/context/DisputesContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { formatNaira } from '@/lib/utils';

export default function DisputesPage() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { disputes, addDispute } = useDisputes();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <h2 className="text-2xl font-display font-bold mb-2">Sign in to view disputes</h2>
        <Link href="/sign-in" className="mt-4">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.status !== 'cancelled');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !reason || !description) return;
    
    addDispute({
      orderId: selectedOrder,
      reason,
      description
    });
    
    toast({
      title: "Dispute Submitted",
      description: "We'll review your dispute and get back to you shortly.",
    });
    
    setIsModalOpen(false);
    setSelectedOrder('');
    setReason('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-3 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Disputes & Returns</h1>
            <p className="text-muted-foreground mt-1">Manage your order issues and return requests.</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <AlertCircle className="w-4 h-4" /> Open Dispute
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Open a Dispute</DialogTitle>
                <DialogDescription>
                  Select an order and tell us what went wrong. Our team will mediate with the vendor.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Order</label>
                  <select 
                    value={selectedOrder} 
                    onChange={e => setSelectedOrder(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="" disabled>Select an order...</option>
                    {userOrders.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} - {new Date(o.placedAt).toLocaleDateString()} ({formatNaira(o.total)})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Dispute</label>
                  <select 
                    value={reason} 
                    onChange={e => setReason(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="" disabled>Select a reason...</option>
                    <option value="item_defective">Item is defective or broken</option>
                    <option value="item_wrong">Wrong item delivered</option>
                    <option value="item_missing">Missing items in order</option>
                    <option value="delivery_delayed">Order never arrived</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Please provide details about the issue..."
                    required
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Dispute</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {disputes.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No disputes found</h3>
            <p className="text-muted-foreground max-w-md">
              You haven't opened any disputes yet. If you have an issue with an order, you can open one here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map(dispute => {
              const order = orders.find(o => o.id === dispute.orderId);
              return (
                <div key={dispute.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold font-display text-lg">Dispute #{dispute.id.slice(-6)}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          dispute.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          dispute.status === 'Under Review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {dispute.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">Opened on {new Date(dispute.createdAt).toLocaleDateString()}</div>
                    </div>
                    {order && (
                      <Link href={`/orders/${order.id}`} className="text-sm font-medium text-primary flex items-center hover:underline">
                        Order {order.orderNumber} <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold text-sm mb-1">{dispute.reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <p className="text-sm text-muted-foreground">{dispute.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
