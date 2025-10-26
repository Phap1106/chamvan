
// // src/components/account/AccountMenu.tsx
// 'use client';

// import Link from 'next/link';
// import { useEffect, useRef, useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { createPortal } from 'react-dom';

// /* ======================== Props ======================== */
// type Props = {
//   isLoggedIn: boolean;
//   role?: string | null; // 'admin' | 'support_admin' | 'user'
//   onLogout?: () => void; // callback đã tích hợp API ở nơi gọi
// };

// /* ======================== Component ======================== */
// export default function AccountMenu({ isLoggedIn, role, onLogout }: Props) {
//   /* ---------- role helpers ---------- */
//   const roleRaw = (role ?? '').toLowerCase();
//   const isAdmin = roleRaw === 'admin' || roleRaw === 'support_admin';
//   const roleLabel =
//     roleRaw === 'admin'
//       ? 'Admin'
//       : roleRaw === 'support_admin'
//       ? 'Support Admin'
//       : roleRaw === 'user'
//       ? 'Thành viên'
//       : 'Member';

//   /* ---------- Router helpers ---------- */
//   const pathname = usePathname();

//   // gate: nếu chưa đăng nhập, đẩy về /dang-nhap?next=...
//   const gate = (href: string) =>
//     isLoggedIn ? href : `/dang-nhap?next=${encodeURIComponent(href)}`;

//   /* ================= DESKTOP DROPDOWN ================= */
//   const wrapRef = useRef<HTMLDivElement | null>(null);
//   const [hovering, setHovering] = useState(false);
//   const [pinned, setPinned] = useState(false);
//   const [open, setOpen] = useState(false);
//   const openTimer = useRef<number | null>(null);
//   const closeTimer = useRef<number | null>(null);

//   const scheduleOpen = (v: boolean) => {
//     if (v) {
//       if (closeTimer.current) window.clearTimeout(closeTimer.current);
//       openTimer.current = window.setTimeout(() => setHovering(true), 60);
//     } else {
//       if (openTimer.current) window.clearTimeout(openTimer.current);
//       closeTimer.current = window.setTimeout(() => setHovering(false), 120);
//     }
//   };
//   useEffect(() => setOpen(hovering || pinned), [hovering, pinned]);

//   useEffect(() => {
//     const onDocDown = (e: MouseEvent) => {
//       if (!open || !wrapRef.current) return;
//       if (!wrapRef.current.contains(e.target as Node)) {
//         setPinned(false);
//         setHovering(false);
//       }
//     };
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         setPinned(false);
//         setHovering(false);
//       }
//     };
//     document.addEventListener('mousedown', onDocDown);
//     document.addEventListener('keydown', onKey);
//     return () => {
//       document.removeEventListener('mousedown', onDocDown);
//       document.removeEventListener('keydown', onKey);
//     };
//   }, [open]);

//   /* ================= MOBILE SHEET ================= */
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // đóng khi đổi route
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   // khóa scroll body khi sheet mở
//   useEffect(() => {
//     if (mobileOpen) document.body.classList.add('overflow-hidden');
//     else document.body.classList.remove('overflow-hidden');
//     return () => document.body.classList.remove('overflow-hidden');
//   }, [mobileOpen]);

//   // auto close sheet khi >= md
//   useEffect(() => {
//     const onResize = () => {
//       if (window.innerWidth >= 768) setMobileOpen(false);
//     };
//     window.addEventListener('resize', onResize);
//     window.addEventListener('orientationchange', onResize);
//     return () => {
//       window.removeEventListener('resize', onResize);
//       window.removeEventListener('orientationchange', onResize);
//     };
//   }, []);

//   return (
//     <>
//       {/* ===== DESKTOP ===== */}
//       <div
//         ref={wrapRef}
//         className="relative hidden md:block"
//         onMouseEnter={() => scheduleOpen(true)}
//         onMouseLeave={() => scheduleOpen(false)}
//       >
//         <button
//           type="button"
//           className="inline-flex items-center gap-2 px-3 py-2 transition border rounded-md hover:bg-gray-50"
//           aria-haspopup="menu"
//           aria-expanded={open}
//           onClick={() => setPinned((v) => !v)}
//         >
//           <AvatarIcon />
//           <span className="text-sm font-medium">Tài khoản</span>
//         </button>

