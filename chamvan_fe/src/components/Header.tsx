// // src/components/Header.tsx
// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "./providers/AuthProvider";
// import { useCart } from "./providers/CartProvider";
// import MiniCart from "@/components/cart/MiniCart";
// import AccountMenu from "@/components/account/AccountMenu";

// /* ================= Header ================= */
// export default function Header() {
//   const router = useRouter();
//   const { isLoggedIn, role, logout } = useAuth();
//   const { items, count, updateQty, remove, subtotal } = useCart();

//   /* ===== Announcement bar (xoay text 4s) ===== */
//   const messages = useMemo(
//     () => [
//       "Miễn phí vận chuyển toàn quốc",
//       "Hàng thủ công mỹ nghệ 100%",
//       "Giao hàng tận nơi – kiểm tra trước khi nhận",
//       "Đổi trả trong 7 ngày nếu lỗi kỹ thuật",
//       "Ưu đãi thành viên – tích điểm đổi quà",
//     ],
//     []
//   );
//   const [idx, setIdx] = useState(0);
//   useEffect(() => {
//     const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
//     return () => clearInterval(t);
//   }, [messages.length]);

//   const linkClass =
//     "relative pb-2 transition-colors hover:text-[var(--color-primary)] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-primary)] after:transition-transform after:duration-300 hover:after:scale-x-100";

//   const handleCartClick = () => {
//     if (!isLoggedIn) return router.push("/dang-nhap");
//     router.push("/gio-hang");
//   };

//   /* ===== Mobile menu ===== */
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [houseOpen, setHouseOpen] = useState(false);
//   useEffect(() => {
//     if (mobileOpen) document.body.classList.add("overflow-hidden");
//     else document.body.classList.remove("overflow-hidden");
//     return () => document.body.classList.remove("overflow-hidden");
//   }, [mobileOpen]);

//   /* ===== Mini-cart (hover) ===== */
//   const [miniOpen, setMiniOpen] = useState(false); // ✅ dùng 1 state duy nhất
//   const openTimer = useRef<number | null>(null);
//   const closeTimer = useRef<number | null>(null);
//   const cartWrapRef = useRef<HTMLDivElement | null>(null);

//   const openMini = () => {
//     if (closeTimer.current) window.clearTimeout(closeTimer.current);
//     openTimer.current = window.setTimeout(() => setMiniOpen(true), 80);
//   };
//   const closeMini = () => {
//     if (openTimer.current) window.clearTimeout(openTimer.current);
//     closeTimer.current = window.setTimeout(() => setMiniOpen(false), 120);
//   };

//   // Đóng nếu click ra ngoài (desktop)
//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       if (!miniOpen || !cartWrapRef.current) return;
//       const t = e.target as Node;
//       if (!cartWrapRef.current.contains(t)) setMiniOpen(false);
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [miniOpen]);

//   // subtotal fallback
//   const sub =
//     typeof subtotal === "number"
//       ? subtotal
//       : items.reduce((s, it) => s + it.price * it.qty, 0);

//   return (
//     <>
//       <header className="sticky top-0 z-40 bg-white/80 backdrop-blur">
//         {/* Announcement bar */}
//         <div className="w-full text-white bg-black">
//           <div className="flex items-center justify-center w-full h-8">
//             <span
//               key={idx}
//               className="text-[12px] tracking-wide transition-opacity duration-500 ease-in-out"
//             >
//               {messages[idx]}
//             </span>
//           </div>
//         </div>

//         {/* Main nav */}
//         <nav className="flex items-center justify-between w-full px-6 py-3 border-b">
//           {/* LEFT: brand */}
//           <div className="min-w-[180px]">
//             <Link href="/" className="text-lg font-semibold tracking-wide">
//               CHẠM VÂN - CỔ MỘC TIỆM
//             </Link>
//           </div>

//           {/* CENTER: menu (desktop) */}
//           <ul className="hidden items-center gap-7 text-[14px] md:flex">
//             <li>
//               <Link href="/" className={linkClass}>
//                 Trang chủ
//               </Link>
//             </li>
//             <li>
//               <Link href="/hang-moi" className={linkClass}>
//                 Hàng mới
//               </Link>
//             </li>
//             <li>
//               <Link href="/qua-tang" className={linkClass}>
//                 Quà tặng
//               </Link>
//             </li>

