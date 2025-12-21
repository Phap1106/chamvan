
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductHover, { Product as UIProduct } from "@/components/ProductHover";

type SortKey = "relevance" | "price_asc" | "price_desc" | "newest";

const BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:4000/api";
  return String(raw).replace(/\/+$/, "");
})();

const ORIGIN = (() => {
  const b = BASE.replace(/\/+$/, "");
  return b.endsWith("/api") ? b.slice(0, -4) : b;
})();

function toAbsUploads(u: any): string | "" {
  if (typeof u !== "string") return "";
  const s = u.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;
  if (s.startsWith("/uploads/")) return `${ORIGIN}${s}`;
  if (s.startsWith("uploads/")) return `${ORIGIN}/${s}`;
  return s;
}

function coerceNumber(n: any): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function normalizeText(s: string) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();
}

const priceFmt = new Intl.NumberFormat("vi-VN");
function priceVND(v: number) {
  // non-breaking space trước "đ" để hạn chế rơi dòng
  return `${priceFmt.format(coerceNumber(v))}\u00A0đ`;
}

const TABS: { key: string; label: string; match?: string[] }[] = [
  { key: "all", label: "Tất cả" },
  { key: "hang-moi", label: "Hàng mới", match: ["hang moi", "hang-moi", "new"] },
  { key: "qua-tang", label: "Quà tặng", match: ["qua tang", "qua-tang", "gift"] },
  { key: "trang-tri-nha", label: "Trang trí nhà", match: ["trang tri nha", "trang-tri-nha", "decor"] },
  { key: "trung-bay", label: "Trưng bày", match: ["trung bay", "trung-bay", "display"] },
];

function pickCategory(root: any): string | undefined {
  const c =
    root?.categories?.[0]?.name ||
    root?.categories?.[0]?.label ||
    root?.categories?.[0]?.slug ||
    root?.category ||
    undefined;
  return c ? String(c) : undefined;
}

function pickImage(root: any): string {
  const main = toAbsUploads(root?.image);
  if (main) return main;

  if (Array.isArray(root?.images) && root.images.length) {
    const first = root.images[0];
    const u = typeof first === "string" ? first : first?.url;
    const abs = toAbsUploads(u);
    if (abs) return abs;
  }

  return "/placeholder.jpg";
}

function mapProduct(root: any): UIProduct | null {
  if (!root) return null;
  const id = root?.id ?? root?._id;
  const name = root?.name;
  const slug = root?.slug;

  if (id == null || !name) return null;

  return {
    id: String(id),
    name: String(name),
    slug: slug ? String(slug) : undefined,
    price: coerceNumber(root?.price),
    original_price: root?.original_price == null ? null : coerceNumber(root?.original_price),
    image: pickImage(root),
    colors: Array.isArray(root?.colors)
      ? root.colors
          .map((c: any) => ({
            name: String(c?.name || "").trim(),
            hex: String(c?.hex || "").trim(),
          }))
          .filter((c: any) => c.name && c.hex)
      : [],
    category: pickCategory(root),
  };
}

async function fetchAllProductsSafe(): Promise<UIProduct[]> {
  // Thử các endpoint phổ biến, tránh phụ thuộc 1 dạng response
  const candidates = [
    `${BASE}/products`,
    `${BASE}/products?limit=5000`,
    `${BASE}/products?take=5000`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) continue;

      const json = await res.json();

      // có thể là: [] | {items: []} | {data: []}
      const arr =
        Array.isArray(json) ? json :
        Array.isArray(json?.items) ? json.items :
        Array.isArray(json?.data) ? json.data :
        Array.isArray(json?.rows) ? json.rows :
        [];

      if (!Array.isArray(arr)) continue;

      const mapped = arr.map(mapProduct).filter(Boolean) as UIProduct[];
      if (mapped.length) return mapped;
    } catch {
      // try next
    }
  }

  return [];
}