//         <div
//           onMouseEnter={() => scheduleOpen(true)}
//           onMouseLeave={() => scheduleOpen(false)}
//           className={[
//             'absolute right-0 z-[80] mt-2 w-[296px] rounded-lg border bg-white shadow-xl ring-1 ring-black/5',
//             'transition-all duration-150',
//             open
//               ? 'pointer-events-auto translate-y-0 opacity-100'
//               : 'pointer-events-none -translate-y-1 opacity-0',
//           ].join(' ')}
//           role="menu"
//         >
//           <div className="px-4 py-3 border-b">
//             {isLoggedIn ? (
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
//                   <AvatarIcon size={22} />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold leading-4">
//                     Tài khoản của bạn
//                   </div>
//                   <div className="text-xs text-gray-500">{roleLabel}</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-sm text-gray-600">
//                 Bạn chưa đăng nhập.{' '}
//                 <Link href={gate('/dang-nhap')} className="text-black underline">
//                   Đăng nhập
//                 </Link>
//               </div>
//             )}
//           </div>

//           <ul
//             className="p-2 text-[14px]"
//             onClick={() => {
//               setPinned(false);
//               setHovering(false);
//             }}
//           >
//             <Item href={gate('/tai-khoan')} icon={<UserIcon />}>
//               Thông tin cá nhân
//             </Item>
//             <Item href={gate('/tai-khoan/doi-mat-khau')} icon={<KeyIcon />}>
//               Đổi mật khẩu
//             </Item>
//             <Item href={gate('/tai-khoan/don-hang')} icon={<PackageIcon />}>
//               Thông tin đơn hàng
//             </Item>
//             <Item href={gate('/bao-cao-loi')} icon={<BugIcon />}>
//               Báo cáo lỗi
//             </Item>

//             {isAdmin && (
//               <Item href={gate('/admin')} icon={<ShieldIcon />}>
//                 Quản lý dành cho Admin
//               </Item>
//             )}
//           </ul>

//           <div className="px-2 pb-2">
//             {isLoggedIn ? (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setPinned(false);
//                   setHovering(false);
//                   onLogout?.();
//                 }}
//                 className="flex items-center w-full gap-3 px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
//               >
//                 <LogoutIcon />
//                 <span>Đăng xuất</span>
//               </button>
//             ) : (
//               <div className="grid grid-cols-2 gap-2 px-1 pb-1">
//                 <Link
//                   href={gate('/dang-nhap')}
//                   className="flex items-center justify-center border rounded h-9 hover:bg-gray-50"
//                 >
//                   Đăng nhập
//                 </Link>
//                 <Link
//                   href={gate('/dang-ky')}
//                   className="flex items-center justify-center text-white bg-black rounded h-9 hover:opacity-90"
//                 >
//                   Đăng ký
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== MOBILE BUTTON ===== */}
//       <button
//         type="button"
//         className="inline-flex items-center justify-center border h-9 w-9 md:hidden"
//         aria-label="Tài khoản"
//         onClick={() => setMobileOpen(true)}
//       >
//         <AvatarIcon />
//       </button>

//       {/* ===== MOBILE SHEET (Portal) ===== */}
//       {mobileOpen &&
//         createPortal(
//           <MobileSheet
//             isLoggedIn={isLoggedIn}
//             isAdmin={isAdmin}
//             roleLabel={isLoggedIn ? roleLabel : undefined}
//             onClose={() => setMobileOpen(false)}
//             onLogout={onLogout}
//             gate={gate}
//           />,
//           document.body
//         )}
//     </>
//   );
// }

// /* ======================== Sub Components ======================== */
// function Item({
//   href,
//   icon,
//   children,
// }: {
//   href: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <li>
//       <Link
//         href={href}
//         className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50"
//         role="menuitem"
//       >
//         <span className="shrink-0">{icon}</span>
//         <span>{children}</span>
//       </Link>
//     </li>
//   );
// }

