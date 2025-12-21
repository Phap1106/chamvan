// src/app/hang-moi/_ListingHM.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import ProductHover, { Product as UIProductCard } from "@/components/ProductHover";
import { getJSON } from "@/lib/api";

/* ===== Types từ BE (giống các listing khác) ===== */
type BECategory = { id: number; name: string; slug: string };
type BEImage = { id?: number; url?: string; src?: string; path?: string };
type BEColor = { name: string; hex?: string | null };
type BEProduct = {
  id: number | string;
  name: string;
  slug?: string | null;
  price: number | string;

  // nếu BE có, ProductHover sẽ tự tính % giảm
  original_price?: number | string | null;

  image?: string | null;
  images?: Array<string | BEImage> | null;
  categories?: BECategory[] | null;
  colors?: BEColor[] | null;
  created_at?: string | null;
};

type UIProductCardWithSlug = UIProductCard & { slug?: string; original_price?: number | null };

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
      if (typeof it === "string") return it.trim();
      if (it && typeof it === "object") {
        const anyIt = it as Record<string, unknown>;
        return (
          ((anyIt.url as string) ??
            (anyIt.src as string) ??
            (anyIt.path as string) ??
            "") || ""
        ).trim();
      }
      return "";
    })
    .filter(Boolean);

  return urls.find((u) => /^https?:\/\//i.test(u)) ?? urls[0] ?? "";
}

function normalizeColors(list: BEColor[] | null | undefined) {
  if (!Array.isArray(list)) return [] as { name: string; hex?: string }[];
  return list.map((c) => ({ name: c.name, hex: c.hex ?? undefined }));
}

function n(v: any) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function formatCurrency(v: number) {
  return v.toLocaleString("vi-VN") + " ₫";
}

const SORTS = [
  { key: "newest", label: "Mới nhất" }, // default cho Hàng mới
  { key: "relevance", label: "Liên quan nhất" },
  { key: "price-asc", label: "Giá từ thấp đến cao" },
  { key: "price-desc", label: "Giá từ cao xuống thấp" },
];

