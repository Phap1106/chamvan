// src/app/admin/products/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/* ================== Types ================== */
type Color = { name: string; hex?: string };
type Spec = { label: string; value: string };

type Product = {
  id?: number | string;
  name: string;
  slug: string;
  price: number; // lưu dạng number
  sku?: string;
  description?: string;
  image?: string;
  images?: string[];
  colors?: Color[];
  specs?: Spec[];
  categories?: Array<{ id: number; name: string; slug: string }>;

  stock?: number;
  sold?: number;
  status?: 'open' | 'closed';
};

type Category = { id: number; name: string; slug: string };

type LocalGallery = {
  url: string;
  kind: 'url' | 'file';
  file?: File;
};

/* ================== Utils ================== */
/** slugify tiếng Việt + giữ a-z0-9, dash */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD') // tách dấu
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-') // non-alnum -> -
    .replace(/^-+|-+$/g, '') // trim -
    .replace(/-{2,}/g, '-') // collapse --
    .slice(0, 120);

function uniqueGallery(arr: LocalGallery[]): LocalGallery[] {
  const seen = new Set<string>();
  const out: LocalGallery[] = [];
  for (const g of arr) {
    if (seen.has(g.url)) continue;
    seen.add(g.url);
    out.push(g);
  }
  return out;
}

/** Định dạng số theo vi-VN */
const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

/** Parse mọi ký tự chỉ lấy số */
const parseDigits = (s: string) => {
  const m = s.replace(/[^\d]/g, '');
  return m ? Number(m) : 0;
};

/* ================== Small UI blocks ================== */
function Card({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow-sm rounded-2xl">
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="px-4 pt-0 pb-4">{children}</div>
    </div>
  );
}


/* ============== Toast (tự ẩn) ============== */
type ToastKind = 'success' | 'error' | 'info';
type Toast = { id: number; kind: ToastKind; message: string };
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);
  function push(kind: ToastKind, message: string, ms = 2600) {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms);
  }
  return { toasts, push, remove: (id: number) => setToasts((t) => t.filter((x) => x.id !== id)) };
}

/* ========== Tiny components ========== */
function Toggle({
  checked,
  onChange,
  labelOn = 'On',
  labelOff = 'Off',
}: {
  checked: boolean;
  onChange: () => void;
  labelOn?: string;
  labelOff?: string;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
        checked ? 'bg-emerald-500' : 'bg-gray-300'
      }`}
      aria-pressed={checked}
      aria-label="toggle"
    >
      <span
        className={`absolute left-0 top-0 m-0.5 inline-block h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
      <span className="sr-only">{checked ? labelOn : labelOff}</span>
    </button>
  );
}

/** Input giá: hiển thị vi-VN, trả ra số */
function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(formatVND(value));
  useEffect(() => {
    // sync khi value thay đổi từ bên ngoài
    setRaw(formatVND(value));
  }, [value]);

  return (
    <input
      inputMode="numeric"
      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
      placeholder={placeholder || '0'}
      value={raw}
      onChange={(e) => {
        const n = parseDigits(e.target.value);
        setRaw(formatVND(n));
        onChange(n);
      }}
      onBlur={() => setRaw(formatVND(parseDigits(raw)))}
    />
  );
}

