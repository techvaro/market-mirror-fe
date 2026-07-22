import { Link } from 'wouter';
import { Star, ShoppingCart, Flame } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import type { Product } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.variants[0] || 'Default', 1);
  };

  const mockSoldCount = `${(product.id * 1.2).toFixed(1)}K+ sold`;
  const originalPrice = Math.round(product.price * 1.4);

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:shadow-md cursor-pointer h-full">
        <div>
          {/* Product Image Area */}
          <div 
            className="relative aspect-square w-full overflow-hidden bg-muted"
            style={{ backgroundColor: product.color }}
          >
            {!product.stock ? (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-[10px] font-bold text-destructive border-2 border-destructive px-2 py-0.5 rounded uppercase">
                  Out of Stock
                </span>
              </div>
            ) : (
              <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm uppercase">
                ONLY FEW LEFT
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="p-2 flex flex-col gap-0.5">
            {/* Title (Max 2 lines) */}
            <h3 className="text-xs font-medium text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Ratings & Sold Count Row */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
              <div className="flex items-center text-yellow-500">
                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold ml-0.5 text-foreground">{product.rating}</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center text-orange-600 font-medium truncate">
                <Flame className="w-2.5 h-2.5 fill-orange-500 text-orange-500 mr-0.5 shrink-0" />
                <span>{mockSoldCount}</span>
              </div>
            </div>

            {/* Promo Tag */}
            <div className="inline-block mt-0.5">
              <span className="bg-orange-500/10 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                BEST-SELLING ITEM
              </span>
            </div>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="p-2 pt-0 flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-orange-600 font-bold leading-none mb-0.5">
              Last day
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-extrabold text-orange-600 leading-none">
                {formatNaira(product.price)}
              </span>
              <span className="text-[9px] text-muted-foreground line-through">
                {formatNaira(originalPrice)}
              </span>
            </div>
          </div>

          {/* Circular Quick Add Button */}
          <Button
            size="icon"
            variant="outline"
            onClick={handleQuickAdd}
            className="w-7 h-7 rounded-full border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shrink-0"
          >
            <ShoppingCart className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
