import { useEffect, useState, type FormEvent } from 'react';
import { Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMySellerApplication } from '@/services/sellerService';
import { databases, appwriteConfig } from '@/lib/appwrite';
import type { Seller } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SellerSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMySellerApplication(user.id)
      .then((s) => {
        if (s) {
          setSeller(s);
          setStoreName(s.storeName);
          setDescription(s.description);
          setPhone(s.phone);
        }
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!seller) return;
    setIsSaving(true);
    try {
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.collections.sellerRequests, seller.id, {
        storeName,
        description,
        phone,
      });
      showToast('پروفایل فروشگاه به‌روزرسانی شد', 'success');
    } catch {
      showToast('خطا در ذخیره تغییرات', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!seller) {
    return <p className="text-sm text-ink-muted">اطلاعات فروشگاه یافت نشد.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 text-xl font-bold text-ink">
        <Store className="h-5 w-5" /> پروفایل فروشگاه
      </h1>

      <form onSubmit={handleSubmit} className="glass-card max-w-lg space-y-4 p-6">
        <Input label="نام فروشگاه" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus-visible:border-brand-400"
          />
        </div>
        <Input label="شماره تماس" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
        <Button type="submit" isLoading={isSaving}>
          ذخیره تغییرات
        </Button>
      </form>
    </div>
  );
}
