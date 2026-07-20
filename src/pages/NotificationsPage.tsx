import { Link } from 'wouter';
import { 
  Bell, MessageCircle, Package, Star, ArrowRight, 
  CheckCircle2, Clock, Truck, Store, Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Notification = {
  id: number;
  type: 'chat' | 'order' | 'review' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
};

const mockNotifications: Notification[] = [
  { id: 1, type: 'chat', title: 'New message from TechCity Electronics', message: 'Thanks for your message! I\'ll get back to you shortly with more details.', time: '2 min ago', read: false, link: '/chat/1' },
  { id: 2, type: 'order', title: 'Order #ORD-001 shipped', message: 'Your order has been dispatched and is on its way to you.', time: '1 hour ago', read: false, link: '/orders/ORD-001' },
  { id: 3, type: 'order', title: 'Order #ORD-002 delivered', message: 'Your order has been delivered successfully. Please confirm receipt.', time: '3 hours ago', read: true, link: '/orders/ORD-002' },
  { id: 4, type: 'review', title: 'Rate your experience', message: 'How was your purchase from PhoneHub Plus? Leave a review.', time: '1 day ago', read: true, link: '/shop/2' },
  { id: 5, type: 'promo', title: 'Flash Sale - 30% off Electronics', message: 'Don\'t miss out on today\'s deals from verified vendors.', time: '2 days ago', read: true },
  { id: 6, type: 'chat', title: 'New message from BeautyGlow Lagos', message: 'The foundation you asked about is available in all shades.', time: '3 days ago', read: true, link: '/chat/6' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'order': return <Package className="w-5 h-5 text-primary" />;
      case 'review': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'promo': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-1" /> Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              You're all caught up! We'll notify you when there are updates on your orders and chats.
            </p>
            <Link href="/">
              <Button className="rounded-full px-6">Browse Markets</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => {
                  markRead(notification.id);
                  if (notification.link) {
                    window.location.href = notification.link;
                  }
                }}
                className={`bg-card border rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${
                  notification.read ? 'border-border' : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-bold text-sm ${notification.read ? 'text-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
                {notification.link && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
