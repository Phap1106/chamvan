"use client";

import { useEffect, useMemo, useState } from "react";
import ProductGallery from "@/components/ProductGallery";

function buildImgRe(reSource: string) {
  try {
    return new RegExp(reSource, "i");
  } catch {
    return /^(https?:\/\/|data:image\/|\/)/i;
  }
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
  apiBase: string;
  imgReFull: string; // regex source từ server (để đồng nhất)
}) {
  const IMG_RE = useMemo(() => buildImgRe(imgReFull), [imgReFull]);

  const [images, setImages] = useState<string[]>(
    initialImages?.length ? initialImages : ["/placeholder.jpg"]
  );

  useEffect(() => {
    if (!shouldLoadBase64) return; // ✅ chỉ fetch khi có base64
    if (!apiBase) return;

    let alive = true;

    fetch(`${apiBase}/products/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((root) => {
        if (!alive || !root) return;

        const list: string[] = [];
        const add = (u: any) => {
          if (typeof u !== "string") return;
          const s = u.trim();
          if (s && IMG_RE.test(s) && !list.includes(s)) list.push(s);
        };

        add(root?.image);

        if (Array.isArray(root?.images)) {
          for (const it of root.images) {
            if (typeof it === "string") add(it);
            else if (it && typeof it === "object") add(it.url);
          }
        }

        if (!list.length) list.push("/placeholder.jpg");

        setImages(list);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [slug, apiBase, shouldLoadBase64, IMG_RE]);

  return <ProductGallery images={images} alt={alt} />;
}
