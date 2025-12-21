// chamvan_fe/src/components/ProductHover.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type Product = {
  id: string;
  name: string;
  slug?: string;

  price: number;
  original_price?: number | null;

  image: string;

  colors?: { name: string; hex: string }[];
  category?: string;
};

function isFiniteNumber(n: any) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function calcDiscountPercent(price: number, original?: number | null) {
  const p = isFiniteNumber(price);
  const o = isFiniteNumber(original);
  if (!o || o <= 0) return 0;
  if (p <= 0 || p >= o) return 0;
  return Math.round(((o - p) / o) * 100);
}

/**
 * Lấy API base từ env (đang là .../api)
 * và MEDIA base = bỏ /api -> dùng cho /uploads
 */
function getBases() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000/api";

  // bỏ /api ở cuối (cả /api hoặc /api/)
  const mediaBase = apiBase.replace(/\/api\/?$/, "");

  // nếu ai đó muốn set riêng media:
  const mediaEnv = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
  return {
    apiBase: apiBase.replace(/\/+$/, ""),
    mediaBase: (mediaEnv || mediaBase).replace(/\/+$/, ""),
  };
}

/**
 * Resolve ảnh:
 * - Nếu là /uploads hoặc /api/uploads => dùng MEDIA base (http://host:port)
 * - Các URL absolute giữ nguyên
 * - Các path khác giữ nguyên để không phá ảnh local/public của FE
 */
function resolveMediaUrl(input?: string | null) {
  const url = (input || "").trim();
  if (!url) return "";

  // absolute
  if (/^(https?:)?\/\//i.test(url)) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  const { mediaBase } = getBases();

  // normalize uploads paths
  const normalized = url.startsWith("/") ? url : `/${url}`;

  // /api/uploads/... -> /uploads/...
  if (normalized.startsWith("/api/uploads/")) {
    return `${mediaBase}${normalized.replace(/^\/api/, "")}`;
  }

  // /uploads/... (đúng chuẩn)
  if (normalized.startsWith("/uploads/")) {
    return `${mediaBase}${normalized}`;
  }

  // Nếu không phải uploads, giữ nguyên (tránh phá ảnh local FE)
  return url;
}

/** chỉ render ảnh khi item vào viewport */
function useInViewport<T extends HTMLElement>(opts?: {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}) {
  const { rootMargin = "250px 0px", threshold = 0.01, once = true } = opts || {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    let didSet = false;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          if (!didSet) {
            didSet = true;
            setInView(true);
          }
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root: null, rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
}

export default function ProductHover({
  product,
  href,
  priceRenderer,
}: {
  product: Product;
  href: string;
  priceRenderer: (v: number) => string;
}) {
  const price = useMemo(() => isFiniteNumber(product.price), [product.price]);
  const original = useMemo(
    () => (product.original_price == null ? 0 : isFiniteNumber(product.original_price)),
    [product.original_price]
  );
  const discountPercent = useMemo(() => calcDiscountPercent(price, original), [price, original]);

  const hasDiscount = discountPercent > 0;

  // ✅ FIX uploads 404: /uploads -> http://localhost:4000/uploads
  const mainImg = useMemo(() => resolveMediaUrl(product.image), [product.image]);

  const { ref: cellRef, inView } = useInViewport<HTMLDivElement>({
    rootMargin: "250px 0px",
    threshold: 0.01,
    once: true,
  });

  return (
    <Link href={href} className="block group" prefetch={false}>
      <div ref={cellRef} className="flex flex-col h-full">
        <div className="relative w-full overflow-hidden aspect-square bg-neutral-50">
          {!inView ? (
            <div className="absolute inset-0 bg-neutral-100" aria-hidden="true" />
          ) : (
            <img
              src={mainImg}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          )}

          {hasDiscount && (
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide bg-neutral-900 text-white">
                {discountPercent}% OFF
              </span>
            </div>
          )}

          {/* hover tim -> mắt */}
          <div className="absolute right-3 top-3">
            <div className="relative h-9 w-9">
              <button
                type="button"
                aria-label="Yêu thích"
                className="absolute inset-0 grid transition opacity-100 place-items-center bg-white/95 text-neutral-900 group-hover:opacity-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s-7-4.35-9.33-8.28C.86 9.36 2.1 6.5 4.8 5.56 6.55 4.96 8.5 5.5 9.8 6.86L12 9.1l2.2-2.24c1.3-1.36 3.25-1.9 5-1.3 2.7.94 3.94 3.8 2.13 7.16C19 16.65 12 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Xem ảnh"
                className="absolute inset-0 grid transition opacity-0 pointer-events-none place-items-center bg-white/95 text-neutral-900 group-hover:opacity-100 group-hover:pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!mainImg) return;
                  window.open(mainImg, "_blank", "noopener,noreferrer");
                }}
                disabled={!mainImg}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 pt-3">
          <h3 className="line-clamp-2 min-h-[52px] text-[17px] sm:text-[18px] font-medium text-neutral-900 leading-snug">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 pt-2 mt-auto">
            <div
              className={[
                "font-semibold leading-none whitespace-nowrap",
                hasDiscount ? "text-red-600" : "text-neutral-900",
                "text-[15px] sm:text-[16px]",
              ].join(" ")}
            >
              {priceRenderer(price)}
            </div>

            {hasDiscount && (
              <div className="flex items-baseline min-w-0 gap-2">
                <div className="text-[12px] sm:text-[13px] text-neutral-400 line-through whitespace-nowrap">
                  {priceRenderer(original)}
                </div>
                <div className="text-[12px] font-semibold text-red-600 whitespace-nowrap">
                  -{discountPercent}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
