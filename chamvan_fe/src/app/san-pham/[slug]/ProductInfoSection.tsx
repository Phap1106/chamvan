// // src/app/san-pham/[slug]/ProductInfoSection.tsx
// "use client";

// import { useMemo, useState } from "react";
// import ReactMarkdown from "react-markdown";

// import AddToCartButton from "@/components/AddToCartButton";
// import QtyStepper from "@/components/QtyStepper";
// import ColorSwatches from "@/components/ColorSwatches";
// import ShareButton from "@/components/ShareButton";
// import WishlistButton from "@/components/WishlistButton";

// type P = {
//   id: string;
//   name: string;
//   price: number;
//   image?: string;
//   sku?: string;
//   colors?: { name: string; hex: string }[];
//   description?: string;
//   specs?: { label: string; value: string }[];
//   category?: string;
//   slug?: string;
// };

// export default function ProductInfoSection({ product }: { product: P }) {
//   const p = product;

//   const firstHex =
//     p.colors?.find((c) => typeof c.hex === "string" && c.hex.trim().length > 0)
//       ?.hex || undefined;

//   const [colorHex, setColorHex] = useState<string | undefined>(firstHex);
//   const [qty, setQty] = useState<number>(1);
//   const [expanded, setExpanded] = useState(false);

//   const desc = useMemo(
//     () =>
//       p.description ??
//       "Sản phẩm gỗ thủ công hoàn thiện tỉ mỉ, bền bỉ và tiện dụng cho không gian sống hiện đại.",
//     [p.description]
//   );

//   const priceStr = useMemo(
//     () => p.price.toLocaleString("vi-VN") + " ₫",
//     [p.price]
//   );

//   const sharePath = `/san-pham/${p.slug || p.id}`;

//   return (
//     <div className="md:sticky md:top-20">
//       <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
//       <div className="mt-2 text-xl font-medium">{priceStr}</div>

//       {p.sku && (
//         <div className="mt-1 text-sm text-neutral-500">
//           Mã sản phẩm: {p.sku}
//         </div>
//       )}

//       {!!p.colors?.length && (
//         <div className="mt-6">
//           <div className="mb-2 text-sm font-medium">MÀU SẮC</div>
//           <ColorSwatches
//             colors={p.colors}
//             value={colorHex}
//             onChange={setColorHex}
//           />
//         </div>
//       )}

//       <div className="flex items-center gap-4 mt-6">
//         <QtyStepper value={qty} onChange={setQty} />
//         <AddToCartButton
//           productId={p.id}
//           name={p.name}
//           price={p.price}
//           image={p.image || "/placeholder.jpg"}
//           qty={qty}
//           color={colorHex}
//         />
//       </div>

//       <div className="flex items-center gap-4 mt-4 text-sm">
//         <ShareButton path={sharePath} title={p.name} />
//         <WishlistButton productId={p.id} />
//       </div>

//       <hr className="my-6 border-neutral-200" />

//       <div className="flex gap-8 text-sm font-medium">
//         <a href="#description" className="pb-2 border-b-2 border-neutral-900">
//           Mô tả sản phẩm
//         </a>
//         <a
//           href="#specifications"
//           className="pb-2 text-neutral-500 hover:text-neutral-800"
//         >
//           Đặc điểm
//         </a>
//       </div>

//       {/* MÔ TẢ – hỗ trợ Markdown */}
//       <div id="description" className="mt-4">
//         <div className="relative text-sm leading-7 text-neutral-700">
//           <div
//             className={
//               expanded ? "space-y-2" : "space-y-2 max-h-[11rem] overflow-hidden"
//             }
//           >
//             <ReactMarkdown
//               components={{
//                 p: (props) => <p className="whitespace-pre-wrap" {...props} />,
//                 ul: (props) => <ul className="ml-5 space-y-1 list-disc" {...props} />,
//                 ol: (props) => <ol className="ml-5 space-y-1 list-decimal" {...props} />,
//                 li: (props) => <li {...props} />,
//               }}
//             >
//               {desc}
//             </ReactMarkdown>
//           </div>

//           {!expanded && (
//             <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none bg-gradient-to-t from-white to-transparent" />
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={() => setExpanded((v) => !v)}
//           className="mt-2 text-sm font-medium underline underline-offset-2"
//           aria-expanded={expanded}
//         >
//           {expanded ? "Thu gọn" : "Xem thêm"}
//         </button>
//       </div>