/* ================== Page ================== */
export default function AdminProductsPage() {
  /* list */
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  /* categories */
  const [allCats, setAllCats] = useState<Category[]>([]);
  const [catsLoaded, setCatsLoaded] = useState(false);

  /* filters (toolbar) */
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState<'all' | 'open' | 'closed'>('all');
  const [catF, setCatF] = useState<number | 'all'>('all');

  /* editor / viewer / confirm */
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const closeViewer = () => setViewing(null);

  /* gallery */
  const [gallery, setGallery] = useState<LocalGallery[]>([]);
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  /* Editor states: category multi-select + auto slug control + price */
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [slugTouched, setSlugTouched] = useState(false); // nếu user từng sửa slug thủ công

  /* toasts */
  const { toasts, push: notify, remove } = useToasts();

  /* ======= Loaders ======= */
  // async function loadProducts() {
  //   setLoading(true);
  //   setErr(null);
  //   try {
  //     const res = await fetch('/api/admin/products', { cache: 'no-store' });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.message || 'Không tải được sản phẩm');
  //     const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  //     setList(items);
  //   } catch (e: any) {
  //     setErr(e?.message || 'Lỗi tải dữ liệu');
  //     notify('error', e?.message || 'Lỗi tải dữ liệu');
  //   } finally {
  //     setLoading(false);
  //   }
  // }
// ...existing code...
async function loadProducts() {
  setLoading(true);
  setErr(null);
  try {
    const res = await fetch('/api/admin/products', { cache: 'no-store' });

    // đọc raw text để chắc chắn log được mọi thứ (tránh lỗi parse json)
    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    // DEBUG: in ra console để kiểm tra chính xác shape BE trả về
    // Mở DevTools -> Console / Network để xem
    // eslint-disable-next-line no-console
    console.log('[AdminProducts] GET /api/admin/products', { status: res.status, ok: res.ok, body: data });

    if (!res.ok) {
      // nếu BE trả message trong body
      const msg = (data && (data.message || data.error)) || 'Không tải được sản phẩm';
      throw new Error(msg);
    }

    // tolerant parsing: hỗ trợ nhiều wrapper phổ biến
    const arr =
      Array.isArray(data) ? data : data?.items || data?.data || data?.rows || data?.products || [];

    // Normalize mỗi product: đảm bảo price là number, images array, categories là array of objects...
    const items = (arr || []).map((p: any) => {
   let imagesRaw = p.images ?? p.gallery ?? p.pictures ?? [];
      if (typeof imagesRaw === 'string') {
       // thử parse JSON, nếu fail thì coi là CSV
      try {
        const parsed = JSON.parse(imagesRaw);
         imagesRaw = Array.isArray(parsed) ? parsed : String(imagesRaw).split(',').map((s) => s.trim());
     } catch {
          imagesRaw = String(imagesRaw).split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      let images: string[] = [];
      if (Array.isArray(imagesRaw)) {
        images = imagesRaw
          .map((it: any) => {
            if (!it) return '';
            if (typeof it === 'string') return it;
          // object: lấy các trường phổ biến
            return String(it.url ?? it.path ?? it.src ?? it.image ?? it.filename ?? '');
         })
          .filter(Boolean);
      }     const image = (p.image && String(p.image)) || images[0] || '';
      const categories = Array.isArray(p.categories)
        ? p.categories.map((c: any) => ({ id: Number(c.id), name: String(c.name || ''), slug: String(c.slug || '') }))
        : [];

      // price đôi khi trả về string -> ép về number (0 fallback)
      const price = Number(p.price ?? p.price_vnd ?? 0);

      return {
        ...p,
        price,
        images,
        image,
        categories,
        stock: Number(p.stock ?? 0),
        sold: Number(p.sold ?? 0),
        status: p.status === 'closed' ? 'closed' : 'open',
      };
    });

    setList(items);
  } catch (e: any) {
    setErr(e?.message || 'Lỗi tải dữ liệu');
    notify('error', e?.message || 'Lỗi tải dữ liệu');
  } finally {
    setLoading(false);
  }
}
// ...existing code...
  async function loadCategories() {
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error();
      const items: Category[] = (Array.isArray(data) ? data : data?.items || []).map((c: any) => ({
        id: Number(c.id),
        name: String(c.name),
        slug: String(c.slug),
      }));
      setAllCats(items);
    } catch {
      setAllCats([]);
    } finally {
      setCatsLoaded(true);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  /* ======= Helpers ======= */
  function startAdd() {
    setEditing({
      name: '',
      slug: '',
      price: 0,
      sku: '',
      description: '',
      image: '',
      images: [],
      colors: [],
      specs: [],
      stock: 0,
      sold: 0,
      status: 'open',
    });
    setSelectedCatIds([]);
    setSlugTouched(false);
    setGallery([]);
    setTab('url');
  }

// ...existing code...
  function startEdit(p: Product) {
    setEditing({ ...p, slug: p.slug ?? slugify(p.name) });
    setSelectedCatIds((p.categories || []).map((c) => Number(c.id)));
    setSlugTouched(false);

    const imgs = (p as any).images ?? [];
    let arr: any[] = [];
    if (typeof imgs === 'string') {
      try {
        const parsed = JSON.parse(imgs);
        arr = Array.isArray(parsed) ? parsed : String(imgs).split(',').map((s) => s.trim());
      } catch {
        arr = String(imgs).split(',').map((s) => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(imgs)) arr = imgs;
    else arr = [];

    // tạo mảng tạm, lọc falsy, rồi map chắc chắn thành LocalGallery[]
    const normalizedAny = arr
      .map((it: any) => {
        const url =
          typeof it === 'string'
            ? it
            : String(it?.url ?? it?.path ?? it?.src ?? it?.image ?? it?.filename ?? '');
        return url ? { url, kind: 'url' as const } : null;
      })
      .filter(Boolean);

    const normalized = (normalizedAny as any[]).map((x) => ({ url: String(x.url), kind: x.kind as 'url' }));

    setGallery(normalized as LocalGallery[]);
    setTab('url');
  }
// ...existing code...
  function addUrlFromInput() {
    const el = urlInputRef.current;
    if (!el) return;
    const urls = el.value
      .trim()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!urls.length) return;
    setGallery((prev) => uniqueGallery([...prev, ...urls.map((u) => ({ url: u, kind: 'url' as const }))]));
    el.value = '';
  }

  function onPickFiles(files: FileList | null) {
    if (!files?.length) return;
    const mapped = Array.from(files)
      .slice(0, 20)
      .map((f) => ({ url: URL.createObjectURL(f), kind: 'file' as const, file: f }));
    setGallery((prev) => uniqueGallery([...prev, ...mapped]));
  }

  function removeItem(idx: number) {
    setGallery((prev) => {
      const n = [...prev];
      const g = n[idx];
      if (g?.kind === 'file' && g.url.startsWith('blob:')) URL.revokeObjectURL(g.url);
      n.splice(idx, 1);
      return n;
    });
  }
  function move(idx: number, dir: -1 | 1) {
    setGallery((prev) => {
      const n = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= n.length) return n;
      [n[idx], n[j]] = [n[j], n[idx]];
      return n;
    });
  }

  /* ======= Save/Delete/Toggle ======= */
  async function save(p: Product) {
    if (!catsLoaded) return notify('error', 'Danh mục chưa tải xong, thử lại.'), setErr('Danh mục chưa tải xong, thử lại.');
    if (!p.name.trim()) return notify('error', 'Tên sản phẩm không được trống'), setErr('Tên sản phẩm không được trống');

    const galleryUrls = gallery.map((g) => g.url).filter((u) => /^https?:\/\//i.test(u));
    const mainImage = p.image && /^https?:\/\//i.test(p.image) ? p.image : galleryUrls[0] || '';

    const payload = {
      name: p.name.trim(),
      slug: (p.slug?.trim() || slugify(p.name)) || slugify(p.name),
      price: String(Number(p.price || 0)), // BE nhận string -> number
      sku: p.sku?.trim() || undefined,
      description: p.description?.trim() || undefined,
      image: mainImage || undefined,
      images: galleryUrls,
      colors: (p.colors || []).filter((c) => c.name?.trim()),
      specs: (p.specs || []).filter((s) => s.label?.trim() && s.value?.trim()),
      categories: selectedCatIds, // MULTI
      stock: Math.max(0, Number(p.stock ?? 0)),
      sold: Math.max(0, Number(p.sold ?? 0)),
      status: p.status === 'closed' ? 'closed' : 'open',
    };

    const isUpdate = Boolean(p.id);
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(isUpdate ? `/api/admin/products/${p.id}` : `/api/admin/products`, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Lưu thất bại');

      await loadProducts();
      setEditing(null);
      setGallery([]);
      setSelectedCatIds([]);
      notify('success', isUpdate ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công', 2800);
    } catch (e: any) {
      notify('error', e?.message || 'Lỗi lưu', 3200);
      setErr(e?.message || 'Lỗi lưu');
    } finally {
      setSaving(false);
    }
  }

  async function removeConfirmed(id: number | string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.status !== 204 && !res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Xoá thất bại');
      }
      setList((prev) => prev.filter((p) => p.id !== id));
      notify('success', 'Đã xoá sản phẩm', 2400);
    } catch (e: any) {
      notify('error', e?.message || 'Xoá thất bại', 3200);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  async function toggleStatus(p: Product) {
    const next: 'open' | 'closed' = p.status === 'closed' ? 'open' : 'closed';
    setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x))); // optimistic
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('Không cập nhật được trạng thái');
      notify('success', next === 'open' ? 'Đã mở bán' : 'Đã đóng bán');
    } catch (e: any) {
      setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: p.status } : x)));
      notify('error', e?.message || 'Lỗi cập nhật trạng thái');
    }
  }

  /* ======= Filters ======= */
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return list.filter((p) => {
      const matchQ =
        !qLower ||
        p.name?.toLowerCase().includes(qLower) ||
        p.slug?.toLowerCase().includes(qLower) ||
        p.sku?.toLowerCase().includes(qLower);
      const matchStatus = statusF === 'all' ? true : p.status === statusF;
      const matchCat =
        catF === 'all' ? true : (p.categories || []).some((c) => c.id === catF);
      return matchQ && matchStatus && matchCat;
    });
  }, [list, q, statusF, catF]);

  /* ================== Render ================== */
  return (
    <div className="p-2 bg-slate-50 md:p-3">
      {/* Toasts */}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
           className={[
  'pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-xl backdrop-blur',
  t.kind === 'success' ? 'bg-emerald-50 text-emerald-800' : '',
  t.kind === 'error' ? 'bg-red-50 text-red-800' : '',
  t.kind === 'info' ? 'bg-white/90 text-gray-800' : '',
].join(' ')}

          >
            <div className="text-lg leading-none">{t.kind === 'success' ? '✅' : t.kind === 'error' ? '⚠️' : 'ℹ️'}</div>
            <div className="text-sm">{t.message}</div>
            <button onClick={() => remove(t.id)} className="ml-2 text-xs text-gray-500 hover:text-gray-800" aria-label="close">
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Top bar */}
    <div className="sticky top-0 z-20 p-3 mb-3 shadow-sm rounded-2xl bg-white/90 backdrop-blur">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {/* view switch (placeholder) */}
            <div className="flex items-center p-1 border rounded-full bg-gray-50">
              <button className="rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm">List</button>
              <button className="rounded-full px-3 py-1.5 text-xs text-gray-500 hover:bg-white">Grid</button>
            </div>
            {/* search */}
            <div className="relative w-full md:w-[420px]">
              <span className="absolute text-gray-400 -translate-y-1/2 pointer-events-none left-3 top-1/2">🔎</span>
              <input
                className="w-full py-2 pr-3 text-sm border rounded-full outline-none bg-gray-50 pl-9 focus:ring-2 focus:ring-gray-300"
                placeholder="Tìm theo tên, SKU, slug…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
           <button onClick={loadProducts} className="px-3 py-2 text-sm rounded-full bg-slate-100 hover:bg-slate-200">
  Làm mới
