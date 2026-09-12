import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { listSellerProducts, deleteProduct } from '@/services/productService';
import type { Product, ProductStatus } from '@/types';
import { formatPrice } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

const statusMeta: Record<ProductStatus, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'تأییدشده', tone: 'success' },
  pending: { label: 'در انتظار بررسی', tone: 'warning' },
  rejected: { label: 'رد‌شده', tone: 'danger' },
};

export default function SellerProducts() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    if (!user) return;
    setIsLoading(true);
    try {
      setProducts(await listSellerProducts(user.id));
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      showToast('محصول حذف شد', 'success');
      load();
    } catch {
      showToast('خطا در حذف محصول', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">محصولات من</h1>
        <Link to="/seller/products/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            افزودن محصول
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="هنوز محصولی ثبت نکرده‌اید"
          description="اولین محصول خود را اضافه کنید تا بعد از تأیید ادمین در فروشگاه نمایش داده شود."
          action={
            <Link to="/seller/products/new">
              <Button size="sm">افزودن محصول</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="glass-card flex items-center gap-4 p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-overlay">
                {product.images[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {formatPrice(product.price)} · موجودی: {product.stock.toLocaleString('fa-IR')}
                </p>
              </div>
              <Badge tone={statusMeta[product.status].tone}>{statusMeta[product.status].label}</Badge>
              <div className="flex gap-1">
                <Link
                  to={`/seller/products/${product.id}/edit`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-overlay hover:text-ink"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
