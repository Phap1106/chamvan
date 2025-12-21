"use client";

import React, { useCallback, useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X } from "lucide-react";

async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

async function cropToBlob(imageSrc: string, crop: Area, mime = "image/webp", quality = 0.92) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  canvas.width = Math.max(1, Math.floor(crop.width));
  canvas.height = Math.max(1, Math.floor(crop.height));

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), mime, quality);
  });

  return blob;
}

export default function ImageCropperModal({
  open,
  file,
  title,
  onClose,
  onDone,
}: {
  open: boolean;
  file: File | null;
  title?: string;
  onClose: () => void;
  onDone: (croppedFile: File) => void;
}) {
  const ASPECT = 1; // ✅ KHÓA CỨNG 1:1

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const imgSrcPromise = useMemo(async () => {
    if (!file) return "";
    return await readFileAsDataURL(file);
  }, [file]);

  const [imgSrc, setImgSrc] = useState<string>("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const v = await imgSrcPromise;
      if (alive) setImgSrc(v);
    })();
    return () => {
      alive = false;
    };
  }, [imgSrcPromise]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = useCallback(async () => {
    if (!file || !imgSrc || !croppedAreaPixels) return;

    setLoading(true);
    try {
      const outMime = "image/webp";
      const blob = await cropToBlob(imgSrc, croppedAreaPixels, outMime, 0.92);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const newName = `${baseName}_crop.webp`;
      const croppedFile = new File([blob], newName, { type: outMime });
      onDone(croppedFile);
    } catch {
      onDone(file);
    } finally {
      setLoading(false);
    }
  }, [file, imgSrc, croppedAreaPixels, onDone]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="text-sm font-semibold text-zinc-900">
            {title || "Chỉnh ảnh (tỷ lệ 1:1) trước khi upload"}
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-zinc-100">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-[1fr_320px]">
          <div className="relative w-full overflow-hidden bg-zinc-100 rounded-xl min-h-[420px]">
            {imgSrc ? (
              <Cropper
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT} // ✅ 1:1
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={false}
              />
            ) : (
              <div className="grid h-[420px] place-items-center text-sm text-zinc-500">
                Đang tải ảnh...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="mb-2 text-xs font-semibold text-zinc-500">HƯỚNG DẪN</div>
              <div className="text-xs text-zinc-600">
                Kéo ảnh để căn vị trí trong khung vuông. Dùng thanh zoom để phóng to/thu nhỏ.
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="mb-2 text-xs font-semibold text-zinc-500">ZOOM</div>
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-1 text-xs text-zinc-500">x{zoom.toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 text-sm border rounded-md border-zinc-200 hover:bg-zinc-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="h-10 px-4 text-sm text-white rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Dùng ảnh này"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
