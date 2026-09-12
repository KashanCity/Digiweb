import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingCart, Star, Store, Minus, Plus, ShieldCheck } from 'lucide-react';
import { getProductById, getRelatedProducts } from '@/services/productService';
import { mockReviewsFor, mockSellers } from '@/lib/mockData';
import type { Product, Review } from '@/types';
import { formatPrice, calcDiscountPercent } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductGallery } from '@/components/product/ProductGallery';
import { RatingStars } from '@/components/product/RatingStars';
import { ReviewList } from '@/components/product/ReviewList';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(id).then((p) => {
      setProduct(p);
      setQuantity(1);
      setIsLoading(false);
      if (p) {
        setReviews(mockReviewsFor(p.id));
        getRelatedProducts(p).then(setRelated);
      }
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <ProductCardSkeleton />
        <div className="space-y-3">
          <div className="skeleton h-6 w-2/3" />
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-2 text-lg font-bold text-ink">محصول پیدا نشد</h1>
        <Button onClick={() => navigate('/shop')}>بازگشت به فروشگاه</Button>
      </div>
    );
  }

  const discount = calcDiscountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;
  const seller = mockSellers.find((s) => s.id === product.sellerId);

  function handleAddToCart(redirectToCheckout = false) {
    if (!product || outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      stock: product.stock,
      sellerId: product.sellerId,
    });
    if (redirectToCheckout) {
      navigate('/cart');
    } else {
      showToast('محصول به سبد خرید اضافه شد', 'success');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <Link to={`/seller/${product.sellerId}`} className="mb-2 flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-300">
            <Store className="h-4 w-4" /> {product.sellerName}
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-ink">{product.name}</h1>

          <div className="mb-4 flex items-center gap-3 text-sm text-ink-muted">
            <div className="flex items-center gap-1">
              <RatingStars rating={product.rating} />
              <span className="mr-1">{product.rating.toLocaleString('fa-IR')}</span>
            </div>
            <span>·</span>
            <span>{product.reviewCount.toLocaleString('fa-IR')} نظر</span>
            <span>·</span>
            <span>{product.salesCount.toLocaleString('fa-IR')} فروش</span>
          </div>

          <div className="glass-card mb-5 flex flex-wrap items-center gap-3 p-4">
            <span className="text-2xl font-extrabold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-sm text-ink-subtle line-through">{formatPrice(product.compareAtPrice)}</span>
                <Badge tone="danger">٪{discount.toLocaleString('fa-IR')} تخفیف</Badge>
              </>
            )}
            <span className="mr-auto">
              {outOfStock ? <Badge tone="neutral">ناموجود</Badge> : <Badge tone="success">موجود در انبار</Badge>}
            </span>
          </div>

          {!outOfStock && (
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm text-ink-muted">تعداد:</span>
              <div className="flex items-center gap-1 rounded-xl border border-surface-border">
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                  className="flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm text-ink">{quantity.toLocaleString('fa-IR')}</span>
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs text-ink-subtle">{product.stock.toLocaleString('fa-IR')} عدد موجود</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" size="lg" disabled={outOfStock} onClick={() => handleAddToCart(true)}>
              خرید مستقیم
            </Button>
            <Button variant="secondary" size="lg" disabled={outOfStock} onClick={() => handleAddToCart(false)}>
              <ShoppingCart className="h-4 w-4" />
              افزودن به سبد
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (!user) {
                  showToast('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید', 'info');
                  navigate('/login');
                  return;
                }
                toggleWishlist(product.id);
              }}
              aria-label="علاقه‌مندی"
            >
              <Heart className={product.id && isWishlisted(product.id) ? 'h-4 w-4 fill-danger text-danger' : 'h-4 w-4'} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('لینک محصول کپی شد', 'info');
              }}
              aria-label="اشتراک‌گذاری"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-ink-subtle">
            <ShieldCheck className="h-4 w-4 text-success" />
            ضمانت بازگشت وجه تا ۷ روز پس از خرید
          </div>
        </div>
      </div>

      {/* توضیحات و مشخصات */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="mb-3 text-base font-bold text-ink">توضیحات محصول</h2>
          <p className="text-sm leading-7 text-ink-muted">{product.description}</p>
        </div>

        <div className="glass-card p-6">
          <h2 className="mb-3 text-base font-bold text-ink">فروشنده</h2>
          {seller && (
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white">
                {seller.storeName[0]}
              </span>
              <div>
                <Link to={`/seller/${seller.id}`} className="text-sm font-semibold text-ink hover:text-brand-300">
                  {seller.storeName}
                </Link>
                <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {seller.rating.toLocaleString('fa-IR')} ·{' '}
                  {seller.productCount.toLocaleString('fa-IR')} محصول
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* نظرات */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-ink">نظرات خریداران</h2>
        <ReviewList reviews={reviews} />
      </div>

      {/* محصولات مشابه */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-lg font-bold text-ink">محصولات مشابه</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
