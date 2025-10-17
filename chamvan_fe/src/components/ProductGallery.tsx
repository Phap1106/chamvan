"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/placeholder.png"];

  return (
    <div>
      <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={list[active]}
          alt={alt}
          className="object-cover w-full h-full"
        />
      </div>

      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border ${
                i === active ? "border-neutral-900" : "border-transparent"
              }`}
              aria-label={`Ảnh ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} ${i + 1}`} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
