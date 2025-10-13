import ProductGrid from '@/components/ProductGrid';
import { byTag } from '@/lib/products';

export default function HangMoiPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Sản phẩm mới</h1>
      <ProductGrid products={byTag('hang-moi')} />
    </div>
  );
}
