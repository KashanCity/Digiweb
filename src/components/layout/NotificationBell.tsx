import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listNotifications, markAsRead } from '@/services/notificationService';
import type { AppNotification } from '@/types';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    listNotifications(user.id)
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkRead(id: string) {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // خطای بی‌اهمیت برای تجربه کاربری — نادیده گرفته می‌شود
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
        aria-label="اعلان‌ها"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount.toLocaleString('fa-IR')}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-card absolute left-0 top-12 z-50 w-80 max-w-[90vw] p-2 shadow-glass">
          <div className="flex items-center justify-between px-2 py-1.5">
            <h4 className="text-sm font-semibold text-ink">اعلان‌ها</h4>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-ink-subtle">اعلانی وجود ندارد</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={cn(
                    'block w-full rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-surface-overlay',
                    !n.read && 'bg-brand-500/5',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-ink">{n.title}</p>
                    {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">{n.message}</p>
                  <p className="mt-1 text-[10px] text-ink-subtle">{formatDate(n.createdAt)}</p>
                </button>
              ))
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => notifications.filter((n) => !n.read).forEach((n) => handleMarkRead(n.id))}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs text-brand-300 hover:bg-surface-overlay"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              علامت‌گذاری همه به‌عنوان خوانده‌شده
            </button>
          )}
        </div>
      )}
    </div>
  );
}
