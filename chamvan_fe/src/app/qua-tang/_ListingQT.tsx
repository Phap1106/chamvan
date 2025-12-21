// // src/app/qua-tang/_ListingQT.tsx
// 'use client';

// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Suspense, useEffect, useMemo, useState } from 'react';
// import Pagination from '@/components/Pagination';
// import ProductHover, { Product as UIProductCard } from '@/components/ProductHover';
// import { getJSON } from '@/lib/api';

// /* ===== Types từ BE ===== */
// type BECategory = { id: number; name: string; slug: string };
// type BEImage = { id?: number; url?: string; src?: string; path?: string };
// type BEColor = { name: string; hex?: string | null };
// type BEProduct = {
//   id: number | string;
//   name: string;
//   slug?: string | null; // ✅ thêm slug
//   price: number | string;
//   image?: string | null;
//   images?: Array<string | BEImage> | null;
//   colors?: BEColor[] | null;
//   categories?: BECategory[] | null;
//   created_at?: string | null;
// };

// type UIProductCardWithSlug = UIProductCard & { slug?: string };

// /* ===== Utils ===== */
// function normalizeImage(
//   list: Array<string | BEImage> | null | undefined,
//   fallback?: string | null,
// ) {
//   const raw: Array<string | BEImage> = [
//     ...(fallback ? [fallback] : []),
//     ...(Array.isArray(list) ? list : []),
//   ];
//   const urls = raw
//     .map((it) => {
//       if (typeof it === 'string') return it.trim();
//       if (it && typeof it === 'object') {
//         const anyIt = it as Record<string, unknown>;
//         return (
//           ((anyIt.url as string) ??
//             (anyIt.src as string) ??
//             (anyIt.path as string) ??
//             '')
//         ).trim();
//       }
//       return '';
//     })
//     .filter(Boolean);
//   return urls.find((u) => /^https?:\/\//i.test(u)) ?? urls[0] ?? '';
// }

// function normalizeColors(list: BEColor[] | null | undefined) {
//   if (!Array.isArray(list)) return [] as { name: string; hex?: string }[];
//   return list.map((c) => ({ name: c.name, hex: c.hex ?? undefined }));
// }

// function formatCurrency(v: number) {
//   return v.toLocaleString('vi-VN') + ' ₫';
// }

// const SORTS = [
//   { key: 'relevance', label: 'Liên quan nhất' },
//   { key: 'newest', label: 'Mới nhất' },
//   { key: 'price-asc', label: 'Giá từ thấp đến cao' },
//   { key: 'price-desc', label: 'Giá từ cao xuống thấp' },
// ];

// function SortMenu({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (k: string) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const current = SORTS.find((s) => s.key === value) ?? SORTS[0];
//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="inline-flex items-center gap-1 text-sm"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//       >
//         <span className="text-neutral-500">Sắp xếp theo:</span>
//         <span className="font-medium text-neutral-900">{current.label}</span>
//         <span>▾</span>
//       </button>
//       {open && (
//         <ul
//           className="absolute z-20 p-1 mt-2 bg-white border rounded-md shadow w-44"
//           role="listbox"
//           onMouseLeave={() => setOpen(false)}
//         >
//           {SORTS.map((s) => (
//             <li key={s.key}>
//               <button
//                 className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
//                   s.key === value ? 'font-medium text-neutral-900' : 'text-neutral-700'
//                 }`}
//                 onClick={() => {
//                   onChange(s.key);
//                   setOpen(false);
//                 }}
//                 role="option"
//                 aria-selected={s.key === value}
//               >
//                 {s.label}
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// /* ===== Inner component ===== */
// function ListingQuaTangInner() {
//   const router = useRouter();
//   const sp = useSearchParams();

//   const pageParam = Math.max(1, Number(sp.get('page') || '1'));
//   const qParam = sp.get('q') || '';
//   const sortParam = sp.get('sort') || 'relevance';

//   const [q, setQ] = useState(qParam);
//   const [state, setState] = useState<
//     | { status: 'idle' | 'loading' }
//     | { status: 'error'; message: string }
//     | { status: 'ok'; data: BEProduct[] }
//   >({ status: 'idle' });

//   const pageSize = 12;

//   // Fetch từ BE
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         setState({ status: 'loading' });
//         const data = await getJSON<BEProduct[]>('/products');
//         if (!alive) return;
//         setState({ status: 'ok', data });
//       } catch (e: any) {
//         if (!alive) return;
//         setState({ status: 'error', message: e?.message || 'Fetch failed' });
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   // Lọc theo 'qua-tang' + search + sort + paginate
//   const { products, total } = useMemo(() => {
//     if (state.status !== 'ok') return { products: [] as UIProductCardWithSlug[], total: 0 };

