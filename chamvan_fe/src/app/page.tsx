'use client';

import HeroSlider from '@/components/HeroSlider';
import TopPicks from '@/components/TopPicks';
import SplitShowcase from '@/components/SplitShowcase';
import Newsletter from '@/components/Newsletter';
import ProcessTimeline from '@/components/ProcessTimeline';

export default function HomePage() {
  const slides = [
    {
      src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/469217872_122152851206284018_6773033838817520893_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFI88cm9V_XkpkqyGhMSmhLG0b4tiBtTSgbRvi2IG1NKC10rBlOygTMUQjrJECjjIfvj9vzMBQMrjsfKI-_rfNo&_nc_ohc=W-eissWJwzcQ7kNvwFtOjaH&_nc_oc=AdkxKmSVXlpYx7N1rDBawPpABhmLiEHIxRij5qFt2GnSxIaZpN904qHJlh-HaKP-oWDbr45pzLDsTto_C4n9kpr4&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=6ZcsOBI0sqX9hhQhi_ni3g&oh=00_Aff7JM6rG1RRcTZ2j2uYPFGVqpYWLf-pbaupqPy1zSXdLQ&oe=68F148DB',
      title: 'Nội thất cảm hứng thủ công',
      subtitle: 'Kết hợp tinh tế giữa truyền thống và hiện đại',
    },
    {
      src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/499734619_122179570130284018_5375072648991930551_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEFHj5SJt7iVtkDdOlU2c4yx0Fy8XgKGpnHQXLxeAoamUZfI2aHRdE31bSggkPAUFCx3aOu8y9arCrNNR5TD_zi&_nc_ohc=nXcPxwZ8X7EQ7kNvwEFkwoQ&_nc_oc=Adlty3ynKfCh1hKEcEedsZqbjV86rJs_245aKB3Hx9WOTCx-Tqg-KvGZDJGMOIvnn38joTCXOLGTi7GEi4eO1sSi&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=7vP4JUOCZfVxG2odIR8tDA&oh=00_Aff2AdOWm_V3OCp48B408i-1bBjflWt1bE3PqIN4BrclUQ&oe=68F13A7B',
      title: 'Không gian sống ấm áp',
      subtitle: 'Tối giản – Sang trọng – Bền vững',
    },
    {
      src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/534719328_122191914848284018_6408569343546223014_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEvTFQve1JuBDIp9g7wF3ZBfr2kGpjoM5N-vaQamOgzk4T7vltd6k0kbbwl6gxD9YCsji3dYyYOc6mzGUSbmUBb&_nc_ohc=0Sjvd4oKI2gQ7kNvwGTSOGA&_nc_oc=AdmDGrYQuSDJ8J7OcUg22wUpaomKqbKg4Lz1hO_anodb3-Si7227iXlDEfqOgfoKgAZFhtUJqFoxQshgVoR2kiij&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=lJw_S91680QqwSTTwwWKFg&oh=00_Aff_RZFgAXQLVlRXcw83vzVkT0f-PZmkB51ESgI2sCMsUg&oe=68F14BF9',
      title: 'Sơn mài đương đại',
      subtitle: 'Mỗi tác phẩm là câu chuyện của người thợ',
    },
  ];

  return (
    <div className="snap-y snap-mandatory">
      {/* HERO: full-screen slider */}
      <section className="snap-start">
        <HeroSlider slides={slides} interval={4000} />
      </section>

      {/* TOP PICKS – mosaic */}
      <section className="snap-start bg-white">
        <TopPicks />
      </section>

      {/* SHOWCASE – storytelling */}
      <section className="snap-start" style={{ background: '#F8F7F4' }}>
        <div className="mx-auto max-w-[1600px] py-6 text-white">
          <SplitShowcase />
        </div>
      </section>
    <section >
        <ProcessTimeline />
      </section>
      {/* NEWSLETTER */}
      <section className="snap-start bg-white">
        <Newsletter />
      </section>

    </div>
  );
}
