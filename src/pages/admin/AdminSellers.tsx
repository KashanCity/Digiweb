import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Store } from 'lucide-react';
import { listSellerRequests, reviewSellerApplication } from '@/services/sellerService';
import type { Seller, SellerRequestStatus } from '@/types';
import { useToast } from '@/context/ToastContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

const tabs: { value: SellerRequestStatus; label: string }[] = [
  { value: 'pending', label: 'در انتظار بررسی' },
  { value: 'approved', label: 'تأییدشده' },
  { value: 'rejected', label: 'رد‌شده' },
];

export default function AdminSellers() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<SellerRequestStatus>('pending');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<Seller | null>(null);
  const [reason, setReason] = useState('');

  async function load() {
    setIsLoading(true);
    try {
      setSellers(await listSellerRequests(tab));
    } catch {
      setSellers([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleApprove(seller: Seller) {
    try {
      await reviewSellerApplication(seller.id, 'approved');
      showToast('فروشنده تأیید شد', 'success');
      load();
    } catch {
      showToast('خطا در تأیید فروشنده', 'error');
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;
    try {
      await reviewSellerApplication(rejectTarget.id, 'rejected', reason);
      showToast('درخواست رد شد', 'success');
      setRejectTarget(null);
      setReason('');
      load();
    } catch {
      showToast('خطا در رد درخواست', 'error');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">مدیریت فروشندگان</h1>

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
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <EmptyState icon={Store} title="موردی یافت نشد" />
      ) : (
        <div className="space-y-3">
          {sellers.map((seller) => (
            <div key={seller.id} className="glass-card p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{seller.storeName}</p>
                  <p className="mt-1 text-xs text-ink-muted">{seller.description}</p>
                  <p className="mt-1 text-xs text-ink-subtle" dir="ltr">{seller.phone}</p>
                </div>
                {seller.status === 'rejected' && <Badge tone="danger">رد‌شده</Badge>}
                {seller.status === 'approved' && <Badge tone="success">تأییدشده</Badge>}
                {seller.status === 'pending' && <Badge tone="warning">در انتظار</Badge>}
              </div>

              {seller.status === 'rejected' && seller.rejectionReason && (
                <p className="mb-2 text-xs text-danger">دلیل رد: {seller.rejectionReason}</p>
              )}

              {seller.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => handleApprove(seller)}>
                    <CheckCircle2 className="h-4 w-4" />
                    تأیید
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setRejectTarget(seller)}>
                    <XCircle className="h-4 w-4" />
                    رد درخواست
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="دلیل رد درخواست">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="دلیل رد را بنویسید..."
          className="w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus-visible:border-brand-400"
        />
        <Button fullWidth className="mt-3" variant="danger" onClick={handleReject}>
          ثبت رد درخواست
        </Button>
      </Modal>
    </div>
  );
}
