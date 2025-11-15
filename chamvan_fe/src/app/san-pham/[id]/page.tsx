// // src/app/san-pham/[id]/page.tsx
// import Image from "next/image";
// import ProductInfoSection from "./ProductInfoSection";
// import { notFound } from "next/navigation";

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

// const BASE =
//   (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "") ||
//   "http://localhost:4000/api";

// /* ------------------------------- Helpers ------------------------------- */
// function firstImageUrl(images: any): string | undefined {
//   if (!images) return undefined;
//   if (Array.isArray(images) && images.length === 0) return undefined;

//   if (Array.isArray(images) && typeof images[0] === "string") {
//     return images[0];
//   }
//   if (Array.isArray(images) && typeof images[0] === "object") {
//     return images[0]?.url || images[0]?.src || images[0]?.path || images[0]?.imageUrl;
//   }
//   if (typeof images === "object") {
//     return images?.url || images?.src || images?.path || images?.imageUrl;
//   }
//   return undefined;
// }

// function coerceNumber(n: any, fallback = 0): number {
//   const num = Number(n);
//   return Number.isFinite(num) ? num : fallback;
// }

// /* ---------------------------- Fetch: chi tiết --------------------------- */
// async function fetchProduct(id: string): Promise<UIProduct | null> {
//   try {
//     const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
//     if (!res.ok) {
//       // log server-side để dễ debug (Vercel function logs)
//       console.error(`[fetchProduct] GET ${BASE}/products/${id} -> status ${res.status}`);
//       return null;
//     }
//     const p = await res.json();
//     const root = p?.data ?? p;
//     const images = root.images ?? [];

//     return {
//       id: String(root.id ?? id),
//       name: root.name ?? "Sản phẩm",
//       price: coerceNumber(root.price, 0),
//       image: firstImageUrl(images) || root.image || "/placeholder.jpg",
//       sku: root.sku,
//       colors: (root.colors ?? [])?.map((c: any) => ({ name: c?.name, hex: c?.hex })),
//       description: root.description,
//       specs: (root.specs ?? [])?.map((s: any) => ({ label: s?.label, value: s?.value })),
//       category: root.category?.name,
//     };
//   } catch (err) {
//     console.error("[fetchProduct] error", err);
//     return null;
//   }
// }

// /* -------------------------- Fetch: sản phẩm gợi ý -------------------------- */
// async function fetchSuggested(id: string, showAll: boolean): Promise<UIProduct[]> {
//   const limit = showAll ? 12 : 6;
//   try {
//     const res = await fetch(
//       `${BASE}/products/${id}/recommendations?limit=${limit}`,
//       { cache: "no-store" }
//     );
//     if (!res.ok) {
//       console.error(`[fetchSuggested] ${res.status} for ${BASE}/products/${id}/recommendations`);
//       return [];
//     }
//     const raw = await res.json();
//     const list = Array.isArray(raw)
//       ? raw
//       : Array.isArray(raw?.data)
//       ? raw.data
//       : Array.isArray(raw?.items)
//       ? raw.items
//       : Array.isArray(raw?.rows)
//       ? raw.rows
//       : [];

//     const normalized = list
//       .map((it: any) => {
//         const node = it?.product ?? it?.data ?? it ?? {};
//         const idRaw =
//           node.id ?? node.productId ?? node._id ?? it?.id ?? it?.productId ?? it?._id;
//         if (!idRaw) return null;
//         const nameRaw = node.name ?? it?.name ?? "Sản phẩm";
//         const priceRaw = node.price ?? it?.price ?? 0;
//         const imageUrl =
//           firstImageUrl(node.images) ??
//           node.image ??
//           firstImageUrl(it?.images) ??
//           it?.image ??
//           "/placeholder.jpg";
//         return {
//           id: String(idRaw),
//           name: String(nameRaw),
//           price: coerceNumber(priceRaw, 0),
//           image: imageUrl,
//         } as UIProduct;
//       })
//       .filter(Boolean) as UIProduct[];

//     return normalized.filter((p) => p.name && p.id);
//   } catch (err) {
//     console.error("[fetchSuggested] error", err);
//     return [];
//   }
// }

// /* --------------------------------- Page -------------------------------- */
// export default async function ProductDetailPage({
//   params,
//   searchParams,
// }: {
//   params: { id: string };
//   searchParams: Record<string, string | string[] | undefined>;
// }) {
//   const { id } = params;
//   const showAllSuggested = (searchParams?.["sug"] as string) === "all";

