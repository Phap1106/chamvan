// // chamvan_fe/src/app/san-pham/[id]/page.tsx
// import type { Metadata } from "next";
// import Link from "next/link";
// import ProductGallery from "@/components/ProductGallery";
// import ProductInfoSection from "./ProductInfoSection";
// import { getJSON } from "@/lib/api";

// /* ===== Types từ BE & hàm map sang UI ===== */
// type BEColor = { name: string; hex?: string | null };
// type BEImageObj = { url?: string; src?: string; path?: string };
// type BECategory = { slug: string };
// type BEProduct = {
//   id: number | string;
//   name: string;
//   slug?: string | null;
//   price: number | string;
//   image?: string | null;
//   images?: Array<string | BEImageObj> | null;
//   colors?: BEColor[] | null;
//   description?: string | null;
//   sku?: string | null;
//   category?: string | null;
//   categories?: BECategory[] | null;
//   specs?: { label: string; value: string }[] | null;
// };

// type UIProduct = {
//   id: string;
//   name: string;
//   price: number;
//   sku?: string;
//   image: string;
//   images: string[];
//   colors: { name: string; hex: string }[];
//   description?: string;
//   category?: string;
//   specs: { label: string; value: string }[];
// };

// type UIProductLite = {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
// };

// type RecResp = {
//   related: Array<{ id: number | string; name: string; price: number; image?: string }>;
//   suggested: Array<{ id: number | string; name: string; price: number; image?: string }>;
// };

// function normalizeImages(image?: string | null, images?: Array<string | BEImageObj> | null) {
//   const raw: unknown[] = [
//     ...(image ? [image] : []),
//     ...(Array.isArray(images) ? images : []),
//   ];
//   const out = raw
//     .map((it) => {
//       if (typeof it === "string") return it.trim();
//       if (it && typeof it === "object") {
//         const anyIt = it as Record<string, unknown>;
//         const candidate =
//           (anyIt.url as string) ??
//           (anyIt.src as string) ??
//           (anyIt.path as string) ??
//           "";
//         return (candidate || "").trim();
//       }
//       return "";
//     })
//     .filter(Boolean)
//     .filter((u, i, arr) => arr.indexOf(u) === i);
//   return out as string[];
// }

// /** Chuẩn hoá dữ liệu về đúng cấu trúc UI */
// function mapToUI(p: BEProduct): UIProduct {
//   const imgs = normalizeImages(p.image ?? undefined, p.images ?? undefined);
//   const categorySlug =
//     p.category ??
//     (Array.isArray(p.categories) && p.categories.length
//       ? p.categories[0]!.slug
//       : undefined);

//   return {
//     id: String(p.id),
//     name: p.name,
//     price: Number(p.price) || 0,
//     sku: p.sku ?? undefined,
//     image: imgs[0] || "",
//     images: imgs,
//     colors: (p.colors ?? []).map((c) => ({ name: c.name, hex: c.hex ?? "" })),
//     description: p.description ?? undefined,
//     category: categorySlug ?? undefined,
//     specs: p.specs ?? [],
//   };
// }

// export const dynamic = "force-dynamic";

// /* ===== SEO metadata từ BE (params phải await) ===== */
// export async function generateMetadata(
//   props: { params: Promise<{ id: string }> }
// ): Promise<Metadata> {
//   try {
//     const { id } = await props.params;
//     const be = await getJSON<BEProduct>(`/products/${id}`);
//     const p = mapToUI(be);

//     const title = `${p.name} | Chạm Vân`;
//     const priceStr = p.price.toLocaleString("vi-VN") + " ₫";
//     const desc =
//       p.description ?? `Mua ${p.name} chính hãng Chạm Vân. Giá ${priceStr}.`;
//     const url = `https://your-domain.com/san-pham/${p.id}`;
//     const ogImages = (p.images.length ? p.images : [p.image]).slice(0, 1);

//     return {
//       title,
//       description: desc,
//       alternates: { canonical: `/san-pham/${p.id}` },
//       openGraph: { title, description: desc, url, type: "website", images: ogImages },
//       twitter: { card: "summary_large_image", title, description: desc, images: ogImages },
//     };
//   } catch {
//     return { title: "Sản phẩm không tồn tại | Chạm Vân" };
//   }
// }

