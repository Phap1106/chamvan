// src/components/CategoryHighlight.tsx
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

// Ảnh local (đổi lại đúng tên file/thư mục nếu khác)
import a1 from '@/app/img/categories/g1.png';
import a2 from '@/app/img/categories/g3.png';
import a3 from '@/app/img/categories/g2.png';

type CategoryItem = {
  title: string;
  subtitle: string;
  href: string;
  image: StaticImageData;
};

const items: CategoryItem[] = [
  {
    title: 'HÀNG MỚI',
    subtitle: 'Những thiết kế vừa cập bến',
    href: '/hang-moi',
    image: a1,
  },
  {
    title: 'QUÀ TẶNG',
    subtitle: 'Gửi gắm sự tinh tế và trân trọng',
    href: '/qua-tang',
    image: a2,
  },
  {
    title: 'TRANG TRÍ NHÀ',
    subtitle: 'Làm mới không gian sống mỗi ngày',
    href: '/trang-tri-nha',
    image: a3,
  },
];

export default function CategoryHighlight() {
  return (
    <section className="bg-white py-10 md:py-14">
      {/* full width, chừa lề 2 bên 1 ít */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative block overflow-hidden rounded-3xl
                         bg-black/80 shadow-[0_6px_18px_rgba(0,0,0,0.04)]
                         transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Ảnh nền */}
              <div className="relative h-[440px] md:h-[540px] lg:h-[650px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />

                {/* overlay nhẹ hơn một chút */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />

                <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
                  <div className="space-y-1">
                    <p className="text-[11px] md:text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">
                      CHẠM VÂN • CỔ MỘC TIỆM
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-white/80 max-w-[16rem]">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90
                                 px-4 py-2 text-xs md:text-sm font-semibold tracking-wide text-slate-900
                                 transition-colors duration-200
                                 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white"
                    >
                      XEM SẢN PHẨM
                      <span className="text-[11px] translate-y-[1px] group-hover:translate-x-[2px] transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
