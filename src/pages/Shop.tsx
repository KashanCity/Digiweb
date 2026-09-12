import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FilterSidebar, type FilterState } from '@/components/product/FilterSidebar';
import { getProducts, type SortOption } from '@/services/productService';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { mockCategories, mockSellers } from '@/lib/mockData';
import type { Product } from '@/types';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheapest', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
  { value: 'bestselling', label: 'پرفروش‌ترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'rating', label: 'بیشترین امتیاز' },
];

const emptyFilters: FilterState = {
  categoryId: undefined,
  sellerId: undefined,
  minPrice: '',
  maxPrice: '',
  inStockOnly: false,
  discountedOnly: false,
  minRating: undefined,
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters, sort]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getProducts({
      query: debouncedQuery,
      categoryId: filters.categoryId,
      sellerId: filters.sellerId,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      inStockOnly: filters.inStockOnly,
      discountedOnly: filters.discountedOnly,
      minRating: filters.minRating,
      sort,
      page,
      pageSize: 8,
    }).then((result) => {
      if (cancelled) return;
      setProducts(result.items);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, filters, sort, page]);

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.sellerId) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.inStockOnly) count++;
    if (filters.discountedOnly) count++;
    if (filters.minRating) count++;
    return count;
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* هدر جستجو */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">فروشگاه</h1>
          <p className="mt-1 text-sm text-ink-muted">{total.toLocaleString('fa-IR')} محصول یافت شد</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در فروشگاه..."
              className="h-10 w-full rounded-xl border border-surface-border bg-surface-raised pr-9 pl-3 text-sm text-ink outline-none focus-visible:border-brand-400"
            />
          </div>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            options={sortOptions}
            className="w-40 shrink-0"
          />
          <Button
            variant="secondary"
            size="md"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && <span className="text-brand-300">({activeFilterCount.toLocaleString('fa-IR')})</span>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* فیلتر دسکتاپ */}
        <div className="hidden lg:block">
          <FilterSidebar
            categories={mockCategories}
            sellers={mockSellers}
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(emptyFilters)}
          />
        </div>

        {/* گرید محصولات */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="محصولی یافت نشد"
              description="فیلترها یا عبارت جستجو را تغییر دهید و دوباره امتحان کنید."
              action={
                <Button variant="secondary" size="sm" onClick={() => { setFilters(emptyFilters); setQuery(''); }}>
                  پاک کردن فیلترها
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* فیلتر موبایل */}
      <Modal open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="فیلترها" side="right">
        <FilterSidebar
          categories={mockCategories}
          sellers={mockSellers}
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
        />
      </Modal>
    </div>
  );
}
