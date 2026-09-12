import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { account } from '@/lib/appwrite';

export default function Settings() {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('رمز عبور جدید باید حداقل ۸ کاراکتر باشد');
      return;
    }
    setIsSaving(true);
    try {
      await account.updatePassword(newPassword, currentPassword);
      showToast('رمز عبور با موفقیت تغییر کرد', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setError('رمز عبور فعلی اشتباه است');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="glass-card max-w-lg p-6">
      <h1 className="mb-6 text-lg font-bold text-ink">تنظیمات حساب</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="رمز عبور فعلی"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label="رمز عبور جدید"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={error}
        />
        <Button type="submit" isLoading={isSaving}>
          تغییر رمز عبور
        </Button>
      </form>
    </div>
  );
}
