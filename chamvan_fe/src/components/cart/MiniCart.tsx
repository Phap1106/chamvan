// src/components/cart/MiniCart.tsx
"use client";

import Link from "next/link";
import { CartLine } from "@/components/providers/CartProvider";

type Props = {
  open: boolean;
  items: CartLine[];
  subtotal: number;
  mobile?: boolean;
  onQty: (id: string, color: string | undefined, next: number) => void;
  onRemove: (id: string, color?: string) => void;
  onClose?: () => void;
};

export default function MiniCart({
  open,
  items,
  subtotal,
  mobile = false,
  onQty,
  onRemove,
  onClose,
}: Props) {
  // Vị trí: desktop cố định mép phải dưới header; mobile bám icon (logic cũ)
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    mobile ? (
      <div className={`absolute right-0 top-[calc(100%+10px)] z-50 ${open ? "" : "pointer-events-none"}`}>
        {children}
      </div>
    ) : (
      <div className={`fixed right-4 md:right-6 top-[96px] z-50 ${open ? "" : "pointer-events-none"}`}>
        {children}
      </div>
    );

  const Panel = (
    <div
      className={[
        "w-[440px] md:w-[460px] max-w-[96vw]",
        "rounded-xl border border-neutral-200/90 bg-white shadow-[0_10px_30px_rgba(0,0,0,.10)] ring-1 ring-black/5",
        "transition-all duration-150",
        // font Montserrat nếu đã khai báo biến; fallback sans
        "font-[var(--font-montserrat,_ui-sans-serif)]",
        open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      ].join(" ")}
      role="dialog"
      aria-label="Giỏ hàng"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="relative">
          {mobile && (
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="absolute right-0 inline-flex items-center justify-center border rounded-lg top-1 h-9 w-9 border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            >
              ✕
            </button>
          )}
          <h4 className="text-center text-[14px] md:text-[15px] font-semibold tracking-wide text-neutral-900">
            GIỎ HÀNG {items.length ? `(${items.length})` : ""}
          </h4>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-h-[60vh] overflow-auto">
        {items.length === 0 ? (
          <div className="px-6 py-14 text-center text-[14px] text-neutral-500">Giỏ hàng trống.</div>
        ) : (
          <ul>
            {items.map((it, idx) => (
              <li key={`${it.id}-${it.color ?? ""}`}>
                <div className="flex gap-4 px-6 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt={it.name}
                    className="flex-none object-cover rounded-md h-18 w-18"
                    style={{ width: 72, height: 72 }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium leading-5 text-neutral-900 line-clamp-2">
                      {it.name}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500">
                      {it.color ? (
                        <>
                          MÀU SẮC: <span className="capitalize normal-case">{it.color}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>

                    {/* Qty group */}
                    <div className="flex items-center gap-2 mt-2">
                      <QtyBtn
                        label="−"
                        aria="Giảm"
                        onClick={() => onQty(it.id, it.color, Math.max(1, it.qty - 1))}
                      />
                      <span className="min-w-[28px] px-1 text-center text-[14px] font-medium text-neutral-900">
                        {it.qty}
                      </span>
                      <QtyBtn
                        label="+"
                        aria="Tăng"
                        onClick={() => onQty(it.id, it.color, it.qty + 1)}
                      />
                    </div>
                  </div>

                  {/* Cột phải: giá + xoá */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="whitespace-nowrap text-[15px] font-semibold text-neutral-900">
                      {(it.price * it.qty).toLocaleString("vi-VN")}₫
                    </div>
                    <button
                      className="inline-flex items-center justify-center border rounded-full h-9 w-9 bg-neutral-50 text-neutral-500 hover:bg-red-50 hover:text-red-600 border-neutral-200"
                      aria-label="Xoá"
                      title="Xoá"
                      onClick={() => onRemove(it.id, it.color)}
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                {idx < items.length - 1 && <div className="mx-6 border-t border-neutral-200" />}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer: tổng tiền + 2 nút */}
      <div className="px-6 py-5 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-medium tracking-wide text-neutral-600">TỔNG TIỀN</span>
          <span className="text-[16px] font-semibold text-neutral-900">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>

        <div className="space-y-2">
          <Link
            href="/gio-hang"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-black text-[13px] md:text-[14px] font-semibold tracking-wide text-white hover:bg-black/90 active:scale-[.99] transition"
            onClick={onClose}
          >
            TIẾN HÀNH THANH TOÁN
          </Link>
          <Link
            href="/gio-hang"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-neutral-300 text-[13px] md:text-[14px] font-medium text-neutral-800 hover:bg-neutral-50 active:scale-[.99] transition"
            onClick={onClose}
          >
            XEM GIỎ HÀNG
          </Link>
        </div>
      </div>
    </div>
  );

  return <Wrapper>{Panel}</Wrapper>;
}

/* ======== UI bits ======== */
function QtyBtn({
  label,
  onClick,
  aria,
}: {
  label: string;
  onClick: () => void;
  aria: string;
}) {
  return (
    <button
      aria-label={aria}
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center",
        "rounded-lg border border-neutral-300 bg-neutral-50",
        "text-[15px] font-semibold text-neutral-800",
        "shadow-sm hover:bg-white hover:shadow active:scale-95 transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function TrashIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
