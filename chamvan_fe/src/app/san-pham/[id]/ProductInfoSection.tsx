"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import QtyStepper from "@/components/QtyStepper";
import ColorSwatches from "@/components/ColorSwatches";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";
import { currencyVN } from "@/lib/products";

type P = {
  id: string;
  name: string;
  price: number;
  sku?: string;
  colors?: { name: string; hex: string }[];
  description?: string;
  specs?: { label: string; value: string }[];
  category: string;
};

export default function ProductInfoSection({ product }: { product: P }) {
  const p = product;
  const [colorHex, setColorHex] = useState<string | undefined>(p.colors?.[0]?.hex);
  const [qty, setQty] = useState<number>(1);

  const desc = useMemo(
    () => p.description ?? "Sản phẩm gỗ thủ công hoàn thiện tỉ mỉ, bền bỉ và tiện dụng cho không gian sống hiện đại.",
    [p.description]
  );

  return (
    <div className="md:sticky md:top-20">
      <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
      <div className="mt-2 text-xl font-medium">{currencyVN(p.price)}</div>
      {p.sku && <div className="mt-1 text-sm text-neutral-500">Mã sản phẩm: {p.sku}</div>}

      {/* Màu sắc */}
      {!!p.colors?.length && (
        <div className="mt-6">
          <div className="mb-2 text-sm font-medium">MÀU SẮC</div>
          <ColorSwatches colors={p.colors} value={colorHex} onChange={setColorHex} />
        </div>
      )}

      {/* Qty + Thêm giỏ */}
      <div className="flex items-center gap-4 mt-6">
        <QtyStepper value={qty} onChange={setQty} />
        {/* AddToCartButton của bạn chỉ cần productId & qty; nếu có hỗ trợ color, truyền thêm colorHex */}
        {/* <AddToCartButton productId={p.id} qty={qty} color={colorHex} /> */}
        <AddToCartButton productId={p.id} qty={qty} />
      </div>

      {/* Share + Wishlist */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <ShareButton path={`/san-pham/${p.id}`} title={p.name} />
        <WishlistButton productId={p.id} />
      </div>

      {/* Divider */}
      <hr className="my-6 border-neutral-200" />

      {/* Tabs head */}
      <div className="flex gap-8 text-sm font-medium">
        <a href="#description" className="pb-2 border-b-2 border-neutral-900">Mô tả sản phẩm</a>
        <a href="#specifications" className="pb-2 text-neutral-500 hover:text-neutral-800">Đặc điểm</a>
      </div>

      {/* Description */}
      <div id="description" className="mt-4 leading-7 text-neutral-700">{desc}</div>

      {/* Specs */}
      <div id="specifications" className="mt-8">
        {p.specs?.length ? (
          <div className="overflow-hidden border rounded-md">
            {p.specs.map((s, i) => (
              <div key={i} className="grid grid-cols-2 text-sm border-b last:border-b-0">
                <div className="px-4 py-3 bg-neutral-50">{s.label}</div>
                <div className="px-4 py-3">{s.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-neutral-600">Thông số sẽ được cập nhật.</div>
        )}
      </div>
    </div>
  );
}
