import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, Wallet, Store, Settings, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const links = [
  { to: '/seller/dashboard', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/seller/products', label: 'محصولات من', icon: Package },
  { to: '/seller/products/new', label: 'افزودن محصول', icon: PlusCircle },
  { to: '/seller/orders', label: 'سفارش‌ها', icon: ShoppingBag },
  { to: '/seller/earnings', label: 'درآمد', icon: Wallet },
  { to: '/seller/settings', label: 'پروفایل فروشگاه', icon: Settings },
];

export function SellerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
          <Store className="h-4 w-4" />
        </span>
        <span className="text-sm font-bold text-ink">پنل فروشنده</span>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-500/15 text-brand-300' : 'text-ink-muted hover:bg-surface-overlay hover:text-ink',
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}

        <Link
          to="/dashboard"
          className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به پنل کاربری
        </Link>
      </nav>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-lg font-bold text-ink">پنل فروشنده</h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-ink-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass-card hidden h-fit p-4 lg:block">{sidebarContent}</aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-[80] flex lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="relative mr-auto h-full w-72 overflow-y-auto bg-surface-raised p-4 shadow-glass">
              <button
                onClick={() => setMobileOpen(false)}
                className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-overlay"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </div>
          </div>
        )}

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
