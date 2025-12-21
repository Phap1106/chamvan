// src/app/san-pham/[slug]/ProductGalleryShell.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductGallery from "@/components/ProductGallery";

const FALLBACK = "/placeholder.jpg";

function buildImgRe(reSource: string) {
  try {
    return new RegExp(reSource, "i");
  } catch {
    return /^(https?:\/\/|data:image\/|\/)/i;
  }
}

function normalizeUploads(u: string, apiOrigin: string) {
  const s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;

  // ✅ quan trọng: /uploads/... phải map sang API origin để tránh bị request localhost:3000/uploads/*
  if (s.startsWith("/uploads/")) return `${apiOrigin}${s}`;
  if (s.startsWith("uploads/")) return `${apiOrigin}/${s}`;

  // giữ nguyên các path local như /placeholder.jpg
  return s;
}

function dedupe(list: string[]) {
  const out: string[] = [];
  for (const u of list) {
    const s = String(u || "").trim();
    if (!s) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

// ✅ check ảnh có load được không (lọc ảnh 404)
async function canLoad(url: string): Promise<boolean> {
  if (!url) return false;
  // không cần check placeholder
  if (url === FALLBACK) return true;

  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.decoding = "async";
    img.loading = "eager";
    img.src = url;
  });
}

export default function ProductGalleryShell({
  slug,
  alt,
  initialImages,
  shouldLoadBase64,
  apiBase,
  imgReFull,
}: {
  slug: string;
  alt: string;
  initialImages: string[];
  shouldLoadBase64?: boolean;
  apiBase: string; // dạng .../api
  imgReFull: string;
}) {
  const IMG_RE = useMemo(() => buildImgRe(imgReFull), [imgReFull]);

  const apiOrigin = useMemo(() => {
    const b = String(apiBase || "").replace(/\/+$/, "");
    return b.endsWith("/api") ? b.slice(0, -4) : b;
  }, [apiBase]);

  const initialNormalized = useMemo(() => {
    const list = Array.isArray(initialImages) ? initialImages : [];
    const normalized = dedupe(
      list
        .map((u) => normalizeUploads(u, apiOrigin))
        .filter((u) => u && IMG_RE.test(u))
    );
    return normalized.length ? normalized : [FALLBACK];
  }, [initialImages, apiOrigin, IMG_RE]);

  const [images, setImages] = useState<string[]>(initialNormalized);

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // ✅ đổi sản phẩm => reset ngay về SSR list
  useEffect(() => {
    setImages(initialNormalized);
  }, [slug, initialNormalized]);

  // ✅ FIX CHÍNH: lọc bỏ ảnh uploads bị 404 để UI không bị “vỡ”
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const list = initialNormalized.length ? initialNormalized : [FALLBACK];

      // Nếu list có nhiều ảnh, check tuần tự để lấy ảnh “tồn tại”
      const ok: string[] = [];
      for (const u of list) {
        if (cancelled || !aliveRef.current) return;
        const ok1 = await canLoad(u);
        if (ok1) ok.push(u);
      }

      if (cancelled || !aliveRef.current) return;

      const final = ok.length ? ok : [FALLBACK];
      setImages(final);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [initialNormalized]);

  // (Giữ logic cũ của bạn) chỉ fetch lại khi có base64
  useEffect(() => {
    if (!shouldLoadBase64) return;
    if (!apiBase) return;

    const run = async () => {
      try {
        const r = await fetch(`${apiBase}/products/${encodeURIComponent(slug)}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!r.ok) return;

        const root = await r.json();
        if (!aliveRef.current || !root) return;

        const listRaw: string[] = [];
        const add = (u: any) => {
          if (typeof u !== "string") return;
          const s = normalizeUploads(u, apiOrigin);
          if (s && IMG_RE.test(s)) listRaw.push(s);
        };

        add(root?.image);

        if (Array.isArray(root?.images)) {
          for (const it of root.images) {
            if (typeof it === "string") add(it);
            else if (it && typeof it === "object") add(it.url);
          }
        }

        const list = dedupe(listRaw);
        if (!list.length) return;

        // append dần và chỉ append ảnh load được
        for (const u of list) {
          if (!aliveRef.current) return;

          setImages((prev) => (prev.includes(u) ? prev : prev)); // đọc prev để tránh warning

          if (images.includes(u)) continue;

          const ok = await canLoad(u);
          if (!ok || !aliveRef.current) continue;

          setImages((prev) => {
            const next = prev.includes(u) ? prev : [...prev, u];
            const hasReal = next.some((x) => x !== FALLBACK);
            return hasReal ? next.filter((x) => x !== FALLBACK) : next;
          });
        }
      } catch {
        // ignore
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, apiBase, shouldLoadBase64, apiOrigin, IMG_RE]);

  const finalImages = useMemo(() => {
    const hasReal = images.some((x) => x !== FALLBACK);
    return hasReal ? images.filter((x) => x !== FALLBACK) : images;
  }, [images]);

  return <ProductGallery images={finalImages} alt={alt} />;
}