//             {/* Dropdown Trang trí nhà */}
//             <li className="relative group">
//               <Link href="/trang-tri-nha" className={linkClass}>
//                 Trang trí nhà
//               </Link>
//               <div className="absolute z-30 pt-3 transition-all duration-300 -translate-x-1/2 opacity-0 pointer-events-none left-1/2 top-full group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
//                 <div className="w-[680px] rounded-lg border bg-white shadow-xl ring-1 ring-black/5">
//                   <div className="grid grid-cols-2 gap-2 p-4">
//                     <div>
//                       <div className="mb-2 text-xs font-semibold text-gray-500">
//                         Danh mục
//                       </div>
//                       <ul className="text-sm">
//                         <li>
//                           <Link
//                             href="/trang-tri-nha/phong-tho"
//                             className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
//                           >
//                             Phòng thờ
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             href="/trang-tri-nha/phong-khach"
//                             className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
//                           >
//                             Phòng khách
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             href="/trang-tri-nha/phong-thuy"
//                             className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
//                           >
//                             Phong thủy
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             href="/trang-tri-nha/trung-bay"
//                             className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4"
//                           >
//                             Trưng bày
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                     <div className="relative overflow-hidden rounded-md">
//                       <img
//                         src="https://images.baodantoc.vn/uploads/2022/Th%C3%A1ng%203/Ng%C3%A0y_30/NGOC/%E1%BA%A2nh%201.jpg"
//                         alt="Trang trí"
//                         className="object-cover w-full h-40 transition-transform duration-500 group-hover:scale-105"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>

//             <li>
//               <Link href="/tat-ca-san-pham" className={linkClass}>
//                 Tất cả sản phẩm
//               </Link>
//             </li>
//             <li>
//               <Link href="/cau-chuyen-cham-van" className={linkClass}>
//                 Câu chuyện Chạm Vân
//               </Link>
//             </li>
//           </ul>

//           {/* RIGHT: cart + auth + hamburger */}
//           <div className="flex min-w-[200px] items-center justify-end gap-6">
//             {/* Cart + mini-cart */}
//             <div
//               ref={cartWrapRef}
//               className="relative hidden md:block"
//               onMouseEnter={openMini}
//               onMouseLeave={closeMini}
//             >
//               <button
//                 onClick={handleCartClick}
//                 title="Giỏ hàng"
//                 className="relative text-[26px] leading-none hover:scale-105 transition"
//                 aria-label="Giỏ hàng"
//               >
//                 <CartIcon />
//                 {count > 0 && (
//                   <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
//                     {count}
//                   </span>
//                 )}
//               </button>

//               {/* Panel (desktop) — ✅ truyền đúng state miniOpen */}
//               <MiniCart
//                 open={miniOpen}
//                 items={items}
//                 subtotal={sub}
//                 onQty={(id, color, next) => updateQty(id, color, next)}
//                 onRemove={(id, color) => remove(id, color)}
//               />
//             </div>

//             {/* Cart on mobile: tap to toggle panel */}
//             <div className="relative md:hidden">
//               <button
//                 onClick={() => setMiniOpen((v) => !v)}
//                 className="relative text-[26px] leading-none"
//                 aria-label="Giỏ hàng"
//               >
//                 <CartIcon />
//                 {count > 0 && (
//                   <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
//                     {count}
//                   </span>
//                 )}
//               </button>

//               {/* Panel (mobile) — ✅ dùng cùng state + onClose đúng */}
//               <MiniCart
//                 open={miniOpen}
//                 items={items}
//                 subtotal={sub}
//                 onQty={(id, color, next) => updateQty(id, color, next)}
//                 onRemove={(id, color) => remove(id, color)}
//                 mobile
//                 onClose={() => setMiniOpen(false)}
//               />
//             </div>

//             {/* Account menu (desktop + mobile trigger) */}
//             <AccountMenu
//               isLoggedIn={isLoggedIn}
//               role={role}
//               onLogout={logout}
//             />

//             {/* Hamburger (mobile) */}
//             <button
//               className="inline-flex items-center justify-center border h-9 w-9 md:hidden"
//               aria-label="Mở menu"
//               onClick={() => setMobileOpen(true)}
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M3 6h18M3 12h18M3 18h18"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//               </svg>
//             </button>
//           </div>
//         </nav>
//       </header>

