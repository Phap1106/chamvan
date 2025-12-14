// //src/app/san-pham/[slug]/page.tsx
// import Image from "next/image";
// import ProductInfoSection from "./ProductInfoSection";
// import ProductGallery from "@/components/ProductGallery";
// import { notFound } from "next/navigation";

// // --- Types ---
// export type UIProduct = {
//   id: string;
//   name: string;
//   slug?: string;
//   price: number;
//   image?: string;   
//   images: string[]; // Full danh sách ảnh (Gallery)
//   sku?: string;
//   colors?: { name: string; hex: string }[];
//   description?: string;
//   specs?: { label: string; value: string }[];
//   category?: string;
// };

// // --- Config ---
// // const BASE = "https://api.chamvan.com/api";
// const BASE = "http://localhost:4000/api";
// // --- Helper: Chuẩn hóa URL ảnh từ API (Fix lỗi không hiển thị gallery) ---
// function getImages(root: any): string[] {
//   const list: string[] = [];
  
//   // 1. Lấy ảnh chính (string)
//   if (root.image && typeof root.image === 'string' && root.image.startsWith('http')) {
//     list.push(root.image);
//   }

//   // 2. Lấy ảnh từ mảng quan hệ 'images' (Array of objects)
//   if (Array.isArray(root.images)) {
//     root.images.forEach((img: any) => {
//       const url = img?.url; // Lấy url từ object TypeORM
      
//       // Chỉ thêm nếu là URL hợp lệ, không trùng và không phải ảnh chính (đã có ở list[0])
//       if (url && typeof url === 'string' && url.startsWith('http') && !list.includes(url)) {
//         list.push(url);
//       }
//     });
//   }

//   // 3. Fallback nếu không có ảnh nào
//   if (list.length === 0) list.push("/placeholder.jpg");
  
//   return list;
// }

// function coerceNumber(n: any): number {
//   const num = Number(n);
//   return Number.isFinite(num) ? num : 0;
// }

// // --- API Fetching ---
// async function fetchProductBySlug(slug: string): Promise<UIProduct | null> {
//   try {
//     const res = await fetch(`${BASE}/products/${slug}`, { cache: "no-store" });
    
//     if (!res.ok) {
//       console.error(`Fetch product failed: ${res.status}`);
//       return null;
//     }
    
//     const root = await res.json();
//     const images = getImages(root); // Dùng helper đã fix

//     return {
//       id: String(root.id),
//       name: root.name ?? "Sản phẩm",
//       price: coerceNumber(root.price),
//       image: images[0],
//       images: images,   // Full list cho Gallery
//       sku: root.sku,
//       colors: (root.colors ?? []).map((c: any) => ({ name: c?.name || "", hex: c?.hex || "" })),
//       description: root.description,
//       specs: (root.specs ?? []).map((s: any) => ({ label: s?.label || "", value: s?.value || "" })),
//       category: root.categories?.[0]?.name,
//       slug: root.slug
//     };
//   } catch (err) {
//     console.error("Error fetching product:", err);
//     return null;
//   }
// }

// async function fetchSuggested(productId: string): Promise<UIProduct[]> {
//   try {
//     const res = await fetch(`${BASE}/products/${productId}/recommendations?limit=4`, { cache: "no-store" });
//     if (!res.ok) return [];

//     const json = await res.json();
    
//     const raw = [
//       ...(Array.isArray(json.related) ? json.related : []),
//       ...(Array.isArray(json.suggested) ? json.suggested : [])
//     ];

//     const seen = new Set();
//     return raw
//       .filter(item => {
//         if (seen.has(item.id)) return false;
//         seen.add(item.id);
//         return true;
//       })
//       .slice(0, 4)
//       .map((item: any) => {
//          const imgs = getImages(item);
//          return {
//             id: String(item.id),
//             name: item.name,
//             price: coerceNumber(item.price),
//             image: imgs[0],
//             images: imgs,
//             sku: item.sku,
//             slug: item.slug
//          } as UIProduct;
//       });
//   } catch (err) {
//     console.error("Error fetching suggestions:", err);
//     return [];
//   }
// }

// // --- Page Component ---
// export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
//   const { slug } = await params;

//   const product = await fetchProductBySlug(slug);
//   if (!product) notFound();

//   const suggested = await fetchSuggested(product.id);

//   return (
//     <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12">
//       <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
//         {/* Cột Trái: Gallery - Đảm bảo nhận mảng URL strings */}
//         <div>
//            <ProductGallery images={product.images} alt={product.name} />
//         </div>

//         {/* Cột Phải: Thông tin & Mua hàng */}
//         <div>
//            <ProductInfoSection product={product} />
//         </div>
//       </div>

//       {/* Phần Gợi ý */}
//       <div className="pt-16 mt-24 border-t border-gray-100">
//         <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
//           Có thể bạn cũng thích
//         </h2>

