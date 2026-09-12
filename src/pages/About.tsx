import { brand } from '@/config/brand';
import { Store, ShieldCheck, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="mb-4 text-2xl font-bold text-ink">درباره {brand.name}</h1>
      <p className="mb-8 text-sm leading-7 text-ink-muted">{brand.description}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card p-5 text-center">
          <Store className="mx-auto mb-3 h-8 w-8 text-brand-300" />
          <h3 className="mb-1 text-sm font-semibold text-ink">بازارچه‌ای برای همه</h3>
          <p className="text-xs text-ink-muted">هرکسی می‌تواند محصولات خود را عرضه کند.</p>
        </div>
        <div className="glass-card p-5 text-center">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-brand-300" />
          <h3 className="mb-1 text-sm font-semibold text-ink">خرید امن</h3>
          <p className="text-xs text-ink-muted">تمام محصولات پیش از انتشار بررسی می‌شوند.</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-brand-300" />
          <h3 className="mb-1 text-sm font-semibold text-ink">جامعه‌ای رو به رشد</h3>
          <p className="text-xs text-ink-muted">هزاران فروشنده و خریدار در کنار هم.</p>
        </div>
      </div>
    </div>
  );
}
