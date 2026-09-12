import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, Store } from 'lucide-react';
import { brand } from '@/config/brand';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { cn } from '@/utils/cn';

const navLinks = [
  { to: '/', label: 'خانه' },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/categories', label: 'دسته‌بندی‌ها' },
  { to: '/sell', label: 'فروشنده شو' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'پشتیبانی' },
];

export function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* لوگو */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Store className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-ink">{brand.name}</span>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-brand-300' : 'text-ink-muted hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* آیکون‌های راست */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/shop"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink sm:flex"
            aria-label="جستجو"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/dashboard/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink sm:flex"
            aria-label="علاقه‌مندی‌ها"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
            aria-label="سبد خرید"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user && <NotificationBell />}

          {user ? (
            <Link
              to="/dashboard"
              className="mr-1 flex items-center gap-2 rounded-xl border border-surface-border py-1.5 pl-3 pr-1.5 hover:border-brand-400"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-overlay text-xs font-semibold">
                {user.name?.[0] ?? <User className="h-4 w-4" />}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            </Link>
          ) : (
            <div className="mr-1 hidden items-center gap-2 sm:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  ورود
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted hover:bg-surface-overlay lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="منو"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* منوی موبایل */}
      {mobileOpen && (
        <div className="border-t border-surface-border bg-surface px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive ? 'bg-surface-overlay text-brand-300' : 'text-ink-muted',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-surface-border pt-3">
                <Link to="/login" className="flex-1">
                  <Button variant="secondary" fullWidth>
                    ورود
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button variant="primary" fullWidth>
                    ثبت‌نام
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
