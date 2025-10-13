'use client';

import { useEffect, useRef, useState } from 'react';

type Slide = { src: string; title?: string; subtitle?: string };

export default function HeroSlider({
  slides,
  interval = 4000, // đổi 3000–5000ms tùy ý
}: {
  slides: Slide[];
  interval?: number;
}) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, interval, slides.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.src}
            alt={s.title ?? `slide-${i}`}
            className="h-full w-full object-cover"
          />
          {(s.title || s.subtitle) && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="max-w-5xl px-6 text-center text-white">
                {s.title && (
                  <h2 className="text-5xl font-bold tracking-tight drop-shadow-lg">
                    {s.title}
                  </h2>
                )}
                {s.subtitle && (
                  <p className="mt-3 text-xl opacity-90">{s.subtitle}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="group absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 backdrop-blur transition hover:bg-white"
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-black">
          <path
            d="M15 18l-6-6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="group absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 backdrop-blur transition hover:bg-white"
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-black">
          <path
            d="M9 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