//   const product = await fetchProduct(id);
//   if (!product) {
//     // trả 404 server-side để Next render page 404
//     notFound();
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
import { notFound } from "next/navigation";

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

/* ------------------------------ BASE URL ------------------------------ */
const BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "")
    .replace(/\/+$/, "") || "https://api.chamvan/api";

/* ------------------------ Helper: lấy ảnh đúng ------------------------ */
function firstImageUrl(images: any): string | undefined {
  if (!images) return undefined;

  let url: any;

  if (Array.isArray(images)) {
    const first = images[0];
    if (!first) return undefined;

    if (typeof first === "string") url = first;
    else if (typeof first === "object")
      url = first.url || first.src || first.path || first.imageUrl;
  } else if (typeof images === "object") {
    url = images.url || images.src || images.path || images.imageUrl;
  }

  if (!url) return undefined;

  if (url.startsWith("/") || url.startsWith("uploads")) {
    return `${BASE.replace("/api", "")}${url.startsWith("/") ? url : "/" + url}`;
  }

  return url;
}

function coerceNumber(n: any, fallback = 0): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
}

/* -------------------------- Fetch chi tiết --------------------------- */
async function fetchProduct(id: string): Promise<UIProduct | null> {
  try {
    const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });

    if (!res.ok) {
      console.error(`[fetchProduct] ${res.status} → ${BASE}/products/${id}`);
      return null;
    }

    const json = await res.json();
    const root = json?.data ?? json;

    const img = firstImageUrl(root.images) || root.image;

    return {
      id: String(root.id ?? id),
      name: root.name ?? "Sản phẩm",
      price: coerceNumber(root.price, 0),
      image: img || "/placeholder.jpg",
      sku: root.sku,
      colors: (root.colors ?? []).map((c: any) => ({
        name: c?.name || "",
        hex: c?.hex || "",
      })),
      description: root.description,
      specs: (root.specs ?? []).map((s: any) => ({
        label: s?.label || "",
        value: s?.value || "",
      })),
      category: root.category?.name,
    };
  } catch (err) {
    console.error("[fetchProduct] ERROR", err);
    return null;
  }
}

/* ------------------------ Fetch sản phẩm gợi ý ------------------------ */
async function fetchSuggested(id: string, showAll: boolean): Promise<UIProduct[]> {
  const limit = showAll ? 12 : 6;

  try {
    const res = await fetch(
      `${BASE}/products/${id}/recommendations?limit=${limit}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(
        `[fetchSuggested] ${res.status} → ${BASE}/products/${id}/recommendations`
      );
      return [];
    }

    const json = await res.json();

    const raw =
      (Array.isArray(json) && json) ||
      (Array.isArray(json?.data) && json.data) ||
      (Array.isArray(json?.items) && json.items) ||
      (Array.isArray(json?.rows) && json.rows) ||
      [];

    return raw
      .map((item) => {
        const node = item?.product ?? item?.data ?? item ?? {};
        const idRaw =
          node.id ??
          node.productId ??
          node._id ??
          item.id ??
          item.productId ??
          item._id;

        if (!idRaw) return null;

        const img =
          firstImageUrl(node.images) ||
          node.image ||
          firstImageUrl(item.images) ||
          item.image;

        return {
          id: String(idRaw),
          name: String(node.name ?? item.name ?? "Sản phẩm"),
          price: coerceNumber(node.price ?? item.price, 0),
          image: img ? img : "/placeholder.jpg",
        } as UIProduct;
      })
      .filter(Boolean) as UIProduct[];
  } catch (err) {
    console.error("[fetchSuggested] ERROR", err);
    return [];
  }
}

/* --------------------------------- PAGE --------------------------------- */

export default async function ProductDetailPage({ params, searchParams }: any) {
  const p = await params;
  const sp = await searchParams;

  const id = p.id;
  const showAllSuggested = sp?.sug === "all";

  const product = await fetchProduct(id);
  if (!product) notFound();

  const suggested = await fetchSuggested(id, showAllSuggested);

  return (
    <div className="max-w-6xl px-6 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
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

        <ProductInfoSection product={product} />
      </div>

      <div className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold">Gợi ý cho bạn</h2>

          {!showAllSuggested && suggested.length >= 6 && (
            <a
              href={`/san-pham/${product.id}?sug=all`}
              className="text-sm underline"
            >
              Xem thêm
            </a>
          )}
        </div>

        {suggested.length > 0 ? (
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
