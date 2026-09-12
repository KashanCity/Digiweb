import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { mockCategories } from '@/lib/mockData';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = mockCategories.find((c) => c.id === id);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getProducts({ categoryId: id, page, pageSize: 8 }).then((result) => {
      setProducts(result.items);
      setTotalPages(result.totalPages);
      setIsLoading(false);
    });
  }, [id, page]);

  if (!category) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-2 text-lg font-bold text-ink">دسته‌بندی پیدا نشد</h1>
        <Button onClick={() => navigate('/categories')}>بازگشت به دسته‌بندی‌ها</Button>
      </div>
    );
  }

  const Icon = getCategoryIcon(category.icon);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{category.name}</h1>
          <p className="text-sm text-ink-muted">{category.productCount.toLocaleString('fa-IR')} محصول</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="محصولی در این دسته‌بندی یافت نشد" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
