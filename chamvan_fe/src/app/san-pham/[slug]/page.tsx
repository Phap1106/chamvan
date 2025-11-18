//src/app/san-pham/[slug]/page.tsx
import Image from "next/image";
import ProductInfoSection from "./ProductInfoSection";
import ProductGallery from "@/components/ProductGallery";
import { notFound } from "next/navigation";

// --- Types ---
export type UIProduct = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;   // Ảnh đại diện (cho các component cũ)
  images: string[]; // Full danh sách ảnh (cho Gallery)
  sku?: string;
  colors?: { name: string; hex: string }[];
  description?: string;
  specs?: { label: string; value: string }[];
  category?: string;
};

// --- Config ---
const BASE = "https://api.chamvan.com/api";

// --- Helpers ---
function getImages(root: any): string[] {
  const list: string[] = [];

  // 1. Ưu tiên ảnh đại diện
  if (root.image && typeof root.image === 'string' && root.image.startsWith('http')) {
    list.push(root.image);
  }

  // 2. Lấy thêm từ bảng images (nếu có)
  if (Array.isArray(root.images)) {
    root.images.forEach((img: any) => {
      const url = typeof img === 'string' ? img : img.url;
      if (url && typeof url === 'string' && !list.includes(url)) {
        list.push(url);
      }
    });
  }

  // 3. Nếu danh sách rỗng -> Fallback
  if (list.length === 0) list.push("/placeholder.jpg");
  
  return list;
}

function coerceNumber(n: any): number {
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

// --- API Fetching ---
async function fetchProductBySlug(slug: string): Promise<UIProduct | null> {
  try {
    // Gọi API: NestJS Controller của bạn đã hỗ trợ tìm theo cả ID và Slug
    const res = await fetch(`${BASE}/products/${slug}`, { cache: "no-store" });
    
    if (!res.ok) {
      console.error(`Fetch product failed: ${res.status}`);
      return null;
    }
    
    const root = await res.json();
    const images = getImages(root);

    return {
      id: String(root.id),
      name: root.name ?? "Sản phẩm",
      price: coerceNumber(root.price),
      image: images[0], // Ảnh đầu tiên làm ảnh đại diện
      images: images,   // Full list cho Gallery
      sku: root.sku,
      colors: (root.colors ?? []).map((c: any) => ({ name: c?.name || "", hex: c?.hex || "" })),
      description: root.description,
      specs: (root.specs ?? []).map((s: any) => ({ label: s?.label || "", value: s?.value || "" })),
      category: root.categories?.[0]?.name,
    };
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

async function fetchSuggested(productId: string): Promise<UIProduct[]> {
  try {
    const res = await fetch(`${BASE}/products/${productId}/recommendations?limit=4`, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json();
    
    // Gộp related và suggested
    const raw = [
      ...(Array.isArray(json.related) ? json.related : []),
      ...(Array.isArray(json.suggested) ? json.suggested : [])
    ];

    // Lọc trùng ID
    const seen = new Set();
    return raw
      .filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, 4)
      .map((item: any) => {
         const imgs = getImages(item);
         return {
            id: String(item.id),
            name: item.name,
            price: coerceNumber(item.price),
            image: imgs[0],
            images: imgs,
            sku: item.sku,
            slug: item.slug
         } as UIProduct;
      });
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return [];
  }
}

// --- Page Component ---
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params; // Await params (cho Next.js 15+)

  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const suggested = await fetchSuggested(product.id);

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* Cột Trái: Gallery */}
        <div>
           <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Cột Phải: Thông tin & Mua hàng */}
        <div>
           <ProductInfoSection product={product} />
        </div>
      </div>

      {/* Phần Gợi ý */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900 tracking-tight">
          Có thể bạn cũng thích
        </h2>

        {suggested.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {suggested.map((p) => (
              <a 
                key={p.id} 
                // Ưu tiên dùng slug nếu có, fallback về ID
                href={`/san-pham/${(p as any).slug || p.id}`} 
                className="group block"
              >
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                  <Image
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed group-hover:text-blue-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-sm font-bold text-gray-900">
                    {p.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Chưa có sản phẩm gợi ý phù hợp.</p>
        )}
      </div>
    </div>
  );
}