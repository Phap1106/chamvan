import ProductGrid from '@/components/ProductGrid';
import { ALL_PRODUCTS } from '@/lib/products';

export default function AllProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Tất cả sản phẩm</h1>
      <ProductGrid products={ALL_PRODUCTS} />
    </div>
  );
}
