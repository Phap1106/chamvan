"use client";

import Link from "next/link";
import { useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: { name: string; hex: string }[];
  category: string;
};

export default function ProductHover({
  product,
  href,
  priceRenderer,
}: {
  product: Product;
  href: string;
  priceRenderer: (v: number) => string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={href}
      className="block group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Ảnh to, tỉ lệ 4/5, không viền, không bo góc */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />

        {/* Swatches hiện khi hover */}
        <div
          className={[
            "absolute left-0 right-0 bottom-0 translate-y-full bg-white/90 px-3 py-2 backdrop-blur transition-transform duration-200",
            hover ? "translate-y-0" : "",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            {product.colors.slice(0, 6).map((c) => (
              <span
                key={c.hex}
                className="block w-4 h-4 border rounded-full border-black/10"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 6 && (
              <span className="text-xs text-neutral-500">
                +{product.colors.length - 6}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tên + giá dưới ảnh */}
      <div className="mt-3">
        <h3 className="line-clamp-1 text-[15px] font-medium text-neutral-900">
          {product.name}
        </h3>
        <div className="mt-1 text-sm font-semibold text-neutral-900">
          {priceRenderer(product.price)}
        </div>
      </div>
    </Link>
  );
}
