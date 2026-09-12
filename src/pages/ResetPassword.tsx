import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { confirmPasswordRecovery } from '@/services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId') ?? '';
  const secret = searchParams.get('secret') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }
    if (!userId || !secret) {
      setError('لینک بازیابی نامعتبر یا منقضی‌شده است');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await confirmPasswordRecovery(userId, secret, password);
      setDone(true);
    } catch {
      setError('لینک بازیابی نامعتبر یا منقضی‌شده است');
    } finally {
      setIsLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
        <h1 className="mb-1 text-lg font-bold text-ink">رمز عبور تغییر کرد</h1>
        <p className="mb-6 text-sm text-ink-muted">اکنون می‌توانید با رمز عبور جدید وارد شوید.</p>
        <Button onClick={() => navigate('/login')}>ورود به حساب</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-ink">تنظیم رمز عبور جدید</h1>
      <p className="mb-6 text-sm text-ink-muted">رمز عبور جدید خود را وارد کنید.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="رمز عبور جدید" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input
          label="تکرار رمز عبور جدید"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={error}
        />
        <Button type="submit" fullWidth isLoading={isLoading}>
          ثبت رمز عبور جدید
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