export default function ListingPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UIProduct[]>([]);

  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 12; // giảm load ảnh: chỉ render 12 sp / trang

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await fetchAllProductsSafe();
      if (!alive) return;
      setItems(data);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // reset page khi đổi filter/search/sort
  useEffect(() => {
    setPage(1);
  }, [tab, q, sort]);

  const filtered = useMemo(() => {
    const nq = normalizeText(q);
    const active = TABS.find((t) => t.key === tab);

    let list = items;

    if (active && active.key !== "all") {
      const match = (active.match || []).map(normalizeText);
      list = list.filter((p) => {
        const cat = normalizeText(p.category || "");
        const nm = normalizeText(p.name || "");
        return match.some((m) => cat.includes(m) || nm.includes(m));
      });
    }

    if (nq) {
      list = list.filter((p) => normalizeText(p.name).includes(nq));
    }

    // Sort
    if (sort === "price_asc") list = [...list].sort((a, b) => coerceNumber(a.price) - coerceNumber(b.price));
    if (sort === "price_desc") list = [...list].sort((a, b) => coerceNumber(b.price) - coerceNumber(a.price));
    if (sort === "newest") {
      // fallback: nếu không có created_at trong UIProduct thì giữ nguyên.
      // Bạn có thể map thêm created_at từ API nếu cần.
      list = [...list];
    }

    return list;
  }, [items, tab, q, sort]);

  const totalPages = useMemo(() => {
    const n = Math.ceil(filtered.length / perPage);
    return n <= 0 ? 1 : n;
  }, [filtered.length]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const goPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    // nhẹ nhàng kéo lên đầu grid
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Dãy số trang gọn
  const pageNums = useMemo(() => {
    const out: number[] = [];
    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);
    for (let i = left; i <= right; i++) out.push(i);
    return out;
  }, [page, totalPages]);

  return (
    <div className="mx-auto max-w-[1320px] px-3 sm:px-4 lg:px-5">
      {/* Header */}
      <div className="pt-10 pb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-wide text-center sm:text-4xl">TẤT CẢ SẢN PHẨM</h1>
        <p className="mt-2 text-sm text-neutral-500">Tinh hoa gỗ mộc thủ công Việt Nam</p>
      </div>

      {/* Tabs + Search + Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "px-4 py-2 text-sm",
                  active ? "bg-neutral-900 text-white" : "bg-transparent text-neutral-700 hover:text-neutral-900",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="h-10 w-[260px] max-w-[60vw] bg-white px-3 text-sm outline-none ring-1 ring-neutral-200 focus:ring-neutral-300"
            />
            <span className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-neutral-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 px-3 text-sm bg-white outline-none ring-1 ring-neutral-200 focus:ring-neutral-300"
          >
            <option value="relevance">Sắp xếp: Liên quan nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Grid (có line nhẹ để phân cách) */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-0 border-t border-l sm:grid-cols-3 lg:grid-cols-4 border-neutral-200/70">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border-b border-r animate-pulse border-neutral-200/70"
              >
                <div className="aspect-square bg-neutral-200" />
                <div className="w-10/12 h-4 mt-3 bg-neutral-200" />
                <div className="w-6/12 h-4 mt-2 bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0 border-t border-l sm:grid-cols-3 lg:grid-cols-4 border-neutral-200/70">
            {pageItems.map((p) => (
              <div
                key={p.id}
                className="p-4 border-b border-r border-neutral-200/70"
              >
                <ProductHover
                  product={p}
                  href={`/san-pham/${p.slug || p.id}`}
                  priceRenderer={priceVND}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-10">
          <button
            type="button"
            onClick={() => goPage(page - 1)}
            disabled={page <= 1}
            className="h-10 px-3 text-sm ring-1 ring-neutral-200 disabled:opacity-40"
          >
            Trước
          </button>

          {page > 3 && (
            <>
              <button
                type="button"
                onClick={() => goPage(1)}
                className="w-10 h-10 text-sm ring-1 ring-neutral-200"
              >
                1
              </button>
              <span className="px-1 text-neutral-400">…</span>
            </>
          )}

          {pageNums.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goPage(n)}
              className={[
                "h-10 w-10 text-sm ring-1",
                n === page ? "bg-neutral-900 text-white ring-neutral-900" : "ring-neutral-200",
              ].join(" ")}
            >
              {n}
            </button>
          ))}

          {page < totalPages - 2 && (
            <>
              <span className="px-1 text-neutral-400">…</span>
              <button
                type="button"
                onClick={() => goPage(totalPages)}
                className="w-10 h-10 text-sm ring-1 ring-neutral-200"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => goPage(page + 1)}
            disabled={page >= totalPages}
            className="h-10 px-3 text-sm ring-1 ring-neutral-200 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {/* Ghi chú nhẹ: chỉ render theo trang để giảm lag */}
      {!loading && (
        <div className="pb-10 text-xs text-center text-neutral-400">
          Đang hiển thị {pageItems.length} / {filtered.length} sản phẩm .
        </div>
      )}
    </div>
  );
}
