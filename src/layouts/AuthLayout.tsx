import { Link, Outlet } from 'react-router-dom';
import { Store } from 'lucide-react';
import { brand } from '@/config/brand';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-radial px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Store className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold text-ink">{brand.name}</span>
        </Link>
        <div className="glass-card p-6 shadow-glass sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
