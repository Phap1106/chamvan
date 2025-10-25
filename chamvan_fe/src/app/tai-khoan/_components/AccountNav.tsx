// chamvan_fe/src/app/tai-khoan/_components/AccountNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/tai-khoan', label: 'Thông tin cá nhân' },
  { href: '/tai-khoan/doi-mat-khau', label: 'Thay đổi mật khẩu' },
  { href: '/tai-khoan/don-hang', label: 'Đơn đặt hàng của tôi' },
  { href: '/tai-khoan/doi-tra', label: 'Yêu cầu đổi trả của tôi' }, // (đang placeholder)
  { href: '/tai-khoan/yeu-thich', label: 'Danh sách yêu thích' },   // (đang placeholder)
  { href: '/bao-cao-loi', label: 'Báo cáo lỗi' },
];

export function AccountNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/tai-khoan' ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div className="px-4 py-3 text-sm font-medium bg-gray-50">
        Thông tin tài khoản
      </div>

      <nav className="divide-y divide-gray-200">
        {NAV.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`block px-4 py-3 text-sm transition ${
              isActive(i.href) ? 'bg-black text-white' : 'hover:bg-gray-50'
            }`}
          >
            {i.label}
          </Link>
        ))}
        <button className="block w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-gray-50">
          Đăng xuất
        </button>
      </nav>
    </div>
  );
}
