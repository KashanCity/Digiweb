import { Link, useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import { Heart, ShoppingCart, Star, Store } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, calcDiscountPercent } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const discount = calcDiscountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      stock: product.stock,
      sellerId: product.sellerId,
    });
    showToast('محصول به سبد خرید اضافه شد', 'success');
  }

  function handleToggleWishlist(e: MouseEvent) {
    e.preventDefault();
    if (!user) {
      showToast('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید', 'info');
      navigate('/login');
      return;
    }
    toggleWishlist(product.id);
  }

  return (
    <div className="glass-card group relative flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface-overlay">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-subtle">بدون تصویر</div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="danger">٪{discount.toLocaleString('fa-IR')} تخفیف</Badge>}
          {outOfStock && <Badge tone="neutral">ناموجود</Badge>}
        </div>

        <button
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-2 left-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface/70 backdrop-blur-md transition-colors',
            wishlisted ? 'text-danger' : 'text-ink hover:text-danger',
          )}
          aria-label="افزودن به علاقه‌مندی"
        >
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-danger')} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/seller/${product.sellerId}`} className="flex items-center gap-1 text-xs text-ink-subtle hover:text-brand-300">
          <Store className="h-3 w-3" /> {product.sellerName}
        </Link>

        <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-brand-300">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span>{product.rating.toLocaleString('fa-IR')}</span>
          <span className="text-ink-subtle">·</span>
          <span>{product.salesCount.toLocaleString('fa-IR')} فروش</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-ink-subtle line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
            <span className="text-sm font-bold text-ink">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              outOfStock
                ? 'cursor-not-allowed bg-surface-overlay text-ink-subtle'
                : 'bg-brand-500/15 text-brand-300 hover:bg-brand-500 hover:text-white',
            )}
            aria-label="افزودن به سبد خرید"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
