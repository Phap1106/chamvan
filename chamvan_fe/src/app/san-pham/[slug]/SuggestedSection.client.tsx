//src/app/san-pham/[slug]/SuggestedSection.client.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ImgFallback from "@/components/common/ImgFallback";

type Item = {
  id: string;
  name: string;
  slug: string;

  price: number; // giá bán
  salePrice?: number;
  originalPrice?: number;
  discountPercent?: number;

  image: string;
};

const IMG_RE_LITE = /^(https?:\/\/|\/)/i;

function getApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:4000/api";
  return String(raw).replace(/\/+$/, "");
}

function getApiOrigin(apiBase: string) {
  const b = String(apiBase || "").replace(/\/+$/, "");
  return b.endsWith("/api") ? b.slice(0, -4) : b;
}

function toAbsUploads(u: any, apiOrigin: string): string | null {
  if (typeof u !== "string") return null;
  const s = u.trim();
  if (!s) return null;

  if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;
  if (s.startsWith("/uploads/")) return `${apiOrigin}${s}`;
  if (s.startsWith("uploads/")) return `${apiOrigin}/${s}`;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

function coerceNumber(n: any): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(v: number) {
  return (Number.isFinite(v) ? v : 0).toLocaleString("vi-VN") + " ₫";
}

function computeDiscount(originalPrice?: number, salePrice?: number) {
  const o = Number(originalPrice || 0);
  const s = Number(salePrice || 0);
  if (!Number.isFinite(o) || !Number.isFinite(s) || o <= 0 || s <= 0) return 0;
  if (o <= s) return 0;
  return Math.round(((o - s) / o) * 100);
}

function useInViewOnce(rootMargin = "600px 0px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

function pickArray(maybe: any): any[] {
  if (Array.isArray(maybe)) return maybe;
  return [];
}

/** ✅ Extract list từ mọi kiểu response phổ biến */
function extractRecommendationList(json: any): any[] {
  if (!json) return [];
  if (Array.isArray(json)) return json;

  // các key phổ biến
  const direct =
    pickArray(json.related)
      .concat(pickArray(json.suggested))
      .concat(pickArray(json.recommendations))
      .concat(pickArray(json.items))
      .concat(pickArray(json.data))
      .concat(pickArray(json.results));

  if (direct.length) return direct;

  // nested: data.items / data.related / data.suggested...
  const d = json.data;
  if (d && typeof d === "object") {
    const nested =
      pickArray(d.items)
        .concat(pickArray(d.related))
        .concat(pickArray(d.suggested))
        .concat(pickArray(d.recommendations))
        .concat(pickArray(d.results))
        .concat(pickArray(d.data));
    if (nested.length) return nested;
  }

  // nested: items.data
  const it = json.items;
  if (it && typeof it === "object") {
    const nested2 = pickArray(it.data).concat(pickArray(it.items));
    if (nested2.length) return nested2;
  }

  return [];
}

function dedupeById(list: any[]): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const raw of list) {
    const obj = raw?.product ?? raw; // ✅ có thể bọc trong {product:{...}}
    const id = String(obj?.id ?? obj?.productId ?? obj?.product_id ?? "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(obj);
  }
  return out;
}

export default function SuggestedSectionClient({
  productId,
  limit = 4,
}: {
  productId: string;
  limit?: number;
}) {
  const apiBase = useMemo(() => getApiBase(), []);
  const apiOrigin = useMemo(() => getApiOrigin(apiBase), [apiBase]);

  const { ref, inView } = useInViewOnce("800px 0px");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inView) return;

    let alive = true;
    setLoading(true);

    const url =
      `${apiBase}/products/${encodeURIComponent(productId)}/recommendations` +
      `?limit=${encodeURIComponent(String(limit))}` +
      `&_ts=${Date.now()}`;

    fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) return null;
        try {
          return await r.json();
        } catch {
          return null;
        }
      })
      .then((json) => {
        if (!alive || !json) return;

        const rawList = extractRecommendationList(json);
        const normalized = dedupeById(rawList).slice(0, limit);

        const mapped: Item[] = normalized.map((p: any) => {
          // images có thể là string[] hoặc object[]
          const imgs: string[] = [];
          const add = (u: any) => {
            const abs = toAbsUploads(u, apiOrigin);
            if (!abs) return;
            if (IMG_RE_LITE.test(abs) && !imgs.includes(abs)) imgs.push(abs);
          };

          add(p?.image ?? p?.thumbnail ?? p?.thumb);

          const pImages =
            Array.isArray(p?.images) ? p.images :
            Array.isArray(p?.productImages) ? p.productImages :
            Array.isArray(p?.product_images) ? p.product_images :
            Array.isArray(p?.gallery) ? p.gallery :
            [];

          for (const x of pImages) {
            if (typeof x === "string") add(x);
            else if (x && typeof x === "object") add(x.url ?? x.path ?? x.src);
          }

          const salePrice = coerceNumber(p?.salePrice ?? p?.sale_price ?? p?.price);
          const originalRaw = coerceNumber(p?.originalPrice ?? p?.original_price ?? p?.compare_at_price ?? 0);
          const originalPrice = originalRaw > 0 ? Math.max(originalRaw, salePrice) : salePrice;
          const discountPercent =
            coerceNumber(p?.discountPercent ?? p?.discount_percent ?? 0) ||
            computeDiscount(originalPrice, salePrice);

          const id = String(p?.id ?? p?.productId ?? p?.product_id ?? "");
          const slug = String(p?.slug ?? p?.handle ?? id);

          return {
            id,
            name: p?.name ?? p?.title ?? "Sản phẩm",
            slug,
            price: salePrice,
            salePrice,
            originalPrice,
            discountPercent,
            image: imgs[0] || "/placeholder.jpg",
          };
        });

        setItems(mapped);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [inView, apiBase, apiOrigin, productId, limit]);

  return (
    <div ref={ref} className="pt-16 mt-24 border-t border-gray-100">
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
        Có thể bạn cũng thích
      </h2>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="w-full mb-4 bg-gray-200 aspect-square rounded-xl" />
              <div className="w-11/12 h-4 mb-2 bg-gray-200 rounded" />
              <div className="w-6/12 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? null : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/san-pham/${p.slug || p.id}`}
              prefetch={false}
              className="block group"
            >
              <div className="relative w-full mb-4 overflow-hidden border border-gray-100 aspect-square rounded-xl bg-neutral-100">
                {p.discountPercent && p.discountPercent > 0 ? (
                  <div className="absolute z-10 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg left-2 top-2">
                    -{p.discountPercent}%
                  </div>
                ) : null}

                <ImgFallback
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-medium leading-relaxed text-gray-900 line-clamp-2 group-hover:text-blue-700">
                  {p.name}
                </h3>

                {p.discountPercent && p.discountPercent > 0 ? (
                  <div className="text-xs text-neutral-600">
                    <span className="mr-2">Giá gốc</span>
                    <span className="line-through">{formatCurrency(p.originalPrice || 0)}</span>
                  </div>
                ) : null}

                <div className="text-sm font-bold text-gray-900">
                  {formatCurrency(p.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
