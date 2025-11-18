// src/app/san-pham/[slug]/page.tsx

import Image from "next/image";
import ProductInfoSection from "./ProductInfoSection"; // Nhớ kiểm tra đường dẫn import này
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
const BASE = "https://api.chamvan.com/api"; // Hardcode luôn cho chắc chắn

/* ------------------------ Helper: lấy ảnh đúng ------------------------ */
function firstImageUrl(product: any): string {
  // 1. Ưu tiên ảnh đại diện (cột image)
  if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
    return product.image;
  }

  // 2. Nếu không có, lấy trong mảng images
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first.url) return first.url;
  }

  // 3. Ảnh mặc định nếu không tìm thấy
  return "https://via.placeholder.com/600x600?text=No+Image";
}

function coerceNumber(n: any, fallback = 0): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
}

/* -------------------------- Fetch chi tiết theo SLUG --------------------------- */
async function fetchProductBySlug(slug: string): Promise<UIProduct | null> {
  try {
    // Gọi API: GET /products/:slug
    const res = await fetch(`${BASE}/products/${slug}`, { cache: "no-store" });

    if (!res.ok) {
      console.error(`[fetchProduct] ${res.status} → ${BASE}/products/${slug}`);
      return null;
    }

    const root = await res.json(); // Dữ liệu trả về từ NestJS (Product Entity)

    return {
      id: String(root.id),
      name: root.name ?? "Sản phẩm",
      price: coerceNumber(root.price, 0),
      image: firstImageUrl(root), // Logic lấy ảnh mới
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
      category: root.categories?.[0]?.name, // Lấy danh mục đầu tiên
    };
  } catch (err) {
    console.error("[fetchProduct] ERROR", err);
    return null;
  }
}

/* ------------------------ Fetch sản phẩm gợi ý (Cần ID) ------------------------ */
async function fetchSuggested(productId: string): Promise<UIProduct[]> {
  try {
    // Gọi API: GET /products/:id/recommendations
    const res = await fetch(
      `${BASE}/products/${productId}/recommendations?limit=4`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const json = await res.json();
    // Xử lý mảng trả về (có thể bọc trong data hoặc trả trực tiếp)
    const raw = Array.isArray(json) ? json : (json?.data || []);

    return raw.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      price: coerceNumber(item.price, 0),
      image: firstImageUrl(item), // Tái sử dụng logic ảnh
      sku: item.sku
    }));
  } catch (err) {
    console.error("[fetchSuggested] ERROR", err);
    return [];
  }
}

/* --------------------------------- PAGE --------------------------------- */
// Lưu ý: params bây giờ là { slug: string } do đã đổi tên thư mục
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params; // Next.js 15 yêu cầu await params

  // 1. Tìm sản phẩm theo SLUG
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  // 2. Dùng ID của sản phẩm vừa tìm được để lấy gợi ý
  const suggested = await fetchSuggested(product.id);

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto md:px-6">
      {/* Phần chi tiết sản phẩm */}
      <div className="grid gap-10 md:grid-cols-2">
        {/* Cột Trái: Ảnh */}
        <div className="relative w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100 aspect-square">
          <Image
            src={product.image!}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        {/* Cột Phải: Thông tin (Client Component) */}
        <ProductInfoSection product={product} />
      </div>

      {/* Phần Gợi ý */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Có thể bạn cũng thích</h2>

        {suggested.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {suggested.map((p) => (
              <a
                key={p.id}
                // Lưu ý: Link gợi ý vẫn dùng ID nếu bạn chưa có slug cho tất cả SP, 
                // nhưng tốt nhất nên dùng slug nếu backend đã có đủ dữ liệu.
                // Ở đây tôi tạm dùng ID nếu slug chưa có, hoặc p.slug nếu API gợi ý trả về slug.
                href={`/san-pham/${(p as any).slug || p.id}`} 
                className="group block"
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-sm font-semibold text-gray-900">
                    {p.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Chưa có sản phẩm tương tự.</p>
        )}
      </div>
    </div>
  );
}