// function MobileSheet({
//   isLoggedIn,
//   isAdmin,
//   roleLabel,
//   onClose,
//   onLogout,
//   gate,
// }: {
//   isLoggedIn: boolean;
//   isAdmin: boolean;
//   roleLabel?: string;
//   onClose: () => void;
//   onLogout?: () => void;
//   gate: (href: string) => string;
// }) {
//   return (
//     <>
//       <div className="fixed inset-0 z-[999] bg-black/40 md:hidden" onClick={onClose} />
//       <div className="fixed inset-x-0 top-0 z-[1000] p-4 md:hidden" role="dialog" aria-modal="true">
//         <div className="mx-auto w-full max-w-md animate-[drop_.18s_ease-out] rounded-2xl bg-white shadow-2xl">
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center gap-2">
//               <AvatarIcon />
//               <div className="text-sm font-semibold">Tài khoản</div>
//             </div>
//             <button
//               type="button"
//               className="w-8 h-8 border rounded"
//               onClick={onClose}
//               aria-label="Đóng"
//             >
//               ✕
//             </button>
//           </div>

//           <div className="max-h-[70vh] overflow-auto p-2">
//             {isLoggedIn && roleLabel && (
//               <div className="px-3 pb-2 text-xs text-gray-500">{roleLabel}</div>
//             )}

//             <MobileItem href={gate('/tai-khoan')} icon={<UserIcon />} onClick={onClose}>
//               Thông tin cá nhân
//             </MobileItem>
//             <MobileItem href={gate('/tai-khoan/doi-mat-khau')} icon={<KeyIcon />} onClick={onClose}>
//               Đổi mật khẩu
//             </MobileItem>
//             <MobileItem href={gate('/tai-khoan/don-hang')} icon={<PackageIcon />} onClick={onClose}>
//               Thông tin đơn hàng
//             </MobileItem>
//             <MobileItem href={gate('/bao-cao-loi')} icon={<BugIcon />} onClick={onClose}>
//               Báo cáo lỗi
//             </MobileItem>

//             {isAdmin && (
//               <MobileItem href={gate('/admin')} icon={<ShieldIcon />} onClick={onClose}>
//                 Quản lý dành cho Admin
//               </MobileItem>
//             )}

