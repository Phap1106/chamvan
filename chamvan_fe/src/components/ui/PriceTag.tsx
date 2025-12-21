"use client";

import React from "react";

function formatVND(n: number) {
  if (!Number.isFinite(n)) return "0 ₫";
  return n.toLocaleString("vi-VN") + " ₫";
}

export default function PriceTag({
  price,
  originalPrice,
  discountPercent,
  className = "",
}: {
  price: number;
  originalPrice?: number | null;
  discountPercent?: number;
  className?: string;
}) {
  const showDiscount =
    !!originalPrice && originalPrice > price && (discountPercent ?? 0) > 0;

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div className="text-2xl font-semibold tracking-tight">
        {formatVND(price)}
      </div>

      {showDiscount && (
        <>
          <div className="mb-1 text-sm line-through text-zinc-500">
            {formatVND(originalPrice!)}
          </div>
          <div className="mb-1">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              -{discountPercent}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}