//         {suggested.length > 0 ? (
//           <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
//             {suggested.map((p) => (
//               <a 
//                 key={p.id} 
//                 href={`/san-pham/${p.slug || p.id}`} 
//                 className="block group"
//               >
//                 <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
//                   <Image
//                     src={p.image || "/placeholder.jpg"}
//                     alt={p.name}
//                     fill
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                     sizes="(min-width: 768px) 25vw, 50vw"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <h3 className="text-sm font-medium leading-relaxed text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-700">
//                     {p.name}
//                   </h3>
//                   <div className="text-sm font-bold text-gray-900">
//                     {p.price.toLocaleString("vi-VN")} ₫
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm italic text-gray-500">Chưa có sản phẩm gợi ý phù hợp.</p>
//         )}
//       </div>
//     </div>
//   );
// }


// src/app/san-pham/[slug]/page.tsx
import Link from "next/link";
import ProductInfoSection from "./ProductInfoSection";
import ProductGallery from "@/components/ProductGallery";
import { notFound } from "next/navigation";

// --- Types ---
export type UIProduct = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  images: string[]; // Full danh sách ảnh (Gallery)
  sku?: string;
  colors?: { name: string; hex: string }[];
  description?: string;
  specs?: { label: string; value: string }[];
  category?: string;
};

// --- Config ---
// const BASE = "https://api.chamvan.com/api";
const BASE = "http://localhost:4000/api";

// Accept: http(s), data:image (base64), và đường dẫn nội bộ '/'
const IMG_RE = /^(https?:\/\/|data:image\/|\/)/i;

function coerceNumber(n: any): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

// --- Helper: Chuẩn hóa danh sách ảnh từ API (FIX base64 + url) ---
function getImages(root: any): string[] {
  const list: string[] = [];

  // 1) Ảnh chính: root.image (string)
  if (root?.image && typeof root.image === "string") {
    const s = root.image.trim();
    if (s && IMG_RE.test(s)) list.push(s);
  }

  // 2) Ảnh từ quan hệ images: [{url}] hoặc string[]
  if (Array.isArray(root?.images)) {
    for (const it of root.images) {
      const u =
        typeof it === "string"
          ? it
          : typeof it === "object" && typeof it?.url === "string"
            ? it.url
            : "";

      if (typeof u === "string") {
        const s = u.trim();
        if (s && IMG_RE.test(s) && !list.includes(s)) list.push(s);
      }
    }
  }

  // 3) Fallback
  if (list.length === 0) list.push("/placeholder.jpg");

  return list;
}

// --- API Fetching ---
async function fetchProductBySlug(slug: string): Promise<UIProduct | null> {
  try {
    const res = await fetch(`${BASE}/products/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch product failed: ${res.status}`);
      return null;
    }

    const root = await res.json();
    const images = getImages(root);

    const colorsRaw = Array.isArray(root?.colors) ? root.colors : [];
    const colors = colorsRaw
      .map((c: any) => ({
        name: String(c?.name || "").trim(),
        hex: String(c?.hex || "").trim(),
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

    return {
      id: String(root.id),
      name: root.name ?? "Sản phẩm",
      slug: root.slug ?? slug,
      price: coerceNumber(root.price),
      image: images[0],
      images,
      sku: root.sku,
      colors,
      description: root.description,
      specs,
      category,
    };
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

async function fetchSuggested(productId: string): Promise<UIProduct[]> {
  try {
    const res = await fetch(
      `${BASE}/products/${encodeURIComponent(productId)}/recommendations?limit=4`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];

    const json = await res.json();

    const raw = [
      ...(Array.isArray(json.related) ? json.related : []),
      ...(Array.isArray(json.suggested) ? json.suggested : []),
    ];

    const seen = new Set<string>();
    return raw
      .filter((item: any) => {
        const key = String(item?.id ?? "");
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 4)
      .map((item: any) => {
        const imgs = getImages(item);
        return {
          id: String(item.id),
          name: item.name ?? "Sản phẩm",
          slug: item.slug ?? String(item.id),
          price: coerceNumber(item.price),
          image: imgs[0],
          images: imgs,
          sku: item.sku,
        } as UIProduct;
      });
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return [];
  }
}

// --- Page Component ---
export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const suggested = await fetchSuggested(product.id);

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* Cột Trái: Gallery */}
        <div>
          {/* ProductGallery phải render được data:image/... (khuyến nghị dùng <img> trong ProductGallery) */}
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Cột Phải: Thông tin & Mua hàng */}
        <div>
          <ProductInfoSection product={product} />
        </div>
      </div>

      {/* Phần Gợi ý */}
      <div className="pt-16 mt-24 border-t border-gray-100">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
          Có thể bạn cũng thích
        </h2>

        {suggested.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {suggested.map((p) => (
              <Link
                key={p.id}
                href={`/san-pham/${p.slug || p.id}`}
                className="block group"
              >
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                  {/* Dùng <img> để chắc chắn hiển thị base64 + fbcdn (không phụ thuộc next.config.js) */}
                  <img
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium leading-relaxed text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-700">
                    {p.name}
                  </h3>
                  <div className="text-sm font-bold text-gray-900">
                    {p.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">
            Chưa có sản phẩm gợi ý phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
