import { Star } from 'lucide-react';
import type { Category, Seller } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface FilterState {
  categoryId?: string;
  sellerId?: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  discountedOnly: boolean;
  minRating?: number;
}

interface FilterSidebarProps {
  categories: Category[];
  sellers: Seller[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

export function FilterSidebar({ categories, sellers, filters, onChange, onReset }: FilterSidebarProps) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="glass-card h-fit space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">فیلترها</h3>
        <button onClick={onReset} className="text-xs text-brand-300 hover:underline">
          پاک کردن
        </button>
      </div>

      {/* دسته‌بندی */}
      <div>
        <h4 className="mb-2.5 text-xs font-medium text-ink-muted">دسته‌بندی</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => set('categoryId', undefined)}
            className={cn(
              'block w-full rounded-lg px-2.5 py-1.5 text-right text-sm',
              !filters.categoryId ? 'bg-brand-500/15 text-brand-300' : 'text-ink-muted hover:bg-surface-overlay',
            )}
          >
            همه
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => set('categoryId', cat.id)}
              className={cn(
                'block w-full rounded-lg px-2.5 py-1.5 text-right text-sm',
                filters.categoryId === cat.id ? 'bg-brand-500/15 text-brand-300' : 'text-ink-muted hover:bg-surface-overlay',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* محدوده قیمت */}
      <div>
        <h4 className="mb-2.5 text-xs font-medium text-ink-muted">محدوده قیمت (تومان)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="حداقل"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
            className="h-9 w-full rounded-lg border border-surface-border bg-surface-raised px-2.5 text-xs text-ink outline-none focus-visible:border-brand-400"
          />
          <span className="text-ink-subtle">−</span>
          <input
            type="number"
            placeholder="حداکثر"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
            className="h-9 w-full rounded-lg border border-surface-border bg-surface-raised px-2.5 text-xs text-ink outline-none focus-visible:border-brand-400"
          />
        </div>
      </div>

      {/* امتیاز */}
      <div>
        <h4 className="mb-2.5 text-xs font-medium text-ink-muted">حداقل امتیاز</h4>
        <div className="flex gap-1.5">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => set('minRating', filters.minRating === r ? undefined : r)}
              className={cn(
                'flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs',
                filters.minRating === r
                  ? 'border-brand-400 bg-brand-500/15 text-brand-300'
                  : 'border-surface-border text-ink-muted hover:border-brand-400/50',
              )}
            >
              {r.toLocaleString('fa-IR')} <Star className="h-3 w-3 fill-warning text-warning" /> +
            </button>
          ))}
        </div>
      </div>

      {/* وضعیت موجودی و تخفیف */}
      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => set('inStockOnly', e.target.checked)}
            className="h-4 w-4 rounded border-surface-border accent-brand-500"
          />
          فقط موجود
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={filters.discountedOnly}
            onChange={(e) => set('discountedOnly', e.target.checked)}
            className="h-4 w-4 rounded border-surface-border accent-brand-500"
          />
          فقط دارای تخفیف
        </label>
      </div>

      {/* فروشنده */}
      <div>
        <h4 className="mb-2.5 text-xs font-medium text-ink-muted">فروشنده</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => set('sellerId', undefined)}
            className={cn(
              'block w-full rounded-lg px-2.5 py-1.5 text-right text-sm',
              !filters.sellerId ? 'bg-brand-500/15 text-brand-300' : 'text-ink-muted hover:bg-surface-overlay',
            )}
          >
            همه فروشندگان
          </button>
          {sellers.map((seller) => (
            <button
              key={seller.id}
              onClick={() => set('sellerId', seller.id)}
              className={cn(
                'block w-full rounded-lg px-2.5 py-1.5 text-right text-sm',
                filters.sellerId === seller.id ? 'bg-brand-500/15 text-brand-300' : 'text-ink-muted hover:bg-surface-overlay',
              )}
            >
              {seller.storeName}
            </button>
          ))}
        </div>
      </div>

      <Button variant="secondary" size="sm" fullWidth onClick={onReset}>
        بازنشانی فیلترها
      </Button>
    </aside>
  );
}
