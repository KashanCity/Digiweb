import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { getProductsByIds } from '@/services/productService';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function Wishlist() {
  const { productIds, isLoading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wishlistLoading) return;
    if (productIds.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getProductsByIds(productIds)
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, [productIds, wishlistLoading]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">علاقه‌مندی‌های من</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="لیست علاقه‌مندی‌ها خالی است"
          description="محصولاتی که دوست دارید بعداً بخرید را اینجا نگه دارید."
          action={
            <Link to="/shop">
              <Button size="sm">مشاهده فروشگاه</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
