import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: {id:number;name:string;price:number;image:string}[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
