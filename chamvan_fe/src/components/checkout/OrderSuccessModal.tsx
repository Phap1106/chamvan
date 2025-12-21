"use client";

import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  orderCode?: string | null;
  primaryText?: string;
  onPrimary?: () => void;
  secondaryText?: string;
  onSecondary?: () => void;
};

export default function OrderSuccessModal({
  open,
  onClose,
  title = "Đặt hàng thành công",
  message = "Cảm ơn bạn đã tin tưởng. Chúng tôi sẽ phản hồi hỗ trợ sớm nhất tới bạn.",
  orderCode = null,
  primaryText = "Tiếp tục mua sắm",
  onPrimary,
  secondaryText = "Đóng",
  onSecondary,
}: Props) {
  // ESC để đóng
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* card */}
      <div className="relative w-full max-w-md bg-white border shadow-2xl rounded-2xl border-white/30">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              {/* check icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {message}
              </p>

              {orderCode ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 mt-3 border rounded-lg border-zinc-200 bg-zinc-50">
                  <span className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
                    Mã đơn
                  </span>
                  <span className="font-mono text-sm text-zinc-900">{orderCode}</span>
                </div>
              ) : null}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100"
              aria-label="Đóng"
              title="Đóng"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                onSecondary?.();
                onClose();
              }}
              className="h-10 px-4 text-sm font-medium bg-white border rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            >
              {secondaryText}
            </button>

            <button
              onClick={() => {
                onPrimary?.();
                onClose();
              }}
              className="h-10 px-4 text-sm font-semibold text-white shadow-sm rounded-xl bg-zinc-900 hover:bg-zinc-800"
            >
              {primaryText}
            </button>
          </div>
        </div>

        {/* viền bóng nhẹ sang trọng */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-black/5" />
      </div>
    </div>
  );
}
