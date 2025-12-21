
// // src/app/trang-tri-nha/_ListingTTN.tsx
// 'use client';

// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Suspense, useEffect, useMemo, useState } from 'react';
// import Pagination from '@/components/Pagination';
// import ProductHover, { Product as UIProductCard } from '@/components/ProductHover';
// import { getJSON } from '@/lib/api';

// /** Danh mục con của Trang trí nhà */
// const CATS = [
//   { slug: '', label: 'Tất cả' },
//   { slug: 'phong-tho', label: 'Phòng thờ' },
//   { slug: 'phong-khach', label: 'Phòng khách' },
//   { slug: 'phong-thuy', label: 'Phong thủy' },
//   { slug: 'trung-bay', label: 'Trưng bày' },
// ];

// const ALLOWED = new Set(['phong-tho', 'phong-khach', 'phong-thuy', 'trung-bay']);

// const SORTS = [
//   { key: 'relevance', label: 'Liên quan nhất' },
//   { key: 'newest', label: 'Mới nhất' },
//   { key: 'price-asc', label: 'Giá từ thấp đến cao' },
//   { key: 'price-desc', label: 'Giá từ cao xuống thấp' },
// ];

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
//   images?: Array<string | BEImage> | null; // ✅ thêm images (đang dùng normalizeImage)
//   categories?: BECategory[] | null;
//   colors?: BEColor[] | null;
//   sku?: string | null;
//   description?: string | null;
//   created_at?: string | null;
// };

// type UIProductCardWithSlug = UIProductCard & { slug?: string };

// /* ===== Local state types ===== */
// type FetchState =
//   | { status: 'idle' | 'loading' }
//   | { status: 'error'; message: string }
//   | { status: 'ok'; data: BEProduct[] };

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
//         const candidate =
//           (anyIt.url as string) ??
//           (anyIt.src as string) ??
//           (anyIt.path as string) ??
//           '';
//         return (candidate || '').trim();
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

// type ListingTrangTriNhaProps = {
//   /** "", "phong-tho", "phong-khach", "phong-thuy", "trung-bay" */
//   initialCategory?: string;
// };

// /* ===== Inner Component ===== */
// function ListingTrangTriNhaInner({ initialCategory }: ListingTrangTriNhaProps) {
//   const router = useRouter();
//   const sp = useSearchParams();

//   const pageParam = Math.max(1, Number(sp.get('page') || '1'));
//   const qParam = sp.get('q') || '';
//   const sortParam = sp.get('sort') || 'relevance';
//   const categoryFromURL = initialCategory ?? sp.get('category') ?? '';

//   const [q, setQ] = useState(qParam);
//   const [state, setState] = useState<FetchState>({ status: 'idle' });
//   const pageSize = 12;

//   /* Fetch từ BE */
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

//   /* Lọc + sắp xếp + phân trang (client) */
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

//     let arr = base.filter((p) => p._slugs.some((s) => ALLOWED.has(s)));

//     if (categoryFromURL) arr = arr.filter((p) => p._slugs.includes(categoryFromURL));

//     if (qParam) {
//       const kw = qParam.trim().toLowerCase();
//       arr = arr.filter(
//         (p) =>
//           p.name.toLowerCase().includes(kw) ||
//           p._slugs.join(' ').replaceAll('-', ' ').includes(kw),
//       );
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
//   }, [state, categoryFromURL, pageParam, qParam, sortParam]);

//   const activeCategory = categoryFromURL;

//   function pushParams(next: URLSearchParams, base?: string) {
//     const href =
//       (base ??
//         (initialCategory ? `/trang-tri-nha/${initialCategory}` : '/trang-tri-nha')) +
//       `?${next.toString()}`;
//     router.push(href);
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
//         <Link href="/trang-tri-nha" className="hover:underline">
//           Trang trí nhà
//         </Link>
//         {activeCategory && (
//           <>
//             <span className="mx-2">/</span>
//             <span className="font-medium text-neutral-700">
//               {CATS.find((c) => c.slug === activeCategory)?.label}
//             </span>
//           </>
//         )}
//       </nav>

