// // src/app/san-pham/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ProductInfoSection from "./ProductInfoSection";
import ProductGalleryShell from "./ProductGalleryShell";

/** ✅ ISR cho ecommerce: click lần sau gần như instant */
export const revalidate = 300; // 5 phút

export type UIProduct = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  images: string[]; // danh sách ảnh "nhẹ" (không base64)
  hasBase64Images?: boolean; // ✅ chỉ là boolean, không mang base64 qua SSR
  sku?: string;
  colors?: { name: string; hex: string }[];
  category?: string;
};

const BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:4000/api";
  return String(raw).replace(/\/+$/, "");
})();

/** ✅ Chỉ cho SSR các URL nhẹ: http(s) hoặc đường dẫn nội bộ */
const IMG_RE_LITE = /^(https?:\/\/|\/)/i;
const IMG_RE_FULL = /^(https?:\/\/|data:image\/|\/)/i;

function coerceNumber(n: any): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

function getImagesLite(root: any): string[] {
  const list: string[] = [];

  const add = (u: any) => {
    if (typeof u !== "string") return;
    const s = u.trim();
    if (s && IMG_RE_LITE.test(s) && !list.includes(s)) list.push(s);
  };

  add(root?.image);

  if (Array.isArray(root?.images)) {
    for (const it of root.images) {
      if (typeof it === "string") add(it);
      else if (it && typeof it === "object") add(it.url);
    }
  }

  if (list.length === 0) list.push("/placeholder.jpg");

  // ✅ giới hạn để payload nhẹ
  return list.slice(0, 6);
}

function hasBase64InRoot(root: any): boolean {
  const isB64 = (s: any) =>
    typeof s === "string" && /^data:image\//i.test(s.trim());

  if (isB64(root?.image)) return true;

  if (Array.isArray(root?.images)) {
    return root.images.some((it: any) => {
      if (isB64(it)) return true;
      if (it && typeof it === "object" && isB64(it.url)) return true;
      return false;
    });
  }
  return false;
}

async function fetchProductCoreBySlug(slug: string): Promise<UIProduct | null> {
  try {
    const res = await fetch(`${BASE}/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const root = await res.json();
    const images = getImagesLite(root);
    const hasBase64Images = hasBase64InRoot(root);

    const colorsRaw = Array.isArray(root?.colors) ? root.colors : [];
    const colors = colorsRaw
      .map((c: any) => ({
        name: String(c?.name || "").trim(),
        hex: String(c?.hex || "").trim(),
      }))
      .filter((c: any) => c.name.length > 0);

    const category =
      root?.categories?.[0]?.name ||
      root?.categories?.[0]?.label ||
      root?.categories?.[0]?.slug ||
      undefined;

    return {
      id: String(root.id),
      name: root.name ?? "Sản phẩm",
      slug: root.slug ?? slug,
      price: coerceNumber(root.price),
      image: images[0],
      images,
      hasBase64Images,
      sku: root.sku,
      colors,
      category,
    };
  } catch {
    return null;
  }
}

async function SuggestedSection({ productId }: { productId: string }) {
  try {
    const res = await fetch(
      `${BASE}/products/${encodeURIComponent(productId)}/recommendations?limit=4`,
      { next: { revalidate: 900 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;

    const json = await res.json();

    const raw = [
      ...(Array.isArray(json.related) ? json.related : []),
      ...(Array.isArray(json.suggested) ? json.suggested : []),
    ];

    const seen = new Set<string>();
    const items = raw
      .filter((it: any) => {
        const k = String(it?.id ?? "");
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 4)
      .map((it: any) => {
        // suggested cũng chỉ lấy ảnh nhẹ
        const imgs: string[] = [];
        const add = (u: any) => {
          if (typeof u !== "string") return;
          const s = u.trim();
          if (s && IMG_RE_LITE.test(s) && !imgs.includes(s)) imgs.push(s);
        };
        add(it?.image);
        if (Array.isArray(it?.images)) {
          for (const x of it.images) {
            if (typeof x === "string") add(x);
            else if (x && typeof x === "object") add(x.url);
          }
        }
        if (!imgs.length) imgs.push("/placeholder.jpg");

        return {
          id: String(it.id),
          name: it.name ?? "Sản phẩm",
          slug: it.slug ?? String(it.id),
          price: coerceNumber(it.price),
          image: imgs[0],
        };
      });

    if (!items.length) return null;

    return (
      <div className="pt-16 mt-24 border-t border-gray-100">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
          Có thể bạn cũng thích
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {items.map((p) => (
            <Link key={p.id} href={`/san-pham/${p.slug}`} className="block group">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={p.name}
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium leading-relaxed text-gray-900 line-clamp-2 group-hover:text-blue-700">
                  {p.name}
                </h3>
                <div className="text-sm font-bold text-gray-900">
                  {p.price.toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

function SuggestedSkeleton() {
  return (
    <div className="pt-16 mt-24 border-t border-gray-100 animate-pulse">
      <div className="w-56 mb-8 bg-gray-200 rounded h-7" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="w-full aspect-[3/4] rounded-xl bg-gray-200 mb-4" />
            <div className="w-11/12 h-4 mb-2 bg-gray-200 rounded" />
            <div className="w-6/12 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await fetchProductCoreBySlug(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* ✅ Gallery: SSR hiện ảnh nhẹ/placeholder trước, base64 load sau */}
        <div>
          <ProductGalleryShell
            slug={product.slug || slug}
            alt={product.name}
            initialImages={product.images}
            shouldLoadBase64={product.hasBase64Images}
            apiBase={BASE} // server biết BASE, truyền xuống client
            imgReFull={IMG_RE_FULL.source}
          />
        </div>

        <div>
          <ProductInfoSection product={product} />
        </div>
      </div>

      {/* ✅ Suggested không block trang */}
      <Suspense fallback={<SuggestedSkeleton />}>
        <SuggestedSection productId={product.id} />
      </Suspense>
    </div>
  );
}
