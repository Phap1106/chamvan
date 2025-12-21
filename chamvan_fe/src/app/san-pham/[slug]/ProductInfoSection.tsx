// src/app/san-pham/[slug]/ProductInfoSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import AddToCartButton from "@/components/AddToCartButton";
import QtyStepper from "@/components/QtyStepper";
import ColorSwatches from "@/components/ColorSwatches";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";
import { getApiBase, resolveImageUrl } from "@/lib/apiClient";

type P = {
  id: string;
  name: string;

  price: number;
  salePrice?: number;
  originalPrice?: number;
  discountPercent?: number;

  image?: string;
  sku?: string | null;
  colors?: { name: string; hex?: string }[];
  description?: string | null;
  specs?: { label: string; value: string }[];
  category?: string;
  slug?: string;
};

const API_BASE = getApiBase();

function formatCurrency(v: number) {
  return (Number.isFinite(v) ? v : 0).toLocaleString("vi-VN") + " ₫";
}

function computeDiscount(originalPrice?: number, salePrice?: number) {
  const o = Number(originalPrice || 0);
  const s = Number(salePrice || 0);
  if (!Number.isFinite(o) || !Number.isFinite(s) || o <= 0 || s <= 0) return 0;
  if (o <= s) return 0;
  return Math.round(((o - s) / o) * 100);
}

export default function ProductInfoSection({ product }: { product: P }) {
  const p = product;

  const firstHex =
    p.colors?.find((c) => typeof c.hex === "string" && c.hex.trim().length > 0)?.hex || undefined;

  const [colorHex, setColorHex] = useState<string | undefined>(firstHex);
  const [qty, setQty] = useState<number>(1);
  const [expanded, setExpanded] = useState(false);

  const [descRemote, setDescRemote] = useState<string | undefined>(
    typeof p.description === "string" ? p.description : undefined
  );
  const [specsRemote, setSpecsRemote] = useState<{ label: string; value: string }[] | undefined>(
    Array.isArray(p.specs) && p.specs.length ? p.specs : undefined
  );

  const shouldFetchExtra =
    Boolean(API_BASE) && Boolean(p.slug) && !descRemote && (!specsRemote || specsRemote.length === 0);

  const [loadingExtra, setLoadingExtra] = useState<boolean>(shouldFetchExtra);

  useEffect(() => {
    if (!shouldFetchExtra) return;

    let alive = true;
    setLoadingExtra(true);

    fetch(`${API_BASE}/products/${encodeURIComponent(p.slug!)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((root) => {
        if (!alive || !root) return;

        const d = typeof root?.description === "string" ? root.description : undefined;

        const specsRaw = Array.isArray(root?.specs) ? root.specs : [];
        const sp = specsRaw
          .map((s: any) => ({
            label: String(s?.label || "").trim(),
            value: String(s?.value || "").trim(),
          }))
          .filter((s: any) => s.label.length > 0);

        setDescRemote(d);
        setSpecsRemote(sp.length ? sp : undefined);
      })
      .finally(() => {
        if (alive) setLoadingExtra(false);
      });

    return () => {
      alive = false;
    };
  }, [shouldFetchExtra, p.slug]);

  const desc = useMemo(
    () =>
      descRemote ??
      (loadingExtra
        ? "Đang tải mô tả sản phẩm…"
        : "Sản phẩm gỗ thủ công hoàn thiện tỉ mỉ, bền bỉ và tiện dụng cho không gian sống hiện đại."),
    [descRemote, loadingExtra]
  );

  const salePrice = useMemo(() => Number(p.salePrice ?? p.price ?? 0), [p.salePrice, p.price]);
  const originalPrice = useMemo(() => {
    const o = Number(p.originalPrice ?? 0);
    return o > 0 ? Math.max(o, salePrice) : salePrice;
  }, [p.originalPrice, salePrice]);

  const discountPercent = useMemo(
    () => Number(p.discountPercent ?? computeDiscount(originalPrice, salePrice)),
    [p.discountPercent, originalPrice, salePrice]
  );

  const sharePath = `/san-pham/${p.slug || p.id}`;

  return (
    <div className="md:sticky md:top-20">
      <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>

      <div className="mt-3 space-y-1">
        {discountPercent > 0 ? (
          <>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <span>Giá gốc</span>
              <span className="line-through">{formatCurrency(originalPrice)}</span>
              <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                -{discountPercent}%
              </span>
            </div>
            <div className="text-2xl font-semibold text-neutral-900">{formatCurrency(salePrice)}</div>
          </>
        ) : (
          <>
            <div className="text-sm text-neutral-600">Giá</div>
            <div className="text-2xl font-semibold text-neutral-900">{formatCurrency(salePrice)}</div>
          </>
        )}
      </div>

      {p.sku ? <div className="mt-1 text-sm text-neutral-500">Mã sản phẩm: {p.sku}</div> : null}

      {!!p.colors?.length && (
        <div className="mt-6">
          <div className="mb-2 text-sm font-medium">MÀU SẮC</div>
          <ColorSwatches colors={p.colors as any} value={colorHex} onChange={setColorHex} />
        </div>
      )}

      <div className="flex items-center gap-4 mt-6">
        <QtyStepper value={qty} onChange={setQty} />
        <AddToCartButton
          productId={p.id}
          name={p.name}
          price={salePrice}
          image={resolveImageUrl(p.image)}
          qty={qty}
          color={colorHex}
        />
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <ShareButton path={sharePath} title={p.name} />
        <WishlistButton productId={p.id} />
      </div>

      <hr className="my-6 border-neutral-200" />

      <div className="flex gap-8 text-sm font-medium">
        <a href="#description" className="pb-2 border-b-2 border-neutral-900">
          Mô tả sản phẩm
        </a>
        <a href="#specifications" className="pb-2 text-neutral-500 hover:text-neutral-800">
          Đặc điểm
        </a>
      </div>

      <div id="description" className="mt-4">
        <div className="relative text-sm leading-7 text-neutral-700">
          <div className={expanded ? "space-y-2" : "space-y-2 max-h-[11rem] overflow-hidden"}>
            <ReactMarkdown
              components={{
                p: (props) => <p className="whitespace-pre-wrap" {...props} />,
                ul: (props) => <ul className="ml-5 space-y-1 list-disc" {...props} />,
                ol: (props) => <ol className="ml-5 space-y-1 list-decimal" {...props} />,
                li: (props) => <li {...props} />,
              }}
            >
              {desc}
            </ReactMarkdown>
          </div>

          {!expanded && (
            <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium underline underline-offset-2"
          aria-expanded={expanded}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>

      <div id="specifications" className="mt-8">
        {specsRemote && specsRemote.length > 0 ? (
          <div className="overflow-hidden border rounded-md">
            {specsRemote.map((s, i) => (
              <div key={i} className="grid grid-cols-2 text-sm border-b last:border-b-0">
                <div className="px-4 py-3 bg-neutral-50">{s.label}</div>
                <div className="px-4 py-3">
                  <div className="space-y-1 text-neutral-800">
                    <ReactMarkdown>{s.value}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : loadingExtra ? (
          <div className="text-sm text-neutral-600">Đang tải thông số…</div>
        ) : (
          <div className="text-sm text-neutral-600">Thông số sẽ được cập nhật.</div>
        )}
      </div>
    </div>
  );
}
