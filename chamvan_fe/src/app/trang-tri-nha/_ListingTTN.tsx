"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import ProductHover, { Product } from "@/components/ProductHover";
import { MOCK_PRODUCTS } from "../tat-ca-san-pham/shared/ListingPage";

/** Danh mục con của Trang trí nhà */
const CATS = [
  { slug: "", label: "Tất cả" },
  { slug: "phong-tho", label: "Phòng thờ" },
  { slug: "phong-khach", label: "Phòng khách" },
  { slug: "phong-thuy", label: "Phong thủy" },
  { slug: "trung-bay", label: "Trưng bày" },
];

const SORTS = [
  { key: "relevance", label: "Liên quan nhất" },
  { key: "newest", label: "Mới nhất" },
  { key: "price-asc", label: "Giá từ thấp đến cao" },
  { key: "price-desc", label: "Giá từ cao xuống thấp" },
];

function formatCurrency(v: number) {
  return v.toLocaleString("vi-VN") + " ₫";
}

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
          className="absolute z-20 p-1 mt-2 bg-white border rounded-md shadow w-44"
          role="listbox"
          onMouseLeave={() => setOpen(false)}
        >
          {SORTS.map((s) => (
            <li key={s.key}>
              <button
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                  s.key === value ? "font-medium text-neutral-900" : "text-neutral-700"
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

export default function ListingTrangTriNha({
  initialCategory,
}: {
  /** "", "phong-tho", "phong-khach", "phong-thuy", "trung-bay" */
  initialCategory?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const pageParam = Number(sp.get("page") || "1");
  const qParam = sp.get("q") || "";
  const sortParam = sp.get("sort") || "relevance";
  const categoryFromURL = initialCategory ?? sp.get("category") ?? "";

  const [q, setQ] = useState(qParam);
  const pageSize = 12;

  // filter + sort + paginate
  const { products, total } = useMemo(() => {
    let arr = [...MOCK_PRODUCTS];

    // Chỉ lấy các sản phẩm thuộc nhóm Trang trí nhà (4 danh mục con)
    const ALLOWED = new Set(["phong-tho", "phong-khach", "phong-thuy", "trung-bay"]);
    arr = arr.filter((p) => ALLOWED.has(p.category));

    if (categoryFromURL) arr = arr.filter((p) => p.category === categoryFromURL);

    if (qParam) {
      const kw = qParam.trim().toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.category.replace("-", " ").includes(kw),
      );
    }

    if (sortParam === "price-asc") arr.sort((a, b) => a.price - b.price);
    if (sortParam === "price-desc") arr.sort((a, b) => b.price - a.price);
    if (sortParam === "newest") arr = arr.slice().reverse();

    const start = (pageParam - 1) * pageSize;
    const end = start + pageSize;
    return { products: arr.slice(start, end), total: arr.length };
  }, [categoryFromURL, pageParam, qParam, sortParam]);

  const activeCategory = categoryFromURL;

  function pushParams(next: URLSearchParams, base?: string) {
    const href =
      (base ?? (initialCategory ? `/trang-tri-nha/${initialCategory}` : "/trang-tri-nha")) +
      `?${next.toString()}`;
    router.push(href);
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
    <div className="px-4 py-8 mx-auto max-w-7xl">
      {/* breadcrumb */}
      <nav className="mb-2 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/trang-tri-nha" className="hover:underline">Trang trí nhà</Link>
        {activeCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="font-medium text-neutral-700">
              {CATS.find((c) => c.slug === activeCategory)?.label}
            </span>
          </>
        )}
      </nav>

      <h1 className="mb-1 text-3xl font-semibold tracking-wide text-center">
        {activeCategory
          ? CATS.find((c) => c.slug === activeCategory)?.label
          : "TRANG TRÍ NHÀ"}
      </h1>
      <p className="mb-6 text-sm text-center text-neutral-500">
        {total} sản phẩm phù hợp
      </p>

      {/* chip danh mục con + search + sort */}
      <div className="flex flex-wrap items-center gap-2 mb-6 md:gap-3">
        {CATS.map((c) => {
          const isActive = (initialCategory ?? "") === c.slug;
          const href = c.slug ? `/trang-tri-nha/${c.slug}` : "/trang-tri-nha";
          return (
            <Link
              key={c.slug}
              href={href}
              className={[
                "rounded-full px-4 py-2 text-sm border",
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500",
              ].join(" ")}
            >
              {c.label}
            </Link>
          );
        })}

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

        <div className="ml-2">
          <SortMenu value={sortParam} onChange={onSortChange} />
        </div>
      </div>

      {/* grid */}
      {products.length === 0 ? (
        <div className="p-10 text-center border border-dashed rounded-md text-neutral-500">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {products.map((p) => (
            <ProductHover
              key={p.id}
              product={p as Product}
              href={`/san-pham/${p.id}`}
              priceRenderer={formatCurrency}
            />
          ))}
        </div>
      )}

      {/* pagination */}
      <div className="mt-10">
        <Pagination
          total={total}
          pageSize={12}
          current={pageParam}
          makeLink={(page) => {
            const params = new URLSearchParams(sp.toString());
            params.set("page", String(page));
            const base = initialCategory
              ? `/trang-tri-nha/${initialCategory}`
              : "/trang-tri-nha";
            return `${base}?${params.toString()}`;
          }}
        />
      </div>
    </div>
  );
}