//       {/* ===== MOBILE MENU (slide-over) giữ nguyên ===== */}
//       <div
//         className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
//           mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
//         }`}
//         onClick={() => setMobileOpen(false)}
//       />
//       <aside
//         className={`fixed right-0 top-0 z-[61] h-full w-[84%] max-w-[380px] bg-white shadow-xl transition-transform duration-300 ${
//           mobileOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         role="dialog"
//         aria-modal="true"
//       >
//         {/* ... phần còn lại y nguyên ... */}
//       </aside>
//     </>
//   );
// }

// /* ================= MiniCart Panel (GIỮ NGUYÊN) ================= */
// /* ================= MiniCart Panel (UI giống mẫu) ================= */
// function MiniCartPanel({
//   open,
//   items,
//   subtotal,
//   onQty,
//   onRemove,
//   mobile = false,
//   onClose,
// }: {
//   open: boolean;
//   items: Array<{
//     id: string;
//     name: string;
//     image: string;
//     price: number;
//     qty: number;
//     color?: string;
//   }>;
//   subtotal: number;
//   onQty?: (id: string, color: string | undefined, nextQty: number) => void;
//   onRemove?: (id: string, color?: string) => void;
//   mobile?: boolean;
//   onClose?: () => void;
// }) {
//   // Kích thước & định vị: desktop neo mép phải, ngay dưới header; mobile giữ vị trí cũ
//   const Wrapper = ({ children }: { children: React.ReactNode }) => {
//     if (mobile) {
//       return (
//         <div
//           className={`absolute right-0 top-[calc(100%+10px)] z-50 ${
//             open ? "" : "pointer-events-none"
//           }`}
//         >
//           {children}
//         </div>
//       );
//     }
//     return (
//       <div
//         className={`fixed right-4 md:right-6 top-[96px] z-50 ${
//           open ? "" : "pointer-events-none"
//         }`} // top ~ announcement(32) + header(64)
//       >
//         {children}
//       </div>
//     );
//   };

//   // Nút +/- vuông theo mẫu
//   const QtyBtn = ({
//     label,
//     onClick,
//     aria,
//   }: {
//     label: string;
//     onClick: () => void;
//     aria: string;
//   }) => (
//     <button
//       aria-label={aria}
//       onClick={onClick}
//       className="inline-flex items-center justify-center text-sm border rounded h-7 w-7 hover:bg-gray-50"
//     >
//       {label}
//     </button>
//   );

//   const content = (
//     <div
//       className={[
//         "w-[420px] md:w-[440px] max-w-[96vw]",
//         "rounded-lg border bg-white shadow-xl ring-1 ring-black/5",
//         "transition-all duration-150",
//         open
//           ? "pointer-events-auto translate-y-0 opacity-100"
//           : "pointer-events-none -translate-y-1 opacity-0",
//       ].join(" ")}
//       role="dialog"
//       aria-label="Mini cart"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b">
//         <h4 className="text-[13px] font-semibold tracking-wide">
//           Giỏ hàng{items.length ? ` (${items.length})` : ""}
//         </h4>
//         {mobile && (
//           <button
//             onClick={onClose}
//             className="text-gray-600 border rounded h-7 w-7 hover:bg-gray-50"
//             aria-label="Đóng"
//           >
//             ✕
//           </button>
//         )}
//       </div>

//       {/* Danh sách */}
//       <div className="max-h-[60vh] overflow-auto">
//         {items.length === 0 ? (
//           <div className="px-6 py-10 text-sm text-center text-gray-500">
//             Giỏ hàng trống.
//           </div>
//         ) : (
//           <ul className="divide-y">
//             {items.map((it) => (
//               <li
//                 key={`${it.id}-${it.color ?? ""}`}
//                 className="flex gap-3 px-4 py-3"
//               >
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img
//                   src={it.image}
//                   alt={it.name}
//                   className="flex-none object-cover w-16 h-16 rounded"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm font-medium line-clamp-2">
//                     {it.name}
//                   </div>
//                   <div className="mt-0.5 text-xs text-gray-500">
//                     {it.color ? (
//                       <>
//                         MÀU SẮC: <span className="capitalize">{it.color}</span>
//                       </>
//                     ) : (
//                       "—"
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 mt-2">
//                     <QtyBtn
//                       label="−"
//                       aria="Giảm"
//                       // ❌ sai: onClick={() => onQty?.(it.id, it.color, Math.max(1, it.qty - 1)))}
//                       onClick={() =>
//                         onQty?.(it.id, it.color, Math.max(1, it.qty - 1))
//                       }
//                     />

