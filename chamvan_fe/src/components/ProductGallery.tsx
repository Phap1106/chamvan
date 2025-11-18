"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  // State lưu index của ảnh đang chọn
  const [activeIndex, setActiveIndex] = useState(0);

  // Đảm bảo luôn có ít nhất 1 ảnh (fallback)
  const list = images && images.length > 0 ? images : ["/placeholder.jpg"];

  // Reset về ảnh đầu tiên nếu danh sách ảnh thay đổi (khi chuyển sản phẩm khác)
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  // Lấy ảnh hiện tại (Safety check)
  const currentImage = list[activeIndex] || list[0];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* --- ẢNH CHÍNH (LỚN) --- */}
      <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
        <Image
          src={currentImage}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          priority // Ưu tiên tải ảnh này vì nó nằm ở đầu trang (LCP)
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      {/* --- DANH SÁCH ẢNH NHỎ (THUMBNAILS) --- */}
      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {list.map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? "border-black ring-1 ring-black/10 opacity-100"
                  : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Xem ảnh chi tiết ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} - thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px" // Ảnh nhỏ nên chỉ cần size nhỏ
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}