//       {/* ĐẶC ĐIỂM / THÔNG SỐ – hỗ trợ Markdown ở value */}
//       <div id="specifications" className="mt-8">
//         {p.specs && p.specs.length > 0 ? (
//           <div className="overflow-hidden border rounded-md">
//             {p.specs.map((s, i) => (
//               <div
//                 key={i}
//                 className="grid grid-cols-2 text-sm border-b last:border-b-0"
//               >
//                 <div className="px-4 py-3 bg-neutral-50">{s.label}</div>
//                 <div className="px-4 py-3">
//                   <div className="space-y-1 text-neutral-800">
//                     <ReactMarkdown
//                       components={{
//                         p: (props) => <p className="whitespace-pre-wrap" {...props} />,
//                         ul: (props) => <ul className="ml-4 list-disc space-y-0.5" {...props} />,
//                         ol: (props) => <ol className="ml-4 list-decimal space-y-0.5" {...props} />,
//                         li: (props) => <li {...props} />,
//                       }}
//                     >
//                       {s.value}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-sm text-neutral-600">Thông số sẽ được cập nhật.</div>
//         )}
//       </div>
//     </div>
//   );
// }










"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import AddToCartButton from "@/components/AddToCartButton";
import QtyStepper from "@/components/QtyStepper";
import ColorSwatches from "@/components/ColorSwatches";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";

type P = {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  colors?: { name: string; hex: string }[];
  description?: string;
  specs?: { label: string; value: string }[];
  category?: string;
  slug?: string;
};

const API_BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";
  return String(raw).replace(/\/+$/, "");
})();

export default function ProductInfoSection({ product }: { product: P }) {
  const p = product;

  const firstHex =
    p.colors?.find((c) => typeof c.hex === "string" && c.hex.trim().length > 0)
      ?.hex || undefined;

  const [colorHex, setColorHex] = useState<string | undefined>(firstHex);
  const [qty, setQty] = useState<number>(1);
  const [expanded, setExpanded] = useState(false);

  // ✅ Lazy-load mô tả/specs để trang hiển thị nhanh trước
  const [descRemote, setDescRemote] = useState<string | undefined>(p.description);
  const [specsRemote, setSpecsRemote] = useState<
    { label: string; value: string }[] | undefined
  >(p.specs);

  const [loadingExtra, setLoadingExtra] = useState<boolean>(
    !p.description && !p.specs
  );

  useEffect(() => {
    if (!API_BASE || !p.slug) return;

    // đã có dữ liệu thì thôi
    if (p.description || (p.specs && p.specs.length > 0)) return;

    let alive = true;
    setLoadingExtra(true);

    fetch(`${API_BASE}/products/${encodeURIComponent(p.slug)}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((root) => {
        if (!alive || !root) return;

        const d =
          typeof root?.description === "string" ? root.description : undefined;

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
  }, [p.slug, p.description, p.specs]);

  const desc = useMemo(
    () =>
      descRemote ??
      (loadingExtra
        ? "Đang tải mô tả sản phẩm…"
        : "Sản phẩm gỗ thủ công hoàn thiện tỉ mỉ, bền bỉ và tiện dụng cho không gian sống hiện đại."),
    [descRemote, loadingExtra]
  );

  const priceStr = useMemo(
    () => p.price.toLocaleString("vi-VN") + " ₫",
    [p.price]
  );

  const sharePath = `/san-pham/${p.slug || p.id}`;

  return (
    <div className="md:sticky md:top-20">
      <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
      <div className="mt-2 text-xl font-medium">{priceStr}</div>

      {p.sku && (
        <div className="mt-1 text-sm text-neutral-500">
          Mã sản phẩm: {p.sku}
        </div>
      )}

      {!!p.colors?.length && (
        <div className="mt-6">
          <div className="mb-2 text-sm font-medium">MÀU SẮC</div>
          <ColorSwatches
            colors={p.colors}
            value={colorHex}
            onChange={setColorHex}
          />
        </div>
      )}

      <div className="flex items-center gap-4 mt-6">
        <QtyStepper value={qty} onChange={setQty} />
        <AddToCartButton
          productId={p.id}
          name={p.name}
          price={p.price}
          image={p.image || "/placeholder.jpg"}
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
        <a
          href="#specifications"
          className="pb-2 text-neutral-500 hover:text-neutral-800"
        >
          Đặc điểm
        </a>
      </div>

      <div id="description" className="mt-4">
        <div className="relative text-sm leading-7 text-neutral-700">
          <div
            className={
              expanded ? "space-y-2" : "space-y-2 max-h-[11rem] overflow-hidden"
            }
          >
            <ReactMarkdown
              components={{
                p: (props) => <p className="whitespace-pre-wrap" {...props} />,
                ul: (props) => (
                  <ul className="ml-5 space-y-1 list-disc" {...props} />
                ),
                ol: (props) => (
                  <ol className="ml-5 space-y-1 list-decimal" {...props} />
                ),
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
              <div
                key={i}
                className="grid grid-cols-2 text-sm border-b last:border-b-0"
              >
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
