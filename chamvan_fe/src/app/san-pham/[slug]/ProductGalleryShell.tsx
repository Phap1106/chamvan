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
  if (s.startsWith("/uploads/")) return `${apiOrigin}${s}`;
  if (s.startsWith("uploads/")) return `${apiOrigin}/${s}`;
  return s;
}

function loadImage(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
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

  // SSR list có thể gồm /uploads/... => normalize sang domain API để tránh 404
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

  // tránh setState sau unmount
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // đổi sản phẩm => reset về SSR list ngay
  useEffect(() => {
    setImages(initialNormalized);
  }, [slug, initialNormalized]);

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

        // Load tới đâu add tới đó (đảm bảo ảnh add vào là ảnh load được)
        for (const u of list) {
          if (!aliveRef.current) return;

          // nếu đã có thì skip
          let exists = false;
          setImages((prev) => {
            exists = prev.includes(u);
            return prev;
          });
          if (exists) continue;

          try {
            await loadImage(u);
          } catch {
            continue;
          }
          if (!aliveRef.current) return;

          setImages((prev) => {
            const next = prev.includes(u) ? prev : [...prev, u];
            // nếu đã có ảnh thật => loại placeholder
            const hasReal = next.some((x) => x !== FALLBACK);
            return hasReal ? next.filter((x) => x !== FALLBACK) : next;
          });
        }
      } catch {
        // ignore
      }
    };

    run();
  }, [slug, apiBase, shouldLoadBase64, IMG_RE, apiOrigin]);

  // đảm bảo không “kẹt” placeholder khi đã có ảnh thật (case SSR đã kèm placeholder)
  const finalImages = useMemo(() => {
    const hasReal = images.some((x) => x !== FALLBACK);
    return hasReal ? images.filter((x) => x !== FALLBACK) : images;
  }, [images]);

  return <ProductGallery images={finalImages} alt={alt} />;
}
