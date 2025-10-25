// // src/components/account/AccountMenu.tsx
// "use client";

// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { usePathname } from "next/navigation";
// import { createPortal } from "react-dom";

// type Props = { isLoggedIn: boolean; role?: string | null; onLogout?: () => void };

// export default function AccountMenu({ isLoggedIn, role, onLogout }: Props) {
//   /* ================= DESKTOP (hover + click) ================= */
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
//       if (e.key === "Escape") {
//         setPinned(false);
//         setHovering(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocDown);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", onDocDown);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [open]);

//   /* ================= MOBILE (bottom-sheet qua Portal) ================= */
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const pathname = usePathname();

//   // reset khi mount + khi đổi route
//   useEffect(() => { setMobileOpen(false); }, []);
//   useEffect(() => { setMobileOpen(false); }, [pathname]);

//   // khóa scroll khi mở sheet
//   useEffect(() => {
//     if (mobileOpen) document.body.classList.add("overflow-hidden");
//     else document.body.classList.remove("overflow-hidden");
//     return () => document.body.classList.remove("overflow-hidden");
//   }, [mobileOpen]);

//   // auto close khi resize lên >= md
//   useEffect(() => {
//     const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
//     window.addEventListener("resize", onResize);
//     window.addEventListener("orientationchange", onResize);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("orientationchange", onResize);
//     };
//   }, []);

//   return (
//     <>
//       {/* ===== DESKTOP ONLY ===== */}
//       <div
//         ref={wrapRef}
//         className="relative hidden md:block"
//         onMouseEnter={() => scheduleOpen(true)}
//         onMouseLeave={() => scheduleOpen(false)}
//       >
//         <button
//           className="inline-flex items-center gap-2 px-3 py-2 transition border rounded-md hover:bg-gray-50"
//           aria-haspopup="menu"
//           aria-expanded={open}
//           onClick={() => setPinned(v => !v)}
//         >
//           <AvatarIcon />
//           <span className="text-sm font-medium">Tài khoản</span>
//         </button>

//         <div
//           onMouseEnter={() => scheduleOpen(true)}
//           onMouseLeave={() => scheduleOpen(false)}
//           className={[
//             "absolute right-0 mt-2 w-[296px]",
//             "rounded-lg border bg-white shadow-xl ring-1 ring-black/5 z-[80]",
//             "transition-all duration-150",
//             open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
//           ].join(" ")}
//           role="menu"
//         >
//           <div className="px-4 py-3 border-b">
//             {isLoggedIn ? (
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
//                   <AvatarIcon size={22} />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold leading-4">Tài khoản của bạn</div>
//                   <div className="text-xs text-gray-500">{role ? role.toLowerCase() : "member"}</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-sm text-gray-600">
//                 Bạn chưa đăng nhập.{" "}
//                 <Link href="/dang-nhap" className="text-black underline">Đăng nhập</Link>
//               </div>
//             )}
//           </div>

//           <ul className="p-2 text-[14px]" onClick={() => { setPinned(false); setHovering(false); }}>
//             <Item href="/tai-khoan" icon={<UserIcon />}>Thông tin cá nhân</Item>
//             <Item href="/tai-khoan/doi-mat-khau" icon={<KeyIcon />}>Đổi mật khẩu</Item>
//             <Item href="/tai-khoan/don-hang" icon={<PackageIcon />}>Thông tin đơn hàng</Item>
//             <Item href="/bao-cao-loi" icon={<BugIcon />}>Báo cáo lỗi</Item>
//           </ul>

//           <div className="px-2 pb-2">
//             {isLoggedIn ? (
//               <button
//                 onClick={() => { setPinned(false); setHovering(false); onLogout?.(); }}
//                 className="flex items-center w-full gap-3 px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
//               >
//                 <LogoutIcon /><span>Đăng xuất</span>
//               </button>
//             ) : (
//               <div className="grid grid-cols-2 gap-2 px-1 pb-1">
//                 <Link href="/dang-nhap" className="flex items-center justify-center border rounded h-9 hover:bg-gray-50">Đăng nhập</Link>
//                 <Link href="/dang-ky" className="flex items-center justify-center text-white bg-black rounded h-9 hover:bg-black/90">Đăng ký</Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== MOBILE BUTTON ===== */}
//       <button
//         className="inline-flex items-center justify-center border md:hidden h-9 w-9"
//         aria-label="Tài khoản"
//         onClick={() => setMobileOpen(true)}
//       >
//         <AvatarIcon />
//       </button>