function SortMenu({
  value,
  onChange,
}: {
  value: string;
  onChange: (k: string) => void;
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
          className="absolute z-20 w-48 p-1 mt-2 bg-white border shadow-sm border-neutral-200"
          role="listbox"
          onMouseLeave={() => setOpen(false)}
        >
          {SORTS.map((s) => (
            <li key={s.key}>
              <button
                className={[
                  "w-full px-3 py-2 text-left text-sm hover:bg-neutral-100",
                  s.key === value ? "font-medium text-neutral-900" : "text-neutral-700",
                ].join(" ")}
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

/* ===== Inner ===== */
function ListingHangMoiInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const pageParam = Math.max(1, Number(sp.get("page") || "1"));
  const qParam = sp.get("q") || "";
  const sortParam = sp.get("sort") || "newest";

  const [q, setQ] = useState(qParam);
  const [state, setState] = useState<
    | { status: "idle" | "loading" }
    | { status: "error"; message: string }
    | { status: "ok"; data: BEProduct[] }
  >({ status: "idle" });

  // Giới hạn số lượng sản phẩm/ảnh render mỗi trang (giảm lag)
  const pageSize = 12;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState({ status: "loading" });
        const data = await getJSON<BEProduct[]>("/products");
        if (!alive) return;
        setState({ status: "ok", data });
      } catch (e: any) {
        if (!alive) return;
        setState({ status: "error", message: e?.message || "Fetch failed" });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const { products, total } = useMemo(() => {
    if (state.status !== "ok") {
      return { products: [] as UIProductCardWithSlug[], total: 0 };
    }

    const base = (state.data || []).map((p) => {
      const slugs = (p.categories ?? []).map((c) => c.slug);
      const img = normalizeImage(p.images ?? undefined, p.image ?? undefined);
      const colors = normalizeColors(p.colors);
      return {
        id: String(p.id),
        slug: (p.slug ?? "") || String(p.id),
        name: p.name ?? "",
        price: n(p.price),
        original_price: p.original_price == null ? null : n(p.original_price),
        image: img,
        colors,
        _createdAt: p.created_at ?? undefined,
        _slugs: slugs,
      };
    });

    // Ưu tiên lọc theo category "hang-moi" nếu BE có gán,
    // nếu không có thì fallback: lấy toàn bộ và sort newest (để không bị 0 sp)
    const hasHangMoiCat = base.some((p) => p._slugs.includes("hang-moi"));
    let arr = hasHangMoiCat ? base.filter((p) => p._slugs.includes("hang-moi")) : base;

    // Search
    if (qParam) {
      const kw = qParam.trim().toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p._slugs.join(" ").replaceAll("-", " ").includes(kw),
      );
    }

    // Sort
    if (sortParam === "price-asc") arr = arr.slice().sort((a, b) => a.price - b.price);
    if (sortParam === "price-desc") arr = arr.slice().sort((a, b) => b.price - a.price);
    if (sortParam === "newest") {
      arr = arr.slice().sort((a, b) => {
        const ta = a._createdAt ? Date.parse(a._createdAt) : 0;
        const tb = b._createdAt ? Date.parse(b._createdAt) : 0;
        return tb - ta || Number(b.id) - Number(a.id);
      });
    }

    const start = (pageParam - 1) * pageSize;
    const end = start + pageSize;

    const pageItems: UIProductCardWithSlug[] = arr.slice(start, end).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      original_price: p.original_price,
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
    if (q) params.set("q", q);
    else params.delete("q");
    params.set("page", "1");
    pushParams(params);
  }

  function onSortChange(k: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("sort", k);
    params.set("page", "1");
    pushParams(params);
  }

  return (
    // Giảm lề 2 bên: tăng max-width + padding hợp lý
    <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-8">
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

      <h1 className="text-3xl font-semibold tracking-wide text-center sm:text-4xl">HÀNG MỚI</h1>
      <p className="mb-6 text-sm text-center text-neutral-500">
        {state.status === "ok" ? total : "…"} sản phẩm phù hợp
      </p>

      {/* search + sort */}
      <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
        <form onSubmit={onSearch} className="ml-auto flex min-w-[280px] flex-1 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm mới..."
            className="w-full px-4 py-2 text-sm border outline-none border-neutral-300 focus:ring-2 focus:ring-neutral-800"
          />
          <button
            type="submit"
            className="px-4 py-2 ml-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800"
          >
            Tìm
          </button>
        </form>

        <div className="ml-2">
          <SortMenu value={sortParam} onChange={onSortChange} />
        </div>
      </div>

      {/* states */}
      {state.status === "loading" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-neutral-200" />
              <div className="w-10/12 h-4 mt-3 bg-neutral-200" />
              <div className="w-6/12 h-4 mt-2 bg-neutral-200" />
            </div>
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="p-10 text-center text-red-600 border border-red-300 border-dashed">
          Lỗi tải sản phẩm: {state.message}
        </div>
      )}

      {state.status === "ok" &&
        (products.length === 0 ? (
          <div className="p-10 text-center border border-dashed text-neutral-500">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          // Line ngăn cách mỏng, tinh tế: dùng divide
          <div className="grid grid-cols-2 divide-x divide-y sm:grid-cols-3 lg:grid-cols-4 divide-neutral-200/70">
            {products.map((p) => (
              <div key={p.id} className="p-6">
                <ProductHover
                  product={p as any}
                  href={`/san-pham/${(p as any).slug || p.id}`}
                  priceRenderer={formatCurrency}
                />
              </div>
            ))}
          </div>
        ))}

      {/* pagination */}
      {state.status === "ok" && total > 0 && (
        <div className="mt-10">
          <Pagination
            total={total}
            pageSize={pageSize}
            current={pageParam}
            makeLink={(page) => {
              const params = new URLSearchParams(sp.toString());
              params.set("page", String(page));
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
        <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-8 text-sm text-neutral-600">
          Đang tải sản phẩm…
        </div>
      }
    >
      <ListingHangMoiInner />
    </Suspense>
  );
}