//       <h1 className="mb-1 text-3xl font-semibold tracking-wide text-center">
//         {activeCategory ? CATS.find((c) => c.slug === activeCategory)?.label : 'TRANG TRÍ NHÀ'}
//       </h1>
//       <p className="mb-6 text-sm text-center text-neutral-500">
//         {state.status === 'ok' ? total : '…'} sản phẩm phù hợp
//       </p>

//       {/* chip + search + sort */}
//       <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
//         {CATS.map((c) => {
//           const isActive = (initialCategory ?? '') === c.slug;
//           const href = c.slug ? `/trang-tri-nha/${c.slug}` : '/trang-tri-nha';
//           return (
//             <Link
//               key={c.slug}
//               href={href}
//               className={[
//                 'rounded-full px-4 py-2 text-sm border',
//                 isActive
//                   ? 'border-neutral-900 bg-neutral-900 text-white'
//                   : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500',
//               ].join(' ')}
//             >
//               {c.label}
//             </Link>
//           );
//         })}

//         <form onSubmit={onSearch} className="ml-auto flex min-w-[280px] flex-1 max-w-md">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Tìm án gian, khay, lộc bình..."
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
//                 href={`/san-pham/${(p as any).slug || p.id}`} // ✅ ưu tiên slug
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
//               const base = initialCategory ? `/trang-tri-nha/${initialCategory}` : '/trang-tri-nha';
//               return `${base}?${params.toString()}`;
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===== Wrapper với Suspense ===== */
// export default function ListingTrangTriNha(props: ListingTrangTriNhaProps) {
//   return (
//     <Suspense
//       fallback={
//         <div className="px-4 py-8 mx-auto text-sm max-w-7xl text-neutral-600">
//           Đang tải sản phẩm…
//         </div>
//       }
//     >
//       <ListingTrangTriNhaInner {...props} />
//     </Suspense>
//   );
// }







"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductHover, { Product as UIProduct } from "@/components/ProductHover";
import Pagination from "@/components/Pagination";
import { getJSON } from "@/lib/api";

type BEProduct = {
  id: string | number;
  name?: string;
  slug?: string | null;

  price?: number | string | null;
  original_price?: number | string | null;

  image?: string | null;
  thumbnail?: string | null;
  images?: any;

  category?: any;
  categories?: any;
  tags?: any;

  created_at?: string;
  updated_at?: string;
  status?: string;
};

function safeNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeText(input: any) {
  return String(input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();
}

function pickImage(p: BEProduct): string {
  const direct =
    (p.image && String(p.image)) ||
    (p.thumbnail && String(p.thumbnail)) ||
    "";

  if (direct) return direct;

  const imgs: any = (p as any).images;
  if (Array.isArray(imgs) && imgs.length) {
    const first = imgs[0];
    if (typeof first === "string") return first;
    if (first?.url) return String(first.url);
    if (first?.path) return String(first.path);
  }
  if (imgs?.url) return String(imgs.url);
  if (imgs?.path) return String(imgs.path);

  return "";
}

function productToUI(p: BEProduct): UIProduct {
  return {
    id: String(p.id),
    name: p.name || "",
    slug: p.slug || undefined,
    price: safeNum(p.price),
    original_price: p.original_price == null ? null : safeNum(p.original_price),
    image: pickImage(p),
    category:
      typeof p.category === "string"
        ? p.category
        : p.category?.slug || p.category?.name || "",
  };
}

function priceVND(v: number) {
  return `${new Intl.NumberFormat("vi-VN").format(safeNum(v))} đ`;
}

function matchCategory(p: BEProduct, initialCategory: string) {
  const target = normalizeText(initialCategory);

  const cat1 =
    (typeof p.category === "string" ? p.category : p.category?.slug || p.category?.name) || "";
  const n1 = normalizeText(cat1);

  // categories array
  const cats = Array.isArray((p as any).categories) ? (p as any).categories : [];
  const nCats = cats
    .map((c: any) => normalizeText(typeof c === "string" ? c : c?.slug || c?.name))
    .join(" ");

  // tags
  const tags = Array.isArray((p as any).tags) ? (p as any).tags : [];
  const nTags = tags
    .map((t: any) => normalizeText(typeof t === "string" ? t : t?.slug || t?.name))
    .join(" ");

  const haystack = `${n1} ${nCats} ${nTags}`;

  // match mềm: “phong-khach” cũng match “phong khach”, “phong_khach”
  return haystack.includes(target.replace(/-/g, " ")) || haystack.includes(target.replace(/-/g, "_")) || haystack.includes(target);
}

export default function ListingTrangTriNha({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [raw, setRaw] = useState<BEProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [keyword, setKeyword] = useState(sp.get("q") || "");

  const pageSize = 12;
  const pageFromUrl = Number(sp.get("page") || "1");
  const safePage = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res: any = await getJSON(`/products?limit=500&status=open`, {
          signal: ac.signal,
        });

        const items: BEProduct[] = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];

        if (!alive) return;
        setRaw(items);
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

  const filtered = useMemo(() => {
    const kw = normalizeText(keyword);

    return raw
      .filter((p) => (p.status ? String(p.status).toLowerCase() === "open" : true))
      .filter((p) => (initialCategory ? matchCategory(p, initialCategory) : true))
      .filter((p) => {
        if (!kw) return true;
        return normalizeText(p.name).includes(kw);
      })
      .sort((a, b) => {
        const ta = Date.parse(a.created_at || a.updated_at || "") || 0;
        const tb = Date.parse(b.created_at || b.updated_at || "") || 0;
        return tb - ta;
      });
  }, [raw, keyword, initialCategory]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paged = useMemo(() => {
    const start = (Math.min(safePage, totalPages) - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, totalPages]);

  function buildUrl(next: { page?: number; q?: string }) {
    const params = new URLSearchParams(sp.toString());
    if (next.page != null) params.set("page", String(next.page));
    if (next.q != null) {
      if (next.q.trim()) params.set("q", next.q.trim());
      else params.delete("q");
    }
    const qs = params.toString();
    // route hiện tại giữ nguyên (Next sẽ apply đúng path)
    return qs ? `?${qs}` : "";
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ page: 1, q: keyword }));
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
      <div className="pt-10 pb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-wide sm:text-4xl">
          TRANG TRÍ NHÀ
        </h1>
        <p className="mt-2 text-sm text-neutral-500">{totalItems} sản phẩm phù hợp</p>
      </div>

      <form onSubmit={onSubmit} className="flex items-center justify-center gap-3 pb-8">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="h-10 w-full max-w-[420px] rounded-none border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          className="h-10 px-4 text-sm font-medium text-white bg-neutral-900"
        >
          Tìm
        </button>
      </form>

      {err ? (
        <div className="p-6 text-sm text-red-600 border border-neutral-200">{err}</div>
      ) : null}

      <div className="mt-2">
        {loading ? (
          <div className="grid grid-cols-2 gap-0 border-t border-l sm:grid-cols-3 lg:grid-cols-4 border-neutral-200/70">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6 border-b border-r animate-pulse border-neutral-200/70">
                <div className="aspect-square bg-neutral-200" />
                <div className="w-10/12 h-4 mt-3 bg-neutral-200" />
                <div className="w-6/12 h-4 mt-2 bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0 border-t border-l sm:grid-cols-3 lg:grid-cols-4 border-neutral-200/70">
            {paged.map((p) => {
              const ui = productToUI(p);
              const href = ui.slug ? `/san-pham/${ui.slug}` : `/san-pham/${ui.id}`;
              return (
                <div key={ui.id} className="p-6 border-b border-r border-neutral-200/70">
                  <ProductHover product={ui} href={href} priceRenderer={priceVND} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-10">
        <Pagination
          current={Math.min(safePage, totalPages)}
          total={totalPages}
          pageSize={pageSize}
          makeLink={(p) => buildUrl({ page: p })}
        />
      </div>

      <div className="h-10" />
    </div>
  );
}
