import { useEffect, useState } from 'react';
import { Search, ShieldOff, ShieldCheck } from 'lucide-react';
import { listUsers, updateUserRole, setUserSuspended } from '@/services/adminService';
import type { AppUser, UserRole } from '@/types';
import { useToast } from '@/context/ToastContext';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'کاربر عادی' },
  { value: 'seller', label: 'فروشنده' },
  { value: 'admin', label: 'ادمین' },
];

export default function AdminUsers() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedQuery = useDebouncedValue(query, 400);

  async function load() {
    setIsLoading(true);
    try {
      setUsers(await listUsers(debouncedQuery || undefined));
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  async function handleRoleChange(userId: string, role: UserRole) {
    try {
      await updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      showToast('نقش کاربر تغییر کرد', 'success');
    } catch {
      showToast('خطا در تغییر نقش', 'error');
    }
  }

  async function handleToggleSuspend(user: AppUser) {
    try {
      await setUserSuspended(user.id, !user.suspended);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, suspended: !u.suspended } : u)));
      showToast(user.suspended ? 'کاربر فعال شد' : 'کاربر مسدود شد', 'success');
    } catch {
      showToast('خطا در تغییر وضعیت کاربر', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">مدیریت کاربران</h1>
        <div className="relative w-64">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام کاربر..."
            className="h-10 w-full rounded-xl border border-surface-border bg-surface-raised pr-9 pl-3 text-sm text-ink outline-none focus-visible:border-brand-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="کاربری یافت نشد" />
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="glass-card flex flex-wrap items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-overlay text-sm font-semibold text-ink">
                {u.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                <p className="truncate text-xs text-ink-subtle" dir="ltr">{u.email}</p>
              </div>
              {u.suspended && <Badge tone="danger">مسدود</Badge>}
              <Select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                options={roleOptions}
                className="w-36"
              />
              <button
                onClick={() => handleToggleSuspend(u)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  u.suspended ? 'text-success hover:bg-success/10' : 'text-danger hover:bg-danger/10'
                }`}
                title={u.suspended ? 'فعال‌سازی حساب' : 'مسدودسازی حساب'}
              >
                {u.suspended ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
