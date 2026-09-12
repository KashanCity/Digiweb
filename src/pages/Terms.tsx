import { brand } from '@/config/brand';

const sections = [
  {
    title: '۱. پذیرش قوانین',
    body: `با استفاده از ${brand.name} شما موافقت می‌کنید که به این قوانین و مقررات پایبند باشید.`,
  },
  {
    title: '۲. حساب کاربری',
    body: 'کاربران مسئول حفظ محرمانگی اطلاعات ورود خود هستند و باید اطلاعات صحیح در زمان ثبت‌نام ارائه دهند.',
  },
  {
    title: '۳. فروش محصولات',
    body: 'فروشندگان متعهد می‌شوند محصولاتی مطابق با توضیحات ارائه‌شده عرضه کنند. تمام محصولات پیش از انتشار توسط تیم مدیریت بررسی می‌شوند.',
  },
  {
    title: '۴. پرداخت و بازگشت وجه',
    body: 'پرداخت‌ها از طریق درگاه‌های معتبر انجام می‌شود. سیاست بازگشت وجه بر اساس نوع محصول متفاوت است.',
  },
  {
    title: '۵. مسئولیت‌ها',
    body: `${brand.name} صرفاً نقش واسط میان خریدار و فروشنده را ایفا می‌کند و مسئولیت کیفیت نهایی محصولات بر عهده فروشنده است.`,
  },
];

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-ink">قوانین و مقررات</h1>
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
