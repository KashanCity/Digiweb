import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Address } from '@/types';

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<Address, 'id'>) => Promise<void>;
  initial?: Address;
}

export function AddressFormModal({ open, onClose, onSubmit, initial }: AddressFormModalProps) {
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? '',
    province: initial?.province ?? '',
    city: initial?.city ?? '',
    addressLine: initial?.addressLine ?? '',
    postalCode: initial?.postalCode ?? '',
    phone: initial?.phone ?? '',
  });
  const [isSaving, setIsSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="نام تحویل‌گیرنده" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="استان" value={form.province} onChange={(e) => update('province', e.target.value)} required />
          <Input label="شهر" value={form.city} onChange={(e) => update('city', e.target.value)} required />
        </div>
        <Input label="آدرس کامل" value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="کد پستی" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} dir="ltr" required />
          <Input label="شماره تماس" value={form.phone} onChange={(e) => update('phone', e.target.value)} dir="ltr" required />
        </div>
        <Button type="submit" fullWidth isLoading={isSaving}>
          ذخیره آدرس
        </Button>
      </form>
    </Modal>
  );
}
