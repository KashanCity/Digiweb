import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/services/wishlistService';

interface WishlistContextValue {
  productIds: string[];
  isLoading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProductIds([]);
      return;
    }
    setIsLoading(true);
    getWishlist(user.id)
      .then(setProductIds)
      .finally(() => setIsLoading(false));
  }, [user]);

  const isWishlisted = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  async function toggleWishlist(productId: string) {
    if (!user) return; // UI باید کاربر مهمان را به صفحه ورود هدایت کند
    const alreadyIn = productIds.includes(productId);
    // به‌روزرسانی خوش‌بینانه رابط کاربری
    setProductIds((prev) => (alreadyIn ? prev.filter((id) => id !== productId) : [...prev, productId]));
    try {
      if (alreadyIn) {
        await removeFromWishlist(user.id, productId);
      } else {
        await addToWishlist(user.id, productId);
      }
    } catch {
      // بازگردانی در صورت خطا
      setProductIds((prev) => (alreadyIn ? [...prev, productId] : prev.filter((id) => id !== productId)));
    }
  }

  return (
    <WishlistContext.Provider value={{ productIds, isLoading, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist باید داخل WishlistProvider استفاده شود');
  return ctx;
}