//                     <span className="min-w-[20px] text-center text-sm">
//                       {it.qty}
//                     </span>

//                     <QtyBtn
//                       label="+"
//                       aria="Tăng"
//                       // ❌ sai: onClick={() => onQty?.(it.id, it.color, it.qty + 1))}
//                       onClick={() => onQty?.(it.id, it.color, it.qty + 1)}
//                     />

//                     <button
//                       className="inline-flex items-center justify-center w-6 h-6 ml-auto text-gray-400 rounded hover:text-red-600"
//                       aria-label="Xoá"
//                       onClick={() => onRemove?.(it.id, it.color)}
//                       title="Xoá"
//                     >
//                       <TrashIcon />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="text-sm font-semibold whitespace-nowrap">
//                   {(it.price * it.qty).toLocaleString("vi-VN")}₫
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Footer giống mẫu */}
//       <div className="px-4 py-4 border-t">
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-sm text-gray-600">Tổng tiền</span>
//           <span className="text-base font-semibold">
//             {subtotal.toLocaleString("vi-VN")}₫
//           </span>
//         </div>

//         {/* Nút hành động: mẫu để nút đen trên, nút viền dưới */}
//         <div className="space-y-2">
//           <Link
//             href="/gio-hang"
//             className="inline-flex items-center justify-center w-full h-10 text-sm font-medium text-white bg-black rounded hover:bg-black/90"
//             onClick={onClose}
//           >
//             Tiến hành thanh toán
//           </Link>
//           <Link
//             href="/gio-hang"
//             className="inline-flex items-center justify-center w-full h-10 text-sm font-medium border rounded hover:bg-gray-50"
//             onClick={onClose}
//           >
//             Xem giỏ hàng
//           </Link>
//         </div>
//       </div>
//     </div>
//   );

//   return <Wrapper>{content}</Wrapper>;
// }

// /* ================= Smaller UI bits (GIỮ NGUYÊN) ================= */
// function MobileItem({
//   href,
//   label,
//   onClick,
//   depth = false,
// }: {
//   href: string;
//   label: string;
//   onClick: () => void;
//   depth?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className={`block px-2 py-3 hover:bg-gray-50 ${
//         depth ? "pl-6 text-[14px] text-gray-600" : ""
//       }`}
//     >
//       {label}
//     </Link>
//   );
// }

// function CartIcon() {
//   return (
//     <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
//       <path
//         d="M6 6h15l-1.5 9H7.5L6 6Z"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M6 6H4M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// function TrashIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//       <path
//         d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// function BoxIcon() {
//   return (
//     <svg
//       width="32"
//       height="32"
//       viewBox="0 0 24 24"
//       fill="none"
//       className="text-gray-400"
//     >
//       <path
//         d="M3 7 12 3l9 4-9 4-9-4Zm0 4 9 4 9-4M3 7v10l9 4 9-4V7"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function QtyInline({
//   value,
//   onChange,
// }: {
//   value: number;
//   onChange: (v: number) => void;
// }) {
//   const [v, setV] = useState(value);
//   useEffect(() => setV(value), [value]);
//   const bump = (d: number) => {
//     const next = Math.max(1, v + d);
//     setV(next);
//     onChange(next);
//   };
//   return (
//     <div className="inline-flex items-center border rounded">
//       <button
//         className="text-sm h-7 w-7 hover:bg-gray-50"
//         onClick={() => bump(-1)}
//         aria-label="Giảm"
//       >
//         −
//       </button>
//       <div className="w-8 text-sm font-medium text-center select-none">{v}</div>
//       <button
//         className="text-sm h-7 w-7 hover:bg-gray-50"
//         onClick={() => bump(1)}
//         aria-label="Tăng"
//       >
//         +
//       </button>
//     </div>
//   );
// }













// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers/AuthProvider";
import { useCart } from "./providers/CartProvider";
import MiniCart from "@/components/cart/MiniCart";
import AccountMenu from "@/components/account/AccountMenu";

