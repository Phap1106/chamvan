// // chamvan_fe/src/app/tai-khoan/page.tsx
// 'use client';

// import Link from 'next/link';
// import AccountLayout from './_components/AccountLayout';

// function Row({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[220px,1fr]">
//       <dt className="text-xs font-medium tracking-wide text-gray-600">{label}</dt>
//       <dd className="text-sm text-gray-800">{value}</dd>
//     </div>
//   );
// }

// export default function Page() {
//   const profile = {
//     name: 'nguyễn văn a',
//     email: 'phap.lv1106@gmail.com',
//     phone: '0328673102',
//     dob: '11/10/2007',
//   };

//   const recent = [
//     {
//       date: '10/16/2025',
//       code: '10000002756',
//       qty: 3,
//       subtotal: '44.950.000 ₫',
//       status: 'Đã hủy',
//       href: '/tai-khoan/don-hang?code=10000002756',
//     },
//   ];

//   return (
//     <AccountLayout title="Thông tin cá nhân">
//       {/* Card thông tin */}
//       <div className="overflow-hidden border border-gray-200 rounded-lg">
//         <dl className="divide-y divide-gray-200">
//           <Row label="HỌ VÀ TÊN" value={profile.name} />
//           <Row label="EMAIL" value={profile.email} />
//           <Row label="ĐIỆN THOẠI" value={profile.phone} />
//           <Row label="NGÀY SINH" value={profile.dob} />
//         </dl>
//       </div>

//       <div className="mt-4">
//         <Link
//           href="/tai-khoan/chinh-sua"
//           className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
//         >
//           THAY ĐỔI THÔNG TIN
//         </Link>
//       </div>

//       {/* Bảng báo cáo: cột rõ ràng, chạy dọc */}
//       <h2 className="mt-10 mb-4 text-xl font-semibold">ĐƠN HÀNG GẦN NHẤT</h2>

//       <div className="overflow-x-auto border border-gray-200 rounded-lg">
//         <table className="min-w-[980px] w-full table-fixed">
//           <colgroup>
//             <col className="w-[140px]" />
//             <col className="w-[240px]" />
//             <col className="w-[110px]" />
//             <col className="w-[200px]" />
//             <col className="w-[160px]" />
//             <col className="w-[60px]" />
//           </colgroup>

//           <thead className="text-sm font-medium text-gray-700 bg-amber-50">
//             <tr>
//               <th className="px-4 py-3 text-left">Ngày</th>
//               <th className="px-4 py-3 text-left">Mã đơn hàng</th>
//               <th className="px-4 py-3 text-right">Số lượng</th>
//               <th className="px-4 py-3 text-right">Tạm tính</th>
//               <th className="px-4 py-3 text-left">Trạng thái</th>
//               <th className="px-2 py-3" />
//             </tr>
//           </thead>

//           <tbody className="text-sm divide-y divide-gray-200">
//             {recent.map((o) => (
//               <tr key={o.code} className="hover:bg-amber-50/60">
//                 <td className="px-4 py-4">{o.date}</td>
//                 <td className="px-4 py-4">
//                   <Link href={o.href} className="font-semibold hover:underline">
//                     {o.code}
//                   </Link>
//                 </td>
//                 <td className="px-4 py-4 text-right">{o.qty}</td>
//                 <td className="px-4 py-4 text-right">{o.subtotal}</td>
//                 <td className="px-4 py-4">{o.status}</td>
//                 <td className="px-2 py-4">
//                   <Link
//                     href={o.href}
//                     aria-label="Xem chi tiết"
//                     className="flex items-center justify-center w-8 h-8 ml-auto border border-gray-300 rounded-full"
//                   >
//                     <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M9 18l6-6-6-6" />
//                     </svg>
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </AccountLayout>
//   );
// }









'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AccountLayout from './_components/AccountLayout';

type Me = {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'support_admin' | 'user';
  phone?: string | null;
  dob?: string | null; // YYYY-MM-DD
};

type OrderItem = { productId: string; qty: number };
type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDob?: string;
  shippingAddress?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  createdAt?: string; // ISO
  status?: string; // nếu BE có
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[220px,1fr]">
      <dt className="text-xs font-medium tracking-wide text-gray-600">{label}</dt>
      <dd className="text-sm text-gray-800">{value}</dd>
    </div>
  );
}

