// //src/app/tat-ca-san-pham/shared/ListingPage.tsx
// 'use client';

// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Suspense, useEffect, useMemo, useState } from 'react';
// import Pagination from '@/components/Pagination';
// import ProductHover, { Product as HoverProduct } from '@/components/ProductHover';
// import { getJSON } from '@/lib/api';

// /* ================== CẤU HÌNH ================== */
// const CATEGORIES = [
//   { slug: '', label: 'Tất cả' },
//   { slug: 'hang-moi', label: 'Hàng mới' },
//   { slug: 'qua-tang', label: 'Quà tặng' },
//   { slug: 'trang-tri-nha', label: 'Trang trí nhà' },
//   { slug: 'trung-bay', label: 'Trưng bày' },
// ];

// const SORTS = [
//   { key: 'relevance', label: 'Liên quan nhất' },
//   { key: 'newest', label: 'Mới nhất' },
//   { key: 'price-asc', label: 'Giá từ thấp đến cao' },
//   { key: 'price-desc', label: 'Giá từ cao xuống thấp' },
// ] as const;
// type SortKey = (typeof SORTS)[number]['key'];

// function formatCurrency(v: number) {
//   return (Number.isFinite(v) ? v : 0).toLocaleString('vi-VN') + ' ₫';
// }

// /* ================== HELPER XỬ LÝ ẢNH (QUAN TRỌNG) ================== */
// // function getProductImage(p: any): string {
// //   // 1. Ưu tiên ảnh đại diện (cột image) nếu là chuỗi URL
// //   if (p.image && typeof p.image === 'string' && p.image.startsWith('http')) {
// //     return p.image;
// //   }

// //   // 2. Tìm trong mảng images
// //   if (Array.isArray(p.images) && p.images.length > 0) {
// //     const first = p.images[0];
// //     if (typeof first === 'string') return first;
// //     if (typeof first === 'object' && first.url) return first.url;
// //   }

// //   // 3. Fallback
// //   return '/placeholder.jpg';
// // }


// const IMG_RE = /^(https?:\/\/|data:image\/)/i;

// function getProductImage(p: any): string {
//   // 1) Ưu tiên image (cột products.image)
//   if (p?.image && typeof p.image === 'string') {
//     const s = p.image.trim();
//     if (IMG_RE.test(s)) return s;
//   }

//   // 2) fallback qua images[] (string hoặc object.url)
//   const arr = Array.isArray(p?.images) ? p.images : [];
//   for (const it of arr) {
//     const u =
//       typeof it === 'string'
//         ? it
//         : typeof it === 'object' && it?.url
//           ? it.url
//           : '';

//     if (typeof u === 'string') {
//       const s = u.trim();
//       if (IMG_RE.test(s)) return s;
//     }
//   }

//   return '/placeholder.jpg';
// }




// /* ================== TYPES ================== */
// type BEColor = { name: string; hex?: string | null };
// type BEProduct = {
//   id: number | string;
//   name: string;
//   slug?: string | null; // <--- Backend đã có slug
//   price: number | string;
//   image?: string | null;
//   images?: any[];
//   colors?: BEColor[];
// };
// type ListResp<T> = {
//   items: T[]; // hoặc data
//   total: number;
//   page?: number;
//   limit?: number;
// };

// type ListingPageProps = {
//   initialCategory?: string;
// };

// /* ================== SORT DROPDOWN ================== */
// function SortMenu({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
//   const [open, setOpen] = useState(false);
//   const current = SORTS.find((s) => s.key === value) ?? SORTS[0];

//   return (
//     <div className="relative z-20">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="inline-flex items-center gap-1 text-sm border px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-50"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//       >
//         <span className="text-neutral-500">Sắp xếp:</span>
//         <span className="font-medium text-neutral-900">{current.label}</span>
//       </button>

//       {open && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
//           <ul
//             className="absolute right-0 z-30 w-48 p-1 mt-2 duration-100 bg-white border rounded-md shadow-xl animate-in fade-in zoom-in-95"
//             role="listbox"
//           >
//             {SORTS.map((s) => (
//               <li key={s.key}>
//                 <button
//                   className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
//                     s.key === value ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-700'
//                   }`}
//                   onClick={() => {
//                     onChange(s.key);
//                     setOpen(false);
//                   }}
//                 >
//                   {s.label}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// }