//     const base = (state.data || []).map((p) => {
//       const slugs = (p.categories ?? []).map((c) => c.slug);
//       const img = normalizeImage(p.images ?? undefined, p.image ?? undefined);
//       const colors = normalizeColors(p.colors);
//       return {
//         id: String(p.id),
//         slug: (p.slug ?? '') || String(p.id), // ✅ lưu slug để tạo link
//         name: p.name ?? '',
//         price: Number(p.price) || 0,
//         image: img,
//         colors,
//         _createdAt: p.created_at ?? undefined,
//         _slugs: slugs,
//       };
//     });

//     let arr = base.filter((p) => p._slugs.includes('qua-tang'));

//     if (qParam) {
//       const kw = qParam.trim().toLowerCase();
//       arr = arr.filter((p) => p.name.toLowerCase().includes(kw));
//     }

//     if (sortParam === 'price-asc') arr.sort((a, b) => a.price - b.price);
//     if (sortParam === 'price-desc') arr.sort((a, b) => b.price - a.price);
//     if (sortParam === 'newest') {
//       arr = arr.slice().sort((a, b) => {
//         const ta = a._createdAt ? Date.parse(a._createdAt) : 0;
//         const tb = b._createdAt ? Date.parse(b._createdAt) : 0;
//         return tb - ta || Number(b.id) - Number(a.id);
//       });
//     }

//     const start = (pageParam - 1) * pageSize;
//     const end = start + pageSize;
//     const pageItems: UIProductCardWithSlug[] = arr.slice(start, end).map((p) => ({
//       id: p.id,
//       slug: p.slug,
//       name: p.name,
//       price: p.price,
//       image: p.image,
//       colors: p.colors,
//     }));

//     return { products: pageItems, total: arr.length };
//   }, [state, pageParam, qParam, sortParam]);

//   function pushParams(next: URLSearchParams) {
//     router.push(`/qua-tang?${next.toString()}`);
//   }

//   function onSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams(sp.toString());
//     if (q) params.set('q', q);
//     else params.delete('q');
//     params.set('page', '1');
//     pushParams(params);
//   }

//   function onSortChange(k: string) {
//     const params = new URLSearchParams(sp.toString());
//     params.set('sort', k);
//     params.set('page', '1');
//     pushParams(params);
//   }

//   return (
//     <div className="px-4 py-8 mx-auto max-w-7xl">
//       {/* breadcrumb */}
//       <nav className="mb-2 text-sm text-neutral-500">
//         <Link href="/" className="hover:underline">
//           Trang chủ
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href="/qua-tang" className="hover:underline">
//           Quà tặng
//         </Link>
//       </nav>

//       <h1 className="mb-1 text-3xl font-semibold tracking-wide text-center">QUÀ TẶNG</h1>
//       <p className="mb-6 text-sm text-center text-neutral-500">
//         {state.status === 'ok' ? total : '…'} sản phẩm phù hợp
//       </p>

//       {/* search + sort */}
//       <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
//         <form onSubmit={onSearch} className="ml-auto flex min-w-[280px] flex-1 max-w-md">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Tìm tượng, hộp, khay, vòng..."
//             className="w-full px-4 py-2 text-sm border outline-none border-neutral-300 focus:ring-2 focus:ring-neutral-800"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 ml-2 text-sm font-medium text-white rounded-md bg-neutral-900 hover:bg-neutral-800"
//           >
//             Tìm
//           </button>
//         </form>

//         <div className="ml-2">
//           <SortMenu value={sortParam} onChange={onSortChange} />
//         </div>
//       </div>

//       {/* states */}
//       {state.status === 'loading' && (
//         <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div key={i} className="rounded h-60 bg-neutral-100 animate-pulse" />
//           ))}
//         </div>
//       )}

//       {state.status === 'error' && (
//         <div className="p-10 text-center text-red-600 border border-dashed rounded-md">
//           Lỗi tải sản phẩm: {state.message}
//         </div>
//       )}

//       {state.status === 'ok' &&
//         (products.length === 0 ? (
//           <div className="p-10 text-center border border-dashed rounded-md text-neutral-500">
//             Không tìm thấy sản phẩm phù hợp.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
//             {products.map((p) => (
//               <ProductHover
//                 key={p.id}
//                 product={p as any}
//                 href={`/san-pham/${(p as any).slug || p.id}`} // ✅ bỏ "$$" và ưu tiên slug
//                 priceRenderer={formatCurrency}
//               />
//             ))}
//           </div>
//         ))}

