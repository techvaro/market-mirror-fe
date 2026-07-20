import { Link } from 'wouter';
import { Star, MapPin, Package } from 'lucide-react';
import { Shop } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard = ({ shop }: ShopCardProps) => {
  return (
    <Link href={`/shop/${shop.id}`}>
      <motion.div 
        whileHover={{ y: -4 }}
        className="group bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow"
      >
        <div 
          className="h-24 w-full"
          style={{ background: shop.bannerGradient }}
        />
        
        <div className="p-5 flex flex-col flex-grow relative pt-12">
          {/* Avatar floating over banner */}
          <div className="absolute -top-8 left-5 w-16 h-16 bg-background rounded-full p-1 border border-border shadow-sm">
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center font-display font-bold text-xl text-muted-foreground">
              {shop.name.charAt(0)}
            </div>
          </div>

          <div className="flex justify-between items-start mb-1">
            <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {shop.name}
            </h3>
            <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold">{shop.rating}</span>
            </div>
          </div>
          
          <div className="text-sm text-primary font-medium mb-3">
            {shop.category}
          </div>
          
          <div className="space-y-2 mt-auto text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{shop.location.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{shop.productCount} Products</span>
            </div>
          </div>
          
          <div className="w-full mt-4 h-10 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
            Visit Shop
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
