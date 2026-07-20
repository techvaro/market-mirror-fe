import { Link } from 'wouter';
import { Star, ShoppingBag } from 'lucide-react';
import { Product, shops } from '@/data/mockData';
import { formatNaira } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const shop = shops.find(s => s.id === product.shopId);

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        whileHover={{ y: -4 }}
        className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div 
          className="aspect-square w-full relative"
          style={{ backgroundColor: product.color }}
        >
          {!product.stock && (
            <div className="absolute top-2 right-2 bg-background/90 text-destructive text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-medium text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-lg text-foreground">
                {formatNaira(product.price)}
              </span>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            
            {shop && (
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex items-center gap-1 truncate">
                <span className="truncate">Sold by {shop.name}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