//             {isLoggedIn ? (
//               <button
//                 type="button"
//                 onClick={() => {
//                   onClose();
//                   onLogout?.();
//                 }}
//                 className="w-full mt-2 text-red-600 border border-red-300 rounded h-11"
//               >
//                 Đăng xuất
//               </button>
//             ) : (
//               <div className="grid grid-cols-2 gap-2 mt-2">
//                 <Link
//                   href={gate('/dang-nhap')}
//                   className="flex items-center justify-center border rounded h-11"
//                   onClick={onClose}
//                 >
//                   Đăng nhập
//                 </Link>
//                 <Link
//                   href={gate('/dang-ky')}
//                   className="flex items-center justify-center text-white bg-black rounded h-11"
//                   onClick={onClose}
//                 >
//                   Đăng ký
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function MobileItem({
//   href,
//   icon,
//   onClick,
//   children,
// }: {
//   href: string;
//   icon: React.ReactNode;
//   onClick: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className="flex items-center gap-3 px-3 py-3 rounded hover:bg-gray-50"
//     >
//       <span className="shrink-0">{icon}</span>
//       <span className="text-[15px]">{children}</span>
//     </Link>
//   );
// }

// /* ======================== Icons (inline SVG) ======================== */
// function AvatarIcon({ size = 18 }: { size?: number }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M4 20c0-3.313 3.582-6 8-6s8 2.687 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }
// function UserIcon() {
//   return <AvatarIcon size={24} />;
// }
// function KeyIcon() {
//   return (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//       <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M12 12l7 7m0 0h3m-3 0v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }
// function PackageIcon() {
//   return (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//       <path d="M3 7l9-4 9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.6" />
//     </svg>
//   );
// }
// function BugIcon() {
//   return (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//       <path d="M8 7h8m-6-3 1 2m4-2-1 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//       <rect x="6" y="7" width="12" height="12" rx="6" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M3 12h3m12 0h3M6 18l-2 2m14-2 2 2M6 6 4 4m14 2 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }
// function ShieldIcon() {
//   return (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//       <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }
// function LogoutIcon() {
//   return (
//     <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//       <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }

// /* Tailwind keyframes gợi ý:
// @keyframes drop { from { transform: translateY(-8px); opacity: .6 } to { transform: translateY(0); opacity: 1 } }
// */










// src/components/account/AccountMenu.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

type Props = {
  isLoggedIn: boolean;
  role?: string | null; // 'admin' | 'support_admin' | 'user'
  onLogout?: () => void;
};

export default function AccountMenu({ isLoggedIn, role, onLogout }: Props) {
  const roleRaw = (role ?? '').toLowerCase();
  const isAdmin = roleRaw === 'admin' || roleRaw === 'support_admin';
  const roleLabel =
    roleRaw === 'admin'
      ? 'Admin'
      : roleRaw === 'support_admin'
      ? 'Support Admin'
      : roleRaw === 'user'
      ? 'Thành viên'
      : 'Member';

  const pathname = usePathname();

  /** Gate chỉ cho các đường dẫn cần đăng nhập */
  const NEED_AUTH = ['/tai-khoan', '/bao-cao-loi', '/admin'];
  const gate = (href: string) => {
    if (isLoggedIn) return href;
    const needAuth = NEED_AUTH.some((p) => href === p || href.startsWith(p + '/'));
    return needAuth ? `/dang-nhap?next=${encodeURIComponent(href)}` : href;
  };

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const scheduleOpen = (v: boolean) => {
    if (v) {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      openTimer.current = window.setTimeout(() => setHovering(true), 60);
    } else {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      closeTimer.current = window.setTimeout(() => setHovering(false), 120);
    }
  };
  useEffect(() => setOpen(hovering || pinned), [hovering, pinned]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!open || !wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setPinned(false);
        setHovering(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(false);
        setHovering(false);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    if (mobileOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileOpen]);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return (
    <>
      {/* ===== DESKTOP ===== */}
      <div
        ref={wrapRef}
        className="relative hidden md:block"
        onMouseEnter={() => scheduleOpen(true)}
        onMouseLeave={() => scheduleOpen(false)}
      >
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-2 transition border rounded-md hover:bg-gray-50"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setPinned((v) => !v)}
        >
          <AvatarIcon />
          <span className="text-sm font-medium">Tài khoản</span>
        </button>

        <div
          onMouseEnter={() => scheduleOpen(true)}
          onMouseLeave={() => scheduleOpen(false)}
          className={[
            'absolute right-0 z-[80] mt-2 w-[296px] rounded-lg border bg-white shadow-xl ring-1 ring-black/5',
            'transition-all duration-150',
            open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
          ].join(' ')}
          role="menu"
        >
          <div className="px-4 py-3 border-b">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <AvatarIcon size={22} />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-4">Tài khoản của bạn</div>
                  <div className="text-xs text-gray-500">{roleLabel}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Bạn chưa đăng nhập.{' '}
                <Link href="/dang-nhap" className="text-black underline">
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>

          <ul
            className="p-2 text-[14px]"
            onClick={() => {
              setPinned(false);
              setHovering(false);
            }}
          >
            <Item href={gate('/tai-khoan')} icon={<UserIcon />}>Thông tin cá nhân</Item>
            <Item href={gate('/tai-khoan/doi-mat-khau')} icon={<KeyIcon />}>Đổi mật khẩu</Item>
            <Item href={gate('/tai-khoan/don-hang')} icon={<PackageIcon />}>Thông tin đơn hàng</Item>
            <Item href={gate('/bao-cao-loi')} icon={<BugIcon />}>Báo cáo lỗi</Item>
            {isAdmin && <Item href={gate('/admin')} icon={<ShieldIcon />}>Quản lý dành cho Admin</Item>}
          </ul>

          <div className="px-2 pb-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setPinned(false);
                  setHovering(false);
                  onLogout?.();
                }}
                className="flex items-center w-full gap-3 px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                <LogoutIcon />
                <span>Đăng xuất</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-1 pb-1">
                <Link
                  href="/dang-nhap"
                  className="flex items-center justify-center border rounded h-9 hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                {/* ĐĂNG KÝ: luôn đi thẳng /dang-ky */}
                <Link
                  href="/dang-ky"
                  className="flex items-center justify-center text-white bg-black rounded h-9 hover:opacity-90"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MOBILE BUTTON ===== */}
      <button
        type="button"
        className="inline-flex items-center justify-center border h-9 w-9 md:hidden"
        aria-label="Tài khoản"
        onClick={() => setMobileOpen(true)}
      >
        <AvatarIcon />
      </button>

      {/* ===== MOBILE SHEET (Portal) ===== */}
      {mobileOpen &&
        createPortal(
          <MobileSheet
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            roleLabel={isLoggedIn ? roleLabel : undefined}
            onClose={() => setMobileOpen(false)}
            onLogout={onLogout}
            gate={gate}
          />,
          document.body
        )}
    </>
  );
}

