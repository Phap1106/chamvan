import type { Metadata } from "next";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import {
  PRODUCTS,
  findProduct,
  getRelated,
  getSuggestions,
  currencyVN,
} from "@/lib/products";
// client section
import ProductInfoSection from "./ProductInfoSection";

/* ========= Static Generation ========= */
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const p = findProduct(params.id);
  if (!p) return { title: "Sản phẩm không tồn tại | Chạm Vân" };

  const title = `${p.name} | Chạm Vân`;
  const desc =
    p.description ?? `Mua ${p.name} chính hãng Chạm Vân. Giá ${currencyVN(p.price)}.`;
  const url = `https://your-domain.com/san-pham/${p.id}`;
  const images = [p.image, ...(p.images ?? [])].slice(0, 1);

  return {
    title,
    description: desc,
    alternates: { canonical: `/san-pham/${p.id}` },
    openGraph: { title, description: desc, url, type: "website", images },
    twitter: { card: "summary_large_image", title, description: desc, images },
  };
}

/* ========= Page ========= */
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const p = findProduct(params.id);
  if (!p) {
    return (
      <div className="max-w-4xl px-4 py-16 mx-auto">
        <h1 className="mb-3 text-2xl font-semibold">Không tìm thấy sản phẩm</h1>
        <p className="text-neutral-600">Sản phẩm có thể đã được cập nhật hoặc tạm ngừng bán.</p>
        <div className="mt-6">
          <Link href="/tat-ca-san-pham" className="underline">← Quay lại tất cả sản phẩm</Link>
        </div>
      </div>
    );
  }

  const gallery = [p.image, ...(p.images ?? [])];
  const related = getRelated(p.id, p.category, 8);
  const suggestions = getSuggestions(p.id, 8);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.name,
    image: gallery,
    sku: p.sku ?? p.id,
    brand: { "@type": "Brand", name: "Chạm Vân" },
    description: p.description ?? "",
    offers: {
      "@type": "Offer",
      url: `https://your-domain.com/san-pham/${p.id}`,
      priceCurrency: "VND",
      price: p.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/tat-ca-san-pham" className="hover:underline">Tất cả sản phẩm</Link>
        <span className="mx-2">/</span>
        <Link href={`/trang-tri-nha/${p.category}`} className="capitalize hover:underline">
          {p.category.replace("-", " ")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{p.name}</span>
      </nav>

      {/* Header: Gallery trái, Info phải */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <ProductGallery images={gallery} alt={p.name} />
        </div>

        <div className="md:col-span-5 md:pl-4">
          <ProductInfoSection product={p} />
        </div>
      </div>

      {/* Có thể bạn quan tâm */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-center">CÓ THỂ BẠN QUAN TÂM</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((r) => (
              <Link key={r.id} href={`/san-pham/${r.id}`} className="group">
                <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="mt-3 text-sm">{r.name}</div>
                <div className="text-sm font-medium">{currencyVN(r.price)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Gợi ý sản phẩm */}
      {suggestions.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-semibold text-center">GỢI Ý SẢN PHẨM</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-[70%] md:auto-cols-[25%] gap-5">
              {suggestions.map((s) => (
                <Link key={s.id} href={`/san-pham/${s.id}`} className="group">
                  <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                  </div>
                  <div className="mt-3 text-sm">{s.name}</div>
                  <div className="text-sm font-medium">{currencyVN(s.price)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