// Helpers
function toVND(n: number) {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n.toLocaleString('vi-VN')} ₫`;
  }
}
function toVNDate(s?: string | null) {
  if (!s) return '';
  // hỗ trợ cả YYYY-MM-DD và ISO
  const d = s.length === 10 ? new Date(`${s}T00:00:00`) : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

export default function Page() {
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // gọi API khi vào trang
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // 1) lấy hồ sơ từ cookie JWT qua proxy /api/auth/me
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!meRes.ok) {
          throw new Error('Vui lòng đăng nhập để xem thông tin tài khoản.');
        }
        const meData: Me = await meRes.json();
        if (!mounted) return;
        setMe(meData);

        // 2) lấy danh sách đơn hàng — tạm thời lấy tất cả rồi lọc theo email
        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
        const odRes = await fetch(`${base}/orders`, { cache: 'no-store' });
        if (odRes.ok) {
          const list: Order[] = await odRes.json();
          if (!mounted) return;
          const mine = (list || [])
            .filter(o => o.customerEmail?.toLowerCase() === meData.email.toLowerCase())
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setOrders(mine);
        } else {
          // nếu BE chặn, vẫn hiển thị profile
          setOrders([]);
        }
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || 'Không tải được dữ liệu.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const recent = useMemo(() => {
    return orders.slice(0, 5).map(o => ({
      date: toVNDate(o.createdAt || ''),
      code: o.id,
      qty: o.items?.reduce((sum, it) => sum + (it?.qty || 0), 0) || 0,
      subtotal: toVND(o.subtotal ?? o.total ?? 0),
      status: o.status || '—',
      href: `/tai-khoan/don-hang?code=${encodeURIComponent(o.id)}`,
    }));
  }, [orders]);

  return (
    <AccountLayout title="Thông tin cá nhân">
      {/* Thông báo lỗi/đang tải */}
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Đang tải thông tin tài khoản…</div>
      )}
      {err && (
        <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded bg-red-50">
          {err}
        </div>
      )}

      {/* Card thông tin */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <dl className="divide-y divide-gray-200">
          <Row label="HỌ VÀ TÊN" value={me?.fullName || '—'} />
          <Row label="EMAIL" value={me?.email || '—'} />
          <Row label="ĐIỆN THOẠI" value={me?.phone || '—'} />
          <Row label="NGÀY SINH" value={toVNDate(me?.dob)} />
        </dl>
      </div>

      <div className="mt-4">
        <Link
          href="/tai-khoan/chinh-sua"
          className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
        >
          THAY ĐỔI THÔNG TIN
        </Link>
      </div>

      {/* Bảng báo cáo: cột rõ ràng, chạy dọc */}
      <h2 className="mt-10 mb-4 text-xl font-semibold">ĐƠN HÀNG GẦN NHẤT</h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-[980px] w-full table-fixed">
          <colgroup>
            <col className="w-[140px]" />
            <col className="w-[240px]" />
            <col className="w-[110px]" />
            <col className="w-[200px]" />
            <col className="w-[160px]" />
            <col className="w-[60px]" />
          </colgroup>

          <thead className="text-sm font-medium text-gray-700 bg-amber-50">
            <tr>
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Mã đơn hàng</th>
              <th className="px-4 py-3 text-right">Số lượng</th>
              <th className="px-4 py-3 text-right">Tạm tính</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-200">
            {recent.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            )}

            {recent.map((o) => (
              <tr key={o.code} className="hover:bg-amber-50/60">
                <td className="px-4 py-4">{o.date}</td>
                <td className="px-4 py-4">
                  <Link href={o.href} className="font-semibold hover:underline">
                    {o.code}
                  </Link>
                </td>
                <td className="px-4 py-4 text-right">{o.qty}</td>
                <td className="px-4 py-4 text-right">{o.subtotal}</td>
                <td className="px-4 py-4">{o.status}</td>
                <td className="px-2 py-4">
                  <Link
                    href={o.href}
                    aria-label="Xem chi tiết"
                    className="flex items-center justify-center w-8 h-8 ml-auto border border-gray-300 rounded-full"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountLayout>
  );
}
