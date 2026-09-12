import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = (location.state as { orderId?: string })?.orderId;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mb-2 text-xl font-bold text-ink">سفارش شما با موفقیت ثبت شد</h1>
      <p className="mb-6 text-sm text-ink-muted">
        {orderId ? `شماره سفارش: #${orderId.slice(-6)}` : 'می‌توانید وضعیت سفارش را از پنل کاربری پیگیری کنید.'}
      </p>
      <div className="flex gap-3">
        {orderId && (
          <Button variant="secondary" onClick={() => navigate(`/order/${orderId}`)}>
            مشاهده جزئیات سفارش
          </Button>
        )}
        <Link to="/shop">
          <Button>ادامه خرید</Button>
        </Link>
      </div>
    </div>
  );
}
