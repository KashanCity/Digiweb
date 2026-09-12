import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import { listCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import type { Category } from '@/types';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { getCategoryIcon } from '@/utils/categoryIcons';

export default function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      setCategories(await listCategories());
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setName('');
    setSlug('');
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, { name, slug });
        showToast('دسته‌بندی ویرایش شد', 'success');
      } else {
        await createCategory({ name, slug });
        showToast('دسته‌بندی جدید ایجاد شد', 'success');
      }
      setModalOpen(false);
      load();
    } catch {
      showToast('خطا در ذخیره دسته‌بندی', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      showToast('دسته‌بندی حذف شد', 'success');
      load();
    } catch {
      showToast('خطا در حذف دسته‌بندی', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">مدیریت دسته‌بندی‌ها</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon={Tags} title="هنوز دسته‌بندی‌ای ثبت نشده" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <div key={cat.id} className="glass-card flex flex-col items-center gap-2 p-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-ink">{cat.name}</p>
                <p className="text-xs text-ink-subtle" dir="ltr">{cat.slug}</p>
                <div className="mt-1 flex gap-1">
                  <button onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-overlay hover:text-ink">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="نام دسته‌بندی" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="اسلاگ (انگلیسی)" value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr" required />
          <Button type="submit" fullWidth isLoading={isSaving}>
            ذخیره
          </Button>
        </form>
      </Modal>
    </div>
  );
}