//       {/* ===== MOBILE SHEET qua Portal (chỉ mount khi mở) ===== */}
//      {mobileOpen && createPortal(
//   <MobileAccountPortal
//     isLoggedIn={isLoggedIn}
//     onClose={() => setMobileOpen(false)}
//     onLogout={onLogout}
//     mode="top"   // <== đổi "top" | "center" | "bottom"
//   />,
//   document.body
// )}

//     </>
//   );
// }

// /* ---------- bits ---------- */
// function Item({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
//   return (
//     <li>
//       <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50" role="menuitem">
//         <span className="shrink-0">{icon}</span>
//         <span>{children}</span>
//       </Link>
//     </li>
//   );
// }
// function MobileItem({ href, icon, onClick, children }: { href: string; icon: React.ReactNode; onClick: () => void; children: React.ReactNode }) {
//   return (
//     <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 py-3 rounded hover:bg-gray-50">
//       <span className="shrink-0">{icon}</span>
//       <span className="text-[15px]">{children}</span>
//     </Link>
//   );
// }

// /* ---------- icons ---------- */
// function AvatarIcon({ size = 18 }: { size?: number }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M4 20c0-3.313 3.582-6 8-6s8 2.687 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }
// function UserIcon() { return <AvatarIcon size={24} />; }
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
// function LogoutIcon() {
//   return (
//     <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//       <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }
// function MobileAccountPortal({
//   isLoggedIn,
//   onClose,
//   onLogout,
//   mode = "top",
// }: {
//   isLoggedIn: boolean;
//   onClose: () => void;
//   onLogout?: () => void;
//   mode?: "center" | "top" | "bottom";
// }) {
//   // lớp đặt vỏ ngoài theo từng mode
//   const wrapper =
//     mode === "center"
//       ? "fixed inset-0 z-[1000] flex items-center justify-center p-4 md:hidden"
//       : mode === "top"
//       ? "fixed inset-x-0 top-0 z-[1000] p-4 md:hidden"
//       : // bottom (giữ tùy chọn cũ)
//         "fixed inset-x-0 bottom-0 z-[1000] md:hidden";

//   const card =
//     mode === "center"
//       ? "w-full max-w-md rounded-2xl bg-white shadow-2xl animate-[pop_.18s_ease-out]"
//       : mode === "top"
//       ? "mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl animate-[drop_.18s_ease-out]"
//       : "rounded-t-2xl bg-white shadow-2xl animate-[slideUp_.18s_ease-out]";

//   const containerPadding =
//     mode === "bottom" ? "max-h-[70vh] overflow-auto p-2 pb-[calc(env(safe-area-inset-bottom,0)+12px)]" : "max-h-[70vh] overflow-auto p-2";

//   return (
//     <>
//       {/* Overlay */}
//       <div className="fixed inset-0 z-[999] bg-black/40 md:hidden" onClick={onClose} />

//       {/* Card/Sheet */}
//       <div className={wrapper} role="dialog" aria-modal="true">
//         <div className={card}>
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center gap-2">
//               <AvatarIcon />
//               <div className="text-sm font-semibold">Tài khoản</div>
//             </div>
//             <button className="w-8 h-8 border rounded" onClick={onClose} aria-label="Đóng">
//               ✕
//             </button>
//           </div>

//           <div className={containerPadding}>
//             <MobileItem href="/tai-khoan" icon={<UserIcon />} onClick={onClose}>
//               Thông tin cá nhân
//             </MobileItem>
//             <MobileItem href="/tai-khoan/doi-mat-khau" icon={<KeyIcon />} onClick={onClose}>
//               Đổi mật khẩu
//             </MobileItem>
//             <MobileItem href="/tai-khoan/don-hang" icon={<PackageIcon />} onClick={onClose}>
//               Thông tin đơn hàng
//             </MobileItem>
//             <MobileItem href="/bao-cao-loi" icon={<BugIcon />} onClick={onClose}>
//               Báo cáo lỗi
//             </MobileItem>

