// src/components/StoryPoster.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import storyPoster from '@/app/img/about/banner.webp';

export default function StoryPoster() {
  return (
    <section className="w-full bg-[#f7f4ef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 md:py-14">
        <div className="relative h-[70vh] min-h-[520px] max-h-[760px] w-full overflow-hidden">
          {/* Ảnh hero */}
          <Image
            src={storyPoster}
            alt="Không gian tượng gỗ Chạm Vân"
            fill
            priority
            className="object-cover"
          />

          {/* Khối text */}
          <div className="relative flex h-full items-center">
            <div
              className="
                ml-2 sm:ml-4 md:ml-8
                bg-[#151515]/78
                text-white
                px-6 py-7 sm:px-8 sm:py-8
                max-w-[360px] sm:max-w-[400px]
                rounded-lg
                shadow-[0_20px_55px_rgba(15,23,42,0.45)]
              "
            >
              <p className="text-[10px] tracking-[0.28em] uppercase text-white/65">
                Chạm Vân · Câu chuyện
              </p>

              <h2
                className="
                  mt-3
                  text-xl sm:text-2xl
                  font-semibold
                  leading-snug
                  tracking-[0.12em]
                  uppercase
                "
              >
                Tinh hoa gỗ thủ công
              </h2>

              <p className="mt-1 text-[11px] sm:text-xs tracking-[0.26em] uppercase text-white/80">
                Trong một khung hình
              </p>

              <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-white/88">
                Góc nhìn cô đọng về những dáng gỗ mộc, ấm và tinh xảo, dễ hòa
                cùng phòng khách, cửa hàng hoặc góc làm việc của bạn.
              </p>

              <Link
                href="/cau-chuyen-cham-van"
                className="
                  mt-5
                  inline-flex items-center justify-center
                  rounded-full
                  border border-white/85
                  bg-white
                  px-4 sm:px-5 py-1.5
                  text-[11px] sm:text-xs
                  font-medium
                  tracking-[0.16em] uppercase
                  text-zinc-900
                  shadow-sm
                  transition
                  hover:-translate-y-[1px]
                  hover:shadow-md
                  hover:bg-[#f3f2ef]
                  active:translate-y-0
                  active:shadow-sm
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-offset-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-[#151515]
                "
              >
                Xem thêm câu chuyện Chạm Vân
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
