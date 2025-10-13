'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers/AuthProvider';
import { useCart } from './providers/CartProvider';

export default function ProductCard({
  id, name, price, image,
}: { id: number; name: string; price: number; image: string }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { add } = useCart();

  const handleAdd = () => {
    if (!isLoggedIn) return router.push('/dang-nhap');
    add({ id, name, price, image });
  };

  return (
    <div className="rounded border">
      <img src={image} alt={name} className="h-44 w-full object-cover" />
      <div className="space-y-1 p-3">
        <div className="font-medium line-clamp-1">{name}</div>
        <div className="font-semibold text-red-600">
          {price.toLocaleString('vi-VN')}₫
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-[var(--color-primary)] px-3 py-2 text-sm text-white disabled:opacity-50"
          title={isLoggedIn ? 'Thêm vào giỏ' : 'Đăng nhập để thêm vào giỏ'}
        >
          {isLoggedIn ? 'Thêm vào giỏ' : 'Thêm vào giỏ (cần đăng nhập)'}
        </button>
      </div>
    </div>
  );
}
