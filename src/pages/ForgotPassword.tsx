import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { sendPasswordRecovery } from '@/services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('ایمیل معتبر وارد کنید');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      // این آدرس باید یکی از Redirect URLهای مجاز در تنظیمات Appwrite Project باشد
      await sendPasswordRecovery(email, `${window.location.origin}/reset-password`);
      setSent(true);
    } catch {
      setError('ارسال ایمیل بازیابی ناموفق بود');
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
        <h1 className="mb-1 text-lg font-bold text-ink">ایمیل ارسال شد</h1>
        <p className="text-sm text-ink-muted">لینک بازیابی رمز عبور به {email} ارسال شد.</p>
        <Link to="/login" className="mt-6 text-sm text-brand-300 hover:underline">
          بازگشت به ورود
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-ink">فراموشی رمز عبور</h1>
      <p className="mb-6 text-sm text-ink-muted">ایمیل حساب خود را وارد کنید تا لینک بازیابی ارسال شود.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} dir="ltr" />
        <Button type="submit" fullWidth isLoading={isLoading}>
          ارسال لینک بازیابی
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link to="/login" className="text-brand-300 hover:underline">
          بازگشت به ورود
        </Link>
      </p>
    </div>
  );
}