// /* ===== Helpers gọi BE ===== */
// async function fetchProduct(id: string): Promise<UIProduct> {
//   const be = await getJSON<BEProduct>(`/products/${id}`);
//   return mapToUI(be);
// }

// async function fetchRecommendations(id: string) {
//   const resp = await getJSON<RecResp>(`/products/${id}/recommendations?limit=12`);
//   const mapLite = (x: { id: number | string; name: string; price: number; image?: string }): UIProductLite => ({
//     id: String(x.id),
//     name: x.name,
//     price: Number(x.price) || 0,
//     image: x.image || "",
//   });
//   return {
//     related: (resp.related || []).map(mapLite),
//     suggested: (resp.suggested || []).map(mapLite),
//   };
// }

// /* ===== Page (Server Component) ===== */
// export default async function ProductDetailPage(
//   props: {
//     params: Promise<{ id: string }>;
//     searchParams?: { [key: string]: string | string[] | undefined };
//   }
// ) {
//   const { id } = await props.params;
//   const showAllSuggested = props.searchParams?.["sug"] === "all";

//   let p: UIProduct | null = null;
//   try {
//     p = await fetchProduct(id);
//   } catch {
//     p = null;
//   }

//   if (!p) {
//     return (
//       <div className="max-w-4xl px-4 py-16 mx-auto">
//         <h1 className="mb-3 text-2xl font-semibold">Không tìm thấy sản phẩm</h1>
//         <p className="text-neutral-600">
//           Sản phẩm có thể đã được cập nhật hoặc tạm ngừng bán.
//         </p>
//         <div className="mt-6">
//           <Link href="/tat-ca-san-pham" className="underline">
//             ← Quay lại tất cả sản phẩm
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Gợi ý từ BE (12 mục cho suggested, related có thể nhiều nhưng ta chỉ lấy 4)
//   let related: UIProductLite[] = [];
//   let suggested: UIProductLite[] = [];
//   try {
//     const rec = await fetchRecommendations(p.id);
//     related = rec.related.slice(0, 4);       // luôn 4 sp
//     suggested = rec.suggested.slice(0, 12);  // tổng 12
//   } catch {
//     related = [];
//     suggested = [];
//   }

//   const jsonLd = {
//     "@context": "https://schema.org/",
//     "@type": "Product",
//     name: p.name,
//     image: p.images.length ? p.images : [p.image],
//     sku: p.sku ?? p.id,
//     brand: { "@type": "Brand", name: "Chạm Vân" },
//     description: p.description ?? "",
//     offers: {
//       "@type": "Offer",
//       url: `https://your-domain.com/san-pham/${p.id}`,
//       priceCurrency: "VND",
//       price: p.price,
//       availability: "https://schema.org/InStock",
//     },
//   };

//   // Tạo URL "Xem thêm" (giữ nguyên query cũ nếu có)
//   const moreHref = `/san-pham/${p.id}?sug=all`;
//   const visibleSuggested = showAllSuggested ? suggested : suggested.slice(0, 4);

//   return (
//     <div className="px-4 py-8 mx-auto max-w-7xl">
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       {/* Breadcrumb */}
//       <nav className="mb-6 text-sm text-neutral-500">
//         <Link href="/" className="hover:underline">Trang chủ</Link>
//         <span className="mx-2">/</span>
//         <Link href="/tat-ca-san-pham" className="hover:underline">Tất cả sản phẩm</Link>
//         {p.category && (
//           <>
//             <span className="mx-2">/</span>
//             <Link
//               href={`/tat-ca-san-pham/${p.category}`}
//               className="capitalize hover:underline"
//             >
//               {p.category.replace("-", " ")}
//             </Link>
//           </>
//         )}
//         <span className="mx-2">/</span>
//         <span className="text-neutral-700">{p.name}</span>
//       </nav>

//       {/* Header: Gallery trái, Info phải */}
//       <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
//         <div className="md:col-span-7">
//           <div className="overflow-hidden rounded-md">
//             <ProductGallery
//               images={p.images.length ? p.images : [p.image]}
//               alt={p.name}
//             />
//           </div>
//         </div>

