






// src/components/AddToCartButton.tsx
'use client';
import { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/Toaster';

type Props = { productId: string; qty: number; color?: string };

export default function AddToCartButton({ productId, qty, color }: Props) {
  const cart = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function addToCart() {
    try {
      setLoading(true);
      cart.add(productId, qty, color);
      toast({
        type: 'success',
        title: 'Đã thêm vào giỏ',
        message: 'Sản phẩm đã được thêm vào giỏ hàng.',
      });
    } catch {
      toast({
        type: 'error',
        title: 'Lỗi',
        message: 'Có lỗi khi thêm giỏ hàng. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className="px-6 font-medium text-white rounded-md h-11 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60"
    >
      {loading ? 'Đang thêm...' : 'THÊM VÀO GIỎ HÀNG'}
    </button>
  );
}
