// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// interface ProductGalleryProps {
//   images: string[];
//   alt: string;
// }

// export default function ProductGallery({ images, alt }: ProductGalleryProps) {
//   // State lưu index của ảnh đang chọn
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Đảm bảo luôn có ít nhất 1 ảnh (fallback)
//   const list = images && images.length > 0 ? images : ["/placeholder.jpg"];

//   // Reset về ảnh đầu tiên nếu danh sách ảnh thay đổi (khi chuyển sản phẩm khác)
//   useEffect(() => {
//     setActiveIndex(0);
//   }, [images]);

//   // Lấy ảnh hiện tại (Safety check)
//   const currentImage = list[activeIndex] || list[0];

//   return (
//     <div className="flex flex-col w-full gap-4">
//       {/* --- ẢNH CHÍNH (LỚN) --- */}
//       <div className="relative w-full overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square rounded-2xl group">
//         <Image
//           src={currentImage}
//           alt={alt}
//           fill
//           className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
//           priority // Ưu tiên tải ảnh này vì nó nằm ở đầu trang (LCP)
//           sizes="(min-width: 1024px) 50vw, 100vw"
//         />
//       </div>

//       {/* --- DANH SÁCH ẢNH NHỎ (THUMBNAILS) --- */}
//       {list.length > 1 && (
//         <div className="grid grid-cols-5 gap-3">
//           {list.map((src, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveIndex(index)}
//               className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
//                 index === activeIndex
//                   ? "border-black ring-1 ring-black/10 opacity-100"
//                   : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
//               }`}
//               aria-label={`Xem ảnh chi tiết ${index + 1}`}
//             >
//               <Image
//                 src={src}
//                 alt={`${alt} - thumbnail ${index + 1}`}
//                 fill
//                 className="object-cover"
//                 sizes="100px" // Ảnh nhỏ nên chỉ cần size nhỏ
//               />
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }








"use client";

import { useEffect, useMemo, useState } from "react";

type ImgLike = string | { url?: string | null } | null | undefined;

// nhận: http(s), data:image, và đường dẫn nội bộ bắt đầu bằng /
const IMG_RE = /^(https?:\/\/|data:image\/|\/)/i;

function toSrc(v: ImgLike): string | null {
  if (!v) return null;
  if (typeof v === "string") return v.trim();
  if (typeof v === "object" && typeof v.url === "string") return v.url.trim();
  return null;
}

function normalizeImages(input: ImgLike[] | undefined): string[] {
  const list = (input ?? [])
    .map(toSrc)
    .filter((s): s is string => !!s && IMG_RE.test(s));

  const uniq = Array.from(new Set(list));
  return uniq.length ? uniq : ["/placeholder.jpg"];
}

export default function ProductGallery({
  images,
  alt,
}: {
  images: ImgLike[]; // nhận cả string[] hoặc {url}[]
  alt: string;
}) {
  const list = useMemo(() => normalizeImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  // reset khi đổi sản phẩm / đổi list
  useEffect(() => {
    setActiveIndex(0);
  }, [list.join("|")]);

  const currentImage = list[activeIndex] || list[0];

  return (
    <div className="flex flex-col w-full gap-4">
      {/* ẢNH CHÍNH */}
      <div className="relative w-full overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square rounded-2xl group">
        <img
          src={currentImage}
          alt={alt}
          className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* THUMBNAILS */}
      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {list.map((src, index) => (
            <button
              key={`${src}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? "border-black ring-1 ring-black/10 opacity-100"
                  : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Xem ảnh chi tiết ${index + 1}`}
            >
              <img
                src={src}
                alt={`${alt} - thumbnail ${index + 1}`}
                className="absolute inset-0 object-cover w-full h-full"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