//         <div className="md:col-span-5 md:pl-4">
//           <ProductInfoSection product={p} />
//         </div>
//       </div>

//       {/* Có thể bạn quan tâm — luôn 4 sản phẩm */}
//       {related.length > 0 && (
//         <section className="mt-16">
//           <h2 className="mb-6 text-2xl font-semibold text-center">CÓ THỂ BẠN QUAN TÂM</h2>
//           <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
//             {related.map((r) => (
//               <Link key={r.id} href={`/san-pham/${r.id}`} className="group">
//                 <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded-md">
//                   <img
//                     src={r.image}
//                     alt={r.name}
//                     className="w-full h-full object-cover group-hover:scale-[1.02] transition"
//                   />
//                 </div>
//                 <div className="mt-3 text-sm">{r.name}</div>
//                 <div className="text-sm font-medium">
//                   {r.price.toLocaleString("vi-VN")} ₫
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Gợi ý sản phẩm — tổng 12, mặc định 4; xem thêm -> 12 (3 hàng × 4) */}
//       {suggested.length > 0 && (
//         <section className="mt-14">
//           <h2 className="mb-6 text-2xl font-semibold text-center">GỢI Ý SẢN PHẨM</h2>

//           <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
//             {visibleSuggested.map((s) => (
//               <Link key={s.id} href={`/san-pham/${s.id}`} className="group">
//                 <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded-md">
//                   <img
//                     src={s.image}
//                     alt={s.name}
//                     className="w-full h-full object-cover group-hover:scale-[1.02] transition"
//                   />
//                 </div>
//                 <div className="mt-3 text-sm">{s.name}</div>
//                 <div className="text-sm font-medium">
//                   {s.price.toLocaleString("vi-VN")} ₫
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {/* Nút xem thêm chỉ hiện khi chưa mở rộng và có đủ >4 */}
//           {!showAllSuggested && suggested.length > 4 && (
//             <div className="mt-6 text-center">
//               <Link
//                 href={moreHref}
//                 className="inline-block px-5 py-2 text-sm font-medium border rounded-md hover:bg-neutral-50"
//               >
//                 Xem thêm sản phẩm gợi ý
//               </Link>
//             </div>
//           )}
//         </section>
//       )}
//     </div>
//   );
// }






// // src/app/san-pham/[id]/page.tsx
// import Image from "next/image";
// import ProductInfoSection from "./ProductInfoSection";

// /** Kiểu dữ liệu dùng cho UI */
// export type UIProduct = {
//   id: string;
//   name: string;
//   price: number;
//   image?: string;
//   sku?: string;
//   colors?: { name: string; hex: string }[];
//   description?: string;
//   specs?: { label: string; value: string }[];
//   category?: string;
// };


// const BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "http://localhost:4000/api";

// async function fetchProduct(id: string): Promise<UIProduct | null> {
//   try {
//     const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
//     if (!res.ok) return null;
//     const p = await res.json();
//     const images =
//       Array.isArray(p.images)
//         ? p.images
//         : Array.isArray(p?.data?.images)
//         ? p.data.images
//         : [];

//     return {
//       id: String(p.id ?? p?.data?.id ?? id),
//       name: p.name ?? p?.data?.name ?? "Sản phẩm",
//       price: Number((p.price ?? p?.data?.price) || 0),
//       image:
//         images?.[0]?.url ||
//         p.image ||
//         p?.data?.image ||
//         "/placeholder.jpg",
//       sku: p.sku ?? p?.data?.sku,
//       colors: (p.colors ?? p?.data?.colors)?.map((c: any) => ({ name: c.name, hex: c.hex })),
//       description: p.description ?? p?.data?.description,
//       specs: (p.specs ?? p?.data?.specs)?.map((s: any) => ({ label: s.label, value: s.value })),
//       category: p.category?.name ?? p?.data?.category?.name,
//     };
//   } catch {
//     return null;
//   }
// }

// async function fetchSuggested(id: string, showAll: boolean): Promise<UIProduct[]> {
//   const limit = showAll ? 12 : 6;
//   try {
//     const res = await fetch(`${BASE}/products/${id}/recommendations?limit=${limit}`, {
//       cache: "no-store",
//     });
//     if (!res.ok) return [];

