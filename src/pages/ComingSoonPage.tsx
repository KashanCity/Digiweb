import { Construction } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

/**
 * این صفحه به‌صورت موقت جایگزین صفحاتی است که در فازهای بعدی توسعه
 * (مطابق نقشه راه) کامل پیاده‌سازی می‌شوند.
 */
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
      <EmptyState icon={Construction} title={title} description="این بخش در فاز بعدی توسعه پروژه تکمیل می‌شود." />
    </div>
  );
}
