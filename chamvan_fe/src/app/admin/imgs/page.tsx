// src/app/admin/imgs/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image as ImageIcon,
  ScanLine,
  Upload,
  Send,
  KeyRound,
  Bot,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  Link as LinkIcon,
  Download,
  Plus,
  Settings2,
  MessageSquareText,
} from "lucide-react";

const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

/* ====== FAL endpoints ====== */
const FAL_GEN = "https://fal.run/fal-ai/nano-banana";        // text -> image
const FAL_EDIT = "https://fal.run/fal-ai/nano-banana/edit";   // image edit / grounded

type ChatRole = "user" | "assistant";
type ChatMsg = {
  id: string;
  role: ChatRole;
  text?: string;
  images?: { url: string; name?: string }[];
  ts: number;
};
const uid = () => Math.random().toString(36).slice(2);

function extractFalImages(json: any): string[] {
  if (!json) return [];
  if (Array.isArray(json.images)) {
    return json.images.map((it: any) => (typeof it === "string" ? it : it?.url)).filter(Boolean);
  }
  if (json.image?.url) return [json.image.url];
  if (typeof json.image_url === "string") return [json.image_url];
  return [];
}

const fileToDataURL = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(f);
  });

export default function AdminImgsPage() {
  const [apiKey, setApiKey] = useState("");
  const [keyStatus, setKeyStatus] =
    useState<"unknown" | "valid" | "invalid" | "checking">("unknown");

  const [prompt, setPrompt] = useState("");
  const [nImages, setNImages] = useState(1);
  const [size, setSize] =
    useState<"square-1024" | "landscape-1024" | "portrait-1024">("landscape-1024");

  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");

  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [sending, setSending] = useState(false);

  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fal_api_key");
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      el.classList.add("ring-2", "ring-zinc-400");
    };
    const onDragLeave = () => el.classList.remove("ring-2", "ring-zinc-400");
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("ring-2", "ring-zinc-400");
      const dt = e.dataTransfer;
      if (!dt) return;
      const ff: File[] = [];
      for (let i = 0; i < (dt.files?.length || 0); i++) {
        const f = dt.files[i];
        if (f?.type?.startsWith("image/")) ff.push(f);
      }
      if (ff.length) setFiles((p) => [...p, ...ff]);
      const url = dt.getData("text/uri-list") || dt.getData("text/plain");
      if (url && /^https?:\/\//.test(url)) setImageUrls((p) => [...p, url]);
    };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  const hasKey = apiKey.trim().length > 10;

  /* ===== validate key: dùng FAL_GEN (không cần ảnh) ===== */
  const validateKey = useCallback(async () => {
    if (!hasKey) return setKeyStatus("invalid");
    setKeyStatus("checking");
    try {
      const res = await fetch(FAL_GEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: "ping",
          num_images: 1,
          size: "square-1024",
          image_urls: [],
          image_b64s: [],
        }),
      });
      if (res.status === 401 || res.status === 403) setKeyStatus("invalid");
      else setKeyStatus("valid");
      if (res.ok) localStorage.setItem("fal_api_key", apiKey);
    } catch {
      setKeyStatus("invalid");
    }
  }, [apiKey, hasKey]);

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    try {
      new URL(u);
      setImageUrls((p) => [...p, u]);
      setUrlInput("");
    } catch {}
  };
  const removeFile = (i: number) => setFiles((p) => p.filter((_, idx) => idx !== i));
  const removeUrl = (i: number) => setImageUrls((p) => p.filter((_, idx) => idx !== i));

  /* ===== run ===== */
  const runGeneration = useCallback(async () => {
    if (!hasKey) return alert("Bạn chưa nhập FAL API Key.");
    if (!prompt.trim()) return alert("Nhập prompt trước khi chạy.");

    const hasRefs = imageUrls.length > 0 || files.length > 0;
    const endpoint = hasRefs ? FAL_EDIT : FAL_GEN;

    setSending(true);
    setChat((c) => [
      ...c,
      {
        id: uid(),
        role: "user",
        text:
          prompt +
          (hasRefs ? "\n\n(Chế độ edit: có ảnh ngữ cảnh)" : "\n\n(Chế độ generate: không có ảnh ngữ cảnh)"),
        images: imageUrls.map((u) => ({ url: u })),
        ts: Date.now(),
      },
    ]);

    try {
      const b64s = hasRefs ? await Promise.all(files.map(fileToDataURL)) : [];

      const body = {
        prompt,
        num_images: Math.max(1, Math.min(4, nImages)),
        size,
        image_urls: imageUrls, // luôn có mặt
        image_b64s: b64s,      // luôn có mặt
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail =
          json?.detail?.map?.((d: any) => d?.msg || d?.message)?.join("; ") ||
          json?.error?.message ||
          json?.message ||
          `FAL error (${res.status})`;
        setChat((c) => [...c, { id: uid(), role: "assistant", text: "❌ " + detail, ts: Date.now() }]);
        setSending(false);
        return;
      }

      const imgs = extractFalImages(json);
      setChat((c) => [
        ...c,
        {
          id: uid(),
          role: "assistant",
          text: imgs.length ? "Đã tạo xong hình ảnh." : "FAL phản hồi thành công.",
          images: imgs.map((u, i) => ({ url: u, name: `fal_${i + 1}.jpg` })),
          ts: Date.now(),
        },
      ]);
    } catch (e: any) {
      setChat((c) => [
        ...c,
        { id: uid(), role: "assistant", text: "❌ " + (e?.message || "Request failed"), ts: Date.now() },
      ]);
    } finally {
      setSending(false);
    }
  }, [apiKey, hasKey, prompt, nImages, size, imageUrls, files]);

  const keyBadge = useMemo(() => {
    if (keyStatus === "checking")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-zinc-100">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Đang kiểm tra…
        </span>
      );
    if (keyStatus === "valid")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Key hợp lệ
        </span>
      );
    if (keyStatus === "invalid")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-700">
          <XCircle className="w-3.5 h-3.5" />
          Key không hợp lệ
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-zinc-100">
        <KeyRound className="w-3.5 h-3.5" />
        Chưa kiểm tra
      </span>
    );
  }, [keyStatus]);

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6" />
          <h1 className="text-xl font-semibold md:text-2xl">Tạo ảnh AI (FAL – nano-banana)</h1>
          {keyBadge}
        </div>
        <div className="items-center hidden gap-2 text-sm md:flex text-zinc-500">
          <ScanLine className="w-4 h-4" />
          <span>Tự động chọn Generate/Edit theo việc có ảnh ngữ cảnh.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT controls */}
        <div className="space-y-6">
          <div className="p-4 bg-white shadow-sm rounded-2xl md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="w-5 h-5" />
              <h2 className="font-semibold">Cấu hình API</h2>
            </div>

            <label className="block text-sm">
              <span className="block mb-1 text-zinc-600">FAL API Key</span>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg outline-none border-zinc-200 focus:ring-2 ring-zinc-300"
                  placeholder="fal_sk_************************"
                />
                <button
                  onClick={validateKey}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-black rounded-lg hover:opacity-90"
                >
                  <KeyRound className="w-4 h-4" />
                  Kiểm tra
                </button>
              </div>
            </label>

            <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
              <label className="col-span-1">
                <span className="block mb-1 text-zinc-600">Số ảnh</span>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={nImages}
                  onChange={(e) => setNImages(Math.max(1, Math.min(4, Number(e.target.value))))}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-200"
                />
              </label>
              <label className="col-span-2">
                <span className="block mb-1 text-zinc-600">Kích thước</span>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as typeof size)}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-200"
                >
                  <option value="landscape-1024">Landscape 1024</option>
                  <option value="square-1024">Square 1024</option>
                  <option value="portrait-1024">Portrait 1024</option>
                </select>
              </label>
            </div>
          </div>

          <div className="p-4 bg-white shadow-sm rounded-2xl md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareText className="w-5 h-5" />
              <h2 className="font-semibold">Prompt</h2>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg outline-none resize-y border-zinc-200 focus:ring-2 ring-zinc-300"
              placeholder='Ví dụ: make a photo of a single red apple on a white table, soft natural light, minimal, no text'
            />

            <div className="flex items-center justify-end mt-4">
              <button
                onClick={runGeneration}
                disabled={sending}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white",
                  sending ? "bg-zinc-500" : "bg-black hover:opacity-90"
                )}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Tạo ảnh
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Context images */}
          <div className="p-4 bg-white shadow-sm rounded-2xl md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <h2 className="font-semibold">Ảnh ngữ cảnh (tùy chọn)</h2>
              </div>
              {(files.length > 0 || imageUrls.length > 0) && (
                <button
                  className="text-xs text-zinc-600 hover:text-zinc-900"
                  onClick={() => {
                    setFiles([]);
                    setImageUrls([]);
                  }}
                >
                  Xoá tất cả
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Dán URL ảnh…"
                  className="w-full px-3 py-2 border rounded-lg border-zinc-200 pl-9"
                />
                <LinkIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
              </div>
              <button
                onClick={addUrl}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white rounded-lg bg-zinc-900"
              >
                <Plus className="w-4 h-4" /> Thêm URL
              </button>
            </div>

            <div
              ref={dropRef}
              className="p-4 text-sm text-center border border-dashed rounded-xl border-zinc-300 bg-zinc-50 text-zinc-600"
            >
              Kéo thả ảnh vào đây hoặc{" "}
              <label className="underline cursor-pointer">
                chọn file
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const fs = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
                    setFiles((p) => [...p, ...fs]);
                  }}
                />
              </label>
            </div>

            {(files.length > 0 || imageUrls.length > 0) && (
              <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3">
                {files.map((f, i) => {
                  const obj = URL.createObjectURL(f);
                  return (
                    <div key={`f-${i}`} className="relative overflow-hidden rounded-lg group bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={obj} alt={f.name} className="object-cover w-full h-32" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute p-1 rounded-full shadow top-2 right-2 bg-white/90 hover:bg-white"
                        title="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 text-[10px] truncate px-2 py-1 bg-black/50 text-white">
                        {f.name}
                      </div>
                    </div>
                  );
                })}
                {imageUrls.map((u, i) => (
                  <div key={`u-${i}`} className="relative overflow-hidden rounded-lg group bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt={"url-"+i} className="object-cover w-full h-32" />
                    <button
                      onClick={() => removeUrl(i)}
                      className="absolute p-1 rounded-full shadow top-2 right-2 bg-white/90 hover:bg-white"
                      title="Xoá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 text-[10px] truncate px-2 py-1 bg-black/50 text-white">
                      {u}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: chat/results */}
        <div className="flex flex-col p-0 overflow-hidden bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-2 px-4 py-4 border-b md:px-5 border-zinc-100">
            <Bot className="w-5 h-5" />
            <h2 className="font-semibold">Chat / Kết quả</h2>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto md:p-5">
            {chat.length === 0 ? (
              <div className="text-sm text-zinc-500">
                Chưa có tin nhắn. Nhập prompt rồi bấm <b>Tạo ảnh</b>.
              </div>
            ) : (
              chat.map((m) => (
                <div key={m.id} className="max-w-full">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs mb-1",
                      m.role === "user" ? "bg-zinc-100 text-zinc-700" : "bg-black text-white"
                    )}
                  >
                    {m.role === "user" ? <ImageIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    {m.role === "user" ? "Bạn" : "AI"}
                  </div>
                  {m.text && <div className="text-sm leading-6 whitespace-pre-wrap">{m.text}</div>}
                  {m.images && m.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-3">
                      {m.images.map((im, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-lg bg-zinc-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={im.url} alt={im.name || "img"} className="object-cover w-full h-36" />
                          <a
                            className="absolute inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bottom-2 right-2 bg-white/90 hover:bg-white"
                            href={im.url}
                            target="_blank"
                            rel="noreferrer"
                            download={im.name || `image_${idx + 1}.jpg`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            Tải
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-zinc-100">
            <div className="flex items-center gap-2">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-lg border-zinc-200"
                placeholder="Nhập prompt để gửi…"
              />
              <button
                onClick={runGeneration}
                disabled={sending}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white",
                  sending ? "bg-zinc-500" : "bg-black hover:opacity-90"
                )}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        Nếu có ảnh ngữ cảnh → dùng <code>/edit</code>; nếu không → dùng <code>/nano-banana</code>.  
        Luôn gửi <code>image_urls</code> và <code>image_b64s</code> (mảng rỗng khi không dùng) để tránh 422.
      </p>
    </div>
  );
}
