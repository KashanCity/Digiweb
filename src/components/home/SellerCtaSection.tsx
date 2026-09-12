import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SellerCtaSection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient px-6 py-12 text-center sm:px-12">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Rocket className="h-7 w-7" />
          </span>
          <h2 className="text-xl font-bold text-white sm:text-2xl">محصولاتت رو به هزاران مشتری معرفی کن</h2>
          <p className="text-sm text-white/85">
            ثبت‌نام به‌عنوان فروشنده رایگان است. کافیست فرم فروشندگی را تکمیل کنید تا محصولات‌تان بعد از تأیید در معرض دید خریداران قرار بگیرد.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="mt-2 bg-white text-brand-700 hover:bg-white/90"
            onClick={() => navigate('/sell')}
          >
            شروع فروش
          </Button>
        </div>
      </div>
    </section>
  );
}
