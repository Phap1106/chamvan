// src/app/hang-moi/_ListingHM.tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/Pagination';
import ProductHover, { Product as UIProductCard } from '@/components/ProductHover';
import { getJSON } from '@/lib/api';

/* ===== Types từ BE ===== */
type BECategory = { id: number; name: string; slug: string };
type BEImage = { id?: number; url?: string; src?: string; path?: string };
type BEColor = { name: string; hex?: string | null };
type BEProduct = {
  id: number | string;
  name: string;
  price: number | string;
  image?: string | null;
  images?: Array<string | BEImage> | null;
  colors?: BEColor[] | null;
  categories?: BECategory[] | null;
  created_at?: string | null;
};

/* ===== Utils ===== */
function normalizeImage(
  list: Array<string | BEImage> | null | undefined,
  fallback?: string | null,
) {
  const raw: Array<string | BEImage> = [
    ...(fallback ? [fallback] : []),
    ...(Array.isArray(list) ? list : []),
  ];
  const urls = raw
    .map((it) => {
      if (typeof it === 'string') return it.trim();
      if (it && typeof it === 'object') {
        const anyIt = it as Record<string, unknown>;
        return ((anyIt.url as string) ?? (anyIt.src as string) ?? (anyIt.path as string) ?? '').trim();
      }
      return '';
    })
    .filter(Boolean);
  return urls.find((u) => /^https?:\/\//i.test(u)) ?? urls[0] ?? '';
}

function normalizeColors(list: BEColor[] | null | undefined) {
  if (!Array.isArray(list)) return [] as { name: string; hex?: string }[];
  return list.map((c) => ({ name: c.name, hex: c.hex ?? undefined }));
}

function formatCurrency(v: number) {
  return v.toLocaleString('vi-VN') + ' ₫';
}

const SORTS = [
  { key: 'relevance', label: 'Liên quan nhất' },
  { key: 'newest', label: 'Mới nhất' },
  { key: 'price-asc', label: 'Giá từ thấp đến cao' },
  { key: 'price-desc', label: 'Giá từ cao xuống thấp' },
];

function SortMenu({ value, onChange }: { value: string; onChange: (k: string) => void }) {
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

/* ===== Inner component dùng useSearchParams ===== */
function ListingHangMoiInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const pageParam = Math.max(1, Number(sp.get('page') || '1'));
  const qParam = sp.get('q') || '';
  const sortParam = sp.get('sort') || 'relevance';

  const [q, setQ] = useState(qParam);
  const [state, setState] = useState<
    | { status: 'idle' | 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ok'; data: BEProduct[] }
  >({ status: 'idle' });

  const pageSize = 12;

  // Fetch BE
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState({ status: 'loading' });
        const data = await getJSON<BEProduct[]>('/products');
        if (!alive) return;
        setState({ status: 'ok', data });
      } catch (e: any) {
        if (!alive) return;
        setState({ status: 'error', message: e?.message || 'Fetch failed' });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Lọc slug 'hang-moi' + search + sort + paginate
  const { products, total } = useMemo(() => {
    if (state.status !== 'ok') return { products: [] as UIProductCard[], total: 0 };

    const base = (state.data || []).map((p) => {
      const slugs = (p.categories ?? []).map((c) => c.slug);
      const img = normalizeImage(p.images ?? undefined, p.image ?? undefined);
      const colors = normalizeColors(p.colors);
      return {
        id: String(p.id),
        name: p.name ?? '',
        price: Number(p.price) || 0,
        image: img,
        colors,
        _createdAt: p.created_at ?? undefined,
        _slugs: slugs,
      };
    });

    let arr = base.filter((p) => p._slugs.includes('hang-moi'));

    if (qParam) {
      const kw = qParam.trim().toLowerCase();
      arr = arr.filter((p) => p.name.toLowerCase().includes(kw));
    }

    if (sortParam === 'price-asc') arr.sort((a, b) => a.price - b.price);
    if (sortParam === 'price-desc') arr.sort((a, b) => b.price - a.price);
    if (sortParam === 'newest') {
      arr = arr.slice().sort((a, b) => {
        const ta = a._createdAt ? Date.parse(a._createdAt) : 0;
        const tb = b._createdAt ? Date.parse(b._createdAt) : 0;
        return tb - ta || Number(b.id) - Number(a.id);
      });
    }

    const start = (pageParam - 1) * pageSize;
    const end = start + pageSize;
    const pageItems: UIProductCard[] = arr.slice(start, end).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      colors: p.colors,
    }));

    return { products: pageItems, total: arr.length };
  }, [state, pageParam, qParam, sortParam]);

  function pushParams(next: URLSearchParams) {
    router.push(`/hang-moi?${next.toString()}`);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (q) params.set('q', q);
    else params.delete('q');
    params.set('page', '1');
    pushParams(params);
  }

  function onSortChange(k: string) {
    const params = new URLSearchParams(sp.toString());
    params.set('sort', k);
    params.set('page', '1');
    pushParams(params);
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      {/* breadcrumb */}
      <nav className="mb-2 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/hang-moi" className="hover:underline">
          Hàng mới
        </Link>
      </nav>

      <h1 className="mb-1 text-3xl font-semibold tracking-wide text-center">HÀNG MỚI</h1>
      <p className="mb-6 text-sm text-center text-neutral-500">
        {state.status === 'ok' ? total : '…'} sản phẩm phù hợp
      </p>

      {/* search + sort */}
      <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
        <form onSubmit={onSearch} className="ml-auto flex min-w-[280px] flex-1 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tượng, hộp, khay, vòng..."
            className="w-full px-4 py-2 text-sm border outline-none border-neutral-300 focus:ring-2 focus:ring-neutral-800"
          />
          <button
            type="submit"
            className="px-4 py-2 ml-2 text-sm font-medium text-white rounded-md bg-neutral-900 hover:bg-neutral-800"
          >
            Tìm
          </button>
        </form>

        <div className="ml-2">
          <SortMenu value={sortParam} onChange={onSortChange} />
        </div>
      </div>

      {/* states */}
      {state.status === 'loading' && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded h-60 bg-neutral-100 animate-pulse" />
          ))}
        </div>
      )}

      {state.status === 'error' && (
        <div className="p-10 text-center text-red-600 border border-dashed rounded-md">
          Lỗi tải sản phẩm: {state.message}
        </div>
      )}

      {state.status === 'ok' &&
        (products.length === 0 ? (
          <div className="p-10 text-center border border-dashed rounded-md text-neutral-500">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {products.map((p) => (
              <ProductHover
                key={p.id}
                product={p}
                href={`/san-pham/${p.id}`}
                priceRenderer={formatCurrency}
              />
            ))}
          </div>
        ))}

      {/* pagination */}
      {state.status === 'ok' && total > 0 && (
        <div className="mt-10">
          <Pagination
            total={total}
            pageSize={12}
            current={pageParam}
            makeLink={(page) => {
              const params = new URLSearchParams(sp.toString());
              params.set('page', String(page));
              return `/hang-moi?${params.toString()}`;
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ===== Wrapper với Suspense ===== */
export default function ListingHangMoi() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8 mx-auto max-w-7xl text-sm text-neutral-600">
          Đang tải sản phẩm…
        </div>
      }
    >
      <ListingHangMoiInner />
    </Suspense>
  );
}