function Item({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50" role="menuitem">
        <span className="shrink-0">{icon}</span>
        <span>{children}</span>
      </Link>
    </li>
  );
}

function MobileSheet({
  isLoggedIn,
  isAdmin,
  roleLabel,
  onClose,
  onLogout,
  gate,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
  roleLabel?: string;
  onClose: () => void;
  onLogout?: () => void;
  gate: (href: string) => string;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[999] bg-black/40 md:hidden" onClick={onClose} />
      <div className="fixed inset-x-0 top-0 z-[1000] p-4 md:hidden" role="dialog" aria-modal="true">
        <div className="mx-auto w-full max-w-md animate-[drop_.18s_ease-out] rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <AvatarIcon />
              <div className="text-sm font-semibold">Tài khoản</div>
            </div>
            <button type="button" className="w-8 h-8 border rounded" onClick={onClose} aria-label="Đóng">
              ✕
            </button>
          </div>

          <div className="max-h-[70vh] overflow-auto p-2">
            {isLoggedIn && roleLabel && <div className="px-3 pb-2 text-xs text-gray-500">{roleLabel}</div>}

            <MobileItem href={gate('/tai-khoan')} icon={<UserIcon />} onClick={onClose}>
              Thông tin cá nhân
            </MobileItem>
            <MobileItem href={gate('/tai-khoan/doi-mat-khau')} icon={<KeyIcon />} onClick={onClose}>
              Đổi mật khẩu
            </MobileItem>
            <MobileItem href={gate('/tai-khoan/don-hang')} icon={<PackageIcon />} onClick={onClose}>
              Thông tin đơn hàng
            </MobileItem>
            <MobileItem href={gate('/bao-cao-loi')} icon={<BugIcon />} onClick={onClose}>
              Báo cáo lỗi
            </MobileItem>
            {isAdmin && (
              <MobileItem href={gate('/admin')} icon={<ShieldIcon />} onClick={onClose}>
                Quản lý dành cho Admin
              </MobileItem>
            )}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout?.();
                }}
                className="w-full mt-2 text-red-600 border border-red-300 rounded h-11"
              >
                Đăng xuất
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link href="/dang-nhap" className="flex items-center justify-center border rounded h-11" onClick={onClose}>
                  Đăng nhập
                </Link>
                {/* ĐĂNG KÝ: luôn đi thẳng /dang-ky */}
                <Link
                  href="/dang-ky"
                  className="flex items-center justify-center text-white bg-black rounded h-11"
                  onClick={onClose}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MobileItem({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 py-3 rounded hover:bg-gray-50">
      <span className="shrink-0">{icon}</span>
      <span className="text-[15px]">{children}</span>
    </Link>
  );
}

/* Icons */
function AvatarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 20c0-3.313 3.582-6 8-6s8 2.687 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() { return <AvatarIcon size={24} />; }
function KeyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 12l7 7m0 0h3m-3 0v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 7l9-4 9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function BugIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 7h8m-6-3 1 2m4-2-1 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="6" y="7" width="12" height="12" rx="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h3m12 0h3M6 18l-2 2m14-2 2 2M6 6 4 4m14 2 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