//             {isLoggedIn ? (
//               <button
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
//                 <Link href="/dang-nhap" className="flex items-center justify-center border rounded h-11" onClick={onClose}>
//                   Đăng nhập
//                 </Link>
//                 <Link href="/dang-ky" className="flex items-center justify-center text-white bg-black rounded h-11" onClick={onClose}>
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

// /* Tailwind keyframes (tuỳ chọn, chỉ để mượt) */
// /* Thêm vào globals.css nếu muốn animation mượt:
// @keyframes slideUp { from { transform: translateY(16px); opacity: .6 } to { transform: translateY(0); opacity: 1 } }
// */








// src/components/account/AccountMenu.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

type Props = {
  isLoggedIn: boolean;
  role?: string | null;        // 'admin' | 'support_admin' | 'user'
  onLogout?: () => void;
};

export default function AccountMenu({ isLoggedIn, role, onLogout }: Props) {
  /* ================= Helpers: role ================= */
  const roleRaw = (role ?? "").toLowerCase();
  const isAdmin = roleRaw === "admin" || roleRaw === "support_admin";
  const roleLabel =
    roleRaw === "admin"
      ? "Admin"
      : roleRaw === "support_admin"
      ? "Support Admin"
      : roleRaw === "user"
      ? "Thành viên"
      : "Member";

  /* ================= DESKTOP (hover + click) ================= */
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
      if (e.key === "Escape") {
        setPinned(false);
        setHovering(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* ================= MOBILE (bottom-sheet qua Portal) ================= */
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // reset khi mount + khi đổi route
  useEffect(() => {
    setMobileOpen(false);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // khóa scroll khi mở sheet
  useEffect(() => {
    if (mobileOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  // auto close khi resize lên >= md
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return (
    <>
      {/* ===== DESKTOP ONLY ===== */}
      <div
        ref={wrapRef}
        className="relative hidden md:block"
        onMouseEnter={() => scheduleOpen(true)}
        onMouseLeave={() => scheduleOpen(false)}
      >
        <button
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
            "absolute right-0 mt-2 w-[296px]",
            "rounded-lg border bg-white shadow-xl ring-1 ring-black/5 z-[80]",
            "transition-all duration-150",
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0",
          ].join(" ")}
          role="menu"
        >
          <div className="px-4 py-3 border-b">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <AvatarIcon size={22} />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-4">
                    Tài khoản của bạn
                  </div>
                  <div className="text-xs text-gray-500">{roleLabel}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Bạn chưa đăng nhập.{" "}
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
            <Item href="/tai-khoan" icon={<UserIcon />}>
              Thông tin cá nhân
            </Item>
            <Item href="/tai-khoan/doi-mat-khau" icon={<KeyIcon />}>
              Đổi mật khẩu
            </Item>
            <Item href="/tai-khoan/don-hang" icon={<PackageIcon />}>
              Thông tin đơn hàng
            </Item>
            <Item href="/bao-cao-loi" icon={<BugIcon />}>
              Báo cáo lỗi
            </Item>

            {/* ✅ Chỉ hiện với admin/support_admin */}
            {isAdmin && (
              <Item href="/admin" icon={<ShieldIcon />}>
                Quản lý dành cho Admin
              </Item>
            )}
          </ul>

          <div className="px-2 pb-2">
            {isLoggedIn ? (
              <button
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
                <Link
                  href="/dang-ky"
                  className="flex items-center justify-center text-white bg-black rounded h-9 hover:bg-black/90"
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
        className="inline-flex items-center justify-center border md:hidden h-9 w-9"
        aria-label="Tài khoản"
        onClick={() => setMobileOpen(true)}
      >
        <AvatarIcon />
      </button>

      {/* ===== MOBILE SHEET qua Portal (chỉ mount khi mở) ===== */}
      {mobileOpen &&
        createPortal(
          <MobileAccountPortal
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            roleLabel={roleLabel}
            onClose={() => setMobileOpen(false)}
            onLogout={onLogout}
            mode="top" // "top" | "center" | "bottom"
          />,
          document.body
        )}
    </>
  );
}

/* ---------- bits ---------- */
function Item({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50"
        role="menuitem"
      >
        <span className="shrink-0">{icon}</span>
        <span>{children}</span>
      </Link>
    </li>
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
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded hover:bg-gray-50"
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-[15px]">{children}</span>
    </Link>
  );
}

/* ---------- icons ---------- */
function AvatarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 20c0-3.313 3.582-6 8-6s8 2.687 8 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UserIcon() {
  return <AvatarIcon size={24} />;
}
function KeyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 12l7 7m0 0h3m-3 0v-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
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
      <path
        d="M8 7h8m-6-3 1 2m4-2-1 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="7"
        width="12"
        height="12"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 12h3m12 0h3M6 18l-2 2m14-2 2 2M6 6 4 4m14 2 2-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MobileAccountPortal({
  isLoggedIn,
  isAdmin = false,
  roleLabel,
  onClose,
  onLogout,
  mode = "top",
}: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  roleLabel?: string;
  onClose: () => void;
  onLogout?: () => void;
  mode?: "center" | "top" | "bottom";
}) {
  // lớp đặt vỏ ngoài theo từng mode
  const wrapper =
    mode === "center"
      ? "fixed inset-0 z-[1000] flex items-center justify-center p-4 md:hidden"
      : mode === "top"
      ? "fixed inset-x-0 top-0 z-[1000] p-4 md:hidden"
      : "fixed inset-x-0 bottom-0 z-[1000] md:hidden";

  const card =
    mode === "center"
      ? "w-full max-w-md rounded-2xl bg-white shadow-2xl animate-[pop_.18s_ease-out]"
      : mode === "top"
      ? "mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl animate-[drop_.18s_ease-out]"
      : "rounded-t-2xl bg-white shadow-2xl animate-[slideUp_.18s_ease-out]";

  const containerPadding =
    mode === "bottom"
      ? "max-h-[70vh] overflow-auto p-2 pb-[calc(env(safe-area-inset-bottom,0)+12px)]"
      : "max-h-[70vh] overflow-auto p-2";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[999] bg-black/40 md:hidden"
        onClick={onClose}
      />

      {/* Card/Sheet */}
      <div className={wrapper} role="dialog" aria-modal="true">
        <div className={card}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <AvatarIcon />
              <div className="text-sm font-semibold">Tài khoản</div>
            </div>
            <button
              className="w-8 h-8 border rounded"
              onClick={onClose}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          <div className={containerPadding}>
            {/* (Tuỳ chọn) ghi chú role trên mobile */}
            {isLoggedIn && (
              <div className="px-3 pb-2 text-xs text-gray-500">{roleLabel}</div>
            )}

            <MobileItem href="/tai-khoan" icon={<UserIcon />} onClick={onClose}>
              Thông tin cá nhân
            </MobileItem>
            <MobileItem
              href="/tai-khoan/doi-mat-khau"
              icon={<KeyIcon />}
              onClick={onClose}
            >
              Đổi mật khẩu
            </MobileItem>
            <MobileItem
              href="/tai-khoan/don-hang"
              icon={<PackageIcon />}
              onClick={onClose}
            >
              Thông tin đơn hàng
            </MobileItem>
            <MobileItem
              href="/bao-cao-loi"
              icon={<BugIcon />}
              onClick={onClose}
            >
              Báo cáo lỗi
            </MobileItem>

            {/* ✅ Mobile: link Admin nếu có quyền */}
            {isLoggedIn && isAdmin && (
              <MobileItem
                href="/admin"
                icon={<ShieldIcon />}
                onClick={onClose}
              >
                Quản lý dành cho Admin
              </MobileItem>
            )}

            {isLoggedIn ? (
              <button
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
                <Link
                  href="/dang-nhap"
                  className="flex items-center justify-center border rounded h-11"
                  onClick={onClose}
                >
                  Đăng nhập
                </Link>
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

/* Tailwind keyframes (tuỳ chọn, chỉ để mượt)
@keyframes slideUp { from { transform: translateY(16px); opacity: .6 } to { transform: translateY(0); opacity: 1 } }
@keyframes drop { from { transform: translateY(-8px); opacity: .6 } to { transform: translateY(0); opacity: 1 } }
@keyframes pop { from { transform: scale(.98); opacity: .6 } to { transform: scale(1); opacity: 1 } }
*/
