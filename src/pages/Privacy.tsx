import { brand } from '@/config/brand';

const sections = [
  {
    title: '۱. اطلاعاتی که جمع‌آوری می‌کنیم',
    body: 'نام، ایمیل، شماره تماس، آدرس‌های ارسال و سوابق خرید برای ارائه خدمات بهتر ذخیره می‌شوند.',
  },
  {
    title: '۲. نحوه استفاده از اطلاعات',
    body: 'اطلاعات شما صرفاً برای پردازش سفارش‌ها، بهبود خدمات و ارتباط با شما استفاده می‌شود.',
  },
  {
    title: '۳. اشتراک‌گذاری اطلاعات',
    body: `${brand.name} اطلاعات شخصی کاربران را با اشخاص ثالث به اشتراک نمی‌گذارد، مگر در موارد ضروری قانونی.`,
  },
  {
    title: '۴. امنیت داده‌ها',
    body: 'تمام اطلاعات حساس با استانداردهای امنیتی روز و از طریق زیرساخت Appwrite نگهداری می‌شود.',
  },
  {
    title: '۵. حقوق شما',
    body: 'شما می‌توانید در هر زمان درخواست مشاهده، ویرایش یا حذف اطلاعات حساب خود را ارائه دهید.',
  },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-ink">حریم خصوصی</h1>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-2 text-base font-semibold text-ink">{section.title}</h2>
            <p className="text-sm leading-7 text-ink-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
