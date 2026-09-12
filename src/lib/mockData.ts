// این فایل صرفاً برای نمایش رابط کاربری در فاز اول توسعه است.
// در فازهای بعدی، این داده‌ها با Query واقعی از Appwrite جایگزین می‌شوند.
import type { Product, Category, Seller, Review } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'آموزش دیجیتال', slug: 'education', icon: 'GraduationCap', productCount: 128 },
  { id: '2', name: 'قالب و افزونه', slug: 'templates', icon: 'LayoutTemplate', productCount: 342 },
  { id: '3', name: 'موسیقی و صدا', slug: 'audio', icon: 'Music', productCount: 96 },
  { id: '4', name: 'گرافیک و طراحی', slug: 'design', icon: 'Palette', productCount: 210 },
  { id: '5', name: 'نرم‌افزار', slug: 'software', icon: 'Code2', productCount: 88 },
  { id: '6', name: 'کتاب الکترونیک', slug: 'ebooks', icon: 'BookOpen', productCount: 154 },
];

const productNames = [
  'دوره جامع React پیشرفته',
  'قالب فروشگاهی نکست‌جی‌اس',
  'پک افکت صوتی سینمایی',
  'فونت فارسی وزیر پرو',
  'دوره طراحی رابط کاربری UI/UX',
  'قالب پرزنتیشن کسب‌وکار',
  'پکیج آیکون‌های خطی مدرن',
  'موسیقی بی‌کلام برای پادکست',
  'کتاب الکترونیک آموزش سرمایه‌گذاری',
  'قالب رزومه حرفه‌ای فارسی',
  'دوره برنامه‌نویسی پایتون مقدماتی',
  'پک فیلتر لایت‌روم سینمایی',
];

const sellerPool = [
  { id: 's1', name: 'فروشگاه آترین' },
  { id: 's2', name: 'استودیو نگاه' },
  { id: 's3', name: 'صوت‌سازان' },
];

export const mockProducts: Product[] = Array.from({ length: 24 }).map((_, i) => {
  const seller = sellerPool[i % sellerPool.length];
  const hasDiscount = i % 3 !== 0;
  const price = 180000 + i * 37000;
  return {
    id: String(i + 1),
    sellerId: seller.id,
    sellerName: seller.name,
    name: productNames[i % productNames.length],
    slug: `product-${i + 1}`,
    description:
      'این محصول با دقت طراحی و آماده‌سازی شده تا بهترین تجربه را برای شما فراهم کند. توضیحات کامل، مشخصات فنی و راهنمای استفاده در ادامه همین صفحه آمده است.',
    price,
    compareAtPrice: hasDiscount ? Math.round(price * 1.35) : undefined,
    stock: i % 7 === 0 ? 0 : (i % 5) + 3,
    sku: `SKU-${1000 + i}`,
    categoryId: String((i % 6) + 1),
    images: [],
    tags: i % 4 === 0 ? ['پرفروش'] : ['جدید'],
    status: 'approved',
    rating: Number((3.8 + (i % 5) * 0.25).toFixed(1)),
    reviewCount: 12 + i * 3,
    salesCount: 40 + i * 11,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const mockSellers: Seller[] = [
  {
    id: 's1',
    userId: 'u1',
    storeName: 'فروشگاه آترین',
    description: 'محصولات آموزشی و دیجیتال باکیفیت',
    phone: '09120000000',
    status: 'approved',
    rating: 4.8,
    totalSales: 1240,
    productCount: 46,
    createdAt: new Date().toISOString(),
  },
  {
    id: 's2',
    userId: 'u2',
    storeName: 'استودیو نگاه',
    description: 'طراحی گرافیک و قالب‌های حرفه‌ای',
    phone: '09120000001',
    status: 'approved',
    rating: 4.6,
    totalSales: 860,
    productCount: 31,
    createdAt: new Date().toISOString(),
  },
  {
    id: 's3',
    userId: 'u3',
    storeName: 'صوت‌سازان',
    description: 'افکت‌ها و موسیقی بدون کپی‌رایت',
    phone: '09120000002',
    status: 'approved',
    rating: 4.9,
    totalSales: 2100,
    productCount: 58,
    createdAt: new Date().toISOString(),
  },
];

export function mockReviewsFor(productId: string): Review[] {
  return [
    {
      id: `${productId}-r1`,
      productId,
      userId: 'u10',
      userName: 'محمد رضایی',
      rating: 5,
      comment: 'کیفیت عالی بود و پشتیبانی فروشنده هم خیلی سریع پاسخ داد. حتماً پیشنهاد می‌کنم.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: `${productId}-r2`,
      productId,
      userId: 'u11',
      userName: 'سارا احمدی',
      rating: 4,
      comment: 'محصول خوبی بود، فقط توضیحات می‌توانست کامل‌تر باشد.',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ];
}
