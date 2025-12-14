// src/components/TopPicks.tsx
'use client';

import Image, { StaticImageData } from 'next/image';

import pick1 from '@/app/img/topics/t1.jpg';
import pick2 from '@/app/img/topics/tp/t2.jpg';
import pick3 from '@/app/img/topics/tp/t10.jpg';
import pick4 from '@/app/img/topics/tp/t7.jpg';
import pick5 from '@/app/img/topics/tp/t3.jpg';
import pick6 from '@/app/img/topics/tp/t4.jpg';
import pick7 from '@/app/img/topics/tp/t9.jpg';

type PickItem = {
  type: 'color' | 'image';
  title: string;
  frontLabel?: string;
  subtitle?: string;
  description?: string;
  dimensions?: string;
  placement?: string;
  src?: StaticImageData;
  align?: 'left' | 'right';
};

const TILE_LABEL = 'GỢI Ý NHANH';

/* ====== TILE DÙNG CHUNG ====== */

type TileProps = {
  item: PickItem;
  idx: number;
  variant: 'desktop' | 'mobile';
};

function Tile({ item, idx, variant }: TileProps) {
  const isColor = item.type === 'color';
  const alignRight = item.align === 'right';

  const radius = variant === 'desktop' ? 'rounded-3xl' : 'rounded-2xl';
  const aspect = variant === 'desktop' ? 'aspect-[3/4]' : 'aspect-[4/5]';
  const paddingX = variant === 'desktop' ? 'px-7 sm:px-10' : 'px-5';

  // ô màu hồng (chỉ dùng desktop; mobile mình sẽ không render loại này)
  if (isColor) {
    return (
      <div
        className={`
          group
          relative
          ${aspect}
          overflow-hidden
          ${radius}
          bg-[#e6afa2]
          text-white
          border border-black/5
          shadow-[0_10px_30px_rgba(15,23,42,0.08)]
          transition-all duration-300
          hover:-translate-y-[4px]
          hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]
          hover:border-black/10
          snap-start
          shrink-0
          w-[70vw] xs:w-[65vw] sm:w-[55vw] md:w-auto
        `}
      >
        {/* mặt trước */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 transition-all duration-500 sm:px-8 group-hover:opacity-0 group-hover:-translate-y-3"
        >
          <span
            className={`
              font-extrabold tracking-[0.28em] uppercase
              ${variant === 'desktop' ? 'text-xl md:text-2xl' : 'text-lg'}
            `}
          >
            {item.frontLabel}
          </span>
        </div>

        {/* mặt trong */}
        <div
          className={`
            absolute inset-0
            flex flex-col justify-center
            ${paddingX}
            opacity-0 translate-y-4
            transition-all duration-500
            group-hover:opacity-100 group-hover:translate-y-0
            ${alignRight ? 'items-end text-right' : 'items-start text-left'}
          `}
        >
          <h3
            className={`
              font-bold tracking-[0.14em] uppercase
              ${variant === 'desktop' ? 'text-2xl md:text-3xl' : 'text-lg'}
            `}
          >
            {item.title}
          </h3>
          {item.subtitle && (
            <p
              className={`
                mt-3 md:mt-4
                font-semibold opacity-95 max-w-xs
                ${variant === 'desktop' ? 'text-xs md:text-sm' : 'text-xs'}
              `}
            >
              {item.subtitle}
            </p>
          )}
          {item.description && (
            <p
              className={`
                mt-2 md:mt-3 opacity-90 max-w-md
                ${variant === 'desktop' ? 'text-xs md:text-sm' : 'text-[11px]'}
              `}
            >
              {item.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // TILE ẢNH
  return (
    <div
      className={`
        group
        relative
        ${aspect}
        overflow-hidden
        ${radius}
        bg-zinc-100
        border border-black/5
        shadow-[0_10px_30px_rgba(15,23,42,0.08)]
        transition-all duration-300
        hover:-translate-y-[4px]
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]
        hover:border-black/10
        snap-start
        shrink-0
        w-[70vw] xs:w-[65vw] sm:w-[55vw] md:w-auto
      `}
    >
      <Image
        src={item.src!}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="
          (min-width:1280px) 390px,
          (min-width:1024px) 340px,
          (min-width:768px) 50vw,
          100vw
        "
        quality={100}
        placeholder="empty"
        priority={idx < 3}
      />

      {/* overlay + text khi hover */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/25 to-transparent group-hover:opacity-100"
      />

      <div
        className="absolute inset-x-0 bottom-0 z-10 p-4 transition-all duration-300 translate-y-4 opacity-0 pointer-events-none sm:p-5 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <div className="max-w-xs text-white">
          <p className="text-[10px] tracking-[0.18em] uppercase text-white/80">
            CHẠM VÂN • TOP PICK
          </p>
          <h3 className="mt-1.5 text-base sm:text-lg font-semibold">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="mt-1 text-[11px] sm:text-xs text-white/90">
              {item.subtitle}
            </p>
          )}

          {(item.dimensions || item.placement) && (
            <div className="mt-2 space-y-1 text-[11px] text-white/90">
              {item.dimensions && (
                <p>
                  <span className="font-semibold">Kích thước gợi ý: </span>
                  {item.dimensions}
                </p>
              )}
              {item.placement && (
                <p>
                  <span className="font-semibold">Vị trí phù hợp: </span>
                  {item.placement}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====== COMPONENT CHÍNH ====== */

export default function TopPicks() {
  // 7 ảnh
  const imageItems: PickItem[] = [
    {
      type: 'image',
      title: 'Gợi ý cho góc tĩnh lặng',
      subtitle:
        'Một món decor gỗ làm điểm nhấn trên bàn, kệ console hoặc góc trưng bày nhỏ.',
      dimensions: 'Chiều cao gợi ý cho tượng / decor: 30–40 cm',
      placement:
        'Phù hợp góc phòng khách, hành lang yên tĩnh hoặc góc thiền, đọc sách.',
      src: pick1,
    },
    {
      type: 'image',
      title: 'Điểm nhấn lối vào',
      subtitle:
        'Những món decor đứng tạo cảm giác chào đón ngay khi bước vào nhà.',
      dimensions: 'Chiều cao gợi ý: 25–35 cm mỗi món',
      placement: 'Đặt trên tủ giày, kệ sảnh hoặc quầy lễ tân nhỏ.',
      src: pick2,
    },
    {
      type: 'image',
      title: 'Trang trí không gian mở',
      subtitle:
        'Decor gỗ đặt thấp, dễ thấy ở tầm mắt khi di chuyển trong khu vực mở.',
      dimensions: 'Chiều dài gợi ý cho decor dạng ngang: 40–60 cm',
      placement:
        'Hợp lối đi sân vườn, hiên nhà hoặc ban công có nhiều cây xanh.',
      src: pick3,
    },
    {
      type: 'image',
      title: 'Góc lưu trữ & trưng bày',
      subtitle:
        'Các sản phẩm dạng hộp, khay gỗ vừa trang trí vừa chứa những món nhỏ xinh.',
      dimensions: 'Kích thước ngang gợi ý: 25–40 cm',
      placement: 'Thích hợp trên tủ rượu, kệ trang trí hoặc bàn console.',
      src: pick4,
    },
    {
      type: 'image',
      title: 'Gợi ý cho kệ TV & tủ thấp',
      subtitle:
        'Những cụm decor gỗ kích thước vừa phải để trải đều trên mặt kệ dài.',
      dimensions: 'Chiều cao gợi ý: 18–25 cm mỗi món',
      placement:
        'Đặt trên kệ TV, kệ trang trí hoặc tủ thấp trong phòng khách, phòng ăn.',
      src: pick5,
    },
    {
      type: 'image',
      title: 'Điểm nhấn chiều cao',
      subtitle:
        'Các món decor cao hơn mặt kệ, tạo tầng lớp và chiều sâu cho không gian.',
      dimensions: 'Chiều cao hoặc ngang gợi ý: 60–80 cm',
      placement:
        'Đặt ở khoảng trống cạnh sofa, bên kệ sách hoặc góc phòng làm việc.',
      src: pick6,
    },
    {
      type: 'image',
      title: 'Góc trưng bày trang trọng',
      subtitle:
        'Những sản phẩm gỗ nhiều chi tiết, phù hợp làm điểm nhấn chính trong phòng.',
      dimensions: 'Chiều cao gợi ý: 35–45 cm',
      placement:
        'Hợp với góc trang trí cạnh tủ rượu, bàn console hoặc hốc tường có đèn.',
      src: pick7,
    },
  ];

  // 2 ô màu hồng – chỉ dùng desktop / tablet
  const colorTiles: PickItem[] = [
    {
      type: 'color',
      frontLabel: 'NỔI BẬT',
      title: 'BỘ SƯU TẬP NỔI BẬT',
      subtitle: 'GỢI Ý THEO KHÔNG GIAN VÀ KÍCH THƯỚC.',
      description:
        'Những mẫu dễ phối trong phòng khách, phòng thờ và các góc trưng bày quan trọng.',
      align: 'left',
    },
    {
      type: 'color',
      frontLabel: 'SƯU TẬP',
      title: 'SƯU TẬP GỢI Ý',
      subtitle: 'NHỮNG KIỂU DÁNG ĐƯỢC YÊU THÍCH.',
      description:
        'Các thiết kế được khách hàng Chạm Vân lựa chọn nhiều, dễ ghép với đồ nội thất có sẵn.',
      align: 'right',
    },
  ];

  // Desktop: 9 tile (2 ô hồng + 7 ảnh)
  const desktopItems: PickItem[] = [
    colorTiles[0],
    imageItems[0],
    imageItems[1],
    imageItems[2],
    imageItems[3],
    colorTiles[1],
    imageItems[4],
    imageItems[5],
    imageItems[6],
  ];

  return (
    <section className="w-full pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-10">
        {/* header */}
        <div className="mb-10 text-center md:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-zinc-400">
            {TILE_LABEL}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-wide md:text-4xl">
            SẢN PHẨM BÁN CHẠY
          </h2>
          <p className="max-w-2xl mx-auto mt-3 text-sm text-zinc-500 md:text-base">
            Một vài gợi ý giúp bạn hình dung nhanh kích thước, vị trí đặt và cách
            ứng dụng các dòng sản phẩm Chạm Vân trong không gian sống.
          </p>
        </div>

        {/* MOBILE: chỉ ảnh, kéo ngang */}
        <div className="px-4 -mx-4 md:hidden">
          <div
            className="flex gap-4 pb-3 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent"
          >
            {imageItems.map((item, idx) => (
              <Tile
                key={`m-img-${idx}`}
                item={item}
                idx={idx}
                variant="mobile"
              />
            ))}
          </div>
        </div>

        {/* DESKTOP/TABLET: grid 3 cột, đủ 9 tile */}
        <div className="hidden grid-cols-3 gap-4 sm:gap-6 lg:gap-8 md:grid">
          {desktopItems.map((item, idx) => (
            <Tile
              key={`d-${idx}`}
              item={item}
              idx={idx}
              variant="desktop"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
