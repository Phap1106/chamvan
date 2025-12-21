// // src/app/san-pham/[slug]/page.tsx
// import { notFound } from "next/navigation";
// import { Suspense } from "react";

// import ProductInfoSection from "./ProductInfoSection";
// import ProductGalleryShell from "./ProductGalleryShell";
// import SuggestedSectionClient from "./SuggestedSection.client";

// export const revalidate = 300;

// export type UIProduct = {
//   id: string;
//   name: string;
//   slug?: string;

//   // pricing
//   price: number; // giá bán
//   salePrice?: number;
//   originalPrice?: number;
//   discountPercent?: number;

//   // media
//   image?: string; // abs url
//   images: string[]; // abs url
//   hasBase64Images?: boolean;

//   // meta
//   sku?: string | null;
//   colors?: { name: string; hex?: string }[];
//   specs?: { label: string; value: string }[];
//   description?: string | null;
//   category?: string;
// };

// const BASE = (() => {
//   const raw =
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     process.env.NEXT_PUBLIC_API_URL ||
//     process.env.API_BASE_URL ||
//     "http://localhost:4000/api";
//   return String(raw).replace(/\/+$/, "");
// })();

// const ORIGIN = (() => {
//   const b = BASE.replace(/\/+$/, "");
//   return b.endsWith("/api") ? b.slice(0, -4) : b;
// })();

// const IMG_RE_LITE = /^(https?:\/\/|\/)/i;
// const IMG_RE_FULL = /^(https?:\/\/|data:image\/|\/)/i;

// function toAbsUploads(u: any): string | null {
//   if (typeof u !== "string") return null;
//   const s = u.trim();
//   if (!s) return null;

//   if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;
//   if (s.startsWith("/uploads/")) return `${ORIGIN}${s}`;
//   if (s.startsWith("uploads/")) return `${ORIGIN}/${s}`;
//   if (s.startsWith("/")) return s;
//   return `/${s}`;
// }

// function coerceNumber(n: any): number {
//   const num = Number(n);
//   return Number.isFinite(num) ? num : 0;
// }

// function dedupe(list: string[]) {
//   const out: string[] = [];
//   for (const u of list) {
//     const s = String(u || "").trim();
//     if (!s) continue;
//     if (!out.includes(s)) out.push(s);
//   }
//   return out;
// }

// function getImagesLite(root: any): string[] {
//   const listRaw: string[] = [];

//   const add = (u: any) => {
//     const abs = toAbsUploads(u);
//     if (!abs) return;
//     if (IMG_RE_LITE.test(abs)) listRaw.push(abs);
//   };

//   add(root?.image);

//   // BE trả: images = [{id,url,productId}, ...]
//   if (Array.isArray(root?.images)) {
//     for (const it of root.images) {
//       if (typeof it === "string") add(it);
//       else if (it && typeof it === "object") add(it.url);
//     }
//   }

//   const list = dedupe(listRaw);
//   return list.length ? list.slice(0, 24) : ["/placeholder.jpg"];
// }

// function hasBase64InRoot(root: any): boolean {
//   const isB64 = (s: any) => typeof s === "string" && /^data:image\//i.test(s.trim());
//   if (isB64(root?.image)) return true;
//   if (Array.isArray(root?.images)) {
//     return root.images.some((it: any) => isB64(it) || (it && typeof it === "object" && isB64(it.url)));
//   }
//   return false;
// }

// function computeDiscount(originalPrice?: number, salePrice?: number) {
//   const o = Number(originalPrice || 0);
//   const s = Number(salePrice || 0);
//   if (!Number.isFinite(o) || !Number.isFinite(s) || o <= 0 || s <= 0) return 0;
//   if (o <= s) return 0;
//   return Math.round(((o - s) / o) * 100);
// }

// async function fetchProductCoreBySlug(slug: string): Promise<UIProduct | null> {
//   try {
//     const res = await fetch(`${BASE}/products/${encodeURIComponent(slug)}`, {
//       next: { revalidate: 300 },
//       headers: { Accept: "application/json" },
//     });
//     if (!res.ok) return null;

//     const root = await res.json();

//     const images = getImagesLite(root);
//     const hasBase64Images = hasBase64InRoot(root);

