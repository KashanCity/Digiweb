import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createProduct, updateProduct, getProductById } from '@/services/productService';
import { mockCategories } from '@/lib/mockData';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0]?.id ?? '');
  const [tags, setTags] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((p) => {
      if (!p) return;
      setName(p.name);
      setDescription(p.description);
      setPrice(String(p.price));
      setCompareAtPrice(p.compareAtPrice ? String(p.compareAtPrice) : '');
      setStock(String(p.stock));
      setSku(p.sku);
      setCategoryId(p.categoryId);
      setTags(p.tags.join('، '));
      setIsLoading(false);
    });
  }, [id]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'نام محصول الزامی است';
    if (!description.trim()) next.description = 'توضیحات الزامی است';
    if (!price || Number(price) <= 0) next.price = 'قیمت معتبر وارد کنید';
    if (stock === '' || Number(stock) < 0) next.stock = 'موجودی معتبر وارد کنید';
    if (!sku.trim()) next.sku = 'SKU الزامی است';
    if (!isEdit && imageFiles.length === 0) next.images = 'حداقل یک تصویر الزامی است';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !validate()) return;

    setIsSaving(true);
    try {
      const tagList = tags.split('،').map((t) => t.trim()).filter(Boolean);

      if (isEdit && id) {
        await updateProduct(id, {
          name,
          description,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
          stock: Number(stock),
          sku,
          categoryId,
          tags: tagList,
          newImageFiles: imageFiles.length > 0 ? imageFiles : undefined,
        });
        showToast('محصول ویرایش شد و برای بررسی مجدد ارسال شد', 'success');
      } else {
        await createProduct({
          sellerId: user.id,
          sellerName: user.name,
          name,
          description,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
          stock: Number(stock),
          sku,
          categoryId,
          tags: tagList,
          imageFiles,
        });
        showToast('محصول ثبت شد و پس از تأیید ادمین نمایش داده می‌شود', 'success');
      }
      navigate('/seller/products');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'خطا در ذخیره محصول', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="text-sm text-ink-muted">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink">{isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h1>

      <form onSubmit={handleSubmit} className="glass-card max-w-2xl space-y-4 p-6">
        <Input label="نام محصول" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />

        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus-visible:border-brand-400"
          />
          {errors.description && <p className="mt-1.5 text-xs text-danger">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="قیمت (تومان)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} />
          <Input label="قیمت قبلی (اختیاری)" type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="موجودی" type="number" value={stock} onChange={(e) => setStock(e.target.value)} error={errors.stock} />
          <Input label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} error={errors.sku} dir="ltr" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">دسته‌بندی</label>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={mockCategories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <Input label="برچسب‌ها (با ، جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="جدید، پرفروش" />

        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">تصاویر محصول</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
            className="w-full text-sm text-ink-muted file:ml-3 file:rounded-lg file:border-0 file:bg-surface-overlay file:px-3 file:py-2 file:text-ink"
          />
          {errors.images && <p className="mt-1.5 text-xs text-danger">{errors.images}</p>}
        </div>

        <Button type="submit" isLoading={isSaving}>
          {isEdit ? 'ذخیره تغییرات' : 'ثبت محصول'}
        </Button>
      </form>
    </div>
  );
}
