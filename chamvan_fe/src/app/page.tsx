//src/app/page.tsx
'use client';

import HeroSlider from '@/components/HeroSlider';
import TopPicks from '@/components/TopPicks';
import SplitShowcase from '@/components/SplitShowcase';
import Newsletter from '@/components/Newsletter';
import ProcessTimeline from '@/components/ProcessTimeline';
import CategoryHighlight from '@/components/CategoryHighlight';
import BrandPoster from '@/components/BrandPoster';
// Ảnh local
import n1 from '@/app/img/nen.jpg';
import n2 from '@/app/img/nen6.jpg';
import n3 from '@/app/img/nen3.jpg';

export default function HomePage() {
  // Chuẩn hoá đường dẫn ảnh tĩnh thành string
  const srcOf = (img: any) => (typeof img === 'string' ? img : img?.src);

  const slides = [
    {
      src: srcOf(n1),
      title: 'Nội thất cảm hứng thủ công',
      subtitle: 'Kết hợp tinh tế giữa truyền thống và hiện đại',
    },
    {
      src: srcOf(n2),
      title: 'Tối giản – Sang trọng – Bền vững',
      subtitle: 'Vật liệu tự nhiên • Hoàn thiện tỉ mỉ • Sử dụng bền lâu',
    },
    {
      src: srcOf(n3),
      title: 'Mỗi tác phẩm là câu chuyện của người thợ',
      subtitle: 'Tôn vinh tay nghề Việt qua từng đường nét',
    },
  ];

  return (
    <div className="snap-y snap-mandatory">
      {/* HERO: full-screen slider */}
      <section className="snap-start">
        <HeroSlider slides={slides as any} interval={5000} />
      </section>

      {/* TOP PICKS – mosaic */}
      <section className="bg-white snap-start">
        <TopPicks />
      </section>
      {/* GIỚI THIỆU NGHỆ NHÂN / THƯƠNG HIỆU */}
      <section className="snap-start">
        <BrandPoster />
      </section>

       {/* CATEGORY HIGHLIGHT – 3 khung ảnh như mockup */}
    <section className="bg-white snap-start">
      <CategoryHighlight />
    </section>

      {/* SHOWCASE – storytelling */}
      <section className="snap-start" style={{ background: '#F8F7F4' }}>
        <div className="mx-auto max-w-[1600px] py-6 text-white">
          <SplitShowcase />
        </div>
      </section>

      {/* PROCESS */}
      <section>
        <ProcessTimeline />
      </section>

      {/* NEWSLETTER */}
      <section className="bg-white snap-start">
        <Newsletter />
      </section>
    </div>
  );
}
