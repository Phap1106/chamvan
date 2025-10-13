import ProductGrid from '@/components/ProductGrid';
import { byTag } from '@/lib/products';

export default function QuaTangPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Gợi ý quà tặng</h1>
      <ProductGrid products={byTag('qua-tang')} />
    </div>
  );
}