/* ================= Header ================= */
export default function Header() {
  const router = useRouter();
  const { isLoggedIn, role, logout } = useAuth();
  const { items, count, updateQty, remove, subtotal } = useCart();

  /* ===== Announcement bar (xoay text 4s) ===== */
  const messages = useMemo(
    () => [
      "Miễn phí vận chuyển toàn quốc",
      "Hàng thủ công mỹ nghệ 100%",
      "Giao hàng tận nơi – kiểm tra trước khi nhận",
      "Đổi trả trong 7 ngày nếu lỗi kỹ thuật",
      "Ưu đãi thành viên – tích điểm đổi quà",
    ],
    []
  );
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [messages.length]);

  const linkClass =
    "relative pb-2 transition-colors hover:text-[var(--color-primary)] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-primary)] after:transition-transform after:duration-300 hover:after:scale-x-100";

  const handleCartClick = () => {
    if (!isLoggedIn) return router.push("/dang-nhap");
    router.push("/gio-hang");
  };

  /* ===== Mobile menu ===== */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [houseOpen, setHouseOpen] = useState(false);
  useEffect(() => {
    if (mobileOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  // đóng mobile menu khi nhấn ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ===== Mini-cart (hover) ===== */
  const [miniOpen, setMiniOpen] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const cartWrapRef = useRef<HTMLDivElement | null>(null);

  const openMini = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setMiniOpen(true), 80);
  };
  const closeMini = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setMiniOpen(false), 120);
  };

  // Đóng mini-cart nếu click ra ngoài (desktop)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!miniOpen || !cartWrapRef.current) return;
      const t = e.target as Node;
      if (!cartWrapRef.current.contains(t)) setMiniOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [miniOpen]);

  // subtotal fallback
  const sub =
    typeof subtotal === "number"
      ? subtotal
      : items.reduce((s, it) => s + it.price * it.qty, 0);

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
        <nav className="flex items-center justify-between w-full px-4 py-3 border-b md:px-6">
          {/* LEFT: brand */}
          <div className="min-w-[160px] md:min-w-[180px]">
            <Link href="/" className="text-[16px] md:text-lg font-semibold tracking-wide">
              CHẠM VÂN - CỔ MỘC TIỆM
            </Link>
          </div>

          {/* CENTER: menu (desktop) */}
          <ul className="hidden items-center gap-7 text-[14px] md:flex">
            <li>
              <Link href="/" className={linkClass}>Trang chủ</Link>
            </li>
            <li>
              <Link href="/hang-moi" className={linkClass}>Hàng mới</Link>
            </li>
            <li>
              <Link href="/qua-tang" className={linkClass}>Quà tặng</Link>
            </li>

            {/* Dropdown Trang trí nhà */}
            <li className="relative group">
              <Link href="/trang-tri-nha" className={linkClass}>Trang trí nhà</Link>
              <div className="absolute z-30 pt-3 transition-all duration-300 -translate-x-1/2 opacity-0 pointer-events-none left-1/2 top-full group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="w-[680px] rounded-lg border bg-white shadow-xl ring-1 ring-black/5">
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div>
                      <div className="mb-2 text-xs font-semibold text-gray-500">Danh mục</div>
                      <ul className="text-sm">
                        <li><Link href="/trang-tri-nha/phong-tho" className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4">Phòng thờ</Link></li>
                        <li><Link href="/trang-tri-nha/phong-khach" className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4">Phòng khách</Link></li>
                        <li><Link href="/trang-tri-nha/phong-thuy" className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4">Phong thủy</Link></li>
                        <li><Link href="/trang-tri-nha/trung-bay" className="block px-3 py-2 transition-all rounded hover:bg-gray-50 hover:pl-4">Trưng bày</Link></li>
                      </ul>
                    </div>
                    <div className="relative overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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

            <li><Link href="/tat-ca-san-pham" className={linkClass}>Tất cả sản phẩm</Link></li>
            <li><Link href="/cau-chuyen-cham-van" className={linkClass}>Câu chuyện Chạm Vân</Link></li>
          </ul>

          {/* RIGHT: cart + account + hamburger */}
          <div className="flex min-w-[160px] md:min-w-[200px] items-center justify-end gap-3 md:gap-6">
            {/* Cart + mini-cart (desktop hover) */}
            <div
              ref={cartWrapRef}
              className="relative hidden md:block"
              onMouseEnter={openMini}
              onMouseLeave={closeMini}
            >
              <button
                onClick={handleCartClick}
                title="Giỏ hàng"
                className="relative text-[26px] leading-none hover:scale-105 transition"
                aria-label="Giỏ hàng"
              >
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
                    {count}
                  </span>
                )}
              </button>
              <MiniCart
                open={miniOpen}
                items={items}
                subtotal={sub}
                onQty={(id, color, next) => updateQty(id, color, next)}
                onRemove={(id, color) => remove(id, color)}
              />
            </div>

            {/* Cart on mobile */}
            <div className="relative md:hidden">
              <button
                onClick={() => setMiniOpen((v) => !v)}
                className="relative text-[24px] leading-none"
                aria-label="Giỏ hàng"
              >
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
                    {count}
                  </span>
                )}
              </button>
              <MiniCart
                open={miniOpen}
                items={items}
                subtotal={sub}
                onQty={(id, color, next) => updateQty(id, color, next)}
                onRemove={(id, color) => remove(id, color)}
                mobile
                onClose={() => setMiniOpen(false)}
              />
            </div>

            {/* Account menu */}
            <AccountMenu isLoggedIn={isLoggedIn} role={role} onLogout={logout} />

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
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[61] h-full w-[88%] max-w-[380px] bg-white shadow-xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* ===== CONTENT of mobile menu (đẹp, dễ bấm) ===== */}
        <div className="flex flex-col h-full">
          {/* Top bar trong panel */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Link href="/" onClick={() => setMobileOpen(false)} className="font-semibold">
              Chạm Vân
            </Link>
            <button
              className="inline-flex items-center justify-center border rounded h-9 w-9"
              onClick={() => setMobileOpen(false)}
              aria-label="Đóng menu"
            >
              ✕
            </button>
          </div>

          {/* Quick account (tuỳ trạng thái) */}
          <div className="px-4 py-3 border-b">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center bg-gray-100 rounded-full h-9 w-9">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 20c0-3.313 3.582-6 8-6s8 2.687 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Tài khoản ({role?.toLowerCase() ?? "member"})</div>
                  <div className="flex gap-3 mt-2">
                    <Link href="/tai-khoan" className="underline" onClick={() => setMobileOpen(false)}>
                      Hồ sơ
                    </Link>
                    <button
                      className="text-red-600 underline"
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dang-nhap" className="inline-flex items-center justify-center h-10 border rounded" onClick={() => setMobileOpen(false)}>
                  Đăng nhập
                </Link>
                <Link href="/dang-ky" className="inline-flex items-center justify-center h-10 text-white bg-black rounded" onClick={() => setMobileOpen(false)}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Nav list (cuộn riêng) */}
          <div className="flex-1 px-1 py-2 overflow-auto">
            <MobileItem href="/" onClick={() => setMobileOpen(false)} label="Trang chủ" />
            <MobileItem href="/hang-moi" onClick={() => setMobileOpen(false)} label="Hàng mới" />
            <MobileItem href="/qua-tang" onClick={() => setMobileOpen(false)} label="Quà tặng" />

            {/* Collapsible: Trang trí nhà */}
            <div className="px-3 py-2">
              <button
                className="flex items-center justify-between w-full px-2 py-3 rounded hover:bg-gray-50"
                onClick={() => setHouseOpen((v) => !v)}
              >
                <span>Trang trí nhà</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`transition-transform ${houseOpen ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${houseOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0">
                  <MobileSubItem href="/trang-tri-nha/phong-tho" onClick={() => setMobileOpen(false)} label="Phòng thờ" />
                  <MobileSubItem href="/trang-tri-nha/phong-khach" onClick={() => setMobileOpen(false)} label="Phòng khách" />
                  <MobileSubItem href="/trang-tri-nha/phong-thuy" onClick={() => setMobileOpen(false)} label="Phong thủy" />
                  <MobileSubItem href="/trang-tri-nha/trung-bay" onClick={() => setMobileOpen(false)} label="Trưng bày" />
                </div>
              </div>
            </div>

            <MobileItem href="/tat-ca-san-pham" onClick={() => setMobileOpen(false)} label="Tất cả sản phẩm" />
            <MobileItem href="/cau-chuyen-cham-van" onClick={() => setMobileOpen(false)} label="Câu chuyện Chạm Vân" />
          </div>

          {/* Footer nhỏ trong panel */}
          <div className="px-4 py-3 text-xs text-gray-500 border-t">
            © {new Date().getFullYear()} Chạm Vân – Cổ Mộc Tiệm
          </div>
        </div>
      </aside>
    </>
  );
}

/* ================= Helper for mobile list ================= */
function MobileItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-3 rounded hover:bg-gray-50 text-[15px]"
    >
      {label}
    </Link>
  );
}
function MobileSubItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block pl-5 pr-3 py-2 rounded hover:bg-gray-50 text-[14px] text-gray-600"
    >
      {label}
    </Link>
  );
}

/* ================= MiniCart Panel (GIỮ NGUYÊN) ================= */
function MiniCartPanel({
  open,
  items,
  subtotal,
  onQty,
  onRemove,
  mobile = false,
  onClose,
}: {
  open: boolean;
  items: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    color?: string;
  }>;
  subtotal: number;
  onQty?: (id: string, color: string | undefined, nextQty: number) => void;
  onRemove?: (id: string, color?: string) => void;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (mobile) {
      return (
        <div className={`absolute right-0 top-[calc(100%+10px)] z-50 ${open ? "" : "pointer-events-none"}`}>
          {children}
        </div>
      );
    }
    return (
      <div className={`fixed right-4 md:right-6 top-[96px] z-50 ${open ? "" : "pointer-events-none"}`}>
        {children}
      </div>
    );
  };

  const QtyBtn = ({
    label,
    onClick,
    aria,
  }: {
    label: string;
    onClick: () => void;
    aria: string;
  }) => (
    <button
      aria-label={aria}
      onClick={onClick}
      className="inline-flex items-center justify-center text-sm border rounded h-7 w-7 hover:bg-gray-50"
    >
      {label}
    </button>
  );

  const content = (
    <div
      className={[
        "w-[420px] md:w-[440px] max-w-[96vw]",
        "rounded-lg border bg-white shadow-xl ring-1 ring-black/5",
        "transition-all duration-150",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
      ].join(" ")}
      role="dialog"
      aria-label="Mini cart"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h4 className="text-[13px] font-semibold tracking-wide">
          Giỏ hàng{items.length ? ` (${items.length})` : ""}
        </h4>
        {mobile && (
          <button
            onClick={onClose}
            className="text-gray-600 border rounded h-7 w-7 hover:bg-gray-50"
            aria-label="Đóng"
          >
            ✕
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-auto">
        {items.length === 0 ? (
          <div className="px-6 py-10 text-sm text-center text-gray-500">
            Giỏ hàng trống.
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((it) => (
              <li key={`${it.id}-${it.color ?? ""}`} className="flex gap-3 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.name} className="flex-none object-cover w-16 h-16 rounded" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-2">{it.name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {it.color ? <>MÀU SẮC: <span className="capitalize">{it.color}</span></> : "—"}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <QtyBtn label="−" aria="Giảm" onClick={() => onQty?.(it.id, it.color, Math.max(1, it.qty - 1))} />
                    <span className="min-w-[20px] text-center text-sm">{it.qty}</span>
                    <QtyBtn label="+" aria="Tăng" onClick={() => onQty?.(it.id, it.color, it.qty + 1)} />
                    <button
                      className="inline-flex items-center justify-center w-6 h-6 ml-auto text-gray-400 rounded hover:text-red-600"
                      aria-label="Xoá"
                      onClick={() => onRemove?.(it.id, it.color)}
                      title="Xoá"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  {(it.price * it.qty).toLocaleString("vi-VN")}₫
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-4 py-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Tổng tiền</span>
          <span className="text-base font-semibold">{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="space-y-2">
          <Link href="/gio-hang" className="inline-flex items-center justify-center w-full h-10 text-sm font-medium text-white bg-black rounded hover:bg-black/90" onClick={onClose}>
            Tiến hành thanh toán
          </Link>
          <Link href="/gio-hang" className="inline-flex items-center justify-center w-full h-10 text-sm font-medium border rounded hover:bg-gray-50" onClick={onClose}>
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
}

/* ================= Smaller UI bits ================= */
function CartIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M6 6h15l-1.5 9H7.5L6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 6H4M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
