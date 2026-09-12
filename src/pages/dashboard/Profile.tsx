import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { databases, appwriteConfig } from '@/lib/appwrite';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.collections.users, user.id, {
        name,
        username,
      });
      await refreshUser();
      showToast('پروفایل با موفقیت به‌روزرسانی شد', 'success');
    } catch {
      showToast('خطا در به‌روزرسانی پروفایل', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="glass-card max-w-lg p-6">
      <h1 className="mb-6 text-lg font-bold text-ink">پروفایل</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="نام کاربری" value={username} onChange={(e) => setUsername(e.target.value)} dir="ltr" />
        <Input label="ایمیل" value={user?.email ?? ''} disabled dir="ltr" hint="تغییر ایمیل از این بخش امکان‌پذیر نیست." />
        <Button type="submit" isLoading={isSaving}>
          ذخیره تغییرات
        </Button>
      </form>
    </div>
  );
}
