//src/components/SplitShowcase.tsx
'use client';
import show1 from '@/app/img/showcase/topic14.jpg';
import show2 from '@/app/img/showcase/topic13.jpg';
import Link from 'next/link';

export default function SplitShowcase() {
  // Chuẩn hoá import tĩnh -> string để dùng cho <img>
  const srcOf = (img: any) => (typeof img === 'string' ? img : img?.src);

  return (
    <section className="mx-auto max-w-[1400px] px-8 py-16">
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-3 text-4xl md:text-5xl uppercase font-medium tracking-[0.08em] text-black">
          Tinh hoa của<br />thủ công và sáng tạo
        </h2>
        <p className="mx-auto max-w-3xl text-[15px] leading-7 text-gray-600">
          Gốc rễ của Chạm Vân bắt nguồn từ niềm đam mê với nghề thủ công, đặc biệt là kỹ thuật sơn mài.
          Mỗi tác phẩm là sự gìn giữ tinh hoa truyền thống qua bàn tay người thợ, kết hợp cảm hứng hiện đại
          cho một không gian sống sang trọng.
        </p>
      </div>

      {/* 2 cột ảnh vuông góc */}
      <div className="grid gap-10 mt-12 md:grid-cols-2">
        {/* LEFT column */}
        <div className="space-y-4">
          {/* Card ảnh: góc vuông, có viền */}
          <div className="overflow-hidden border">
            <img
              src={srcOf(show1)}
              alt="Thủ công"
              className="h-[540px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          {/* Nút rời, góc vuông */}
          <div className="text-center">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-black px-8 md:px-10 py-3.5 text-base md:text-lg text-white tracking-wide hover:bg-black/90 transition rounded-none"
            >
              Thủ công
              <svg
                className="w-5 h-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-4">
          <div className="overflow-hidden border">
            <img
              src={srcOf(show2)}
              alt="Sáng tạo"
              className="h-[540px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          <div className="text-center">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-black px-8 md:px-10 py-3.5 text-base md:text-lg text-white tracking-wide hover:bg-black/90 transition rounded-none"
            >
              Sáng tạo
              <svg
                className="w-5 h-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
