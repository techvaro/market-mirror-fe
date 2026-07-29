import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, Menu, Store, Map, LogOut, FileText, Settings, LayoutGrid, AlertCircle, AlertTriangle, Bell, MessageCircle, ChevronDown, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDisputes } from '@/context/DisputesContext';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { shops, nigerianStates, stateMarkets } from '@/data/mockData';

const mockChats = [
  { shopId: 1, shopName: 'TechCity Electronics', lastMessage: 'For this model, we can do ₦430,000...', time: '2m ago', unread: 2 },
  { shopId: 2, shopName: 'PhoneHub Plus', lastMessage: 'Authentic AirPods, verified!', time: '1h ago', unread: 0 },
  { shopId: 6, shopName: 'BeautyGlow Lagos', lastMessage: 'The foundation you asked about...', time: '3h ago', unread: 1 },
];

export const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { addReport } = useDisputes();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedState, setSelectedState] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportState, setReportState] = useState('');
  const [reportMarket, setReportMarket] = useState('');
  const [reportShopId, setReportShopId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const reportAvailableMarkets = reportState ? (stateMarkets[reportState] || []) : [];
  const filteredShops = reportMarket 
    ? shops.filter(s => s.market === reportMarket)
    : shops;

  const availableMarkets = selectedState ? (stateMarkets[selectedState] || []) : [];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedMarket('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportShopId || !reportReason || !reportDescription) return;
    
    addReport({
      shopId: parseInt(reportShopId),
      reason: reportReason,
      description: reportDescription
    });
    
        setReportModalOpen(false);
        setReportState('');
        setReportMarket('');
        setReportShopId('');
    setReportReason('');
    setReportDescription('');
    
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep Market Mirror safe.",
    });
  };

  const totalUnreadChats = mockChats.reduce((sum, c) => sum + c.unread, 0);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* City / Market Selector Bar */}
      <div className="bg-white text-foreground border-b border-border">
        <div className="container mx-auto px-3 h-9 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline text-muted-foreground">Location:</span>
            <select
              value={selectedState}
              onChange={e => handleStateChange(e.target.value)}
              className="bg-muted border-none text-foreground text-xs font-bold rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="" disabled className="bg-background text-muted-foreground">Location</option>
              {nigerianStates.map(state => (
                <option key={state} value={state} className="bg-background text-foreground">{state}</option>
              ))}
            </select>
            <span className="text-muted-foreground/40">|</span>
            <select
              value={selectedMarket}
              onChange={e => setSelectedMarket(e.target.value)}
              className="bg-muted border-none text-foreground text-xs font-bold rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[200px] truncate"
            >
              <option value="" disabled className="bg-background text-muted-foreground">Select Market</option>
              {availableMarkets.map(m => (
                <option key={m} value={m} className="bg-background text-foreground">{m}</option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <span>Sell on Market Mirror</span>
            <span className="text-border">|</span>
            <span>Help Center</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-3 h-14 md:h-16 flex items-center justify-between gap-2 md:gap-4">
          {/* Logo + Nav Links */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Logo size="sm" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <Link href="/shops" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted">
                <LayoutGrid className="w-4 h-4" /> Browse Shops
              </Link>
              <Link href="/map" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted">
                <Map className="w-4 h-4" /> Market Map
              </Link>
              <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted">
                <Store className="w-4 h-4" /> Shop All
              </Link>
            </nav>
          </div>

          {/* Search + Icons */}
          <div className="flex flex-1 items-center justify-end gap-1.5 md:gap-3 min-w-0">
            {/* Desktop Search */}
            <div className="hidden md:flex relative flex-1 min-w-[120px] max-w-sm">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <button type="submit" className="absolute left-2.5 top-2.5 text-muted-foreground hover:text-foreground">
                  <Search className="h-4 w-4" />
                </button>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full min-w-0 bg-muted/50 border border-border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </form>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors shrink-0">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications - only when logged in */}
            {user && (
              <Link href="/notifications" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>
            )}

            {/* Chat Dropdown - only when logged in */}
            {user && (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors shrink-0">
                      <MessageCircle className="w-5 h-5" />
                      {totalUnreadChats > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
                          {totalUnreadChats}
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-0" align="end">
                    <div className="px-4 py-3 border-b border-border">
                      <h3 className="font-bold text-sm">Messages</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{totalUnreadChats} unread</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mockChats.map(chat => (
                        <Link key={chat.shopId} href={`/chat/${chat.shopId}`} onClick={() => { sessionStorage.setItem('chatReferrer', 'chat'); document.dispatchEvent(new Event('mousedown')); }}>
                          <DropdownMenuItem className="px-4 py-3 cursor-pointer gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {chat.shopName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-sm truncate">{chat.shopName}</span>
                                <span className="text-[10px] text-muted-foreground shrink-0">{chat.time}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                              <span className="w-5 h-5 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center shrink-0">
                                {chat.unread}
                              </span>
                            )}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border p-2">
                      <Link href="/chat" onClick={() => document.dispatchEvent(new Event('mousedown'))}>
                        <Button variant="ghost" className="w-full text-xs" size="sm">View All Messages</Button>
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* User / Sign In */}
            {user ? (
              <div className="hidden sm:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border border-primary/20">
                        {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary/10 text-primary">
                        {user.role === 'vendor' ? 'Vendor' : 'Buyer'}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/orders" onClick={() => document.dispatchEvent(new Event('mousedown'))}>
                      <DropdownMenuItem className="cursor-pointer"><FileText className="mr-2 h-4 w-4" /><span>My Orders</span></DropdownMenuItem>
                    </Link>
                    <Link href="/profile" onClick={() => document.dispatchEvent(new Event('mousedown'))}>
                      <DropdownMenuItem className="cursor-pointer"><Settings className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
                    </Link>
                    <Link href="/disputes" onClick={() => document.dispatchEvent(new Event('mousedown'))}>
                      <DropdownMenuItem className="cursor-pointer"><AlertCircle className="mr-2 h-4 w-4" /><span>Disputes</span></DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => setReportModalOpen(true)} className="cursor-pointer">
                      <AlertTriangle className="mr-2 h-4 w-4" /><span>Report Seller</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /><span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/sign-in" className="hidden sm:flex">
                <Button variant="outline" className="rounded-full px-5 text-sm">Sign In</Button>
              </Link>
            )}

            {/* Hamburger */}
            <button 
              className="lg:hidden p-2 -mr-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background py-4 px-4 space-y-4 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <button type="submit" className="absolute left-2.5 top-2.5 text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" />
            </button>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-muted border border-border rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none"
            />
          </form>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-1 font-medium">
            <Link href="/shops" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 text-foreground rounded-lg hover:bg-muted">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" /> Browse Shops
            </Link>
            <Link href="/map" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 text-foreground rounded-lg hover:bg-muted">
              <Map className="w-5 h-5 text-muted-foreground" /> Market Map
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 text-foreground rounded-lg hover:bg-muted">
              <Store className="w-5 h-5 text-muted-foreground" /> Shop All
            </Link>
            {user && (
              <>
                <Link href="/chat" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 text-foreground rounded-lg hover:bg-muted">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" /> Messages
                  {totalUnreadChats > 0 && (
                    <span className="ml-auto w-5 h-5 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">{totalUnreadChats}</span>
                  )}
                </Link>
                <Link href="/notifications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 text-foreground rounded-lg hover:bg-muted">
                  <Bell className="w-5 h-5 text-muted-foreground" /> Notifications
                  <span className="ml-auto w-5 h-5 bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full flex items-center justify-center">3</span>
                </Link>
              </>
            )}
          </nav>
          
          <div className="border-t border-border pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
                    <AvatarFallback className="bg-secondary text-secondary-foreground">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-3"><FileText className="mr-2 h-4 w-4" /> My Orders</Button>
                  </Link>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-3"><Settings className="mr-2 h-4 w-4" /> Profile</Button>
                  </Link>
                  <Link href="/disputes" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-3"><AlertCircle className="mr-2 h-4 w-4" /> Disputes</Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start px-3" onClick={() => { setMobileMenuOpen(false); setReportModalOpen(true); }}>
                    <AlertTriangle className="mr-2 h-4 w-4" /> Report Seller
                  </Button>
                  <Button variant="destructive" className="w-full justify-start mt-2 px-3" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="w-full block px-3">
                <Button className="w-full rounded-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}

      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report a Seller</DialogTitle>
            <DialogDescription>
              Help us maintain a safe marketplace. Reports are confidential and reviewed by our team within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleReportSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <select 
                value={reportState} 
                onChange={e => {
                  setReportState(e.target.value);
                  setReportMarket('');
                  setReportShopId('');
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                required
              >
                <option value="" disabled>Select a state...</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Market</label>
              <select 
                value={reportMarket} 
                onChange={e => {
                  setReportMarket(e.target.value);
                  setReportShopId('');
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                required
                disabled={!reportState}
              >
                <option value="" disabled>{reportState ? 'Select a market...' : 'Select a state first...'}</option>
                {reportAvailableMarkets.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Shop</label>
              <select 
                value={reportShopId} 
                onChange={e => setReportShopId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                required
                disabled={!reportMarket}
              >
                <option value="" disabled>{reportMarket ? 'Select a shop...' : 'Select a market first...'}</option>
                {filteredShops.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Report</label>
              <select 
                value={reportReason} 
                onChange={e => setReportReason(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                required
              >
                <option value="" disabled>Select a reason...</option>
                <option value="fake_items">Selling fake/counterfeit items</option>
                <option value="scam">Scam/Fraudulent behavior</option>
                <option value="offensive">Offensive communication</option>
                <option value="wrong_location">Location details are incorrect</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={reportDescription}
                onChange={e => setReportDescription(e.target.value)}
                placeholder="Please provide details to help us investigate..."
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setReportModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive">Submit Report</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};
