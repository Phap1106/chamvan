"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CartLine } from "@/components/providers/CartProvider";

type Props = {
  open: boolean;
  items: CartLine[];
  subtotal: number;
  mobile?: boolean; // giữ để tương thích
  onQty: (id: string, color: string | undefined, next: number) => void;
  onRemove: (id: string, color?: string) => void;
  onClose?: () => void;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();

    // Safari cũ
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export default function MiniCart({
  open,
  items,
  subtotal,
  onQty,
  onRemove,
  onClose,
}: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // md trở lên = desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // ====== FIX 1: giữ mở khi hover desktop (tránh tự đóng khi rời icon sang panel) ======
  const [hoveringPanel, setHoveringPanel] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const requestClose = useCallback(() => {
    clearCloseTimer();
    setVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => setMounted(true), []);

  // Đồng bộ open -> visible, nhưng có “grace period” trên desktop
  useEffect(() => {
    clearCloseTimer();

    if (open) {
      setVisible(true);
      return;
    }

    // open = false
    if (isDesktop) {
      // nếu đang hover panel => giữ mở
      if (hoveringPanel) {
        setVisible(true);
        return;
      }
      // delay nhẹ để kịp rê chuột từ icon sang panel
      closeTimer.current = window.setTimeout(() => {
        setVisible(false);
      }, 180);
      return;
    }

    // mobile: đóng ngay
    setVisible(false);
  }, [open, isDesktop, hoveringPanel]);

  // ESC để đóng
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, requestClose]);

  // Khóa scroll chỉ khi MOBILE mở (desktop không khóa để tránh cảm giác lag/khựng)
  useEffect(() => {
    if (!visible) return;
    if (isDesktop) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible, isDesktop]);

  const money = useMemo(
    () =>
      (Number.isFinite(subtotal) ? subtotal : 0).toLocaleString("vi-VN") + "₫",
    [subtotal]
  );

  // ====== FIX 2: điều hướng ổn định trên mobile (đừng close quá sớm) ======
  const go = (href: string) => {
    router.push(href);

    // Đóng sau 1 nhịp render để route transition không bị “cụp”
    window.setTimeout(() => {
      requestClose();
    }, 120);
  };

  if (!mounted) return null;
  if (!visible) return null;

  const node = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop: CHỈ MOBILE. Desktop không dùng backdrop để hover không bị gián đoạn */}
      {!isDesktop && (
        <button
          type="button"
          aria-label="Đóng giỏ hàng"
          className="absolute inset-0 z-0 bg-black/35"
          onClick={requestClose}
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Giỏ hàng"
        onMouseEnter={() => {
          if (!isDesktop) return;
          clearCloseTimer();
          setHoveringPanel(true);
        }}
        onMouseLeave={() => {
          if (!isDesktop) return;
          setHoveringPanel(false);
          // nếu parent đã set open=false thì effect sẽ đóng sau delay
          // nếu parent vẫn open=true thì vẫn giữ
        }}
        className={[
          "absolute z-10 bg-white flex flex-col",
          "shadow-[0_10px_30px_rgba(0,0,0,.18)] ring-1 ring-black/5",
          "transform-gpu will-change-transform",

          // MOBILE: full height drawer
          "right-0 top-0 h-dvh w-[min(92vw,420px)]",

          // DESKTOP: hộp nổi dưới header
          "md:right-6 md:top-[96px] md:h-auto md:max-h-[calc(100vh-120px)]",
          "md:rounded-xl md:border md:border-neutral-200/90",

          // Animation nhẹ, tránh blur nặng gây lag
          "transition duration-200 ease-out",
          isDesktop ? "md:animate-none" : "",
        ].join(" ")}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200">
          <div className="relative">
            <button
              onClick={requestClose}
              aria-label="Đóng"
              className="absolute top-0 right-0 inline-flex items-center justify-center border rounded-lg h-9 w-9 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              type="button"
            >
              ✕
            </button>

            <h4 className="text-center text-[14px] md:text-[15px] font-semibold tracking-wide text-neutral-900">
              GIỎ HÀNG {items.length ? `(${items.length})` : ""}
            </h4>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="px-5 py-14 text-center text-[14px] text-neutral-500">
              Giỏ hàng trống.
            </div>
          ) : (
            <ul>
              {items.map((it, idx) => (
                <li key={`${it.id}-${it.color ?? ""}`}>
                  <div className="flex gap-4 px-5 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.image}
                      alt={it.name}
                      className="flex-none h-[72px] w-[72px] rounded-md object-cover bg-neutral-100"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium leading-5 text-neutral-900 line-clamp-2">
                        {it.name}
                      </div>

                      <div className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500">
                        {it.color ? (
                          <>
                            MÀU SẮC:{" "}
                            <span className="capitalize normal-case">
                              {it.color}
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <QtyBtn
                          label="−"
                          aria="Giảm"
                          onClick={() =>
                            onQty(it.id, it.color, Math.max(1, it.qty - 1))
                          }
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

                    <div className="flex flex-col items-end gap-2">
                      <div className="whitespace-nowrap text-[15px] font-semibold text-neutral-900">
                        {(it.price * it.qty).toLocaleString("vi-VN")}₫
                      </div>

                      <button
                        className="inline-flex items-center justify-center border rounded-full h-9 w-9 border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Xoá"
                        title="Xoá"
                        onClick={() => onRemove(it.id, it.color)}
                        type="button"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </div>

                  {idx < items.length - 1 && (
                    <div className="mx-5 border-t border-neutral-200" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-medium tracking-wide text-neutral-600">
              TỔNG TIỀN
            </span>
            <span className="text-[16px] font-semibold text-neutral-900">
              {money}
            </span>
          </div>

          <div className="space-y-2">
            {/* FIX 2: đúng route thanh toán */}
            <button
              type="button"
              onClick={() => go("/checkout")}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-black text-[13px] md:text-[14px] font-semibold tracking-wide text-white hover:bg-black/90 active:scale-[.99] transition"
            >
              TIẾN HÀNH THANH TOÁN
            </button>

            <button
              type="button"
              onClick={() => go("/gio-hang")}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-neutral-300 text-[13px] md:text-[14px] font-medium text-neutral-800 hover:bg-neutral-50 active:scale-[.99] transition"
            >
              XEM GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
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
      type="button"
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
      <path
        d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
