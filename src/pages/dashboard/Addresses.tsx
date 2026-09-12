import { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '@/services/addressService';
import type { Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AddressFormModal } from '@/components/checkout/AddressFormModal';

export default function Addresses() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | undefined>(undefined);

  async function load() {
    if (!user) return;
    setIsLoading(true);
    try {
      setAddresses(await getAddresses(user.id));
    } catch {
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleSubmit(address: Omit<Address, 'id'>) {
    if (!user) return;
    try {
      if (editing) {
        await updateAddress(editing.id, address);
      } else {
        await createAddress(user.id, address);
      }
      showToast('آدرس با موفقیت ذخیره شد', 'success');
      setEditing(undefined);
      load();
    } catch {
      showToast('خطا در ذخیره آدرس', 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAddress(id);
      showToast('آدرس حذف شد', 'success');
      load();
    } catch {
      showToast('خطا در حذف آدرس', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">آدرس‌های من</h1>
        <Button size="sm" onClick={() => { setEditing(undefined); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          افزودن آدرس
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="هنوز آدرسی ثبت نکرده‌اید" description="برای تسویه‌حساب سریع‌تر، آدرس خود را اضافه کنید." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="glass-card p-4">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-semibold text-ink">{address.fullName}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(address); setModalOpen(true); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-overlay hover:text-ink"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs leading-6 text-ink-muted">
                {address.province}، {address.city}، {address.addressLine}
                <br />
                کد پستی: {address.postalCode} · {address.phone}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