// /* ================== Inner Listing ================== */
// function ListingPageInner({ initialCategory }: ListingPageProps) {
//   const router = useRouter();
//   const sp = useSearchParams();

//   // Query Params
//   const pageParam = Math.max(1, Number(sp.get('page') || '1'));
//   const qParam = sp.get('q') || '';
//   const sortParam = (sp.get('sort') || 'relevance') as SortKey;
//   const categoryFromURL = initialCategory ?? sp.get('category') ?? '';

//   // State
//   const [q, setQ] = useState(qParam);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>('');
//   const [items, setItems] = useState<HoverProduct[]>([]);
//   const [total, setTotal] = useState(0);

//   const pageSize = 12;
//   const activeCategory = categoryFromURL;

//   // Fetch API
//   useEffect(() => {
//     const params = new URLSearchParams();
//     params.set('page', String(pageParam));
//     params.set('limit', String(pageSize));
//     if (qParam) params.set('q', qParam);
//     // Lưu ý: Backend NestJS của bạn có thể cần logic filter category (nếu chưa có thì sẽ hiện tất cả)
//     // Tạm thời gửi lên để backend xử lý nếu có
//     if (categoryFromURL) params.set('category', categoryFromURL);
//     if (sortParam) params.set('sort', sortParam);

//     // URL API của bạn
//     const path = `/products?${params.toString()}`;

//     setLoading(true);
//     setError('');

//     getJSON<ListResp<BEProduct> | BEProduct[]>(path)
//       .then((data: any) => {
//         // Xử lý response trả về (có thể là { items: [] } hoặc { data: [] } hoặc [])
//         const rawItems = Array.isArray(data) ? data : (data.items || data.data || []);
//         const rawTotal = Array.isArray(data) ? data.length : (data.total || data.meta?.total || rawItems.length);

//         // Map dữ liệu sang format hiển thị
//         const mapped: HoverProduct[] = rawItems.map((p: BEProduct) => ({
//           id: String(p.id),
//           slug: p.slug || String(p.id), // Lưu slug để dùng tạo link
//           name: p.name,
//           price: Number(p.price) || 0,
//           image: getProductImage(p), // Dùng hàm xử lý ảnh an toàn
//           colors: (p.colors ?? []).map((c) => ({ name: c.name, hex: c.hex || undefined })),
//             category: '',
//         }));

//         setItems(mapped);
//         setTotal(Number(rawTotal));
//       })
//       .catch((e: any) => {
//         console.error(e);
//         setError('Không thể tải dữ liệu sản phẩm.');
//       })
//       .finally(() => setLoading(false));
//   }, [pageParam, pageSize, qParam, sortParam, categoryFromURL]);

//   // Handlers
//   function pushParams(next: URLSearchParams, base?: string) {
//     const href = (base ?? (initialCategory ? `/${initialCategory}` : '/tat-ca-san-pham')) + `?${next.toString()}`;
//     router.push(href);
//   }

//   function onSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams(sp.toString());
//     if (q) params.set('q', q); else params.delete('q');
//     params.set('page', '1');
//     pushParams(params);
//   }

//   function onSortChange(k: SortKey) {
//     const params = new URLSearchParams(sp.toString());
//     params.set('sort', k);
//     params.set('page', '1');
//     pushParams(params);
//   }

