import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

/**
 * محافظت از Routeهای نیازمند ورود (و در صورت نیاز، نقش خاص).
 * نکته امنیتی: این بررسی فقط تجربه کاربری را کنترل می‌کند.
 * بررسی واقعی دسترسی همیشه باید سمت Appwrite (Permissions) نیز اعمال شود.
 */
export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">در حال بارگذاری...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
