import { Link } from 'react-router-dom';
import { Instagram, Send, Twitter, Mail, Phone } from 'lucide-react';
import { brand } from '@/config/brand';

const columns = [
  {
    title: 'دسترسی سریع',
    links: [
      { to: '/shop', label: 'فروشگاه' },
      { to: '/categories', label: 'دسته‌بندی‌ها' },
      { to: '/sell', label: 'فروشنده شو' },
      { to: '/about', label: 'درباره ما' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { to: '/contact', label: 'تماس با ما' },
      { to: '/terms', label: 'قوانین و مقررات' },
      { to: '/privacy', label: 'حریم خصوصی' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-raised/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-ink">{brand.name}</span>
            <p className="mt-3 text-sm leading-6 text-ink-muted">{brand.description}</p>
            <div className="mt-4 flex gap-2">
              <a
                href={brand.social.instagram}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-overlay text-ink-muted hover:text-brand-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={brand.social.telegram}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-overlay text-ink-muted hover:text-brand-300"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href={brand.social.twitter}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-overlay text-ink-muted hover:text-brand-300"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-ink-muted hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-ink">اطلاعات تماس</h4>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {brand.supportEmail}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {brand.supportPhone}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-border pt-6 text-center text-xs text-ink-subtle">
          © {new Date().getFullYear()} {brand.name}. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
