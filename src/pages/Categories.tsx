import { Link } from 'react-router-dom';
import { mockCategories } from '@/lib/mockData';
import { getCategoryIcon } from '@/utils/categoryIcons';

export default function Categories() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-xl font-bold text-ink sm:text-2xl">همه دسته‌بندی‌ها</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mockCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="glass-card flex flex-col items-center gap-3 px-4 py-8 text-center transition-colors hover:border-brand-500/50"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Icon className="h-7 w-7" />
              </span>
              <span className="text-sm font-semibold text-ink">{cat.name}</span>
              <span className="text-xs text-ink-subtle">{cat.productCount.toLocaleString('fa-IR')} محصول</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
