'use client';

import Link from 'next/link';
import AccountLayout from '../_components/AccountLayout';

export default function OrdersPage() {
  const orders = [
    { date: '10/16/2025', code: '10000002756', qty: 3, subtotal: '44.950.000 ₫', status: 'Đã hủy' },
    { date: '10/05/2025', code: '10000001990', qty: 1, subtotal: '2.350.000 ₫', status: 'Hoàn tất' },
  ];

  return (
    <AccountLayout title="Đơn đặt hàng của tôi">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-[980px] w-full table-fixed">
          {/* Chia tỉ lệ cột: ngày | mã | SL | tạm tính | trạng thái | icon */}
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
            {orders.map((o) => (
              <tr key={o.code} className="hover:bg-amber-50/60">
                <td className="px-4 py-4 whitespace-nowrap">{o.date}</td>
                <td className="px-4 py-4">
                  <Link href={`/tai-khoan/don-hang?code=${o.code}`} className="font-semibold hover:underline">
                    {o.code}
                  </Link>
                </td>
                <td className="px-4 py-4 text-right">{o.qty}</td>
                <td className="px-4 py-4 text-right">{o.subtotal}</td>
                <td className="px-4 py-4">{o.status}</td>
                <td className="px-2 py-4">
                  <Link
                    href={`/tai-khoan/don-hang?code=${o.code}`}
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