//     const colorsRaw = Array.isArray(root?.colors) ? root.colors : [];
//     const colors = colorsRaw
//       .map((c: any) => ({
//         name: String(c?.name || "").trim(),
//         hex: c?.hex ? String(c.hex).trim() : undefined,
//       }))
//       .filter((c: any) => c.name.length > 0);

//     const specsRaw = Array.isArray(root?.specs) ? root.specs : [];
//     const specs = specsRaw
//       .map((s: any) => ({
//         label: String(s?.label || "").trim(),
//         value: String(s?.value || "").trim(),
//       }))
//       .filter((s: any) => s.label.length > 0);

//     const category =
//       root?.categories?.[0]?.name ||
//       root?.categories?.[0]?.label ||
//       root?.categories?.[0]?.slug ||
//       undefined;

//     // BE: price/original_price là string "645..."
//     const salePrice = coerceNumber(root?.salePrice ?? root?.sale_price ?? root?.price);
//     const originalRaw = coerceNumber(root?.originalPrice ?? root?.original_price ?? 0);

//     // nếu BE có original_price thì dùng, không thì coi = salePrice
//     const originalPrice = originalRaw > 0 ? Math.max(originalRaw, salePrice) : salePrice;

//     const discountPercent =
//       Number.isFinite(Number(root?.discount_percent)) && Number(root?.discount_percent) > 0
//         ? Number(root.discount_percent)
//         : computeDiscount(originalPrice, salePrice);

//     return {
//       id: String(root?.id ?? ""),
//       name: root?.name ?? "Sản phẩm",
//       slug: root?.slug ?? slug,

//       price: salePrice, // giữ tương thích
//       salePrice,
//       originalPrice,
//       discountPercent,

//       image: images[0],
//       images,
//       hasBase64Images,

//       sku: root?.sku ?? null,
//       colors,
//       specs: specs.length ? specs : undefined,
//       description: typeof root?.description === "string" ? root.description : null,
//       category,
//     };
//   } catch {
//     return null;
//   }
// }

// function SuggestedSkeleton() {
//   return (
//     <div className="pt-16 mt-24 border-t border-gray-100 animate-pulse">
//       <div className="w-56 mb-8 bg-gray-200 rounded h-7" />
//       <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i}>
//             <div className="w-full mb-4 bg-gray-200 aspect-square rounded-xl" />
//             <div className="w-11/12 h-4 mb-2 bg-gray-200 rounded" />
//             <div className="w-6/12 h-4 bg-gray-200 rounded" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default async function ProductDetailPage({
//   params,
// }: {
//   params: { slug: string } | Promise<{ slug: string }>;
// }) {
//   const p = await params;
//   const slug = p.slug;

//   const product = await fetchProductCoreBySlug(slug);
//   if (!product) notFound();

//   return (
//     <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12">
//       <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
//         <div>
//           <ProductGalleryShell
//             slug={product.slug || slug}
//             alt={product.name}
//             initialImages={product.images}
//             shouldLoadBase64={product.hasBase64Images}
//             apiBase={BASE}
//             imgReFull={IMG_RE_FULL.source}
//           />
//         </div>

//         <div>
//           <ProductInfoSection product={product} />
//         </div>
//       </div>

//       <Suspense fallback={<SuggestedSkeleton />}>
//         <SuggestedSectionClient productId={product.id} limit={4} />
//       </Suspense>
//     </div>
//   );
// }







// src/app/san-pham/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ProductInfoSection from "./ProductInfoSection";
import ProductGalleryShell from "./ProductGalleryShell";
import SuggestedSectionClient from "./SuggestedSection.client";

export const revalidate = 300;

