import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Package } from 'lucide-react';
import { listProductsByStatus, approveProduct, rejectProduct, deleteProduct } from '@/services/productService';
import type { Product, ProductStatus } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

const tabs: { value: ProductStatus; label: string }[] = [
  { value: 'pending', label: 'در انتظار بررسی' },
  { value: 'approved', label: 'تأییدشده' },
  { value: 'rejected', label: 'رد‌شده' },
];

export default function AdminProducts() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<ProductStatus>('pending');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [reason, setReason] = useState('');

  async function load() {
    setIsLoading(true);
    try {
      setProducts(await listProductsByStatus(tab));
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleApprove(product: Product) {
    try {
      await approveProduct(product.id);
      showToast('محصول تأیید شد', 'success');
      load();
    } catch {
      showToast('خطا در تأیید محصول', 'error');
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;
    try {
      await rejectProduct(rejectTarget.id, reason);
      showToast('محصول رد شد', 'success');
      setRejectTarget(null);
      setReason('');
      load();
    } catch {
      showToast('خطا در رد محصول', 'error');
    }
  }

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
      <h1 className="mb-6 text-xl font-bold text-ink">مدیریت محصولات</h1>

      <div className="mb-5 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              tab === t.value ? 'bg-brand-gradient text-white' : 'bg-surface-overlay text-ink-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState icon={Package} title="محصولی یافت نشد" />
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-overlay">
                {product.images[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {product.sellerName} · {formatPrice(product.price)}
                </p>
                {product.status === 'rejected' && product.rejectionReason && (
                  <p className="mt-1 text-xs text-danger">دلیل رد: {product.rejectionReason}</p>
                )}
              </div>

              {product.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(product)}>
                    <CheckCircle2 className="h-4 w-4" />
                    تأیید
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setRejectTarget(product)}>
                    <XCircle className="h-4 w-4" />
                    رد
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge tone={product.status === 'approved' ? 'success' : 'danger'}>
                    {product.status === 'approved' ? 'تأییدشده' : 'رد‌شده'}
                  </Badge>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="دلیل رد محصول">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="دلیل رد را بنویسید..."
          className="w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus-visible:border-brand-400"
        />
        <Button fullWidth className="mt-3" variant="danger" onClick={handleReject}>
          ثبت رد محصول
        </Button>
      </Modal>
    </div>
  );
}