//   // JSON-LD
//   const jsonLd = useMemo(() => ({
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: [
//       { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://chamvan.com/' },
//       { '@type': 'ListItem', position: 2, name: 'Tất cả sản phẩm', item: 'https://chamvan.com/tat-ca-san-pham' },
//       ...(activeCategory ? [{
//         '@type': 'ListItem', position: 3, 
//         name: CATEGORIES.find((c) => c.slug === activeCategory)?.label ?? 'Danh mục',
//         item: `https://chamvan.com/tat-ca-san-pham/${activeCategory}`
//       }] : [])
//     ],
//   }), [activeCategory]);

//   return (
//     <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl">
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

//       {/* Breadcrumb */}
//       <nav className="mb-4 text-sm text-neutral-500">
//         <Link href="/" className="hover:underline">Trang chủ</Link>
//         <span className="mx-2">/</span>
//         <Link href="/tat-ca-san-pham" className="hover:underline text-neutral-800">Tất cả sản phẩm</Link>
//       </nav>

//       <div className="mb-10 text-center">
//         <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
//           {activeCategory ? CATEGORIES.find((c) => c.slug === activeCategory)?.label : 'TẤT CẢ SẢN PHẨM'}
//         </h1>
//         <p className="text-sm text-neutral-500">Tinh hoa gỗ mộc thủ công Việt Nam</p>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
//         {/* Categories */}
//         <div className="flex max-w-full gap-2 pb-2 overflow-x-auto md:pb-0 no-scrollbar">
//           {CATEGORIES.map((c) => {
//             const isActive = (initialCategory ? initialCategory : '') === c.slug;
//             const href = c.slug ? `/${c.slug}` : '/tat-ca-san-pham';
//             return (
//               <Link
//                 key={c.slug}
//                 href={href}
//                 className={[
//                   'rounded-full px-4 py-2 text-sm border transition-all whitespace-nowrap',
//                   isActive ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900',
//                 ].join(' ')}
//               >
//                 {c.label}
//               </Link>
//             );
//           })}
//         </div>

//         <div className="flex items-center w-full gap-3 md:w-auto">
//             {/* Search */}
//             <form onSubmit={onSearch} className="relative flex-1 md:w-64">
//               <input
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 placeholder="Tìm sản phẩm..."
//                 className="w-full py-2 pl-4 pr-10 text-sm transition-all border rounded-lg border-neutral-200 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
//               />
//               <button type="submit" className="absolute -translate-y-1/2 right-3 top-1/2 text-neutral-400 hover:text-neutral-900">
//                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
//               </button>
//             </form>

//             {/* Sort */}
//             <SortMenu value={sortParam} onChange={onSortChange} />
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="p-4 mb-8 text-center text-red-600 border border-red-100 bg-red-50 rounded-xl">
//           {error}
//         </div>
//       )}

//       {/* Loading / Empty / List */}
//       {loading ? (
//         <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//            {[1,2,3,4,5,6,7,8].map(i => (
//              <div key={i} className="animate-pulse">
//                <div className="bg-neutral-200 aspect-[3/4] rounded-xl mb-3"></div>
//                <div className="w-3/4 h-4 mb-2 rounded bg-neutral-200"></div>
//                <div className="w-1/2 h-4 rounded bg-neutral-200"></div>
//              </div>
//            ))}
//         </div>
//       ) : items.length === 0 ? (
//         <div className="py-20 text-center">
//           <p className="mb-4 text-neutral-400">Không tìm thấy sản phẩm nào phù hợp.</p>
//           <button onClick={() => { setQ(''); pushParams(new URLSearchParams('')); }} className="text-sm font-medium underline text-neutral-900 underline-offset-4">
//             Xóa bộ lọc
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
//           {items.map((p) => (
//             <ProductHover
//               key={p.id}
//               product={p}
//               // Ưu tiên SLUG, fallback ID
//               href={`/san-pham/${(p as any).slug || p.id}`} 
//               priceRenderer={formatCurrency}
//             />
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="mt-16">
//         <Pagination
//           total={total}
//           pageSize={pageSize}
//           current={pageParam}
//           makeLink={(page) => {
//             const params = new URLSearchParams(sp.toString());
//             params.set('page', String(page));
//             const base = initialCategory ? `/${initialCategory}` : '/tat-ca-san-pham';
//             return `${base}?${params.toString()}`;
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default function ListingPage(props: ListingPageProps) {
//   return (
//     <Suspense fallback={<div className="flex items-center justify-center w-full h-screen">Đang tải...</div>}>
//       <ListingPageInner {...props} />
//     </Suspense>
//   );
// }











'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/Pagination';
import ProductHover, { Product as HoverProduct } from '@/components/ProductHover';
import { getJSON } from '@/lib/api';

/* ================== CẤU HÌNH ================== */
const CATEGORIES = [
  { slug: '', label: 'Tất cả' },
  { slug: 'hang-moi', label: 'Hàng mới' },
  { slug: 'qua-tang', label: 'Quà tặng' },
  { slug: 'trang-tri-nha', label: 'Trang trí nhà' },
  { slug: 'trung-bay', label: 'Trưng bày' },
];

const SORTS = [
  { key: 'relevance', label: 'Liên quan nhất' },
  { key: 'newest', label: 'Mới nhất' },
  { key: 'price-asc', label: 'Giá từ thấp đến cao' },
  { key: 'price-desc', label: 'Giá từ cao xuống thấp' },
] as const;

type SortKey = (typeof SORTS)[number]['key'];

function formatCurrency(v: number) {
  return (Number.isFinite(v) ? v : 0).toLocaleString('vi-VN') + ' ₫';
}

/* ================== HELPER XỬ LÝ ẢNH (QUAN TRỌNG) ================== */
// Hỗ trợ: http(s), data:image (base64), và cả đường dẫn nội bộ bắt đầu bằng /
const IMG_RE = /^(https?:\/\/|data:image\/|\/)/i;

function getProductImage(p: any): string {
  // 1) Ưu tiên image (cột products.image)
  if (p?.image && typeof p.image === 'string') {
    const s = p.image.trim();
    if (IMG_RE.test(s)) return s;
  }

  // 2) fallback qua images[] (string hoặc object.url)
  const arr = Array.isArray(p?.images) ? p.images : [];
  for (const it of arr) {
    const u =
      typeof it === 'string'
        ? it
        : typeof it === 'object' && it?.url
          ? it.url
          : '';

    if (typeof u === 'string') {
      const s = u.trim();
      if (IMG_RE.test(s)) return s;
    }
  }

  return '/placeholder.jpg';
}

/* ================== TYPES ================== */
type BEColor = { name: string; hex?: string | null };
type BEProduct = {
  id: number | string;
  name: string;
  slug?: string | null;
  price: number | string;
  image?: string | null;
  images?: any[];
  colors?: BEColor[];
};

type ListResp<T> = {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
};

type ListingPageProps = {
  initialCategory?: string; // lấy từ route /tat-ca-san-pham/[category]
};

/* ================== SORT DROPDOWN ================== */
function SortMenu({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = SORTS.find((s) => s.key === value) ?? SORTS[0];

  return (
    <div className="relative z-20">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm border px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="text-neutral-500">Sắp xếp:</span>
        <span className="font-medium text-neutral-900">{current.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul
            className="absolute right-0 z-30 w-48 p-1 mt-2 duration-100 bg-white border rounded-md shadow-xl animate-in fade-in zoom-in-95"
            role="listbox"
          >
            {SORTS.map((s) => (
              <li key={s.key}>
                <button
                  type="button"
                  className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                    s.key === value
                      ? 'font-bold text-neutral-900 bg-neutral-50'
                      : 'text-neutral-700'
                  }`}
                  onClick={() => {
                    onChange(s.key);
                    setOpen(false);
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* ================== Inner Listing ================== */
function ListingPageInner({ initialCategory }: ListingPageProps) {
  const router = useRouter();
  const sp = useSearchParams();

  // Query Params
  const pageParam = Math.max(1, Number(sp.get('page') || '1'));
  const qParam = sp.get('q') || '';
  const sortParam = (sp.get('sort') || 'relevance') as SortKey;

  // Category: ưu tiên route param /tat-ca-san-pham/[category]
  const activeCategory = initialCategory ?? sp.get('category') ?? '';

  // State
  const [q, setQ] = useState(qParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [items, setItems] = useState<HoverProduct[]>([]);
  const [total, setTotal] = useState(0);

  const pageSize = 12;

  // Sync input search khi user back/forward hoặc đổi URL
  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  // Helper build base path đúng theo route
  const basePath = initialCategory
    ? `/tat-ca-san-pham/${initialCategory}`
    : '/tat-ca-san-pham';

  // Fetch API
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(pageParam));
    params.set('limit', String(pageSize));
    if (qParam) params.set('q', qParam);
    if (activeCategory) params.set('category', activeCategory);
    if (sortParam) params.set('sort', sortParam);

    const path = `/products?${params.toString()}`;

    setLoading(true);
    setError('');

    getJSON<ListResp<BEProduct> | BEProduct[]>(path)
      .then((data: any) => {
        const rawItems = Array.isArray(data) ? data : data.items || data.data || [];
        const rawTotal = Array.isArray(data)
          ? data.length
          : data.total || data.meta?.total || rawItems.length;

        const mapped: HoverProduct[] = rawItems.map((p: BEProduct) => ({
          id: String(p.id),
          slug: p.slug || String(p.id),
          name: p.name,
          price: Number(p.price) || 0,
          image: getProductImage(p),

          // ProductHover đang require hex: string => lọc bỏ màu không có hex để tránh undefined
          colors: (p.colors ?? [])
            .filter((c) => typeof c?.hex === 'string' && (c.hex as string).trim().length > 0)
            .map((c) => ({ name: c.name, hex: (c.hex as string).trim() })),

          // ProductHover đang require category: string
          category: '',
        }));

        setItems(mapped);
        setTotal(Number(rawTotal) || 0);
      })
      .catch((e: any) => {
        console.error(e);
        setError('Không thể tải dữ liệu sản phẩm.');
      })
      .finally(() => setLoading(false));
  }, [pageParam, pageSize, qParam, sortParam, activeCategory]);

  function pushParams(next: URLSearchParams) {
    const qs = next.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function onSearch(e: any) {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (q) params.set('q', q);
    else params.delete('q');
    params.set('page', '1');
    pushParams(params);
  }

  function onSortChange(k: SortKey) {
    const params = new URLSearchParams(sp.toString());
    params.set('sort', k);
    params.set('page', '1');
    pushParams(params);
  }

  // JSON-LD
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://chamvan.com/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tất cả sản phẩm',
          item: 'https://chamvan.com/tat-ca-san-pham',
        },
        ...(activeCategory
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name:
                  CATEGORIES.find((c) => c.slug === activeCategory)?.label ?? 'Danh mục',
                item: `https://chamvan.com/tat-ca-san-pham/${activeCategory}`,
              },
            ]
          : []),
      ],
    }),
    [activeCategory],
  );

  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tat-ca-san-pham" className="hover:underline text-neutral-800">
          Tất cả sản phẩm
        </Link>
      </nav>

      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          {activeCategory
            ? CATEGORIES.find((c) => c.slug === activeCategory)?.label
            : 'TẤT CẢ SẢN PHẨM'}
        </h1>
        <p className="text-sm text-neutral-500">Tinh hoa gỗ mộc thủ công Việt Nam</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        {/* Categories */}
        <div className="flex max-w-full gap-2 pb-2 overflow-x-auto md:pb-0 no-scrollbar">
          {CATEGORIES.map((c) => {
            const isActive = activeCategory === c.slug;
            const href = c.slug ? `/tat-ca-san-pham/${c.slug}` : '/tat-ca-san-pham';

            return (
              <Link
                key={c.slug}
                href={href}
                className={[
                  'rounded-full px-4 py-2 text-sm border transition-all whitespace-nowrap',
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900',
                ].join(' ')}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center w-full gap-3 md:w-auto">
          {/* Search */}
          <form onSubmit={onSearch} className="relative flex-1 md:w-64">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full py-2 pl-4 pr-10 text-sm transition-all border rounded-lg border-neutral-200 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="absolute -translate-y-1/2 right-3 top-1/2 text-neutral-400 hover:text-neutral-900"
              aria-label="Tìm kiếm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>

          {/* Sort */}
          <SortMenu value={sortParam} onChange={onSortChange} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 mb-8 text-center text-red-600 border border-red-100 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      {/* Loading / Empty / List */}
      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-200 aspect-[3/4] rounded-xl mb-3" />
              <div className="w-3/4 h-4 mb-2 rounded bg-neutral-200" />
              <div className="w-1/2 h-4 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-neutral-400">Không tìm thấy sản phẩm nào phù hợp.</p>
          <button
            type="button"
            onClick={() => {
              setQ('');
              pushParams(new URLSearchParams());
            }}
            className="text-sm font-medium underline text-neutral-900 underline-offset-4"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductHover
              key={p.id}
              product={p}
              href={`/san-pham/${(p as any).slug || p.id}`}
              priceRenderer={formatCurrency}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-16">
        <Pagination
          total={total}
          pageSize={pageSize}
          current={pageParam}
          makeLink={(page) => {
            const params = new URLSearchParams(sp.toString());
            params.set('page', String(page));
            const qs = params.toString();
            return qs ? `${basePath}?${qs}` : basePath;
          }}
        />
      </div>
    </div>
  );
}

export default function ListingPage(props: ListingPageProps) {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center w-full h-screen">Đang tải...</div>}
    >
      <ListingPageInner {...props} />
    </Suspense>
  );
}
