// //chamvan_fe/src/app/admin/layout.tsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import {
  Home,
  PackageSearch,
  ClipboardList,
  Users,
  BarChart3,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

/* ===== Icon cho từng route ===== */
const iconOf = (href: string) => {
  if (href === '/admin') return Home;
  if (href.startsWith('/admin/products')) return PackageSearch;
  if (href.startsWith('/admin/orders')) return ClipboardList;
  if (href.startsWith('/admin/users')) return Users;
  if (href.startsWith('/admin/revenue')) return BarChart3;
  if (href.startsWith('/admin/staff')) return ShieldCheck;
  return Home;
};

/* ===== Bảng màu theo từng menu (active) ===== */
const palette: Record<
  string,
  { bg: string; text: string; ring: string; dot: string; icon: string }
> = {
  '/admin': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200',
    dot: 'bg-sky-500',
    icon: 'text-sky-700',
  },
  '/admin/products': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
    icon: 'text-amber-700',
  },
  '/admin/orders': {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200',
    dot: 'bg-violet-500',
    icon: 'text-violet-700',
  },
  '/admin/users': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: 'text-emerald-700',
  },
  '/admin/revenue': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200',
    dot: 'bg-rose-500',
    icon: 'text-rose-700',
  },
  '/admin/staff': {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    ring: 'ring-slate-200',
    dot: 'bg-slate-500',
    icon: 'text-slate-800',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  // giữ nguyên logic
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const role = (user?.role ?? '').toLowerCase();
  const isAdmin = role === 'admin' || role === 'support_admin';
  useEffect(() => {
    if (!mounted) return;
    if (isLoggedIn === true && !isAdmin) router.replace('/');
  }, [mounted, isLoggedIn, isAdmin, router]);

  // giữ nguyên danh mục
  const items = useMemo(
    () => [
      { href: '/admin', label: 'Tổng quan' },
      { href: '/admin/products', label: 'Quản lý sản phẩm' },
      { href: '/admin/orders', label: 'Quản lý đơn hàng' },
      { href: '/admin/users', label: 'Quản lý user' },
      { href: '/admin/revenue', label: 'Quản lý doanh thu' },
      { href: '/admin/staff', label: 'Quản lý nhân viên' },
    ],
    []
  );

  if (!mounted) return null;

  return (
    // Full màn desktop + nền xám nhẹ cho vùng quản trị
    <div className="w-full px-3 py-6 lg:px-6 bg-gray-50">
      {/* Top bar (mobile) giữ nguyên */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <div>
          <div className="text-sm font-semibold">Quản trị hệ thống</div>
          <div className="text-xs text-gray-500">
            {user?.fullName ?? '—'} · {role || 'member'}
          </div>
        </div>
        <MobileDrawer items={items} />
      </div>

      <div className="md:flex md:gap-6">
        {/* ===== Sidebar TRÁI — FULL CHIỀU CAO ===== */}
        <aside className="hidden md:block md:w-72 md:shrink-0">
          {/* top header site ~84px -> sidebar cao = 100vh - 84px (chỉnh cho phù hợp site bạn) */}
          <div className="sticky top-[84px]">
            <div className="h-[calc(100vh-100px)] rounded-3xl bg-white ring-1 ring-gray-200 p-3 flex flex-col">
              {/* Header trong sidebar */}
              <div className="flex items-center justify-between px-3 py-3 mb-3 bg-gray-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-gray-900 rounded-full" />
                  <span className="text-[12px] font-semibold tracking-wide text-gray-800">
                    ADMIN QUẢN TRỊ
                  </span>
                </div>
                {/* nút menu “đẹp” – chỉ là UI */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                </div>
              </div>

              {/* Danh mục */}
              <nav className="flex-1 p-2 overflow-auto bg-white border border-gray-200 rounded-2xl">
                {items.map((it) => {
                  const active = pathname === it.href;
                  // lấy màu theo prefix khớp
                  const key =
                    Object.keys(palette).find((k) =>
                      it.href.startsWith(k)
                    ) ?? '/admin';
                  const c = palette[key];

                  const Icon = iconOf(it.href);

                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={[
                        'group flex items-center gap-3 rounded-2xl px-2 py-2 text-[13px] font-medium transition mb-1',
                        active
                          ? `${c.bg} ${c.text} ring-1 ${c.ring}`
                          : 'text-gray-700 hover:bg-gray-100',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'grid h-8 w-8 place-items-center rounded-full border transition',
                          active ? `border-transparent ${c.bg}` : 'border-gray-200 bg-white',
                        ].join(' ')}
                      >
                        <Icon className={active ? `h-4 w-4 ${c.icon}` : 'h-4 w-4 text-gray-700'} />
                      </span>
                      <span className="truncate">{it.label}</span>

                      {/* dot màu ở cuối khi active */}
                      {active && <span className={`ml-auto h-2 w-2 rounded-full ${c.dot}`} />}
                    </Link>
                  );
                })}
              </nav>

              {/* Khối user + logout */}
              <div className="p-3 mt-3 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="object-cover border border-gray-200 rounded-full h-9 w-9"
                  />
                  <div className="text-sm font-medium text-gray-800 truncate">
                    @{user?.fullName || 'admin'}
                  </div>
                </div>

                <button
                  className="mt-3 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50"
                  onClick={() => (window.location.href = '/logout')}
                >
                  <span className="grid w-8 h-8 bg-white border rounded-full place-items-center border-rose-200">
                    <LogOut className="w-4 h-4 text-rose-600" />
                  </span>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ===== Content bên phải ===== */}
        <main className="flex-1">
          {/* card nội dung sáng, biên độ theo mẫu */}
          <div className="p-4 bg-white rounded-2xl ring-1 ring-gray-200 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===== Mobile drawer (giữ logic, đồng bộ style sáng) ===== */
function MobileDrawer({ items }: { items: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 text-sm border rounded h-9 md:hidden"
        aria-label="Mở menu quản trị"
      >
        Menu
      </button>

      <div
        onClick={() => setOpen(false)}
        className={[
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      <div
        className={[
          'fixed inset-y-0 left-0 z-50 w-[82%] max-w-[340px] bg-white p-3 transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-3 py-3 mb-3 bg-gray-100 rounded-2xl">
          <span className="text-sm font-semibold">ADMIN QUẢN TRỊ</span>
          <button className="w-8 h-8 border rounded-xl" onClick={() => setOpen(false)} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="p-2 border border-gray-200 rounded-2xl">
          {items.map((it) => {
            const active = pathname === it.href;
            const key =
              Object.keys(palette).find((k) => it.href.startsWith(k)) ?? '/admin';
            const c = palette[key];
            const Icon = iconOf(it.href);

            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={[
                  'mb-1 flex items-center gap-3 rounded-2xl px-2 py-2 text-[13px] font-medium transition',
                  active ? `${c.bg} ${c.text} ring-1 ${c.ring}` : 'text-gray-700 hover:bg-gray-100',
                ].join(' ')}
              >
                <span
                  className={[
                    'grid h-8 w-8 place-items-center rounded-full border',
                    active ? `border-transparent ${c.bg}` : 'border-gray-200 bg-white',
                  ].join(' ')}
                >
                  <Icon className={active ? `h-4 w-4 ${c.icon}` : 'h-4 w-4 text-gray-700'} />
                </span>
                <span className="truncate">{it.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          className="mt-3 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50"
          onClick={() => (window.location.href = '/logout')}
        >
          <span className="grid w-8 h-8 bg-white border rounded-full place-items-center border-rose-200">
            <LogOut className="w-4 h-4 text-rose-600" />
          </span>
          Đăng xuất
        </button>
      </div>
    </>
  );
}