//       {/* pagination */}
//       {state.status === 'ok' && total > 0 && (
//         <div className="mt-10">
//           <Pagination
//             total={total}
//             pageSize={pageSize}
//             current={pageParam}
//             makeLink={(page) => {
//               const params = new URLSearchParams(sp.toString());
//               params.set('page', String(page));
//               return `/qua-tang?${params.toString()}`;
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===== Wrapper với Suspense ===== */
// export default function ListingQuaTang() {
//   return (
//     <Suspense
//       fallback={
//         <div className="px-4 py-8 mx-auto text-sm max-w-7xl text-neutral-600">
//           Đang tải sản phẩm…
//         </div>
//       }
//     >
//       <ListingQuaTangInner />
//     </Suspense>
//   );
// }








"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductHover from "@/components/ProductHover";

/** ====== CONFIG ====== */
const PAGE_SIZE = 12; // đồng bộ kiểu lưới 4 cột, dễ nhìn
const CATEGORY_SLUG = "qua-tang";

/** ====== TYPES ====== */
type BECategory =
  | { id?: any; name?: string; slug?: string }
  | string
  | number
  | null
  | undefined;

type BEProduct = any;

type CardProduct = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  original_price?: number | null;
  image: string;
  _cats: string[]; // slug/name dạng normalize để filter
};

/** ====== HELPERS (giống style hang-moi: robust normalize) ====== */
function isFiniteNumber(n: any) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function normalizeText(s: any) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function pickImage(p: any) {
  const main = String(p?.image || "").trim();
  if (main) return main;

  const arr = Array.isArray(p?.images) ? p.images : [];
  const first = arr.find((x: any) => String(x || "").trim());
  return String(first || "").trim();
}

function extractCats(p: any): string[] {
  const out: string[] = [];

  // 1) p.category / p.category_slug
  if (p?.category) out.push(normalizeText(p.category));
  if (p?.category_slug) out.push(normalizeText(p.category_slug));
  if (p?.categorySlug) out.push(normalizeText(p.categorySlug));

  // 2) p.categories: array (object | string | number)
  const cats: BECategory[] = Array.isArray(p?.categories) ? p.categories : [];
  for (const c of cats) {
    if (c == null) continue;
    if (typeof c === "string" || typeof c === "number") {
      out.push(normalizeText(c));
      continue;
    }
    if (typeof c === "object") {
      if ((c as any).slug) out.push(normalizeText((c as any).slug));
      if ((c as any).name) out.push(normalizeText((c as any).name));
      if ((c as any).title) out.push(normalizeText((c as any).title));
    }
  }

  // unique
  return Array.from(new Set(out.filter(Boolean)));
}

function mapToCard(p: BEProduct): CardProduct {
  return {
    id: String(p?.id ?? ""),
    name: String(p?.name ?? ""),
    slug: p?.slug ? String(p.slug) : undefined,
    price: isFiniteNumber(p?.price),
    original_price:
      p?.original_price == null ? null : isFiniteNumber(p?.original_price),
    image: pickImage(p),
    _cats: extractCats(p),
  };
}

/** API base từ env (đang là .../api) */
function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000/api"
  ).replace(/\/+$/, "");
}

async function getJSON(path: string, init?: RequestInit) {
  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const r = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`${r.status} ${r.statusText}${t ? ` - ${t}` : ""}`);
  }
  return r.json();
}

/** price renderer */
function priceVND(v: number) {
  const n = Math.max(0, Math.round(isFiniteNumber(v)));
  return n.toLocaleString("vi-VN") + " ₫";
}

