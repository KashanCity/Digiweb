import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface FormState {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = 'نام باید حداقل ۲ کاراکتر باشد';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) next.username = 'نام کاربری فقط حروف انگلیسی، عدد و _ (۳ تا ۲۰ کاراکتر)';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'ایمیل معتبر وارد کنید';
    if (form.password.length < 8) next.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      showToast('ثبت‌نام با موفقیت انجام شد', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('already exists') || message.includes('409')) {
        setFormError('این ایمیل قبلاً ثبت‌نام کرده است');
      } else {
        setFormError('خطایی رخ داد، دوباره تلاش کنید');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-ink">ساخت حساب کاربری</h1>
      <p className="mb-6 text-sm text-ink-muted">برای خرید و فروش محصولات ثبت‌نام کنید.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="نام و نام خانوادگی" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
        <Input
          label="نام کاربری"
          value={form.username}
          onChange={(e) => update('username', e.target.value)}
          error={errors.username}
          dir="ltr"
          placeholder="username"
        />
        <Input
          label="ایمیل"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
          dir="ltr"
          placeholder="you@example.com"
        />
        <Input
          label="رمز عبور"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />
        <Input
          label="تکرار رمز عبور"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />

        {formError && <p className="text-sm text-danger">{formError}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          ثبت‌نام
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        قبلاً ثبت‌نام کرده‌اید؟{' '}
        <Link to="/login" className="text-brand-300 hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}
