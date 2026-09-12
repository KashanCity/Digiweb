import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMySellerApplication, submitSellerApplication } from '@/services/sellerService';
import type { Seller } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Sell() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [existing, setExisting] = useState<Seller | null | undefined>(undefined);
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [storeImageFile, setStoreImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setExisting(null);
      return;
    }
    getMySellerApplication(user.id)
      .then(setExisting)
      .catch(() => setExisting(null));
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/sell' } } });
      return;
    }
    if (!storeName.trim() || !description.trim() || !phone.trim()) {
      showToast('لطفاً همه فیلدهای الزامی را تکمیل کنید', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const seller = await submitSellerApplication({
        userId: user.id,
        storeName,
        description,
        phone,
        storeImageFile,
      });
      setExisting(seller);
      showToast('درخواست فروشندگی شما ثبت شد', 'success');
    } catch {
      showToast('خطا در ثبت درخواست. دوباره تلاش کنید', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (existing === undefined) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (existing) {
    const statusMeta = {
      pending: { icon: Clock, tone: 'warning' as const, bgClass: 'bg-warning/15 text-warning', label: 'درخواست شما در حال بررسی است' },
      approved: { icon: CheckCircle2, tone: 'success' as const, bgClass: 'bg-success/15 text-success', label: 'درخواست شما تأیید شد! اکنون فروشنده هستید' },
      rejected: { icon: XCircle, tone: 'danger' as const, bgClass: 'bg-danger/15 text-danger', label: 'درخواست شما رد شد' },
    }[existing.status];
    const StatusIcon = statusMeta.icon;

    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${statusMeta.bgClass}`}>
          <StatusIcon className="h-8 w-8" />
        </span>
        <h1 className="mb-2 text-lg font-bold text-ink">{statusMeta.label}</h1>
        <Badge tone={statusMeta.tone}>{existing.storeName}</Badge>
        {existing.status === 'rejected' && existing.rejectionReason && (
          <p className="mt-4 text-sm text-ink-muted">دلیل رد: {existing.rejectionReason}</p>
        )}
        {existing.status === 'approved' && (
          <Button className="mt-6" onClick={() => navigate('/seller/dashboard')}>
            رفتن به پنل فروشنده
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <Store className="h-7 w-7" />
        </span>
        <h1 className="text-xl font-bold text-ink">فروشنده شو</h1>
        <p className="mt-2 text-sm text-ink-muted">اطلاعات فروشگاه خود را وارد کنید تا پس از بررسی، بتوانید محصولات‌تان را بفروشید.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
        <Input label="نام فروشگاه" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">توضیحات فروشگاه</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus-visible:border-brand-400"
          />
        </div>
        <Input label="شماره تماس" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" required />
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">تصویر فروشگاه (اختیاری)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setStoreImageFile(e.target.files?.[0])}
            className="w-full text-sm text-ink-muted file:ml-3 file:rounded-lg file:border-0 file:bg-surface-overlay file:px-3 file:py-2 file:text-ink"
          />
        </div>
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          ارسال درخواست فروشندگی
        </Button>
      </form>
    </div>
  );
}
