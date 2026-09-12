import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { TopSellersSection } from '@/components/home/TopSellersSection';
import { SellerCtaSection } from '@/components/home/SellerCtaSection';
import { mockCategories, mockProducts, mockSellers } from '@/lib/mockData';

// TODO(فاز فروشگاه): جایگزینی mockData با Query واقعی از Appwrite (categories, products, sellers)
export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection categories={mockCategories} />
      <FeaturedProductsSection products={mockProducts} />
      <TopSellersSection sellers={mockSellers} />
      <SellerCtaSection />
    </div>
  );
}