//     const raw = await res.json();

//     // Chuẩn hoá: hỗ trợ nhiều schema trả về
//     const list =
//       Array.isArray(raw)
//         ? raw
//         : Array.isArray(raw?.data)
//         ? raw.data
//         : Array.isArray(raw?.items)
//         ? raw.items
//         : Array.isArray(raw?.rows)
//         ? raw.rows
//         : [];

//     return list.map((p: any) => ({
//       id: String(p.id),
//       name: p.name,
//       price: Number(p.price || 0),
//       image: p.images?.[0]?.url || p.image || "/placeholder.jpg",
//     }));
//   } catch {
//     return [];
//   }
// }

// export default async function ProductDetailPage(props: {
//   params: Promise<{ id: string }>;
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//   // ⚠️ Next.js App Router yêu cầu await cho dynamic props:
//   const { id } = await props.params;
//   const sp = await props.searchParams;
//   const showAllSuggested = (sp?.["sug"] as string) === "all";

//   const product = await fetchProduct(id);
//   if (!product) {
//     return (
//       <div className="max-w-5xl p-8 mx-auto">
//         <h1 className="text-xl font-semibold">Sản phẩm không tồn tại</h1>
//       </div>
//     );
//   }

//   const suggested = await fetchSuggested(id, showAllSuggested);

//   return (
//     <div className="max-w-6xl px-6 py-8 mx-auto">
//       <div className="grid gap-8 md:grid-cols-2">
//         {/* Ảnh lớn */}
//         <div>
//           <div className="relative w-full overflow-hidden border rounded-lg aspect-square">
//             <Image
//               src={product.image || "/placeholder.jpg"}
//               alt={product.name}
//               fill
//               className="object-cover"
//               sizes="(min-width: 768px) 50vw, 100vw"
//             />
//           </div>
//         </div>

//         {/* Thông tin sản phẩm */}
//         <ProductInfoSection product={product} />
//       </div>

