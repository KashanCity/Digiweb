import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">محصولات ویژه</h2>
        <Link to="/shop" className="text-sm text-brand-300 hover:underline">
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
