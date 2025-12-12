
// // src/components/AddToCartButton.tsx
// 'use client';
// import { useState } from 'react';
// import { useCart } from '@/components/providers/CartProvider';
// import { useToast } from '@/components/Toaster';
// import { useAuth } from '@/components/providers/AuthProvider';
// import { usePathname, useRouter } from 'next/navigation';

// type Props = {
//   productId: string;
//   name: string;
//   price: number;
//   image: string;
//   qty: number;
//   color?: string;
// };

// export default function AddToCartButton({ productId, name, price, image, qty, color }: Props) {
//   const cart = useCart();
//   const toast = useToast();
//   const { isLoggedIn } = useAuth();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   async function addToCart() {
//     try {
//       setLoading(true);

//       if (!isLoggedIn) {
//         toast({
//           type: 'warning',
//           title: 'Cần đăng nhập',
//           message: 'Vui lòng đăng nhập để sử dụng giỏ hàng.',
//         });
//         router.push(`/dang-nhap?next=${encodeURIComponent(pathname || '/')}`);
//         return;
//       }

//       cart.add({ id: productId, name, price, image, qty, color });
//       toast({
//         type: 'success',
//         title: 'Đã thêm vào giỏ',
//         message: 'Sản phẩm đã được thêm vào giỏ hàng.',
//       });
//     } catch (e: any) {
//       const isAuth = String(e?.message || '').includes('NOT_LOGGED_IN');
//       toast({
//         type: 'error',
//         title: isAuth ? 'Cần đăng nhập' : 'Lỗi',
//         message: isAuth ? 'Vui lòng đăng nhập để thêm giỏ hàng.' : 'Có lỗi khi thêm giỏ hàng. Vui lòng thử lại.',
//       });
//       if (isAuth) router.push(`/dang-nhap?next=${encodeURIComponent(pathname || '/')}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       onClick={addToCart}
//       disabled={loading}
//       className="px-6 font-medium text-white rounded-md h-11 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60"
//     >
//       {loading ? 'Đang thêm...' : 'THÊM VÀO GIỎ HÀNG'}
//     </button>
//   );
// }






// src/components/AddToCartButton.tsx
'use client';
import { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/Toaster';

type Props = {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  color?: string;
};

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  qty,
  color,
}: Props) {
  const cart = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function addToCart() {
    try {
      setLoading(true);

      // KHÔNG yêu cầu đăng nhập nữa
      cart.add({ id: productId, name, price, image, qty, color });

      toast({
        type: 'success',
        title: 'Đã thêm vào giỏ',
        message: 'Sản phẩm đã được thêm vào giỏ hàng.',
      });
    } catch (e) {
      console.error('Add to cart error', e);
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
