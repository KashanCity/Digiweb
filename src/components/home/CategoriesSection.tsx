import { Link } from 'react-router-dom';
import type { Category } from '@/types';
import { getCategoryIcon } from '@/utils/categoryIcons';

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">دسته‌بندی‌های محبوب</h2>
        <Link to="/categories" className="text-sm text-brand-300 hover:underline">
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="glass-card group flex flex-col items-center gap-3 px-4 py-6 text-center transition-colors hover:border-brand-500/50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium text-ink">{cat.name}</span>
              <span className="text-xs text-ink-subtle">{cat.productCount.toLocaleString('fa-IR')} محصول</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
