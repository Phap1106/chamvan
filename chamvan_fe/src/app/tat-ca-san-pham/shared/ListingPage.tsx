// src/app/tat-ca-san-pham/ListingPage.tsx
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

/* ================== TYPES (phía BE) ================== */
type BEColor = { name: string; hex?: string | null };
type BEProduct = {
  id: number | string;
  name: string;
  slug?: string | null;
  price: number | string;
  image?: string | null;
  images?: string[];
  colors?: BEColor[];
};
type ListResp<T> = {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
};

type ListingPageProps = {
  initialCategory?: string;
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
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-neutral-500">Sắp xếp theo:</span>
        <span className="font-medium text-neutral-900">{current.label}</span>
        <span>▾</span>
      </button>

      {open && (
        <ul
          className="absolute z-20 p-1 mt-2 bg-white border rounded-md shadow w-44"
          role="listbox"
          onMouseLeave={() => setOpen(false)}
        >
          {SORTS.map((s) => (
            <li key={s.key}>
              <button
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                  s.key === value ? 'font-medium text-neutral-900' : 'text-neutral-700'
                }`}
                onClick={() => {
                  onChange(s.key);
                  setOpen(false);
                }}
                role="option"
                aria-selected={s.key === value}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ================== Inner Listing ================== */
function ListingPageInner({ initialCategory }: ListingPageProps) {
  const router = useRouter();
  const sp = useSearchParams();

  // === Query từ URL ===
  const pageParam = Math.max(1, Number(sp.get('page') || '1'));
  const qParam = sp.get('q') || '';
  const sortParam = (sp.get('sort') || 'relevance') as SortKey;
  const categoryFromURL = initialCategory ?? sp.get('category') ?? '';

  // === State giao diện ===
  const [q, setQ] = useState(qParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [items, setItems] = useState<HoverProduct[]>([]);
  const [total, setTotal] = useState(0);

  const pageSize = 12;
  const activeCategory = categoryFromURL;

  // === Gọi API danh sách sản phẩm ===
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(pageParam));
    params.set('limit', String(pageSize));
    if (qParam) params.set('q', qParam);
    if (categoryFromURL) params.set('category', categoryFromURL);
    if (sortParam) params.set('sort', sortParam);

    const path = `/products?${params.toString()}`;

    setLoading(true);
    setError('');

    getJSON<ListResp<BEProduct> | BEProduct[]>(path)
      .then((data) => {
        // Chuẩn hóa cả 2 khả năng: {items,total} hoặc mảng thẳng
        const arr: BEProduct[] = Array.isArray(data) ? data : (data as any).items ?? [];
        const totalVal: number = Array.isArray(data) ? arr.length : (data as any).total ?? arr.length;

        // Map về dạng ProductHover
        const mapped: HoverProduct[] = arr.map((p) => ({
          id: String(p.id),
          name: p.name,
          price: Number(p.price) || 0,
          image: p.image || (Array.isArray(p.images) && p.images[0]) || '',
          colors: (p.colors ?? []).map((c) => ({ name: c.name, hex: c.hex || undefined })),
        }));

        setItems(mapped);
        setTotal(totalVal);
      })
      .catch((e: any) => {
        setError(e?.message || 'Lỗi tải dữ liệu');
      })
      .finally(() => setLoading(false));
  }, [pageParam, pageSize, qParam, sortParam, categoryFromURL]);

  // === Helpers push URL ===
  function pushParams(next: URLSearchParams, base?: string) {
    const href =
      (base ?? (initialCategory ? `/${initialCategory}` : '/tat-ca-san-pham')) +
      `?${next.toString()}`;
    router.push(href);
  }

  function onSearch(e: React.FormEvent) {
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

  // breadcrumb JSON-LD (SEO)
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
                name: CATEGORIES.find((c) => c.slug === activeCategory)?.label ?? 'Danh mục',
                item: `https://chamvan.com/tat-ca-san-pham/${activeCategory}`,
              },
            ]
          : []),
      ],
    }),
    [activeCategory],
  );

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb + tiêu đề */}
      <nav className="mb-2 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tat-ca-san-pham" className="hover:underline">
          Tất cả sản phẩm
        </Link>
        {activeCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="font-medium text-neutral-700">
              {CATEGORIES.find((c) => c.slug === activeCategory)?.label}
            </span>
          </>
        )}
      </nav>

      <h1 className="mb-1 text-3xl font-semibold tracking-wide text-center">
        {activeCategory ? CATEGORIES.find((c) => c.slug === activeCategory)?.label : 'TRUNG BÀY & TRANG TRÍ'}
      </h1>
      <p className="mb-6 text-sm text-center text-neutral-500">{total} sản phẩm phù hợp</p>

      {/* Dãy danh mục + ô tìm kiếm + sắp xếp */}
      <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
        {CATEGORIES.map((c) => {
          const isActive = (initialCategory ? initialCategory : '') === c.slug;
          const href = c.slug ? `/${c.slug}` : '/tat-ca-san-pham';
          return (
            <Link
              key={c.slug}
              href={href}
              className={[
                'rounded-full px-4 py-2 text-sm border',
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500',
              ].join(' ')}
            >
              {c.label}
            </Link>
          );
        })}

        {/* SEARCH */}
        <form onSubmit={onSearch} className="ml-auto flex min-w-[280px] flex-1 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm án gian, khay, lộc bình..."
            className="w-full px-4 py-2 text-sm border outline-none border-neutral-300 focus:ring-2 focus:ring-neutral-800"
          />
          <button
            type="submit"
            className="px-4 py-2 ml-2 text-sm font-medium text-white rounded-md bg-neutral-900 hover:bg-neutral-800"
          >
            Tìm
          </button>
        </form>

        {/* SORT */}
        <div className="ml-2">
          <SortMenu value={sortParam} onChange={onSortChange} />
        </div>
      </div>

      {/* Kết quả */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          Lỗi tải dữ liệu — {error}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center border border-dashed rounded-md text-neutral-500">Đang tải…</div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center border border-dashed rounded-md text-neutral-500">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {items.map((p) => (
            <ProductHover key={p.id} product={p} href={`/san-pham/${(p as any).slug}`} priceRenderer={formatCurrency} />
          ))}
        </div>
      )}

      {/* PHÂN TRANG */}
      <div className="mt-10">
        <Pagination
          total={total}
          pageSize={pageSize}
          current={pageParam}
          makeLink={(page) => {
            const params = new URLSearchParams(sp.toString());
            params.set('page', String(page));
            const base = initialCategory ? `/${initialCategory}` : '/tat-ca-san-pham';
            return `${base}?${params.toString()}`;
          }}
        />
      </div>
    </div>
  );
}

/* ================== Wrapper với Suspense ================== */
export default function ListingPage(props: ListingPageProps) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8 mx-auto text-sm max-w-7xl text-neutral-600">
          Đang tải sản phẩm…
        </div>
      }
    >
      <ListingPageInner {...props} />
    </Suspense>
  );
}
