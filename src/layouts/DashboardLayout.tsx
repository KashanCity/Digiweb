import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const links = [
  { to: '/dashboard', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'پروفایل', icon: User },
  { to: '/dashboard/orders', label: 'سفارش‌های من', icon: Package },
  { to: '/dashboard/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
  { to: '/dashboard/addresses', label: 'آدرس‌ها', icon: MapPin },
  { to: '/dashboard/settings', label: 'تنظیمات', icon: Settings },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    showToast('با موفقیت خارج شدید', 'info');
    navigate('/');
  }

  const sidebarContent = (
    <>
      <div className="mb-6 flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-base font-bold text-white">
          {user?.name?.[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
          <p className="truncate text-xs text-ink-subtle">{user?.email}</p>
        </div>
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

        {(user?.role === 'seller' || user?.role === 'admin') && (
          <NavLink
            to="/seller/dashboard"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
          >
            <Store className="h-4 w-4" />
            فروشگاه من
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </nav>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-lg font-bold text-ink">پنل کاربری</h1>
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