</button>
<button onClick={startAdd} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600">
  + Thêm sản phẩm
</button>

          </div>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <select
            value={catF}
            onChange={(e) => setCatF(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 text-sm border rounded-full outline-none bg-gray-50 hover:bg-white"
            title="Danh mục"
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
            className="px-3 py-2 text-sm border rounded-full outline-none bg-gray-50 hover:bg-white"
            title="Trạng thái"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Active</option>
            <option value="closed">No Active</option>
          </select>
        </div>
      </div>

      {/* Danh sách */}
      {err && <div className="p-3 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">{err}</div>}
{loading ? (
  <div className="p-8 text-center text-gray-600 bg-white shadow-sm rounded-2xl">Đang tải…</div>
) : (
  <div className="overflow-x-auto bg-white shadow-sm rounded-2xl">
    <table className="min-w-[1040px] w-full text-sm border-separate border-spacing-y-10">
      <thead className="sticky top-[90px] z-10 bg-white/90 backdrop-blur">
        <tr>
          <th className="w-12 px-4 py-2 text-xs font-semibold text-left text-gray-500">#</th>
          <th className="px-4 py-2 text-xs font-semibold text-left text-gray-500">Sản phẩm</th>
          <th className="w-40 px-4 py-2 text-xs font-semibold text-left text-gray-500">Slug</th>
          <th className="w-32 px-4 py-2 text-xs font-semibold text-left text-gray-500">SKU</th>
          <th className="px-4 py-2 text-xs font-semibold text-right text-gray-500 w-36">Giá</th>
          <th className="w-[260px] px-4 py-2 text-left text-xs font-semibold text-gray-500">Tiến độ bán</th>
          <th className="px-4 py-2 text-xs font-semibold text-left text-gray-500 w-28">Active</th>
          <th className="px-4 py-2 text-xs font-semibold text-right text-gray-500 w-44">Thao tác</th>
        </tr>
      </thead>

      <tbody className="align-middle">
        {[...filtered].sort((a:any,b:any)=> {
          const ao = Number.isFinite(a.order) ? a.order : Number.POSITIVE_INFINITY;
          const bo = Number.isFinite(b.order) ? b.order : Number.POSITIVE_INFINITY;
          if (ao !== bo) return ao - bo;
          return String(a.name||'').localeCompare(String(b.name||''),'vi',{numeric:true,sensitivity:'base'});
        }).map((p:any, i:number) => {
          const stock = Math.max(0, p.stock ?? 0);
          const sold  = Math.max(0, p.sold ?? 0);
          const target = Math.max(1, stock + sold);
          const ratio  = Math.min(100, Math.round((sold/target)*100));
          const barColor =
            ratio >= 80 ? 'bg-emerald-500' : ratio >= 50 ? 'bg-amber-500' : ratio > 0 ? 'bg-orange-500' : 'bg-gray-300';

          return (
            <tr key={String(p.id)} className="hover:bg-slate-50/60">
              <td className="px-4 py-3">{i + 1}</td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-4">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="object-cover w-24 h-18 rounded-xl" />
                  ) : (
                    <div className="w-24 h-18 rounded-xl bg-slate-100" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {(p.categories || []).map((c:any)=>c.name).join(' · ') || '—'}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3">
                <span className="rounded px-2 py-0.5 text-xs bg-slate-100">{(p as any).slug || ''}</span>
              </td>

              <td className="px-4 py-3">{p.sku || '—'}</td>

              <td className="px-4 py-3 text-right">{formatVND(p.price)}₫</td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-full h-2 rounded-full bg-slate-200">
                    <div className={`absolute left-0 top-0 h-2 rounded-full ${barColor}`} style={{ width: `${ratio}%` }} />
                  </div>
                  <div className="text-xs text-right text-gray-600 w-28">{sold}/{target}</div>
                </div>
              </td>

              <td className="px-4 py-3">
                <Toggle checked={p.status !== 'closed'} onChange={() => toggleStatus(p)} labelOn="Mở" labelOff="Đóng" />
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200" onClick={() => setViewing(p)}>
                    Xem
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200" onClick={() => startEdit(p)}>
                    Sửa
                  </button>
                  <button
                    className="px-2.5 py-1 text-xs rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                    onClick={() => setConfirmDelete(p)}
                    disabled={deleting === p.id}
                  >
                    {deleting === p.id ? 'Đang xoá…' : 'Xoá'}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}

        {!filtered.length && (
          <tr>
            <td colSpan={8} className="px-4 py-10 text-center text-gray-500">Không có sản phẩm phù hợp bộ lọc</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}


      {/* ========== Modal Editor ========== */}
      {editing && (
        <div className="fixed inset-0 z-50 grid p-4 place-items-center bg-black/40">
          <div className="flex flex-col w-full max-w-6xl overflow-hidden bg-white border shadow-2xl rounded-2xl">
            {/* Titlebar */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{editing.id ? 'Edit Product' : 'New Product'}</h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setGallery([]);
                  setSelectedCatIds([]);
                  setSlugTouched(false);
                }}
                className="grid border rounded-lg h-9 w-9 place-items-center hover:bg-gray-50"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="grid max-h-[78vh] grid-cols-1 gap-6 overflow-y-auto bg-slate-50 p-6 lg:grid-cols-12">
              {/* LEFT (7) */}
              <div className="space-y-6 lg:col-span-7">
                <Card title="Description" subtitle="Product name & detailed description.">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">Product Name</label>
                      <input
                        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Ví dụ: Bộ bàn ghế gỗ hương"
                        value={editing.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setEditing((prev) => {
                            const next = { ...(prev as Product), name };
                            // auto-slug nếu user chưa từng sửa slug thủ công
                            if (!slugTouched) next.slug = slugify(name);
                            return next;
                          });
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Slug (auto)</label>
                        <input
                          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="bo-ban-ghe-go-huong"
                          value={editing.slug}
                          onChange={(e) => {
                            setSlugTouched(true);
                            setEditing({ ...(editing as Product), slug: slugify(e.target.value) });
                          }}
                          onBlur={() => {
                            // tránh rỗng
                            if (!editing.slug?.trim()) {
                              setEditing((prev) => ({ ...(prev as Product), slug: slugify(editing.name || '') }));
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Main Image (URL)</label>
                        <input
                          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="https://..."
                          value={editing.image || ''}
                          onChange={(e) => setEditing({ ...(editing as Product), image: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Tồn kho</label>
                        <input
                          className="w-full p-2 border rounded"
                          type="number"
                          min={0}
                          value={editing.stock ?? 0}
                          onChange={(e) => setEditing({ ...(editing as Product), stock: Math.max(0, Number(e.target.value || 0)) })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Đã bán</label>
                        <input
                          className="w-full p-2 border rounded"
                          type="number"
                          min={0}
                          value={editing.sold ?? 0}
                          onChange={(e) => setEditing({ ...(editing as Product), sold: Math.max(0, Number(e.target.value || 0)) })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Trạng thái</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={editing.status ?? 'open'}
                          onChange={(e) => setEditing({ ...(editing as Product), status: e.target.value as 'open' | 'closed' })}
                        >
                          <option value="open">Mở bán</option>
                          <option value="closed">Đóng</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">Business Description</label>
                      <textarea
                        className="min-h-[140px] w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Mô tả chi tiết sản phẩm…"
                        value={editing.description || ''}
                        onChange={(e) => setEditing({ ...(editing as Product), description: e.target.value })}
                      />
                    </div>
                  </div>
                </Card>

                {/* MULTI CATEGORIES */}
                <Card title="Categories" subtitle="Chọn nhiều danh mục cho sản phẩm.">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    <span className="text-gray-600">Đã chọn:</span>
                    <b>{selectedCatIds.length}</b>
                    <button
                      className="rounded border px-2 py-0.5 hover:bg-slate-50"
                      onClick={() => setSelectedCatIds(allCats.map((c) => c.id))}
                    >
                      Chọn hết
                    </button>
                    <button className="rounded border px-2 py-0.5 hover:bg-slate-50" onClick={() => setSelectedCatIds([])}>
                      Bỏ hết
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {allCats.length ? (
                      allCats.map((c) => {
                        const checked = selectedCatIds.includes(c.id);
                        return (
                          <label
                            key={c.id}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 ${
                              checked ? 'bg-emerald-50 border-emerald-200' : ''
                            }`}
                          >
                            <span className="truncate">
                              {c.name} <span className="text-xs text-gray-500">/{c.slug}</span>
                            </span>
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={checked}
                              onChange={() =>
                                setSelectedCatIds((prev) =>
                                  prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                                )
                              }
                            />
                          </label>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-xs text-gray-500 border rounded-lg">Không có danh mục</div>
                    )}
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card title="Specifications (optional)">
                    <SpecsEditor value={editing.specs || []} onChange={(specs) => setEditing({ ...(editing as Product), specs })} />
                  </Card>
                  <Card title="Colors (optional)">
                    <ColorsEditor value={editing.colors || []} onChange={(colors) => setEditing({ ...(editing as Product), colors })} />
                  </Card>
                </div>
              </div>

              {/* RIGHT (5) */}
              <div className="space-y-6 lg:col-span-5">
                <Card
                  title="Product Image"
                  subtitle="Paste image URLs or preview uploaded files."
                  actions={
                    <div className="grid grid-cols-2 overflow-hidden border rounded-lg">
                      <button
                        onClick={() => setTab('url')}
                        className={`px-3 py-1.5 text-xs ${tab === 'url' ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}
                      >
                        Use URL
                      </button>
                      <button
                        onClick={() => setTab('upload')}
                        className={`px-3 py-1.5 text-xs ${tab === 'upload' ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}
                      >
                        Upload (preview)
                      </button>
                    </div>
                  }
                >
                  {tab === 'url' ? (
                    <div className="space-y-2">
                      <input
                        ref={urlInputRef}
                        className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Dán 1 hoặc nhiều URL, phân tách bằng dấu phẩy"
                      />
                      <button onClick={addUrlFromInput} className="w-full px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">
                        Thêm vào gallery
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => onPickFiles(e.target.files)}
                        className="block w-full cursor-pointer rounded-lg border p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white"
                      />
                      <div className="p-2 text-xs border rounded-lg bg-amber-50/60 text-amber-700">
                        Chưa bật upload — ảnh tải lên chỉ để <b>xem trước</b>. Khi lưu, hệ thống chỉ gửi các URL http/https.
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  <div className="grid grid-cols-2 gap-3 mt-3 md:grid-cols-3">
                    {gallery.map((g, idx) => (
                      <div key={g.url} className="relative p-2 border rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.url} alt="" className="object-cover w-full rounded h-28" />
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5">
                            {idx + 1}
                            <span className={`ml-1 rounded px-1 ${g.kind === 'file' ? 'bg-amber-200' : 'bg-emerald-200'}`}>{g.kind}</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <button className="rounded border px-1.5 py-0.5" onClick={() => move(idx, -1)} title="Lên">
                              ↑
                            </button>
                            <button className="rounded border px-1.5 py-0.5" onClick={() => move(idx, 1)} title="Xuống">
                              ↓
                            </button>
                            <button className="rounded border px-1.5 py-0.5 text-red-600" onClick={() => removeItem(idx)} title="Xoá">
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {gallery.length === 0 && (
                      <div className="p-4 text-sm text-center text-gray-500 border rounded-lg col-span-full">Chưa có ảnh</div>
                    )}
                  </div>
                </Card>

                <Card title="Sales" subtitle="Price & SKU">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">Price (VND)</label>
                      <PriceInput
                        value={editing.price || 0}
                        onChange={(v) => setEditing({ ...(editing as Product), price: v })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">SKU</label>
                      <input
                        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Mã hàng nội bộ (tuỳ chọn)"
                        value={editing.sku || ''}
                        onChange={(e) => setEditing({ ...(editing as Product), sku: e.target.value })}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-white border-t">
              <button
                onClick={() => {
                  setEditing(null);
                  setGallery([]);
                  setSelectedCatIds([]);
                  setSlugTouched(false);
                }}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50"
              >
                Discard
              </button>
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50" onClick={() => save(editing as Product)} disabled={saving}>
                Save Product
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60"
                onClick={() => save(editing as Product)}
                disabled={saving}
              >
                {editing?.id ? 'Update' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Viewer ========== */}
      {viewing && (
        <div className="fixed inset-0 z-40 grid p-4 place-items-center bg-black/40">
          <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white border shadow-xl rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="text-lg font-semibold">Chi tiết sản phẩm</div>
              <button onClick={closeViewer} className="grid border rounded-lg h-9 w-9 place-items-center hover:bg-gray-50">
                ✕
              </button>
            </div>

            <div className="grid max-h-[78vh] grid-cols-1 gap-6 overflow-y-auto bg-slate-50 p-6 md:grid-cols-2">
              <div className="space-y-3">
                {viewing.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={viewing.image} alt="" className="object-cover w-full h-64 rounded-xl ring-1 ring-gray-200" />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-xl" />
                )}
                <div className="grid items-center grid-cols-5 gap-2">
                  <div className="col-span-1 text-xs font-medium text-gray-600">Ảnh chính</div>
                  <input readOnly value={viewing.image || ''} className="col-span-4 w-full rounded-lg border px-2 py-1.5 text-xs" />
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium text-gray-600">Gallery ({(viewing.images || []).length})</div>
                  <div className="grid grid-cols-5 gap-2">
                    {(viewing.images || []).map((u, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={u + i} src={u} alt="" className="object-cover w-full h-16 rounded ring-1 ring-gray-200" />
                    ))}
                    {!(viewing.images || []).length && (
                      <div className="p-3 text-xs text-center text-gray-500 border rounded-lg col-span-full">Chưa có ảnh</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{viewing.name}</h3>
                  <span className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">#{viewing.id}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded bg-gray-100 px-2 py-0.5">Slug: {(viewing as any).slug || '—'}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5">SKU: {viewing.sku || '—'}</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">
                    {formatVND(viewing.price || 0)}₫
                  </span>
                </div>

                <div className="text-sm text-gray-700">
                  <span className="font-medium">Danh mục:</span> {(viewing.categories || []).map((c) => c.name).join(' · ') || '—'}
                </div>

                <Card title="Nội dung / Mô tả">
                  <div className="text-sm whitespace-pre-wrap">{viewing.description || '—'}</div>
                </Card>

                <Card title="Thông số">
                  {(viewing.specs || []).length ? (
                    <ul className="space-y-1 text-sm">
                      {(viewing.specs || []).map((s, i) => (
                        <li key={i} className="grid items-center grid-cols-5 gap-2">
                          <span className="col-span-2 text-gray-600">{s.label}</span>
                          <span className="col-span-3 font-medium">{s.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-gray-500">—</div>
                  )}
                </Card>

                <Card title="Màu sắc">
                  <div className="flex flex-wrap gap-2">
                    {(viewing.colors || []).length ? (
                      (viewing.colors || []).map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs">
                          <span className="w-3 h-3 rounded-full ring-1 ring-gray-300" style={{ background: c.hex || '#eee' }} />
                          {c.name}
                          {c.hex ? ` (${c.hex})` : ''}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </div>
                  <div className="mt-2 space-x-2 text-sm text-gray-600">
                    <span>
                      Tồn kho: <b>{viewing.stock ?? 0}</b>
                    </span>
                    <span>
                      Đã bán: <b>{viewing.sold ?? 0}</b>
                    </span>
                    <span>
                      Trạng thái: <b>{viewing.status === 'closed' ? 'Đóng' : 'Mở'}</b>
                    </span>
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-white border-t">
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50" onClick={closeViewer}>
                Đóng
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                onClick={() => {
                  setEditing(viewing);
                  setSelectedCatIds((viewing?.categories || []).map((c) => Number(c.id)));
                  setSlugTouched(false);
                  closeViewer();
                }}
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Confirm delete dialog ========== */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid p-4 place-items-center bg-black/40">
          <div className="w-full max-w-md overflow-hidden bg-white border shadow-xl rounded-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div className="text-base font-semibold">Xác nhận xoá</div>
              <button className="grid border rounded-lg h-9 w-9 place-items-center hover:bg-gray-50" onClick={() => setConfirmDelete(null)}>
                ✕
              </button>
            </div>
            <div className="px-5 py-4 space-y-2 text-sm">
              <p>
                Bạn chắc chắn muốn xoá <b>“{confirmDelete.name}”</b>? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t">
              <button className="px-3 py-2 border rounded-lg" onClick={() => setConfirmDelete(null)}>
                Huỷ
              </button>
              <button
                className="px-3 py-2 text-white bg-red-600 rounded-lg disabled:opacity-60"
                onClick={() => removeConfirmed(confirmDelete.id!)}
                disabled={deleting === confirmDelete.id}
              >
                {deleting === confirmDelete.id ? 'Đang xoá…' : 'Xoá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Editors (optional) ========== */
function ColorsEditor({ value, onChange }: { value: Color[]; onChange: (v: Color[]) => void }) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('');
  function add() {
    if (!name.trim()) return;
    onChange([...(value || []), { name: name.trim(), hex: hex.trim() }]);
    setName('');
    setHex('');
  }
  function removeIdx(idx: number) {
    const n = [...value];
    n.splice(idx, 1);
    onChange(n);
  }
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input className="flex-1 px-3 py-2 text-sm border rounded-lg" placeholder="Tên màu" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="px-3 py-2 text-sm border rounded-lg w-28" placeholder="#hex" value={hex} onChange={(e) => setHex(e.target.value)} />
        <button onClick={add} className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">
          Thêm
        </button>
      </div>
      <ul className="space-y-1 text-sm">
        {value?.map((c, i) => (
          <li key={`${c.name}-${i}`} className="flex items-center justify-between">
            <span className="truncate">
              {c.name}
              {c.hex ? ` (${c.hex})` : ''}
            </span>
            <button className="text-red-600" onClick={() => removeIdx(i)}>
              Xoá
            </button>
          </li>
        ))}
        {!value?.length && <li className="text-xs text-gray-500">Chưa có màu</li>}
      </ul>
    </div>
  );
}

function SpecsEditor({ value, onChange }: { value: Spec[]; onChange: (v: Spec[]) => void }) {
  const [label, setLabel] = useState('');
  const [val, setVal] = useState('');
  function add() {
    if (!label.trim() || !val.trim()) return;
    onChange([...(value || []), { label: label.trim(), value: val.trim() }]);
    setLabel('');
    setVal('');
  }
  function removeIdx(i: number) {
    const n = [...value];
    n.splice(i, 1);
    onChange(n);
  }
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <input className="col-span-1 px-3 py-2 text-sm border rounded-lg" placeholder="Nhãn" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input className="col-span-2 px-3 py-2 text-sm border rounded-lg" placeholder="Giá trị" value={val} onChange={(e) => setVal(e.target.value)} />
      </div>
      <button onClick={add} className="px-3 py-2 mb-2 text-sm border rounded-lg hover:bg-slate-50">
        Thêm
      </button>
      <ul className="space-y-1 text-sm">
        {value?.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex items-center justify-between">
            <span className="truncate">
              {s.label}: <span className="text-gray-600">{s.value}</span>
            </span>
            <button className="text-red-600" onClick={() => removeIdx(i)}>
              Xoá
            </button>
          </li>
        ))}
        {!value?.length && <li className="text-xs text-gray-500">Chưa có thông số</li>}
      </ul>
    </div>
  );
}
