// src/components/ShareButton.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/Toaster";
import { X, Copy, Check } from "lucide-react";

/** SVG icons đơn giản cho mạng xã hội (nhẹ & không cần lib ngoài) */
const Icon = {
  Facebook: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.594 24 1.325 24h11.494v-9.294H9.691v-3.62h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.241l-1.918.001c-1.503 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.62h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0z"/>
    </svg>
  ),
  Messenger: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M12 0C5.373 0 0 4.973 0 11.111c0 3.49 1.735 6.61 4.448 8.64V24l4.068-2.233c1.088.3 2.245.466 3.484.466 6.627 0 12-4.973 12-11.122C24 4.973 18.627 0 12 0zm1.1 14.934l-2.855-3.05-5.565 3.05 6.12-6.567 2.877 3.05 5.544-3.05-6.121 6.567z"/>
    </svg>
  ),
  Zalo: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M19 2H5C3.343 2 2 3.343 2 5v14c0 1.657 1.343 3 3 3h14c1.657 0 3-1.343 3-3V5c0-1.657-1.343-3-3-3zm-8.7 14H6l3.9-6H6.2V8h6.1l-2 3.1L10.3 16zM17 8h-2v6h2a3 3 0 0 0 0-6zm0 4h-1v-2h1a1 1 0 0 1 0 2z"/>
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M16 3c1 1.6 2.5 2.7 4 2.9V9c-1.8 0-3.4-.7-4.7-1.8v6.6a5.6 5.6 0 1 1-5.6-5.6c.3 0 .7 0 1 .1v2.8a2.8 2.8 0 1 0 2.8 2.8V3h2.5z"/>
    </svg>
  ),
  Telegram: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M9.036 15.803l-.376 5.293c.54 0 .774-.232 1.054-.509l2.53-2.425 5.244 3.846c.962.532 1.653.253 1.911-.892l3.462-16.231c.353-1.646-.593-2.286-1.69-1.89L1.326 10.15c-1.627.632-1.602 1.537-.277 1.942l5.49 1.71L19.01 6.358c.69-.456 1.32-.205.803.251L9.036 15.803z"/>
    </svg>
  ),
};

type Props = { path: string; title: string };

export default function ShareButton({ path, title }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const url = useMemo(() => {
    if (typeof window === "undefined") return path;
    try {
      return new URL(path, window.location.origin).toString();
    } catch {
      return path;
    }
  }, [path]);

  const shareUrlU = encodeURIComponent(url);
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${shareUrlU}`;
  const msgr = `https://www.facebook.com/sharer/sharer.php?u=${shareUrlU}`;
  const zalo = `https://zalo.me/share/?url=${shareUrlU}`;
  const tiktok = `https://www.tiktok.com/share?url=${shareUrlU}`;
  const telegram = `https://t.me/share/url?url=${shareUrlU}&text=${encodeURIComponent(
    title
  )}`;

  async function doCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Đã sao chép liên kết sản phẩm");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast("Không thể sao chép. Hãy chọn và copy thủ công nhé.");
    }
  }

  async function nativeShare() {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title, url });
      } catch {
        /* user cancel */
      }
    } else {
      setOpen(true);
    }
  }

  // accessibility: Esc to close + focus the dialog
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      dialogRef.current?.focus();
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Nút kêu gọi hành động nổi bật hơn */}
      <button
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 active:scale-[0.98] transition"
        onClick={() => setOpen(true)}
      >
        <span className="i-lucide-share-2" />
        Chia sẻ
      </button>

      {/* ===== Modal ===== */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* backdrop mờ + blur */}
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setOpen(false)}
          />
          {/* panel */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-10 w-[92vw] max-w-[520px] origin-center animate-scale-in rounded-2xl border border-neutral-200 bg-white shadow-xl"
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="text-base font-semibold tracking-tight">
                Chia sẻ sản phẩm
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="p-2 rounded-full hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* body */}
            <div className="px-5 pt-4 pb-5">
              {/* ô copy link */}
              <div className="flex">
                <input
                  readOnly
                  value={url}
                  className="flex-1 px-3 py-2 text-sm border rounded-l-lg outline-none border-neutral-300 focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  onClick={doCopy}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-l-0 rounded-r-lg border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Đã copy
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* social buttons */}
              <div className="grid grid-cols-5 gap-3 mt-5 text-sm">
                <a
                  href={fb}
                  target="_blank"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-3 py-2 text-white shadow hover:brightness-110"
                >
                  <Icon.Facebook />
                  <span className="hidden sm:inline">Facebook</span>
                </a>
                <a
                  href={msgr}
                  target="_blank"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#00B2FF] px-3 py-2 text-white shadow hover:brightness-110"
                >
                  <Icon.Messenger />
                  <span className="hidden sm:inline">Messenger</span>
                </a>
                <a
                  href={zalo}
                  target="_blank"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#0068FF] px-3 py-2 text-white shadow hover:brightness-110"
                >
                  <Icon.Zalo />
                  <span className="hidden sm:inline">Zalo</span>
                </a>
                <a
                  href={tiktok}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 text-white bg-black rounded-lg shadow group hover:brightness-110"
                >
                  <Icon.TikTok />
                  <span className="hidden sm:inline">TikTok</span>
                </a>
                <a
                  href={telegram}
                  target="_blank"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-3 py-2 text-white shadow hover:brightness-110"
                >
                  <Icon.Telegram />
                  <span className="hidden sm:inline">Telegram</span>
                </a>
              </div>

              {/* native share */}
              <button
                onClick={nativeShare}
                className="mt-4 text-sm underline text-neutral-600 hover:text-neutral-900"
              >
                Chia sẻ bằng hệ thống (nếu hỗ trợ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS keyframes nho nhỏ cho animation */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fade-in 160ms ease-out;
        }
        .animate-scale-in {
          animation: scale-in 160ms ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.96) }
          to   { opacity: 1; transform: scale(1) }
        }
      `}</style>
    </>
  );
}
