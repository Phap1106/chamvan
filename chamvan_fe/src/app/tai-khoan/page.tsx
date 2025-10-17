'use client';

import Link from 'next/link';
import AccountLayout from './_components/AccountLayout';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[220px,1fr]">
      <dt className="text-xs font-medium tracking-wide text-gray-600">{label}</dt>
      <dd className="text-sm text-gray-800">{value}</dd>
    </div>
  );
}

export default function Page() {
  const profile = {
    name: 'nguyễn văn a',
    email: 'phap.lv1106@gmail.com',
    phone: '0328673102',
    dob: '11/10/2007',
  };

  const recent = [
    {
      date: '10/16/2025',
      code: '10000002756',
      qty: 3,
      subtotal: '44.950.000 ₫',
      status: 'Đã hủy',
      href: '/tai-khoan/don-hang?code=10000002756',
    },
  ];

  return (
    <AccountLayout title="Thông tin cá nhân">
      {/* Card thông tin */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <dl className="divide-y divide-gray-200">
          <Row label="HỌ VÀ TÊN" value={profile.name} />
          <Row label="EMAIL" value={profile.email} />
          <Row label="ĐIỆN THOẠI" value={profile.phone} />
          <Row label="NGÀY SINH" value={profile.dob} />
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