//       {/* Đề xuất */}
//       <div className="mt-12">
//         <div className="flex items-baseline justify-between mb-4">
//           <h2 className="text-lg font-semibold">Gợi ý cho bạn</h2>
//           {!showAllSuggested && suggested.length >= 6 && (
//             <a href={`/san-pham/${product.id}?sug=all`} className="text-sm underline">
//               Xem thêm
//             </a>
//           )}
//         </div>
//         {suggested.length ? (
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {suggested.map((p) => (
//               <a
//                 key={p.id}
//                 href={`/san-pham/${p.id}`}
//                 className="overflow-hidden border rounded-lg group"
//               >
//                 <div className="relative w-full aspect-square">
//                   <Image
//                     src={p.image || "/placeholder.jpg"}
//                     alt={p.name}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-3">
//                   <div className="text-sm font-medium line-clamp-1">{p.name}</div>
//                   <div className="text-sm text-neutral-600">
//                     {p.price.toLocaleString("vi-VN")} ₫
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>
//         ) : (
//           <div className="text-sm text-neutral-600">Chưa có sản phẩm gợi ý.</div>
//         )}
//       </div>
//     </div>
//   );
// }











// src/app/san-pham/[id]/page.tsx
import Image from "next/image";
import ProductInfoSection from "./ProductInfoSection";

/** Kiểu dữ liệu dùng cho UI */
export type UIProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  colors?: { name: string; hex: string }[];
  description?: string;
  specs?: { label: string; value: string }[];
  category?: string;
};

const BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "http://localhost:4000/api";

/* ------------------------------- Helpers ------------------------------- */
function firstImageUrl(images: any): string | undefined {
  if (!images) return undefined;

  // Trường hợp mảng string URL
  if (Array.isArray(images) && typeof images[0] === "string") {
    return images[0];
  }
  // Mảng object có url/src
  if (Array.isArray(images) && typeof images[0] === "object") {
    return images[0]?.url || images[0]?.src || images[0]?.path || images[0]?.imageUrl;
  }
  // Object đơn lẻ có url/src
  if (typeof images === "object") {
    return images?.url || images?.src || images?.path || images?.imageUrl;
  }
  return undefined;
}

function coerceNumber(n: any, fallback = 0): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
}

/* ---------------------------- Fetch: chi tiết --------------------------- */
async function fetchProduct(id: string): Promise<UIProduct | null> {
  try {
    const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const p = await res.json();

    const root = p?.data ?? p; // hỗ trợ {data: {...}}
    const images = root.images ?? [];

    return {
      id: String(root.id ?? id),
      name: root.name ?? "Sản phẩm",
      price: coerceNumber(root.price, 0),
      image: firstImageUrl(images) || root.image || "/placeholder.jpg",
      sku: root.sku,
      colors: (root.colors ?? [])?.map((c: any) => ({ name: c?.name, hex: c?.hex })),
      description: root.description,
      specs: (root.specs ?? [])?.map((s: any) => ({ label: s?.label, value: s?.value })),
      category: root.category?.name,
    };
  } catch {
    return null;
  }
}

/* -------------------------- Fetch: sản phẩm gợi ý -------------------------- */
async function fetchSuggested(id: string, showAll: boolean): Promise<UIProduct[]> {
  const limit = showAll ? 12 : 6;
  try {
    const res = await fetch(
      `${BASE}/products/${id}/recommendations?limit=${limit}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];

    const raw = await res.json();

    // Chuẩn hoá list: hỗ trợ nhiều schema trả về
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.rows)
      ? raw.rows
      : [];

    // Một số BE có thể bọc mỗi item trong { product: {...} } hoặc { data: {...} }
    const normalized = list
      .map((it: any) => {
        const node = it?.product ?? it?.data ?? it ?? {};

        const idRaw =
          node.id ??
          node.productId ??
          node._id ??
          it?.id ??
          it?.productId ??
          it?._id;

        const nameRaw = node.name ?? it?.name ?? "Sản phẩm";
        const priceRaw = node.price ?? it?.price ?? 0;

        // ảnh: ưu tiên images (array/object) → image → it.image
        const imageUrl =
          firstImageUrl(node.images) ??
          node.image ??
          firstImageUrl(it?.images) ??
          it?.image ??
          "/placeholder.jpg";

        if (!idRaw) return null; // bỏ item lỗi không có id

        return {
          id: String(idRaw),
          name: String(nameRaw),
          price: coerceNumber(priceRaw, 0),
          image: imageUrl,
        } as UIProduct;
      })
      .filter(Boolean) as UIProduct[];

    // Loại thêm các phần tử thiếu name (hiếm)
    return normalized.filter((p) => p.name && p.id);
  } catch {
    return [];
  }
}

/* --------------------------------- Page -------------------------------- */
export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Giữ nguyên cách await như hiện tại để không ảnh hưởng các chỗ khác
  const { id } = await props.params;
  const sp = await props.searchParams;
  const showAllSuggested = (sp?.["sug"] as string) === "all";

  const product = await fetchProduct(id);
  if (!product) {
    return (
      <div className="max-w-5xl p-8 mx-auto">
        <h1 className="text-xl font-semibold">Sản phẩm không tồn tại</h1>
      </div>
    );
  }

  const suggested = await fetchSuggested(id, showAllSuggested);

  return (
    <div className="max-w-6xl px-6 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Ảnh lớn */}
        <div>
          <div className="relative w-full overflow-hidden border rounded-lg aspect-square">
            <Image
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <ProductInfoSection product={product} />
      </div>

      {/* Đề xuất */}
      <div className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold">Gợi ý cho bạn</h2>
          {!showAllSuggested && suggested.length >= 6 && (
            <a href={`/san-pham/${product.id}?sug=all`} className="text-sm underline">
              Xem thêm
            </a>
          )}
        </div>

        {suggested.length ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {suggested.map((p) => (
              <a
                key={p.id}
                href={`/san-pham/${p.id}`}
                className="overflow-hidden border rounded-lg group"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                  <div className="text-sm text-neutral-600">
                    {p.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-sm text-neutral-600">Chưa có sản phẩm gợi ý.</div>
        )}
      </div>
    </div>
  );
}
