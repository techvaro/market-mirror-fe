import { Link } from 'wouter';
import { Store, Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  const [socialModalOpen, setSocialModalOpen] = useState(false);

  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSocialModalOpen(true);
  };

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-3 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="mb-6 inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              The energy of Alaba Market, delivered with clarity. Discover authentic electronics, fabrics, and more from verified Lagos sellers.
            </p>
            <div className="flex gap-4">
              <a href="#" onClick={handleSocialClick} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" onClick={handleSocialClick} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" onClick={handleSocialClick} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Explore Market</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shops" className="hover:text-primary transition-colors">All Shops</Link></li>
              <li><Link href="/map" className="hover:text-primary transition-colors">Market Map</Link></li>
              <li><Link href="/products?category=Electronics" className="hover:text-primary transition-colors">Electronics Zone</Link></li>
              <li><Link href="/products?category=Fabrics" className="hover:text-primary transition-colors">Fashion & Fabrics</Link></li>
              <li><Link href="/products?category=Auto%20Parts" className="hover:text-primary transition-colors">Auto Parts</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Delivery Information</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Return Policy</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/vendors/open-shop" className="hover:text-primary transition-colors">Open a Shop</Link></li>
              <li><Link href="/vendors/dashboard" className="hover:text-primary transition-colors">Vendor Dashboard</Link></li>
              <li><Link href="/vendors/policies" className="hover:text-primary transition-colors">Seller Policies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Market Mirror Lagos. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <Dialog open={socialModalOpen} onOpenChange={setSocialModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Social Media Coming Soon</DialogTitle>
            <DialogDescription>
              We're currently building our social presence. Check back later to connect with Market Mirror on social platforms!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setSocialModalOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};
