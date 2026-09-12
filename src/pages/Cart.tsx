import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const FREE_SHIPPING_THRESHOLD = 1_000_000;
const SHIPPING_COST = 45_000;

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCost = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const hasStockIssue = items.some((i) => i.quantity > i.stock || i.stock <= 0);

  function handleCheckout() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <EmptyState
          icon={ShoppingCart}
          title="سبد خرید شما خالی است"
          description="محصولاتی که می‌خواهید بخرید را از فروشگاه اضافه کنید."
          action={
            <Link to="/shop">
              <Button size="sm">مشاهده فروشگاه</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-bold text-ink">سبد خرید</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => {
            const outOfStock = item.stock <= 0;
            const exceedsStock = item.quantity > item.stock;
            return (
              <div key={item.productId} className="glass-card flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-overlay">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.productId}`} className="line-clamp-1 text-sm font-medium text-ink hover:text-brand-300">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-ink">{formatPrice(item.price)}</p>
                  {(outOfStock || exceedsStock) && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {outOfStock ? 'این محصول ناموجود است' : `فقط ${item.stock.toLocaleString('fa-IR')} عدد موجود است`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 rounded-xl border border-surface-border">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm text-ink">{item.quantity.toLocaleString('fa-IR')}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger"
                  aria-label="حذف از سبد"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="glass-card h-fit space-y-3 p-5">
          <h2 className="text-sm font-semibold text-ink">خلاصه سفارش</h2>
          <div className="flex justify-between text-sm text-ink-muted">
            <span>جمع جزء</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-muted">
            <span>هزینه ارسال</span>
            <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'رایگان'}</span>
          </div>
          <div className="flex justify-between border-t border-surface-border pt-3 text-base font-bold text-ink">
            <span>مبلغ نهایی</span>
            <span>{formatPrice(total)}</span>
          </div>

          {hasStockIssue && (
            <p className="flex items-center gap-1.5 text-xs text-danger">
              <AlertTriangle className="h-3.5 w-3.5" />
              برای ادامه، موارد ناموجود را از سبد حذف یا تعداد را اصلاح کنید.
            </p>
          )}

          <Button fullWidth size="lg" disabled={hasStockIssue} onClick={handleCheckout}>
            ادامه فرآیند خرید
          </Button>
        </div>
      </div>
    </div>
  );
}
