import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getAddresses, createAddress } from '@/services/addressService';
import { createOrder } from '@/services/orderService';
import { requestPayment } from '@/services/paymentService';
import type { Address } from '@/types';
import { formatPrice } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { AddressFormModal } from '@/components/checkout/AddressFormModal';
import { cn } from '@/utils/cn';

const FREE_SHIPPING_THRESHOLD = 1_000_000;
const SHIPPING_COST = 45_000;

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  async function loadAddresses() {
    if (!user) return;
    setIsLoading(true);
    try {
      const list = await getAddresses(user.id);
      setAddresses(list);
      if (list.length > 0) setSelectedAddressId(list[0].id);
    } catch {
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true });
      return;
    }
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleAddAddress(address: Omit<Address, 'id'>) {
    if (!user) return;
    const created = await createAddress(user.id, address);
    setAddresses((prev) => [...prev, created]);
    setSelectedAddressId(created.id);
  }

  async function handlePay() {
    if (!user) return;
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      showToast('لطفاً یک آدرس انتخاب کنید', 'error');
      return;
    }

    setIsPaying(true);
    try {
      const order = await createOrder({
        userId: user.id,
        items,
        address,
        subtotal,
        discount: 0,
        shippingCost,
        total,
      });

      const payment = await requestPayment({
        orderId: order.id,
        amount: total,
        description: `پرداخت سفارش #${order.id.slice(-6)}`,
      });

      if (payment.success) {
        clearCart();
        navigate('/order-success', { state: { orderId: order.id } });
      } else {
        showToast(payment.message, 'error');
      }
    } catch {
      showToast('خطا در ثبت سفارش. دوباره تلاش کنید', 'error');
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-bold text-ink">تسویه‌حساب</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">انتخاب آدرس ارسال</h2>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              آدرس جدید
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="glass-card flex flex-col items-center gap-3 p-8 text-center">
              <MapPin className="h-8 w-8 text-ink-subtle" />
              <p className="text-sm text-ink-muted">هنوز آدرسی ثبت نکرده‌اید</p>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                افزودن آدرس
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => setSelectedAddressId(address.id)}
                  className={cn(
                    'glass-card block w-full p-4 text-right transition-colors',
                    selectedAddressId === address.id && 'border-brand-400 bg-brand-500/5',
                  )}
                >
                  <p className="text-sm font-semibold text-ink">{address.fullName}</p>
                  <p className="mt-1 text-xs leading-6 text-ink-muted">
                    {address.province}، {address.city}، {address.addressLine} · کد پستی {address.postalCode}
                  </p>
                </button>
              ))}
            </div>
          )}

          <div className="glass-card mt-6 divide-y divide-surface-border">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <span className="flex-1 truncate text-sm text-ink">{item.name}</span>
                <span className="text-xs text-ink-subtle">×{item.quantity.toLocaleString('fa-IR')}</span>
                <span className="text-sm font-medium text-ink">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card h-fit space-y-3 p-5">
          <h2 className="text-sm font-semibold text-ink">خلاصه پرداخت</h2>
          <div className="flex justify-between text-sm text-ink-muted">
            <span>جمع جزء</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-muted">
            <span>هزینه ارسال</span>
            <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'رایگان'}</span>
          </div>
          <div className="flex justify-between border-t border-surface-border pt-3 text-base font-bold text-ink">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button fullWidth size="lg" isLoading={isPaying} onClick={handlePay} disabled={!selectedAddressId}>
            <CreditCard className="h-4 w-4" />
            پرداخت و ثبت سفارش
          </Button>
          <p className="text-center text-xs text-ink-subtle">این یک درگاه پرداخت آزمایشی (Mock) برای محیط توسعه است.</p>
        </div>
      </div>

      <AddressFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddAddress} />
    </div>
  );
}
