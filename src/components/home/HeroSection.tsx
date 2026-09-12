import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Store } from 'lucide-react';
import { brand } from '@/config/brand';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
  }

  return (
    <section className="relative overflow-hidden bg-hero-radial">
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-raised/60 px-4 py-1.5 text-xs text-ink-muted">
          بازارچه‌ای برای سازندگان و خریداران
        </span>

        <h1 className="text-3xl font-extrabold leading-[1.3] text-ink sm:text-5xl sm:leading-[1.25]">
          محصولات خود را بفروشید،
          <br className="hidden sm:block" /> از بهترین‌ها خرید کنید
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ink-muted sm:text-base">
          {brand.description}
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-surface-border bg-surface-raised/80 p-2 shadow-glass backdrop-blur-xl">
          <Search className="mr-2 h-5 w-5 shrink-0 text-ink-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محصول، فروشگاه یا دسته‌بندی..."
            className="h-11 w-full flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
          <Button type="submit" size="md" className="shrink-0">
            جستجو
          </Button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" size="lg" onClick={() => navigate('/shop')}>
            مشاهده محصولات
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/sell')}>
            <Store className="h-4 w-4" />
            فروشنده شو
          </Button>
        </div>
      </div>
    </section>
  );
}
