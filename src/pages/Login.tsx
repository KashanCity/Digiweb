import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  function validate() {
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'ایمیل معتبر وارد کنید';
    if (password.length < 8) next.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('با موفقیت وارد شدید', 'success');
      const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch {
      setFormError('ایمیل یا رمز عبور اشتباه است');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-ink">ورود به حساب کاربری</h1>
      <p className="mb-6 text-sm text-ink-muted">خوش برگشتی! برای ادامه وارد شوید.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ایمیل"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          label="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {formError && <p className="text-sm text-danger">{formError}</p>}

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-brand-300 hover:underline">
            فراموشی رمز عبور
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          ورود
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        حساب کاربری ندارید؟{' '}
        <Link to="/register" className="text-brand-300 hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}
