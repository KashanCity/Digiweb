import { useState, type FormEvent } from 'react';
import { Mail, Phone } from 'lucide-react';
import { brand } from '@/config/brand';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Contact() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: در اتصال کامل، این فرم باید یک Appwrite Function برای ارسال ایمیل صدا بزند.
    showToast('پیام شما ارسال شد. به‌زودی پاسخ داده می‌شود', 'success');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-ink">پشتیبانی و تماس با ما</h1>
      <p className="mb-8 text-sm text-ink-muted">سوالی دارید؟ فرم زیر را پر کنید یا مستقیم با ما در تماس باشید.</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
          <Input label="نام" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" required />
          <div>
            <label className="mb-1.5 block text-sm text-ink-muted">پیام</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              className="w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus-visible:border-brand-400"
            />
          </div>
          <Button type="submit" fullWidth>
            ارسال پیام
          </Button>
        </form>

        <div className="glass-card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-ink-subtle">ایمیل</p>
              <p className="text-sm text-ink" dir="ltr">{brand.supportEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-ink-subtle">تلفن</p>
              <p className="text-sm text-ink" dir="ltr">{brand.supportPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