/** Pagination UI (nếu bạn đang có component Pagination riêng thì giữ lại và dùng props tương tự) */
function PaginationInline({
  current,
  totalItems,
  pageSize,
  onPage,
}: {
  current: number;
  totalItems: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;

  // hiển thị gọn: 1 ... (current-1) current (current+1) ... last
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(current);
  pages.add(current - 1);
  pages.add(current + 1);

  const list = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const withDots: (number | "dots")[] = [];
  for (let i = 0; i < list.length; i++) {
    withDots.push(list[i]);
    if (i < list.length - 1 && list[i + 1] - list[i] > 1) withDots.push("dots");
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="px-3 border h-9 border-neutral-200 text-neutral-700 disabled:opacity-40"
        onClick={() => onPage(current - 1)}
        disabled={prevDisabled}
      >
        Trước
      </button>

      {withDots.map((x, idx) =>
        x === "dots" ? (
          <span key={`d${idx}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={x}
            className={[
              "px-3 h-9 border",
              x === current
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 text-neutral-700 hover:border-neutral-400",
            ].join(" ")}
            onClick={() => onPage(x)}
          >
            {x}
          </button>
        )
      )}

      <button
        className="px-3 border h-9 border-neutral-200 text-neutral-700 disabled:opacity-40"
        onClick={() => onPage(current + 1)}
        disabled={nextDisabled}
      >
        Sau
      </button>
    </div>
  );
}

export default function ListingQT() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const qParam = (sp.get("q") || "").trim();
  const pageParam = Number(sp.get("page") || "1");
  const safePage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [raw, setRaw] = useState<CardProduct[]>([]);

  const buildUrl = useCallback(
    (next: { page?: number; q?: string }) => {
      const params = new URLSearchParams(sp.toString());
      if (next.page != null) params.set("page", String(next.page));
      if (next.q != null) {
        const v = next.q.trim();
        if (!v) params.delete("q");
        else params.set("q", v);
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, sp]
  );

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // giống hang-moi: lấy nhiều rồi lọc ở FE
        const res: any = await getJSON(`/products?limit=500&status=open`, {
          signal: ac.signal,
        });

        const items: BEProduct[] = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];

        const mapped = items.map(mapToCard).filter((p) => p.id && p.name);

        if (!alive) return;
        setRaw(mapped);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Không tải được dữ liệu.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, []);

  /** ====== FILTER: category + search ====== */
  const filtered = useMemo(() => {
    const q = normalizeText(qParam);

    // lọc category "qua-tang" theo slug/name trong categories
    const catKey = normalizeText(CATEGORY_SLUG);
    const byCat = raw.filter((p) => p._cats.includes(catKey));

    // nếu DB đang trả name dạng "Quà tặng" (không có slug) thì catKey vẫn match nhờ normalize
    // (vì "qua-tang" normalize -> "qua-tang" còn "Quà tặng" normalize -> "qua tang")
    // => bổ sung match mềm:
    const byCatSoft =
      byCat.length > 0
        ? byCat
        : raw.filter((p) => p._cats.some((c) => c.includes("qua tang") || c.includes("qua-tang")));

    const base = byCatSoft;

    if (!q) return base;

    return base.filter((p) => {
      const name = normalizeText(p.name);
      const slug = normalizeText(p.slug);
      return name.includes(q) || slug.includes(q);
    });
  }, [raw, qParam]);

  /** ====== PAGINATION ====== */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(safePage, totalPages);
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const onChangePage = useCallback(
    (p: number) => {
      const next = Math.max(1, Math.min(p, totalPages));
      router.push(buildUrl({ page: next }));
      // scroll nhẹ về top list
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [buildUrl, router, totalPages]
  );

  return (
    <div className="w-full">
      {/* giảm lề 2 bên */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="pt-10 pb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-wide text-center sm:text-4xl">QUÀ TẶNG</h1>
          <div className="mt-2 text-sm text-neutral-500">
            {loading ? "Đang tải..." : `${totalItems} sản phẩm phù hợp`}
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <input
              className="h-10 w-full max-w-[520px] border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder="Tìm quà tặng..."
              defaultValue={qParam}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.currentTarget.value || "").trim();
                  router.push(buildUrl({ q: v, page: 1 }));
                }
              }}
            />
            <button
              className="h-10 px-5 text-sm text-white bg-neutral-900"
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>(
                  'input[placeholder="Tìm quà tặng..."]'
                );
                const v = (el?.value || "").trim();
                router.push(buildUrl({ q: v, page: 1 }));
              }}
            >
              Tìm
            </button>
          </div>
        </div>

        {/* lỗi */}
        {err && (
          <div className="px-4 py-3 my-6 text-sm text-red-700 border border-red-200 bg-red-50">
            {err}
          </div>
        )}

        {/* GRID có line ngăn cách nhẹ */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-0 border-t border-l sm:grid-cols-3 lg:grid-cols-4 border-neutral-200/60">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 border-b border-r border-neutral-200/60 sm:p-7 animate-pulse"
                >
                  <div className="aspect-square bg-neutral-200" />
                  <div className="w-10/12 h-4 mt-3 bg-neutral-200" />
                  <div className="w-6/12 h-4 mt-2 bg-neutral-200" />
                </div>
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center border border-dashed border-neutral-300 py-14 text-neutral-500">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-0 border-t border-l sm:grid-cols-3 lg:grid-cols-4 border-neutral-200/60">
              {pageItems.map((p) => (
                <div
                  key={p.id}
                  className="p-6 border-b border-r border-neutral-200/60 sm:p-7"
                >
                  <ProductHover
                    product={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      price: p.price,
                      original_price: p.original_price ?? null,
                      image: p.image,
                    }}
                    href={`/san-pham/${p.slug || p.id}`}
                    priceRenderer={priceVND}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalItems > 0 && (
          <div className="flex justify-center mt-10 mb-8">
            <PaginationInline
              current={page}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPage={onChangePage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
