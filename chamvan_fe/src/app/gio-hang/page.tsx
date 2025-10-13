'use client';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const { isLoggedIn } = useAuth();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>
      {items.length === 0 ? (
        <div>Chưa có sản phẩm nào.</div>
      ) : (
        <div className="space-y-4">
          {items.map(i => (
            <div key={i.id} className="flex items-center gap-4 rounded border p-3">
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-500">SL: {i.qty}</div>
              </div>
              <div className="w-28 text-right font-semibold">
                {(i.price * i.qty).toLocaleString('vi-VN')}₫
              </div>
              <button onClick={() => remove(i.id)} className="text-sm text-red-600 hover:underline">Xoá</button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-semibold">Tổng: {total.toLocaleString('vi-VN')}₫</div>
            <div className="flex gap-3">
              <button onClick={clear} className="rounded border px-4 py-2">Xoá giỏ</button>
              <button
                className="bg-black px-4 py-2 text-white disabled:opacity-50"
                disabled={!isLoggedIn}
                title={isLoggedIn ? 'Thanh toán' : 'Đăng nhập để thanh toán'}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