export type UIProduct = {
  id: string;
  name: string;
  slug?: string;

  // pricing
  price: number; // giá bán
  salePrice?: number;
  originalPrice?: number;
  discountPercent?: number;

  // media
  image?: string; // abs url
  images: string[]; // abs url
  hasBase64Images?: boolean;

  // meta
  sku?: string | null;
  colors?: { name: string; hex?: string }[];
  specs?: { label: string; value: string }[];
  description?: string | null;
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

const ORIGIN = (() => {
  const b = BASE.replace(/\/+$/, "");
  return b.endsWith("/api") ? b.slice(0, -4) : b;
})();

const IMG_RE_LITE = /^(https?:\/\/|\/)/i;
const IMG_RE_FULL = /^(https?:\/\/|data:image\/|\/)/i;

function toAbsUploads(u: any): string | null {
  if (typeof u !== "string") return null;
  const s = u.trim();
  if (!s) return null;

  if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;
  if (s.startsWith("/uploads/")) return `${ORIGIN}${s}`;
  if (s.startsWith("uploads/")) return `${ORIGIN}/${s}`;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

function coerceNumber(n: any): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

function dedupe(list: string[]) {
  const out: string[] = [];
  for (const u of list) {
    const s = String(u || "").trim();
    if (!s) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

function getImagesLite(root: any): string[] {
  const listRaw: string[] = [];

  const add = (u: any) => {
    const abs = toAbsUploads(u);
    if (!abs) return;
    if (IMG_RE_LITE.test(abs)) listRaw.push(abs);
  };

  add(root?.image);

  // BE trả: images = [{id,url,productId}, ...]
  if (Array.isArray(root?.images)) {
    for (const it of root.images) {
      if (typeof it === "string") add(it);
      else if (it && typeof it === "object") add(it.url);
    }
  }

  const list = dedupe(listRaw);
  return list.length ? list.slice(0, 24) : ["/placeholder.jpg"];
}

function hasBase64InRoot(root: any): boolean {
  const isB64 = (s: any) => typeof s === "string" && /^data:image\//i.test(s.trim());
  if (isB64(root?.image)) return true;
  if (Array.isArray(root?.images)) {
    return root.images.some((it: any) => isB64(it) || (it && typeof it === "object" && isB64(it.url)));
  }
  return false;
}

function computeDiscount(originalPrice?: number, salePrice?: number) {
  const o = Number(originalPrice || 0);
  const s = Number(salePrice || 0);
  if (!Number.isFinite(o) || !Number.isFinite(s) || o <= 0 || s <= 0) return 0;
  if (o <= s) return 0;
  return Math.round(((o - s) / o) * 100);
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
        hex: c?.hex ? String(c.hex).trim() : undefined,
      }))
      .filter((c: any) => c.name.length > 0);

    const specsRaw = Array.isArray(root?.specs) ? root.specs : [];
    const specs = specsRaw
      .map((s: any) => ({
        label: String(s?.label || "").trim(),
        value: String(s?.value || "").trim(),
      }))
      .filter((s: any) => s.label.length > 0);

    const category =
      root?.categories?.[0]?.name ||
      root?.categories?.[0]?.label ||
      root?.categories?.[0]?.slug ||
      undefined;

    // BE: price/original_price có thể là string
    const salePrice = coerceNumber(root?.salePrice ?? root?.sale_price ?? root?.price);
    const originalRaw = coerceNumber(root?.originalPrice ?? root?.original_price ?? 0);

    // nếu BE có original_price thì dùng, không thì coi = salePrice
    const originalPrice = originalRaw > 0 ? Math.max(originalRaw, salePrice) : salePrice;

    const discountPercent =
      Number.isFinite(Number(root?.discount_percent)) && Number(root?.discount_percent) > 0
        ? Number(root.discount_percent)
        : computeDiscount(originalPrice, salePrice);

    return {
      id: String(root?.id ?? ""),
      name: root?.name ?? "Sản phẩm",
      slug: root?.slug ?? slug,

      price: salePrice, // giữ tương thích
      salePrice,
      originalPrice,
      discountPercent,

      image: images[0],
      images,
      hasBase64Images,

      sku: root?.sku ?? null,
      colors,
      specs: specs.length ? specs : undefined,
      description: typeof root?.description === "string" ? root.description : null,
      category,
    };
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
            <div className="w-full mb-4 bg-gray-200 aspect-square rounded-xl" />
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
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const p = await params;
  const slug = p.slug;

  const product = await fetchProductCoreBySlug(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div>
          <ProductGalleryShell
            slug={product.slug || slug}
            alt={product.name}
            initialImages={product.images}
            shouldLoadBase64={product.hasBase64Images}
            apiBase={BASE}
            imgReFull={IMG_RE_FULL.source}
          />
        </div>

        <div>
          <ProductInfoSection product={product} />
        </div>
      </div>

      <Suspense fallback={<SuggestedSkeleton />}>
        <SuggestedSectionClient productId={product.id} limit={4} />
      </Suspense>
    </div>
  );
}
