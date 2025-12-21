//src/app/admin/products/page.tsx
"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
} from "react";
import {
  Eye,
  Copy,
  Edit3,
  Trash2,
  X,
  Package,
  Layers,
  Tag,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import ImageCropperModal from "@/components/admin/ImageCropperModal";

/* ================== ENV + URL HELPERS ================== */
const API_BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000/api";
  return String(raw).replace(/\/+$/, "");
})();

const API_ORIGIN = (() => {
  const b = API_BASE.replace(/\/+$/, "");
  return b.endsWith("/api") ? b.slice(0, -4) : b;
})();

const UPLOAD_ENDPOINT = `${API_BASE}/products/upload`;

const FALLBACK = "/placeholder.jpg";

function toAbsImageUrl(u: string) {
  if (!u) return FALLBACK;
  const s = String(u).trim();
  if (!s) return FALLBACK;
  if (/^data:image\//i.test(s)) return s;
  if (/^https?:\/\//i.test(s)) return s;

  // QUAN TRỌNG: /uploads/... phải trỏ sang API_ORIGIN, không phải domain FE
  if (s.startsWith("/uploads/")) return `${API_ORIGIN}${s}`;
  if (s.startsWith("uploads/")) return `${API_ORIGIN}/${s}`;

  // path tuyệt đối nội bộ khác (vd /placeholder.jpg)
  if (s.startsWith("/")) return s;

  return s;
}

/* ================== TYPES ================== */
type Color = { name: string; hex?: string };
type Spec = { label: string; value: string };

type Product = {
  id?: number | string;
  name: string;
  slug?: string;

  /** ✅ giá bán thực tế */
  price: number | string;

  /** ✅ giá gốc */
  original_price?: number | string | null;

  /** ✅ % giảm (BE tự tính lại khi lưu) */
  discount_percent?: number;

  sku?: string;
  description?: string;
  stock: number;
  sold: number;
  status: "open" | "closed";

  image?: string;
  images?: any[]; // có thể là string[] hoặc [{url,...}]
  colors?: Color[];
  specs?: Spec[];

  /** FE đang dùng number[] cho filter */
  categories?: number[];
};

type Cat = { id: number; name: string };

type GalleryItem = { url: string; kind: "file" | "url" };

const IMG_RE = /^(https?:\/\/|data:image\/|\/uploads\/|uploads\/|\/placeholder\.jpg|\/)/i;

/* ================== HELPERS ================== */
function formatVND(n: number) {
  return (Number(n) || 0).toLocaleString("vi-VN");
}

function toNumberMoney(v: any): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v).trim().replace(/\s+/g, "").replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function calcDiscountPercent(original: number, price: number) {
  if (!(original > 0) || !(price > 0) || price >= original) return 0;
  const pct = Math.round((1 - price / original) * 100);
  return Math.max(0, Math.min(99, pct));
}

function pickUrl(x: any): string | null {
  if (!x) return null;
  if (typeof x === "string") return x.trim();
  if (typeof x === "object") {
    const u = x.url || x.href || x.src;
    return u ? String(u).trim() : null;
  }
  return null;
}

function normalizeImagesToUrls(imagesRaw: any): string[] {
  const arr = Array.isArray(imagesRaw) ? imagesRaw : [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const it of arr) {
    const u = pickUrl(it);
    if (!u) continue;
    if (!IMG_RE.test(u)) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

function normalizeCategoriesToIds(raw: any): number[] {
  // FE đang dùng number[]; nếu BE trả relation objects thì vẫn normalize được.
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((x) => {
        if (typeof x === "number") return x;
        if (typeof x === "string") return Number(x);
        if (x && typeof x === "object") return Number(x.id);
        return NaN;
      })
      .filter((n) => Number.isFinite(n));
  }
  return [];
}

/* ================== UI ATOMS ================== */
function Badge({ color, children }: { color: "green" | "zinc"; children: any }) {
  const cls =
    color === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-zinc-100 text-zinc-700 border-zinc-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs border rounded ${cls}`}>
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center gap-2 px-3 h-10 rounded-md text-sm font-medium transition border";
  const styles: any = {
    primary: "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800",
    secondary: "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50",
    ghost: "bg-transparent text-zinc-700 border-transparent hover:bg-zinc-100",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-500",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );
}

function Label({ required, children }: { required?: boolean; children: any }) {
  return (
    <label className="block mb-1 text-sm font-medium text-zinc-700">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      className={
        "w-full h-10 px-3 text-sm bg-white border rounded-md border-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900 " +
        (props.className || "")
      }
    />
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={String(value ?? "")}
      placeholder={placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(Number(String(e.target.value).replace(/[^\d]/g, "")) || 0)
      }
      inputMode="numeric"
    />
  );
}

/* ================== Editors ================== */
function ColorsEditor({
  value,
  onChange,
}: {
  value: Color[];
  onChange: (v: Color[]) => void;
}) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");

  const add = () => {
    const n = name.trim();
    const h = hex.trim();
    if (!n) return;
    onChange([...value, { name: n, hex: h || undefined }]);
    setName("");
    setHex("");
  };

  return (
    <div className="p-4 space-y-3 bg-white border rounded-md border-zinc-200">
      <Label>Màu sắc</Label>
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Tên màu"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <Input
          placeholder="#hex"
          value={hex}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHex(e.target.value)}
          className="w-24"
        />
        <Button onClick={add} variant="secondary">
          Thêm
        </Button>
      </div>

      <ul className="space-y-1 overflow-y-auto text-sm max-h-28">
        {value.map((c, i) => (
          <li
            key={`${c.name}-${i}`}
            className="flex items-center justify-between p-2 rounded bg-zinc-50"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border rounded" style={{ background: c.hex || "#fff" }} />
              {c.name} <span className="text-xs text-zinc-400">{c.hex || ""}</span>
            </span>
            <button
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {!value.length && <div className="text-xs text-zinc-400">Chưa có màu</div>}
      </ul>
    </div>
  );
}

function SpecsEditor({
  value,
  onChange,
}: {
  value: Spec[];
  onChange: (v: Spec[]) => void;
}) {
  const [label, setLabel] = useState("");
  const [val, setVal] = useState("");

  const add = () => {
    const l = label.trim();
    const v = val.trim();
    if (!l || !v) return;
    onChange([...value, { label: l, value: v }]);
    setLabel("");
    setVal("");
  };

  return (
    <div className="p-4 space-y-3 bg-white border rounded-md border-zinc-200">
      <Label>Thông số kỹ thuật</Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Nhãn"
          value={label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
        />
        <Input
          placeholder="Giá trị"
          value={val}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
        />
      </div>
      <Button onClick={add} variant="secondary">
        Thêm thông số
      </Button>

      <ul className="space-y-1 overflow-y-auto text-sm max-h-28">
        {value.map((s, i) => (
          <li
            key={`${s.label}-${i}`}
            className="flex items-center justify-between p-2 rounded bg-zinc-50"
          >
            <span className="truncate">
              {s.label}: {s.value}
            </span>
            <button
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {!value.length && <div className="text-xs text-zinc-400">Chưa có thông số</div>}
      </ul>
    </div>
  );
}

/* ================== TABLE ROW (memo) ================== */
const ProductRow = memo(function ProductRow({
  p,
  onView,
  onDup,
  onEdit,
  onDel,
}: {
  p: Product;
  onView: (p: Product) => void;
  onDup: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDel: (p: Product) => void;
}) {
  const price = toNumberMoney(p.price);
  const original =
    p.original_price === null || p.original_price === undefined ? 0 : toNumberMoney(p.original_price);
  const pct = calcDiscountPercent(original, price);

  return (
    <tr className="transition-colors hover:bg-zinc-50/50 group">
      <td className="px-4 py-3">
        <div className="w-10 h-10 overflow-hidden border rounded bg-zinc-100 border-zinc-200">
          <img
            src={toAbsImageUrl(p.image || "")}
            alt=""
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK)}
          />
        </div>
      </td>

      <td className="px-4 py-3 font-medium text-zinc-900">
        <div className="truncate max-w-[420px]" title={p.name}>
          {p.name}
        </div>
        <div className="font-mono text-xs text-zinc-400">{p.sku}</div>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="font-medium">{formatVND(price)}</div>
        {original > price ? (
          <div className="text-xs text-zinc-400">
            <span className="line-through">{formatVND(original)}</span>
            {pct > 0 ? <span className="ml-2 text-emerald-700">-{pct}%</span> : null}
          </div>
        ) : null}
      </td>

      <td className="px-4 py-3 text-xs text-center">{Number(p.stock || 0)}</td>

      <td className="px-4 py-3">
        <Badge color={p.status === "open" ? "green" : "zinc"}>
          {p.status === "open" ? "Bán" : "Ẩn"}
        </Badge>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 transition-opacity opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onView(p)}
            className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
            title="Xem"
          >
            <Eye size={14} />
          </button>

          <button
            onClick={() => onDup(p)}
            className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
            title="Nhân bản"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={() => onEdit(p)}
            className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
            title="Sửa"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={() => onDel(p)}
            className="p-1.5 hover:bg-red-50 rounded text-red-600"
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
});

/* ================== EDIT DRAWER ================== */
function buildBaseProduct(p?: Product): Product {
  return p
    ? { ...p }
    : {
        name: "",
        price: 0,
        original_price: null,
        discount_percent: 0,
        stock: 0,
        sold: 0,
        status: "closed",
        sku: "",
        description: "",
        colors: [],
        specs: [],
        images: [],
        image: "",
        categories: [],
      };
}

function uniqUrls(urls: string[]) {
  const out: string[] = [];
  for (const u of urls || []) {
    const s = String(u || "").trim();
    if (!s) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

function EditorDrawer({
  open,
  initial,
  cats,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial: Product;
  cats: Cat[];
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [saving, setSaving] = useState(false);

  // Local draft state
  const [name, setName] = useState(initial.name || "");

  // ✅ giá bán thực tế
  const [price, setPrice] = useState<number>(toNumberMoney(initial.price) || 0);

  // ✅ giá gốc
  const [originalPrice, setOriginalPrice] = useState<number>(
    initial.original_price === null || initial.original_price === undefined
      ? 0
      : toNumberMoney(initial.original_price)
  );

  const [sku, setSku] = useState(initial.sku || "");
  const [description, setDescription] = useState(initial.description || "");
  const [stock, setStock] = useState<number>(Number(initial.stock) || 0);
  const [sold, setSold] = useState<number>(Number(initial.sold) || 0);
  const [status, setStatus] = useState<Product["status"]>(initial.status || "closed");
  const [colors, setColors] = useState<Color[]>(initial.colors || []);
  const [specs, setSpecs] = useState<Spec[]>(initial.specs || []);
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>(
    Array.isArray(initial.categories) ? initial.categories : []
  );

  const initialGallery = useMemo(() => {
    const normalized = normalizeImagesToUrls(initial.images);
    const imgs = uniqUrls([...(initial.image ? [initial.image] : []), ...normalized]);
    return imgs.map((u) => ({ url: u, kind: "url" as const }));
  }, [initial]);

  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // ================== NEW: crop queue states (thêm mới, không phá logic cũ) ==================
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropIndex, setCropIndex] = useState(0);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);

  const resetCropFlow = useCallback(() => {
    setCropQueue([]);
    setCropIndex(0);
    setCroppedFiles([]);
    setCropOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // reset khi mở editor sản phẩm khác
  useEffect(() => {
    setName(initial.name || "");
    setPrice(toNumberMoney(initial.price) || 0);
    setOriginalPrice(
      initial.original_price === null || initial.original_price === undefined
        ? 0
        : toNumberMoney(initial.original_price)
    );
    setSku(initial.sku || "");
    setDescription(initial.description || "");
    setStock(Number(initial.stock) || 0);
    setSold(Number(initial.sold) || 0);
    setStatus(initial.status || "closed");
    setColors(initial.colors || []);
    setSpecs(initial.specs || []);
    setSelectedCatIds(Array.isArray(initial.categories) ? initial.categories : []);
    setGallery(initialGallery);

    // NEW: reset crop state để không dính ảnh giữa các lần mở
    resetCropFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id, open]);

  // ✅ giữ nguyên tên hàm, chỉ mở rộng input để nhận File[] (không phá call cũ)
  const uploadFilesToServer = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files) return;
      const arr = Array.isArray(files) ? files : Array.from(files);
      if (arr.length === 0) return;

      if (!API_BASE) {
        toast.error("Thiếu NEXT_PUBLIC_API_BASE_URL / NEXT_PUBLIC_API_URL");
        return;
      }

      const fd = new FormData();
      arr.forEach((f) => fd.append("files", f));

      try {
        const r = await fetch(UPLOAD_ENDPOINT, {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        if (!r.ok) {
          const t = await r.text().catch(() => "");
          toast.error(`Upload thất bại (${r.status})`);
          console.log("upload error:", t);
          return;
        }

        const json = await r.json();
        const list = Array.isArray(json?.files) ? json.files : Array.isArray(json) ? json : [];
        const urls: string[] = list
          .map((x: any) => String(x?.url || x?.path || "").trim())
          .filter((u: string) => !!u);

        if (!urls.length) {
          toast.error("Upload xong nhưng không nhận được URL");
          return;
        }

        setGallery((prev) => {
          const cur = new Set(prev.map((x) => x.url));
          const next = [...prev];
          for (const u of urls) {
            if (!cur.has(u)) next.push({ url: u, kind: "file" });
          }
          return next;
        });

        toast.success(`Đã upload ${urls.length} ảnh`);
      } catch {
        toast.error("Upload lỗi (network)");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    []
  );

  // NEW: chọn file => mở crop từng ảnh => xong mới upload
  const handlePickFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    setCropQueue(arr);
    setCropIndex(0);
    setCroppedFiles([]);
    setCropOpen(true);
  }, []);

  // NEW: khi đã crop hết => upload batch (giữ trải nghiệm như cũ: upload nhiều ảnh 1 lần)
  useEffect(() => {
    if (!cropOpen) return;
    if (cropQueue.length === 0) return;

    // đã crop xong toàn bộ
    if (cropIndex >= cropQueue.length && croppedFiles.length === cropQueue.length) {
      setCropOpen(false);
      uploadFilesToServer(croppedFiles);
      // giữ cropQueue/croppedFiles để debug nếu cần, nhưng reset input file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [cropOpen, cropQueue.length, cropIndex, croppedFiles, uploadFilesToServer]);

  const discountPreview = useMemo(() => {
    const p = toNumberMoney(price);
    const o = toNumberMoney(originalPrice);
    return calcDiscountPercent(o, p);
  }, [price, originalPrice]);

  const handleSave = useCallback(async () => {
    const n = String(name || "").trim();
    if (!n) return toast.error("Tên sản phẩm không được rỗng");

    setSaving(true);
    try {
      const images = gallery
        .map((g) => g.url)
        .map((u) => String(u || "").trim())
        .filter((u) => IMG_RE.test(u));

      const p = toNumberMoney(price);
      const o = toNumberMoney(originalPrice);

      const payload: any = {
        id: initial.id,
        name: n,

        // ✅ 2 giá
        price: p,
        original_price: o > p && o > 0 ? o : null,

        sku: sku || "",
        description: description || "",
        stock: Number(stock) || 0,
        sold: Number(sold) || 0,
        status,
        colors,
        specs,
        categories: selectedCatIds, // giữ nguyên logic hiện tại
        image: images[0] || "",
        images,
      };

      const isEdit = !!initial.id;
      const url = isEdit ? `/api/admin/products/${initial.id}` : `/api/admin/products`;
      const method = isEdit ? "PATCH" : "POST";

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        toast.error(`Lưu thất bại (${r.status})`);
        console.log("save error:", t);
        return;
      }

      toast.success("Lưu thành công");
      onClose();
      await onSaved();
    } catch {
      toast.error("Lưu lỗi (network)");
    } finally {
      setSaving(false);
    }
  }, [
    name,
    price,
    originalPrice,
    sku,
    description,
    stock,
    sold,
    status,
    colors,
    specs,
    selectedCatIds,
    gallery,
    initial.id,
    onClose,
    onSaved,
  ]);

  if (!open) return null;

  const currentCropFile = cropQueue[cropIndex] || null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative flex flex-col w-full h-full max-w-4xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
          <h2 className="text-lg font-bold text-zinc-900">
            {initial.id ? "Chỉnh sửa" : "Thêm mới"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto bg-zinc-50/50">
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Package size={18} />
              <h3 className="font-bold">Thông tin</h3>
            </div>

            <div className="grid gap-4">
              <div>
                <Label required>Tên sản phẩm</Label>
                <Input
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
              </div>

              {/* ✅ 2 giá: price + original_price */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>Giá bán (VNĐ)</Label>
                  <PriceInput value={price} onChange={setPrice} placeholder="Giá thực tế" />
                </div>

                <div>
                  <Label>Giá gốc (VNĐ)</Label>
                  <PriceInput
                    value={originalPrice}
                    onChange={setOriginalPrice}
                    placeholder="Giá gốc (nếu có)"
                  />
                </div>

                <div>
                  <Label>Mã SKU</Label>
                  <Input value={sku} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSku(e.target.value)} />
                </div>
              </div>

              {/* Preview % giảm */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <Label>% giảm (tự tính)</Label>
                  <Input value={String(discountPreview)} readOnly disabled />
                </div>

                <div className="md:col-span-2">
                  <Label>Slug (tự sinh từ server)</Label>
                  <Input value={initial.slug || ""} readOnly disabled placeholder="Sẽ được tạo sau khi lưu" />
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <textarea
                  className="w-full p-3 text-sm border border-zinc-300 rounded-md bg-white min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Layers size={18} />
              <h3 className="font-bold">Kho & Trạng thái</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-white border rounded">
              <div>
                <Label>Tồn kho</Label>
                <Input type="number" value={stock} onChange={(e: any) => setStock(Number(e.target.value))} />
              </div>
              <div>
                <Label>Đã bán</Label>
                <Input type="number" value={sold} onChange={(e: any) => setSold(Number(e.target.value))} />
              </div>
              <div className="col-span-2">
                <Label>Trạng thái</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3 text-sm bg-white border rounded-md border-zinc-300"
                >
                  <option value="open">Đang bán</option>
                  <option value="closed">Ngưng bán</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Tag size={18} />
              <h3 className="font-bold">Thuộc tính & Màu sắc</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <ColorsEditor value={colors} onChange={setColors} />
              <SpecsEditor value={specs} onChange={setSpecs} />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <ImageIcon size={18} />
              <h3 className="font-bold">Hình ảnh</h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handlePickFiles(e.target.files)}
              />
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} /> Upload ảnh từ máy
              </Button>
              <div className="text-xs text-zinc-500">
                Upload endpoint: <span className="font-mono">{UPLOAD_ENDPOINT}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                ref={urlInputRef}
                className="flex-1 h-10 px-3 text-sm bg-white border rounded-md border-zinc-300"
                placeholder="Dán URL ảnh (http/https hoặc /uploads/...)"
              />
              <Button
                variant="secondary"
                onClick={() => {
                  const raw = urlInputRef.current?.value || "";
                  const urls = raw
                    .split(/[\n,]+/)
                    .map((s) => s.trim())
                    .filter((u) => IMG_RE.test(u));
                  if (!urls.length) return toast.error("URL ảnh không hợp lệ");
                  setGallery((prev) => {
                    const cur = new Set(prev.map((x) => x.url));
                    const next = [...prev];
                    for (const u of urls) if (!cur.has(u)) next.push({ url: u, kind: "url" });
                    return next;
                  });
                  if (urlInputRef.current) urlInputRef.current.value = "";
                }}
              >
                Thêm
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <div
                  key={`${g.url}-${i}`}
                  className="relative overflow-hidden bg-white border rounded-md group aspect-square border-zinc-200"
                >
                  <img
                    src={toAbsImageUrl(g.url)}
                    alt=""
                    className="object-cover w-full h-full"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK)}
                  />
                  <button
                    onClick={() => setGallery((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute p-1 text-red-500 rounded opacity-0 top-1 right-1 bg-white/90 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                    {g.kind === "file" ? "FILE" : "URL"}
                  </div>

                  {i === 0 && (
                    <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center">
                      Ảnh chính
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Layers size={18} />
              <h3 className="font-bold">Danh mục</h3>
            </div>

            <div className="p-2 overflow-y-auto bg-white border rounded-md max-h-40 border-zinc-300">
              {cats.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 rounded cursor-pointer text-sm select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedCatIds.includes(c.id)}
                    onChange={() =>
                      setSelectedCatIds((prev) =>
                        prev.includes(c.id) ? prev.filter((i) => i !== c.id) : [...prev, c.id]
                      )
                    }
                    className="rounded border-zinc-300 accent-zinc-900"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-zinc-200">
          <Button variant="ghost" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu lại"}
          </Button>
        </div>
      </div>

      {/* NEW: Crop modal (chỉ thêm mới) */}
      <ImageCropperModal
        open={cropOpen}
        file={currentCropFile}
        title={
          cropQueue.length > 0
            ? `Chỉnh ảnh (${Math.min(cropIndex + 1, cropQueue.length)}/${cropQueue.length})`
            : "Chỉnh sửa ảnh"
        }
        aspect={1} // default vuông (đúng layout aspect-square của FE)
        onClose={() => {
          // nếu admin tắt crop thì hủy upload, giữ nguyên trải nghiệm “an toàn”
          resetCropFlow();
          toast.message("Đã hủy chỉnh ảnh");
        }}
        onDone={(croppedFile) => {
          setCroppedFiles((prev) => {
            const next = [...prev];
            next[cropIndex] = croppedFile;
            return next;
          });
          setCropIndex((x) => x + 1);
        }}
      />
    </div>
  );
}

/* ================== PAGE ================== */
export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);

  const [allCats, setAllCats] = useState<Cat[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [q, setQ] = useState("");
  const qDeferred = useDeferredValue(q);

  const [catF, setCatF] = useState<"all" | number>("all");
  const [statusF, setStatusF] = useState<"all" | "open" | "closed">("all");

  const [viewing, setViewing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorInitial, setEditorInitial] = useState<Product>(() => buildBaseProduct());

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products", { credentials: "include" }),
        fetch("/api/admin/categories", { credentials: "include" }),
      ]);

      const pJson = pRes.ok ? await pRes.json() : [];
      const cJson = cRes.ok ? await cRes.json() : [];

      const pArr = Array.isArray(pJson) ? pJson : [];
      const normalized = pArr.map((p: any) => {
        const imagesUrls = normalizeImagesToUrls(p.images);
        const categories = normalizeCategoriesToIds(p.categories);

        return {
          ...p,
          price: toNumberMoney(p.price),
          original_price:
            p.original_price === null || p.original_price === undefined ? null : toNumberMoney(p.original_price),
          discount_percent: Number(p.discount_percent || 0),
          stock: Number(p.stock || 0),
          sold: Number(p.sold || 0),
          status: p.status === "closed" ? "closed" : "open",
          image: p.image || imagesUrls[0] || "",
          images: imagesUrls,
          categories,
          colors: Array.isArray(p.colors) ? p.colors : [],
          specs: Array.isArray(p.specs) ? p.specs : [],
        } as Product;
      });

      setProducts(normalized);
      setAllCats(Array.isArray(cJson) ? cJson : []);
    } catch {
      toast.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    const kw = qDeferred.trim().toLowerCase();
    return products.filter((p) => {
      const okKw =
        !kw ||
        String(p.name || "").toLowerCase().includes(kw) ||
        String(p.sku || "").toLowerCase().includes(kw);

      const okCat =
        catF === "all" ? true : Array.isArray(p.categories) ? p.categories.includes(catF) : false;

      const okStatus = statusF === "all" ? true : p.status === statusF;

      return okKw && okCat && okStatus;
    });
  }, [products, qDeferred, catF, statusF]);

  const openEditor = useCallback((p?: Product) => {
    const base = buildBaseProduct(p);
    setEditorInitial(base);
    setEditorOpen(true);
  }, []);

  const handleDuplicate = useCallback(
    (p: Product) => {
      const clone: Product = { ...p, id: undefined, name: `${p.name} (Copy)`, slug: "" };
      openEditor(clone);
    },
    [openEditor]
  );

  const handleDelete = useCallback(async () => {
    if (!confirmDelete?.id) return;
    try {
      const r = await fetch(`/api/admin/products/${confirmDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!r.ok) return toast.error("Xóa thất bại");
      toast.success("Đã xóa");
      setConfirmDelete(null);
      await loadAll();
    } catch {
      toast.error("Xóa lỗi (network)");
    }
  }, [confirmDelete, loadAll]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-20 bg-white border-b border-zinc-200">
        {/* ✅ FULL WIDTH: bỏ max-w-7xl mx-auto */}
        <div className="flex items-center justify-between w-full h-16 px-6">
          <div>
            <h1 className="text-lg font-bold">Sản phẩm</h1>
            <div className="text-xs text-zinc-500">
              API_BASE: <span className="font-mono">{API_BASE}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setQ("");
                setCatF("all");
                setStatusF("all");
              }}
            >
              Reset
            </Button>
            <Button onClick={() => openEditor()}>
              <Package size={16} /> Thêm mới
            </Button>
          </div>
        </div>

        {/* ✅ FULL WIDTH */}
        <div className="flex items-center justify-between w-full gap-3 px-6 pb-4">
          <div className="flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm tên, mã SKU..."
              className="w-full py-2 pl-4 pr-4 text-sm border rounded-md outline-none bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={catF}
              onChange={(e) => setCatF(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 text-sm bg-white border rounded-md outline-none h-9 border-zinc-200"
            >
              <option value="all">Tất cả danh mục</option>
              {allCats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusF}
              onChange={(e) => setStatusF(e.target.value as any)}
              className="px-3 text-sm bg-white border rounded-md outline-none h-9 border-zinc-200"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="open">Đang bán</option>
              <option value="closed">Ngưng bán</option>
            </select>
          </div>
        </div>
      </header>

      {/* ✅ FULL WIDTH: bỏ max-w-7xl mx-auto */}
      <main className="w-full px-6 py-6">
        {loading ? (
          <div className="py-20 text-center text-zinc-400 animate-pulse">Đang tải dữ liệu...</div>
        ) : (
          <div className="w-full overflow-hidden bg-white border rounded-lg shadow-sm border-zinc-200">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-semibold uppercase border-b bg-zinc-50 border-zinc-200 text-zinc-500">
                <tr>
                  <th className="w-16 px-4 py-3">Image</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3 text-right">Giá bán</th>
                  <th className="px-4 py-3 text-center">Kho</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {filtered.map((p) => (
                  <ProductRow
                    key={String(p.id)}
                    p={p}
                    onView={setViewing}
                    onDup={handleDuplicate}
                    onEdit={openEditor}
                    onDel={setConfirmDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* VIEW */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setViewing(null)} />
          <div className="relative flex flex-col w-full h-full max-w-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Chi tiết sản phẩm</h2>
              <button onClick={() => setViewing(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="overflow-hidden border rounded-lg aspect-square bg-zinc-100">
                <img
                  src={toAbsImageUrl(viewing.image || "")}
                  className="object-cover w-full h-full"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK)}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900">{viewing.name}</h3>

                {(() => {
                  const price = toNumberMoney(viewing.price);
                  const original =
                    viewing.original_price === null || viewing.original_price === undefined
                      ? 0
                      : toNumberMoney(viewing.original_price);
                  const pct = calcDiscountPercent(original, price);

                  return (
                    <div className="mt-1">
                      <div className="text-lg font-semibold text-emerald-600">{formatVND(price)} ₫</div>
                      {original > price ? (
                        <div className="text-sm text-zinc-500">
                          <span className="line-through">{formatVND(original)} ₫</span>
                          {pct > 0 ? <span className="ml-2 text-emerald-700">-{pct}%</span> : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>

              <div className="p-4 space-y-2 text-sm border rounded-lg text-zinc-600 bg-zinc-50">
                <div className="flex justify-between">
                  <span>Slug:</span> <span className="font-mono">{viewing.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span> <span>{viewing.sku || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kho:</span> <b>{Number(viewing.stock || 0)}</b>
                </div>
                <div className="flex justify-between">
                  <span>Đã bán:</span> <b>{Number(viewing.sold || 0)}</b>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold uppercase text-zinc-500">Mô tả</h4>
                <div className="text-sm text-zinc-700 whitespace-pre-wrap bg-white p-3 border rounded-md min-h-[100px]">
                  {viewing.description || "Chưa có mô tả"}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-zinc-50">
              <Button
                onClick={() => {
                  openEditor(viewing);
                  setViewing(null);
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DRAWER */}
      <EditorDrawer
        open={editorOpen}
        initial={editorInitial}
        cats={allCats}
        onClose={() => setEditorOpen(false)}
        onSaved={loadAll}
      />

      {/* DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-zinc-900">Xác nhận xóa?</h3>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Hủy
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
