

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers/AuthProvider';
import { useCart } from './providers/CartProvider';

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, role, logout } = useAuth();
  const { count } = useCart();

  // ===== Announcement bar (xoay text 4s) =====
  const messages = useMemo(
    () => [
      'Miễn phí vận chuyển toàn quốc',
      'Hàng thủ công mỹ nghệ 100%',
      'Giao hàng tận nơi – kiểm tra trước khi nhận',
      'Đổi trả trong 7 ngày nếu lỗi kỹ thuật',
      'Ưu đãi thành viên – tích điểm đổi quà',
    ],
    []
  );
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [messages.length]);

  // underline hover
  const linkClass =
    'relative pb-2 transition-colors hover:text-[var(--color-primary)] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-primary)] after:transition-transform after:duration-300 hover:after:scale-x-100';

  const handleCartClick = () => {
    if (!isLoggedIn) return router.push('/dang-nhap');
    router.push('/gio-hang');
  };

  // ===== Mobile menu =====
  const [mobileOpen, setMobileOpen] = useState(false);
  const [houseOpen, setHouseOpen] = useState(false);

  // khóa scroll khi mở menu
  useEffect(() => {
    if (mobileOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur">
        {/* Announcement bar */}
        <div className="w-full text-white bg-black">
          <div className="flex items-center justify-center w-full h-8">
            <span
              key={idx}
              className="text-[12px] tracking-wide transition-opacity duration-500 ease-in-out"
            >
              {messages[idx]}
            </span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex items-center justify-between w-full px-6 py-3 border-b">
          {/* LEFT: brand */}
          <div className="min-w-[160px]">
            <Link href="/" className="text-lg font-semibold tracking-wide">
              CHẠM VÂN - CỔ MỘC TIỆM
            </Link>
          </div>

          {/* CENTER: menu (desktop) */}
          <ul className="hidden items-center gap-7 text-[14px] md:flex">
            <li>
              <Link href="/" className={linkClass}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/hang-moi" className={linkClass}>
                Hàng mới
              </Link>
            </li>
            <li>
              <Link href="/qua-tang" className={linkClass}>
                Quà tặng
              </Link>
            </li>

            {/* Dropdown Trang trí nhà */}
            <li className="relative group">
              <Link href="/trang-tri-nha" className={linkClass}>
                Trang trí nhà
              </Link>

              {/* Panel dropdown: trượt + mờ */}
              <div className="absolute z-30 pt-3 transition-all duration-300 -translate-x-1/2 opacity-0 pointer-events-none left-1/2 top-full group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="w-[680px] rounded-lg border bg-white shadow-xl ring-1 ring-black/5">
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div>
                      <div className="mb-2 text-xs font-semibold text-gray-500">Danh mục</div>
                      <ul className="text-sm">
                        <li>
                          <Link
                            href="/trang-tri-nha/phong-tho"
                            className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
                          >
                            Phòng thờ
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/trang-tri-nha/phong-khach"
                            className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
                          >
                            Phòng khách
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/trang-tri-nha/phong-thuy"
                            className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
                          >
                            Phong thủy
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/trang-tri-nha/trung-bay"
                            className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
                          >
                            Trưng bày
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src="https://images.baodantoc.vn/uploads/2022/Th%C3%A1ng%203/Ng%C3%A0y_30/NGOC/%E1%BA%A2nh%201.jpg"
                        alt="Trang trí"
                        className="object-cover w-full h-40 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <Link href="/tat-ca-san-pham" className={linkClass}>
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/cau-chuyen-cham-van" className={linkClass}>
                Câu chuyện Chạm Vân
              </Link>
            </li>
          </ul>

          {/* RIGHT: cart + auth + hamburger */}
          <div className="flex min-w-[160px] items-center justify-end gap-5">
            {/* Cart (luôn hiển thị) */}
            <button
              onClick={handleCartClick}
              title="Giỏ hàng"
              className="relative text-[22px] leading-none"
              aria-label="Giỏ hàng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6h15l-1.5 9H7.5L6 6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6H4M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {isLoggedIn && count > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
                  {count}
                </span>
              )}
            </button>

            {/* Auth (desktop) */}
            <div className="items-center hidden gap-3 md:flex">
              {isLoggedIn ? (
                <>
                  <span className="text-xs text-gray-500">({role?.toLowerCase()})</span>
                  <button onClick={logout} className="text-sm text-red-600 hover:underline">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dang-nhap" className="text-sm">
                    Đăng nhập
                  </Link>
                  <Link href="/dang-ky" className="text-sm">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              className="inline-flex items-center justify-center border h-9 w-9 md:hidden"
              aria-label="Mở menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* ===== MOBILE MENU (slide-over) ===== */}
      {/* overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
      />
      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-[61] h-full w-[84%] max-w-[380px] bg-white shadow-xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-semibold tracking-wide">Menu</span>
          <button onClick={closeMenu} aria-label="Đóng menu" className="w-8 h-8 border">
            ✕
          </button>
        </div>

        {/* auth quick actions */}
        <div className="px-4 py-3 border-b">
          {isLoggedIn ? (
            <div className="flex items-center justify-between text-sm">
              <span>
                Xin chào <strong className="uppercase">{role}</strong>
              </span>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="text-red-600 underline"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link href="/dang-nhap" className="underline" onClick={closeMenu}>
                Đăng nhập
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/dang-ky" className="underline" onClick={closeMenu}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* nav items */}
        <nav className="px-2 py-2 text-[15px]">
          <MobileItem href="/" label="Trang chủ" onClick={closeMenu} />
          <MobileItem href="/hang-moi" label="Hàng mới" onClick={closeMenu} />
          <MobileItem href="/qua-tang" label="Quà tặng" onClick={closeMenu} />

          {/* accordion Trang trí nhà */}
          <button
            className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-50"
            onClick={() => setHouseOpen((v) => !v)}
          >
            <span>Trang trí nhà</span>
            <svg
              className={`h-4 w-4 transition-transform ${houseOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-[max-height] ${
              houseOpen ? 'max-h-64' : 'max-h-0'
            }`}
          >
            <MobileItem depth href="/trang-tri-nha/phong-tho" label="Phòng thờ" onClick={closeMenu} />
            <MobileItem depth href="/trang-tri-nha/phong-khach" label="Phòng khách" onClick={closeMenu} />
            <MobileItem depth href="/trang-tri-nha/phong-thuy" label="Phong thủy" onClick={closeMenu} />
            <MobileItem depth href="/trang-tri-nha/trung-bay" label="Trưng bày" onClick={closeMenu} />
          </div>

          <MobileItem href="/tat-ca-san-pham" label="Tất cả sản phẩm" onClick={closeMenu} />
          <MobileItem href="/cau-chuyen-cham-van" label="Câu chuyện Chạm Vân" onClick={closeMenu} />
          <MobileItem
            href={isLoggedIn ? '/gio-hang' : '/dang-nhap'}
            label="Giỏ hàng 🛒"
            onClick={closeMenu}
          />
        </nav>
      </aside>
    </>
  );
}

function MobileItem({
  href,
  label,
  onClick,
  depth = false,
}: {
  href: string;
  label: string;
  onClick: () => void;
  depth?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-2 py-3 hover:bg-gray-50 ${depth ? 'pl-6 text-[14px] text-gray-600' : ''}`}
    >
      {label}
    </Link>
  );
}
