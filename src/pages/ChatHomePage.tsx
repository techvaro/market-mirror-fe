import { Link } from 'wouter';
import { useState } from 'react';
import { shops } from '@/data/mockData';
import { 
  MessageCircle, Search, Phone, Video, MoreVertical, 
  Check, CheckCheck, Store, ShieldCheck, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Conversation = {
  shopId: number;
  shopName: string;
  category: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isVendorTyping?: boolean;
};

const mockConversations: Conversation[] = [
  { 
    shopId: 1, shopName: 'TechCity Electronics', category: 'Electronics',
    lastMessage: 'For this model, we can do ₦430,000 with free delivery within Lagos.', 
    time: '2m ago', unread: 2, online: true 
  },
  { 
    shopId: 2, shopName: 'PhoneHub Plus', category: 'Phones & Gadgets',
    lastMessage: 'Authentic AirPods Pro, verified and tested!', 
    time: '1h ago', unread: 0, online: true 
  },
  { 
    shopId: 3, shopName: 'FabriQ Lounge', category: 'Fabrics',
    lastMessage: 'The lace fabric is still available. Would you like 3 yards or 5?', 
    time: '3h ago', unread: 1, online: false 
  },
  { 
    shopId: 6, shopName: 'BeautyGlow Lagos', category: 'Beauty & Wellness',
    lastMessage: 'The foundation you asked about is in stock.', 
    time: '5h ago', unread: 0, online: false 
  },
  { 
    shopId: 4, shopName: 'AutoZone Parts', category: 'Auto Parts',
    lastMessage: 'We can get the brake pads delivered by tomorrow.', 
    time: '1d ago', unread: 0, online: false 
  },
];

export default function ChatHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = mockConversations.filter(c =>
    c.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="container mx-auto px-3 py-6 md:py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-foreground tracking-tight">Messages</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {totalUnread > 0 
                ? `You have ${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` 
                : 'All caught up! No unread messages.'}
            </p>
          </div>
          <Link href="/shops">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Store className="w-4 h-4" /> Browse Shops
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <div className="space-y-2">
            {filteredConversations.map(conv => {
              const shop = shops.find(s => s.id === conv.shopId);
              return (
                <Link key={conv.shopId} href={`/chat/${conv.shopId}`} onClick={() => sessionStorage.setItem('chatReferrer', 'chat')}>
                  <div className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all cursor-pointer ${
                    conv.unread > 0 
                      ? 'bg-primary/5 border-primary/20 hover:border-primary/40' 
                      : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
                  }`}>
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-background">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-base md:text-lg">
                          {conv.shopName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background"></span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className={`text-sm md:text-base truncate ${conv.unread > 0 ? 'font-bold text-foreground' : 'font-semibold text-foreground'}`}>
                            {conv.shopName}
                          </h3>
                          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                        </div>
                        <span className={`text-xs shrink-0 ${conv.unread > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conv.category}</p>
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Unread badge + arrow */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 md:w-6 md:h-6 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm md:text-base">
              {searchQuery 
                ? 'Try a different search term or check your spelling.'
                : 'Start a conversation with a vendor by visiting their shop page.'}
            </p>
            {!searchQuery && (
              <Link href="/shops">
                <Button className="rounded-xl gap-2">
                  <Store className="w-4 h-4" /> Browse Shops
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
