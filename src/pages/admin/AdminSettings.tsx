import { Settings as SettingsIcon } from 'lucide-react';
import { brand } from '@/config/brand';

export default function AdminSettings() {
  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 text-xl font-bold text-ink">
        <SettingsIcon className="h-5 w-5" /> تنظیمات سیستم
      </h1>

      <div className="glass-card max-w-lg p-6">
        <p className="mb-4 text-sm text-ink-muted">
          تنظیمات هویت برند در حال حاضر از فایل مرکزی <code dir="ltr">src/config/brand.ts</code> خوانده می‌شود تا هرگونه
          تغییر نام، شعار یا اطلاعات تماس به‌سادگی و بدون نیاز به تغییر در چندین فایل انجام شود.
        </p>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-surface-border pb-2">
            <dt className="text-ink-muted">نام پلتفرم</dt>
            <dd className="font-medium text-ink">{brand.name}</dd>
          </div>
          <div className="flex justify-between border-b border-surface-border pb-2">
            <dt className="text-ink-muted">ایمیل پشتیبانی</dt>
            <dd className="font-medium text-ink" dir="ltr">{brand.supportEmail}</dd>
          </div>
          <div className="flex justify-between border-b border-surface-border pb-2">
            <dt className="text-ink-muted">تلفن پشتیبانی</dt>
            <dd className="font-medium text-ink" dir="ltr">{brand.supportPhone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">واحد پول</dt>
            <dd className="font-medium text-ink">{brand.currency}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
