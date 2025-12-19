// //src/app/admin/products/page.tsx
// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Search, Plus, X, Trash2, Edit3, Eye, Image as ImageIcon, Package, Layers, Tag
// } from 'lucide-react';
// import { toast } from 'sonner';

// /* ================== TYPES & UTILS ================== */
// type Color = { name: string; hex?: string };
// type Spec = { label: string; value: string };
// type Variant = { name: string; price: number; stock: number; sku?: string };

// type Product = {
//   id?: number | string;
//   name: string;
//   slug: string;
//   price: number;
//   sku?: string;
//   description?: string;
//   image?: string;
//   images?: string[];
//   colors?: Color[];
//   specs?: Spec[];
//   variants?: Variant[];
//   categories?: Array<{ id: number; name: string; slug: string }>;
//   stock?: number;
//   sold?: number;
//   status?: 'open' | 'closed';
// };

// type Category = { id: number; name: string; slug: string };
// type LocalGallery = { url: string; kind: 'url' | 'file'; file?: File };

// const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
// const parseDigits = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;

// const normalizeImages = (imagesRaw: any): string[] => {
//   if (!imagesRaw || !Array.isArray(imagesRaw)) return [];
//   return imagesRaw
//     .map((i: any) => {
//       if (typeof i === 'string') return i.trim();
//       if (i && typeof i.url === 'string') return i.url.trim();
//       return '';
//     })
//     .filter(Boolean);
// };

// /* ================== UI COMPONENTS (FIXED) ================== */
// const Button = ({ variant = 'primary', className, ...props }: any) => {
//   const base =
//     'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none disabled:opacity-50 h-10';
//   const variants: Record<string, string> = {
//     primary: 'bg-zinc-900 text-white hover:bg-zinc-800',
//     secondary: 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
//     danger: 'bg-red-600 text-white hover:bg-red-700',
//     ghost: 'hover:bg-zinc-100 text-zinc-600',
//   };
//   const variantClass = variants[variant] || variants.primary;
//   return <button className={`${base} ${variantClass} ${className}`} {...props} />;
// };

// const Input = (props: any) => (
//   <input
//     className="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
//     {...props}
//   />
// );

// const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
//   <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">
//     {children} {required && <span className="text-red-500">*</span>}
//   </label>
// );

// const Badge = ({
//   children,
//   color = 'zinc',
// }: {
//   children: React.ReactNode;
//   color?: 'zinc' | 'green' | 'red';
// }) => {
//   const colors = {
//     zinc: 'bg-zinc-100 text-zinc-800 border-zinc-200',
//     green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//     red: 'bg-rose-50 text-rose-700 border-rose-200',
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold border ${colors[color]} border-opacity-50`}
//     >
//       {children}
//     </span>
//   );
// };

// function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
//   const [raw, setRaw] = useState(formatVND(value));
//   useEffect(() => setRaw(formatVND(value)), [value]);
//   return (
//     <input
//       inputMode="numeric"
//       className="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
//       value={raw}
//       onChange={(e) => {
//         const n = parseDigits(e.target.value);
//         setRaw(new Intl.NumberFormat('vi-VN').format(n));
//         onChange(n);
//       }}
//       onBlur={() => setRaw(formatVND(value))}
//     />
//   );
// }

// // === HELPER EDITORS ===

// function ColorsEditor({ value, onChange }: { value: Color[]; onChange: (v: Color[]) => void }) {
//   const [name, setName] = useState('');
//   const [hex, setHex] = useState('');
//   function add() {
//     if (!name.trim()) return;
//     let finalHex = hex.trim();
//     if (finalHex && !finalHex.startsWith('#')) {
//       finalHex = '#' + finalHex;
//     }
//     onChange([...(value || []), { name: name.trim(), hex: finalHex }]);
//     setName('');
//     setHex('');
//   }
//   function removeIdx(idx: number) {
//     const n = [...value];
//     n.splice(idx, 1);
//     onChange(n);
//   }
//   return (
//     <div className="p-4 space-y-3 bg-white border rounded-md border-zinc-200">
//       <Label>Màu sắc</Label>
//       <div className="flex gap-2 mb-3">
//         <Input placeholder="Tên màu" value={name} onChange={(e) => setName(e.target.value)} />
//         <Input
//           placeholder="#hex"
//           value={hex}
//           onChange={(e) => setHex(e.target.value)}
//           className="w-24"
//         />
//         <Button onClick={add} variant="secondary">
//           Thêm
//         </Button>
//       </div>
//       <ul className="space-y-1 overflow-y-auto text-sm max-h-28">
//         {value?.map((c, i) => (
//           <li
//             key={`${c.name}-${i}`}
//             className="flex items-center justify-between p-2 rounded bg-zinc-50"
//           >
//             <span className="flex items-center gap-2 truncate">
//               <span
//                 className="w-3 h-3 rounded-full ring-1 ring-zinc-300"
//                 style={{ background: c.hex || '#eee' }}
//               />
//               {c.name} {c.hex && <span className="text-xs text-zinc-500">({c.hex})</span>}
//             </span>
//             <button
//               className="text-red-500 hover:bg-red-50 p-0.5 rounded"
//               onClick={() => removeIdx(i)}
//             >
//               <Trash2 size={14} />
//             </button>
//           </li>
//         ))}
//         {!value?.length && <li className="py-2 text-xs text-zinc-400">Chưa có màu</li>}
//       </ul>
//     </div>
//   );
// }

// function SpecsEditor({ value, onChange }: { value: Spec[]; onChange: (v: Spec[]) => void }) {
//   const [label, setLabel] = useState('');
//   const [val, setVal] = useState('');
//   function add() {
//     if (!label.trim() || !val.trim()) return;
//     onChange([...(value || []), { label: label.trim(), value: val.trim() }]);
//     setLabel('');
//     setVal('');
//   }
//   function removeIdx(i: number) {
//     const n = [...value];
//     n.splice(i, 1);
//     onChange(n);
//   }
//   return (
//     <div className="p-4 space-y-3 bg-white border rounded-md border-zinc-200">
//       <Label>Thông số kỹ thuật</Label>
//       <div className="grid grid-cols-3 gap-2 mb-3">
//         <Input
//           placeholder="Nhãn"
//           value={label}
//           onChange={(e) => setLabel(e.target.value)}
//           className="col-span-1"
//         />
//         <Input
//           placeholder="Giá trị"
//           value={val}
//           onChange={(e) => setVal(e.target.value)}
//           className="col-span-2"
//         />
//         <Button onClick={add} variant="secondary" className="col-span-3">
//           Thêm thông số
//         </Button>
//       </div>
//       <ul className="space-y-1 overflow-y-auto text-sm max-h-28">
//         {value?.map((s, i) => (
//           <li
//             key={`${s.label}-${i}`}
//             className="flex items-center justify-between p-2 rounded bg-zinc-50"
//           >
//             <span className="truncate">
//               {s.label}: <span className="text-gray-600">{s.value}</span>
//             </span>
//             <button
//               className="text-red-500 hover:bg-red-50 p-0.5 rounded"
//               onClick={() => removeIdx(i)}
//             >
//               <Trash2 size={14} />
//             </button>
//           </li>
//         ))}
//         {!value?.length && <li className="py-2 text-xs text-zinc-400">Chưa có thông số</li>}
//       </ul>
//     </div>
//   );
// }

// function VariantsEditor({ value, onChange }: { value: Variant[]; onChange: (v: Variant[]) => void }) {
//   const [vName, setVName] = useState('');
//   const [vPrice, setVPrice] = useState(0);
//   const [vStock, setVStock] = useState(0);
//   const [vSku, setVSku] = useState('');

//   function add() {
//     if (!vName.trim()) return toast.error('Nhập tên biến thể (VD: Size L)');
//     if (vPrice <= 0) return toast.error('Giá phải lớn hơn 0');

//     onChange([...value, { name: vName, price: vPrice, stock: vStock, sku: vSku }]);
//     setVName('');
//     setVPrice(0);
//     setVStock(0);
//     setVSku('');
//   }

//   function removeIdx(idx: number) {
//     const n = [...value];
//     n.splice(idx, 1);
//     onChange(n);
//   }

//   return (
//     <div className="space-y-4">
//       <div className="grid items-end grid-cols-12 gap-2 p-3 bg-white border rounded-lg shadow-sm border-zinc-200">
//         <div className="col-span-4">
//           <Label>Tên biến thể</Label>
//           <Input
//             placeholder="Màu Đỏ - Size L"
//             value={vName}
//             onChange={(e) => setVName(e.target.value)}
//           />
//         </div>
//         <div className="col-span-3">
//           <Label>Giá tiền</Label>
//           <PriceInput value={vPrice} onChange={setVPrice} />
//         </div>
//         <div className="col-span-2">
//           <Label>Kho</Label>
//           <Input
//             type="number"
//             value={vStock}
//             onChange={(e) => setVStock(Number(e.target.value))}
//           />
//         </div>
//         <div className="col-span-2">
//           <Label>SKU (Opt)</Label>
//           <Input value={vSku} onChange={(e) => setVSku(e.target.value)} />
//         </div>
//         <div className="col-span-1">
//           <Button
//             onClick={add}
//             className="w-full h-10 px-0 text-white bg-blue-600 hover:bg-blue-700"
//           >
//             <Plus size={18} />
//           </Button>
//         </div>
//       </div>

//       <div className="space-y-2 overflow-y-auto max-h-60">
//         {value.map((v, idx) => (
//           <div
//             key={idx}
//             className="flex items-center justify-between p-3 bg-white border rounded shadow-sm"
//           >
//             <div>
//               <div className="text-sm font-medium">{v.name}</div>
//               <div className="text-xs text-gray-500">SKU: {v.sku || '—'}</div>
//             </div>
//             <div className="flex items-center gap-4 text-sm">
//               <span className="font-semibold text-emerald-600">
//                 {formatVND(v.price)} ₫
//               </span>
//               <span className="text-gray-600">Kho: {v.stock}</span>
//               <button
//                 onClick={() => removeIdx(idx)}
//                 className="p-1 text-red-500 rounded hover:bg-red-50"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {value.length === 0 && (
//           <div className="py-2 text-sm text-center border rounded-lg text-zinc-400">
//             Chưa có biến thể nào.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================== MAIN PAGE ================== */
// export default function AdminProductsPage() {
//   const [list, setList] = useState<Product[]>([]);
//   const [allCats, setAllCats] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [q, setQ] = useState('');
//   const [catF, setCatF] = useState<number | 'all'>('all');
//   const [statusF, setStatusF] = useState<'all' | 'open' | 'closed'>('all');

//   const [showDrawer, setShowDrawer] = useState(false);
//   const [editing, setEditing] = useState<Product | null>(null);
//   const [viewing, setViewing] = useState<Product | null>(null);

//   const [gallery, setGallery] = useState<LocalGallery[]>([]);
//   const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
//   const [saving, setSaving] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

//   const urlInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     Promise.all([loadProducts(), loadCategories()]).finally(() => setLoading(false));
//   }, []);

//   async function loadProducts() {
//     try {
//       const res = await fetch('/api/admin/products', { cache: 'no-store' });
//       const raw = await res.text();
//       const data = raw ? JSON.parse(raw) : [];
//       if (!res.ok) throw new Error();

//       const arr = Array.isArray(data) ? data : data?.items || [];
//       const items = arr.map((p: any) => {
//         const images = normalizeImages(p.images);

//         const displayPrice = Number(p.price || 0);
//         const totalStock = Number(p.stock || 0);

//         return {
//           ...p,
//           price: displayPrice,
//           stock: totalStock,
//           images,
//           image: p.image || images[0] || '',
//           categories: Array.isArray(p.categories)
//             ? p.categories.map((c: any) => ({ id: Number(c.id), name: c.name, slug: c.slug }))
//             : [],
//           status: p.status === 'closed' ? 'closed' : 'open',
//           description: p.description || '',
//           colors: p.colors || [],
//           specs: p.specs || [],
//           variants: p.variants || [],
//         };
//       });
//       setList(items);
//     } catch (e) {
//       toast.error('Lỗi tải danh sách sản phẩm');
//     }
//   }

//   async function loadCategories() {
//     try {
//       const res = await fetch('/api/admin/categories');
//       const data = await res.json();
//       setAllCats(
//         (Array.isArray(data) ? data : data.items || []).map((c: any) => ({
//           id: Number(c.id),
//           name: c.name,
//           slug: c.slug,
//         })),
//       );
//     } catch {}
//   }

//   const openEditor = (p?: Product) => {
//     if (p) {
//       setEditing({
//         ...p,
//         colors: p.colors || [],
//         specs: p.specs || [],
//         variants: p.variants || [],
//       });
//       setSelectedCatIds((p.categories || []).map((c) => Number(c.id)));
//       const existingImages =
//         p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
//       setGallery(existingImages.map((url) => ({ url, kind: 'url' })));
//     } else {
//       setEditing({
//         name: '',
//         slug: '',
//         price: 0,
//         sku: '',
//         description: '',
//         image: '',
//         images: [],
//         stock: 0,
//         sold: 0,
//         status: 'open',
//         colors: [],
//         specs: [],
//         variants: [],
//       });
//       setSelectedCatIds([]);
//       setGallery([]);
//     }
//     setShowDrawer(true);
//   };

//   const handleSave = async () => {
//     if (!editing || !editing.name) return toast.error('Tên sản phẩm là bắt buộc');
//     setSaving(true);

//     const finalImages = gallery.map((g) => g.url);

//     // KHÔNG gửi slug lên BE – để BE tự sinh / giữ
//     const { slug, ...restEditing } = editing as any;

//     const payload = {
//       ...restEditing,
//       price: String(editing.price),
//       stock: Number(editing.stock),
//       image: finalImages[0] || '',
//       images: finalImages,
//       categories: selectedCatIds,
//       colors: editing.colors,
//       specs: editing.specs,
//       variants: undefined, // KHÔNG GỬI VARIANTS
//     };

//     try {
//       const url = editing.id ? `/api/admin/products/${editing.id}` : '/api/admin/products';
//       const method = editing.id ? 'PATCH' : 'POST';
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error();
//       await loadProducts();
//       setShowDrawer(false);
//       toast.success('Lưu thành công');
//     } catch {
//       toast.error('Lưu thất bại');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete?.id) return;
//     await fetch(`/api/admin/products/${confirmDelete.id}`, { method: 'DELETE' });
//     setList((prev) => prev.filter((p) => p.id !== confirmDelete.id));
//     setConfirmDelete(null);
//     toast.success('Đã xóa');
//   };

//   const filtered = useMemo(() => {
//     const lowerQ = q.toLowerCase();
//     return list.filter(
//       (p) =>
//         (!q ||
//           p.name.toLowerCase().includes(lowerQ) ||
//           p.sku?.toLowerCase().includes(lowerQ)) &&
//         (catF === 'all' || p.categories?.some((c) => c.id === catF)),
//     );
//   }, [list, q, catF]);

//   return (
//     <div className="min-h-screen pb-20 font-sans bg-zinc-50 text-zinc-900">
//       <header className="sticky top-0 z-20 bg-white border-b border-zinc-200">
//         <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
//           <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900">
//             📦 Quản lý sản phẩm{' '}
//             <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-600">
//               {list.length}
//             </span>
//           </h1>
//           <Button onClick={() => openEditor()} className="shadow-sm">
//             <Plus size={16} /> Thêm mới
//           </Button>
//         </div>
//         <div className="flex flex-col gap-3 px-4 pb-4 mx-auto max-w-7xl md:flex-row">
//           <div className="relative flex-1">
//             <Search
//               className="absolute -translate-y-1/2 left-3 top-1/2 text-zinc-400"
//               size={16}
//             />
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Tìm kiếm tên, mã SKU..."
//               className="w-full py-2 pr-4 text-sm border rounded-md outline-none pl-9 bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-zinc-900"
//             />
//           </div>
//           <div className="flex gap-2">
//             <select
//               value={catF}
//               onChange={(e) =>
//                 setCatF(e.target.value === 'all' ? 'all' : Number(e.target.value))
//               }
//               className="px-3 text-sm bg-white border rounded-md outline-none h-9 border-zinc-200"
//             >
//               <option value="all">Tất cả danh mục</option>
//               {allCats.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={statusF}
//               onChange={(e) => setStatusF(e.target.value as any)}
//               className="px-3 text-sm bg-white border rounded-md outline-none h-9 border-zinc-200"
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="open">Đang bán</option>
//               <option value="closed">Ngưng bán</option>
//             </select>
//           </div>
//         </div>
//       </header>

//       <main className="px-4 py-6 mx-auto max-w-7xl">
//         {loading ? (
//           <div className="py-20 text-center text-zinc-400 animate-pulse">
//             Đang tải dữ liệu...
//           </div>
//         ) : (
//           <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-zinc-200">
//             <table className="w-full text-sm text-left">
//               <thead className="text-xs font-semibold uppercase border-b bg-zinc-50 border-zinc-200 text-zinc-500">
//                 <tr>
//                   <th className="w-16 px-4 py-3">Image</th>
//                   <th className="px-4 py-3">Sản phẩm</th>
//                   <th className="px-4 py-3 text-right">Giá bán</th>
//                   <th className="px-4 py-3 text-center">Kho</th>
//                   <th className="px-4 py-3">Trạng thái</th>
//                   <th className="px-4 py-3 text-right">Thao tác</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-zinc-100">
//                 {filtered.map((p) => (
//                   <tr
//                     key={p.id}
//                     className="transition-colors hover:bg-zinc-50/50 group"
//                   >
//                     <td className="px-4 py-3">
//                       <div className="w-10 h-10 overflow-hidden border rounded bg-zinc-100 border-zinc-200">
//                         <img
//                           src={p.image || '/placeholder.jpg'}
//                           alt=""
//                           className="object-cover w-full h-full"
//                           onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
//                         />
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-zinc-900">
//                       <div
//                         className="truncate max-w-[300px]"
//                         title={p.name}
//                       >
//                         {p.name}
//                       </div>
//                       <div className="font-mono text-xs text-zinc-400">
//                         {p.sku}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-right">
//                       {formatVND(p.price)}
//                     </td>
//                     <td className="px-4 py-3 text-xs text-center">
//                       {p.stock}
//                     </td>
//                     <td className="px-4 py-3">
//                       <Badge color={p.status === 'open' ? 'green' : 'zinc'}>
//                         {p.status === 'open' ? 'Bán' : 'Ẩn'}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex items-center justify-end gap-1 transition-opacity opacity-0 group-hover:opacity-100">
//                         <button
//                           onClick={() => setViewing(p)}
//                           className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
//                           title="Xem"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button
//                           onClick={() => openEditor(p)}
//                           className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
//                           title="Sửa"
//                         >
//                           <Edit3 size={14} />
//                         </button>
//                         <button
//                           onClick={() => setConfirmDelete(p)}
//                           className="p-1.5 hover:bg-red-50 rounded text-red-600"
//                           title="Xóa"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </main>

//       {viewing && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div
//             className="absolute inset-0 bg-black/20 backdrop-blur-sm"
//             onClick={() => setViewing(null)}
//           />
//           <div className="relative flex flex-col w-full h-full max-w-lg duration-300 bg-white shadow-2xl animate-in slide-in-from-right">
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <h2 className="text-lg font-bold">Chi tiết sản phẩm</h2>
//               <button onClick={() => setViewing(null)}>
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//               <div className="overflow-hidden border rounded-lg aspect-square bg-zinc-100">
//                 <img
//                   src={viewing.image || '/placeholder.jpg'}
//                   className="object-cover w-full h-full"
//                   alt=""
//                 />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-zinc-900">
//                   {viewing.name}
//                 </h3>
//                 <div className="mt-1 text-lg font-semibold text-emerald-600">
//                   {formatVND(viewing.price)} ₫
//                 </div>
//               </div>
//               <div className="p-4 space-y-2 text-sm border rounded-lg text-zinc-600 bg-zinc-50">
//                 <div className="flex justify-between">
//                   <span>Slug:</span>{' '}
//                   <span className="font-mono">{viewing.slug}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>SKU:</span> <span>{viewing.sku || '—'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Kho:</span> <b>{viewing.stock}</b>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Đã bán:</span> <b>{viewing.sold}</b>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="mb-2 text-sm font-bold uppercase text-zinc-500">
//                   Mô tả
//                 </h4>
//                 <div className="text-sm text-zinc-700 whitespace-pre-wrap bg-white p-3 border rounded-md min-h-[100px]">
//                   {viewing.description || 'Chưa có mô tả'}
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end p-4 border-t bg-zinc-50">
//               <Button
//                 onClick={() => {
//                   openEditor(viewing);
//                   setViewing(null);
//                 }}
//               >
//                 Chỉnh sửa
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDrawer && editing && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div
//             className="absolute inset-0 bg-black/20 backdrop-blur-sm"
//             onClick={() => setShowDrawer(false)}
//           />
//           <div
//             className="relative flex flex-col w-full h-full max-w-2xl duration-300 bg-white shadow-2xl animate-in slide-in-from-right"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
//               <h2 className="text-lg font-bold text-zinc-900">
//                 {editing.id ? 'Chỉnh sửa' : 'Thêm mới'}
//               </h2>
//               <button
//                 onClick={() => setShowDrawer(false)}
//                 className="p-2 rounded-full hover:bg-zinc-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="flex-1 p-6 space-y-8 overflow-y-auto bg-zinc-50/50">
//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <Package size={18} />
//                   <h3 className="font-bold">Thông tin</h3>
//                 </div>
//                 <div className="grid gap-4">
//                   <div>
//                     <Label required>Tên sản phẩm</Label>
//                     <Input
//                       value={editing.name}
//                       onChange={(e: any) =>
//                         setEditing((prev) => ({ ...prev!, name: e.target.value }))
//                       }
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>Giá bán (VNĐ)</Label>
//                       <PriceInput
//                         value={editing.price}
//                         onChange={(v) =>
//                           setEditing({ ...(editing as Product), price: v })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <Label>Mã SKU</Label>
//                       <Input
//                         value={editing.sku || ''}
//                         onChange={(e: any) =>
//                           setEditing({ ...(editing as Product), sku: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <Label>Slug (tự sinh từ server)</Label>
//                     <Input
//                       value={editing.slug || ''}
//                       readOnly
//                       disabled
//                       placeholder="Sẽ được tạo sau khi lưu"
//                     />
//                   </div>
//                   <div>
//                     <Label>Mô tả</Label>
//                     <textarea
//                       className="w-full p-3 text-sm border border-zinc-300 rounded-md bg-white min-h-[120px]"
//                       value={editing.description || ''}
//                       onChange={(e) =>
//                         setEditing({
//                           ...(editing as Product),
//                           description: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
//                   <Layers size={18} />
//                   <h3 className="font-bold">Phân loại hàng</h3>
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4 p-3 bg-white border rounded">
//                   <div>
//                     <Label>Tồn kho</Label>
//                     <Input
//                       type="number"
//                       value={editing.stock}
//                       onChange={(e: any) =>
//                         setEditing({
//                           ...(editing as Product),
//                           stock: Number(e.target.value),
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <Label>Đã bán</Label>
//                     <Input
//                       type="number"
//                       value={editing.sold}
//                       onChange={(e: any) =>
//                         setEditing({
//                           ...(editing as Product),
//                           sold: Number(e.target.value),
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <Tag size={18} />
//                   <h3 className="font-bold">Thuộc tính & Màu sắc</h3>
//                 </div>
//                 <div className="grid gap-6 md:grid-cols-2">
//                   <ColorsEditor
//                     value={editing.colors || []}
//                     onChange={(colors) =>
//                       setEditing({ ...(editing as Product), colors })
//                     }
//                   />
//                   <SpecsEditor
//                     value={editing.specs || []}
//                     onChange={(specs) =>
//                       setEditing({ ...(editing as Product), specs })
//                     }
//                   />
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <h3 className="flex items-center gap-2 pb-2 border-b">
//                   <ImageIcon size={18} />
//                   <h3 className="font-bold">Hình ảnh</h3>
//                 </h3>
//                 <div className="flex gap-2 mb-3">
//                   <input
//                     ref={urlInputRef}
//                     className="flex-1 h-10 px-3 text-sm bg-white border rounded-md border-zinc-300"
//                     placeholder="Dán URL ảnh..."
//                   />
//                   <Button
//                     variant="secondary"
//                     onClick={() => {
//                       if (urlInputRef.current?.value) {
//                         const urls = urlInputRef.current.value
//                           .split(/[\n,]+/)
//                           .map((s) => s.trim())
//                           .filter(Boolean);
//                         setGallery((prev) => [
//                           ...prev,
//                           ...urls.map((u) => ({ url: u, kind: 'url' as const })),
//                         ]);
//                         urlInputRef.current.value = '';
//                       }
//                     }}
//                   >
//                     Thêm
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-4 gap-3">
//                   {gallery.map((g, i) => (
//                     <div
//                       key={i}
//                       className="relative overflow-hidden bg-white border rounded-md group aspect-square border-zinc-200"
//                     >
//                       <img
//                         src={g.url}
//                         alt=""
//                         className="object-cover w-full h-full"
//                         onError={(e) => (e.currentTarget.style.display = 'none')}
//                       />
//                       <button
//                         onClick={() =>
//                           setGallery((prev) => prev.filter((_, idx) => idx !== i))
//                         }
//                         className="absolute p-1 text-red-500 rounded opacity-0 top-1 right-1 bg-white/90 group-hover:opacity-100"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                       {i === 0 && (
//                         <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center">
//                           Ảnh chính
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <h3 className="flex items-center gap-2 pb-2 border-b">
//                   <Layers size={18} />
//                   <h3 className="font-bold">Danh mục</h3>
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="p-2 overflow-y-auto bg-white border rounded-md max-h-40 border-zinc-300">
//                     {allCats.map((c) => (
//                       <label
//                         key={c.id}
//                         className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 rounded cursor-pointer text-sm select-none"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedCatIds.includes(c.id)}
//                           onChange={() =>
//                             setSelectedCatIds((prev) =>
//                               prev.includes(c.id)
//                                 ? prev.filter((i) => i !== c.id)
//                                 : [...prev, c.id],
//                             )
//                           }
//                           className="rounded border-zinc-300 accent-zinc-900"
//                         />
//                         {c.name}
//                       </label>
//                     ))}
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <Label>Trạng thái</Label>
//                       <select
//                         value={editing.status}
//                         onChange={(e) =>
//                           setEditing({
//                             ...(editing as Product),
//                             status: e.target.value as any,
//                           })
//                         }
//                         className="w-full h-10 px-3 text-sm bg-white border rounded-md border-zinc-300"
//                       >
//                         <option value="open">Đang bán</option>
//                         <option value="closed">Ngưng bán</option>
//                       </select>
//                     </div>
//                     <div>
//                       <Label>SKU Gốc (Tùy chọn)</Label>
//                       <Input
//                         value={editing.sku || ''}
//                         onChange={(e: any) =>
//                           setEditing({ ...(editing as Product), sku: e.target.value })
//                         }
//                         placeholder="Mã SKU chung"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <Label>Tồn kho Chung</Label>
//                       <Input
//                         type="number"
//                         value={editing.stock}
//                         onChange={(e: any) =>
//                           setEditing({
//                             ...(editing as Product),
//                             stock: Number(e.target.value),
//                           })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <Label>Đã bán Chung</Label>
//                       <Input
//                         type="number"
//                         value={editing.sold}
//                         onChange={(e: any) =>
//                           setEditing({
//                             ...(editing as Product),
//                             sold: Number(e.target.value),
//                           })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             </div>
//             <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-zinc-200">
//               <Button variant="ghost" onClick={() => setShowDrawer(false)}>
//                 Hủy bỏ
//               </Button>
//               <Button onClick={handleSave} disabled={saving}>
//                 {saving ? 'Đang lưu...' : 'Lưu lại'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {confirmDelete && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
//           <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
//             <h3 className="mb-2 text-lg font-bold text-zinc-900">Xác nhận xóa?</h3>
//             <div className="flex justify-end gap-3 mt-6">
//               <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
//                 Hủy
//               </Button>
//               <Button variant="danger" onClick={handleDelete}>
//                 Xóa ngay
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }













// //src/app/admin/products/page.tsx
// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Search,
//   Plus,
//   X,
//   Trash2,
//   Edit3,
//   Eye,
//   Image as ImageIcon,
//   Package,
//   Layers,
//   Tag,
//   Copy,
//   Upload,
// } from 'lucide-react';
// import { toast } from 'sonner';

// /* ================== TYPES & UTILS ================== */
// type Color = { name: string; hex?: string };
// type Spec = { label: string; value: string };
// type Variant = { name: string; price: number; stock: number; sku?: string };

// type Product = {
//   id?: number | string;
//   name: string;
//   slug: string;
//   price: number;
//   sku?: string;
//   description?: string;
//   image?: string;
//   images?: string[];
//   colors?: Color[];
//   specs?: Spec[];
//   variants?: Variant[];
//   categories?: Array<{ id: number; name: string; slug: string }>;
//   stock?: number;
//   sold?: number;
//   status?: 'open' | 'closed';
// };

// type Category = { id: number; name: string; slug: string };
// type LocalGallery = { url: string; kind: 'url' | 'file' };

// const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
// const parseDigits = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;

// const normalizeImages = (imagesRaw: any): string[] => {
//   if (!imagesRaw || !Array.isArray(imagesRaw)) return [];
//   return imagesRaw
//     .map((i: any) => {
//       if (typeof i === 'string') return i.trim();
//       if (i && typeof i.url === 'string') return i.url.trim();
//       return '';
//     })
//     .filter(Boolean);
// };

// const IMG_RE = /^(https?:\/\/|data:image\/)/i;

// // ✅ nén ảnh trước khi convert base64 để tránh payload nổ
// async function compressToDataUrl(file: File, maxW = 1600, quality = 0.85): Promise<string> {
//   const readAsDataUrl = (f: File) =>
//     new Promise<string>((resolve, reject) => {
//       const r = new FileReader();
//       r.onload = () => resolve(String(r.result || ''));
//       r.onerror = reject;
//       r.readAsDataURL(f);
//     });

//   // nếu file nhỏ thì giữ nguyên
//   if (file.size <= 400 * 1024) {
//     return await readAsDataUrl(file);
//   }

//   const dataUrl = await readAsDataUrl(file);

//   const img = await new Promise<HTMLImageElement>((resolve, reject) => {
//     const im = new Image();
//     im.onload = () => resolve(im);
//     im.onerror = reject;
//     im.src = dataUrl;
//   });

//   const ratio = Math.min(1, maxW / (img.width || maxW));
//   const w = Math.max(1, Math.round((img.width || maxW) * ratio));
//   const h = Math.max(1, Math.round((img.height || maxW) * ratio));

//   const canvas = document.createElement('canvas');
//   canvas.width = w;
//   canvas.height = h;
//   const ctx = canvas.getContext('2d');
//   if (!ctx) return dataUrl;

//   ctx.drawImage(img, 0, 0, w, h);

//   // ưu tiên jpeg để giảm dung lượng
//   const out = canvas.toDataURL('image/jpeg', quality);
//   return out;
// }

// /* ================== UI COMPONENTS ================== */
// const Button = ({ variant = 'primary', className, ...props }: any) => {
//   const base =
//     'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none disabled:opacity-50 h-10';
//   const variants: Record<string, string> = {
//     primary: 'bg-zinc-900 text-white hover:bg-zinc-800',
//     secondary: 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
//     danger: 'bg-red-600 text-white hover:bg-red-700',
//     ghost: 'hover:bg-zinc-100 text-zinc-600',
//   };
//   const variantClass = variants[variant] || variants.primary;
//   return <button className={`${base} ${variantClass} ${className}`} {...props} />;
// };

// const Input = (props: any) => (
//   <input
//     className="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
//     {...props}
//   />
// );

// const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
//   <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">
//     {children} {required && <span className="text-red-500">*</span>}
//   </label>
// );

// const Badge = ({
//   children,
//   color = 'zinc',
// }: {
//   children: React.ReactNode;
//   color?: 'zinc' | 'green' | 'red';
// }) => {
//   const colors = {
//     zinc: 'bg-zinc-100 text-zinc-800 border-zinc-200',
//     green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//     red: 'bg-rose-50 text-rose-700 border-rose-200',
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold border ${colors[color]} border-opacity-50`}
//     >
//       {children}
//     </span>
//   );
// };

// function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
//   const [raw, setRaw] = useState(formatVND(value));
//   useEffect(() => setRaw(formatVND(value)), [value]);
//   return (
//     <input
//       inputMode="numeric"
//       className="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
//       value={raw}
//       onChange={(e) => {
//         const n = parseDigits(e.target.value);
//         setRaw(new Intl.NumberFormat('vi-VN').format(n));
//         onChange(n);
//       }}
//       onBlur={() => setRaw(formatVND(value))}
//     />
//   );
// }

// /* ================== HELPER EDITORS ================== */
// function ColorsEditor({ value, onChange }: { value: Color[]; onChange: (v: Color[]) => void }) {
//   const [name, setName] = useState('');
//   const [hex, setHex] = useState('');
//   function add() {
//     if (!name.trim()) return;
//     let finalHex = hex.trim();
//     if (finalHex && !finalHex.startsWith('#')) finalHex = '#' + finalHex;
//     onChange([...(value || []), { name: name.trim(), hex: finalHex }]);
//     setName('');
//     setHex('');
//   }
//   function removeIdx(idx: number) {
//     const n = [...value];
//     n.splice(idx, 1);
//     onChange(n);
//   }
//   return (
//     <div className="p-4 space-y-3 bg-white border rounded-md border-zinc-200">
//       <Label>Màu sắc</Label>
//       <div className="flex gap-2 mb-3">
//         <Input placeholder="Tên màu" value={name} onChange={(e) => setName(e.target.value)} />
//         <Input placeholder="#hex" value={hex} onChange={(e) => setHex(e.target.value)} className="w-24" />
//         <Button onClick={add} variant="secondary">Thêm</Button>
//       </div>
//       <ul className="space-y-1 overflow-y-auto text-sm max-h-28">
//         {value?.map((c, i) => (
//           <li key={`${c.name}-${i}`} className="flex items-center justify-between p-2 rounded bg-zinc-50">
//             <span className="flex items-center gap-2 truncate">
//               <span className="w-3 h-3 rounded-full ring-1 ring-zinc-300" style={{ background: c.hex || '#eee' }} />
//               {c.name} {c.hex && <span className="text-xs text-zinc-500">({c.hex})</span>}
//             </span>
//             <button className="text-red-500 hover:bg-red-50 p-0.5 rounded" onClick={() => removeIdx(i)}>
//               <Trash2 size={14} />
//             </button>
//           </li>
//         ))}
//         {!value?.length && <li className="py-2 text-xs text-zinc-400">Chưa có màu</li>}
//       </ul>
//     </div>
//   );
// }

// function SpecsEditor({ value, onChange }: { value: Spec[]; onChange: (v: Spec[]) => void }) {
//   const [label, setLabel] = useState('');
//   const [val, setVal] = useState('');
//   function add() {
//     if (!label.trim() || !val.trim()) return;
//     onChange([...(value || []), { label: label.trim(), value: val.trim() }]);
//     setLabel('');
//     setVal('');
//   }
//   function removeIdx(i: number) {
//     const n = [...value];
//     n.splice(i, 1);
//     onChange(n);
//   }
//   return (
//     <div className="p-4 space-y-3 bg-white border rounded-md border-zinc-200">
//       <Label>Thông số kỹ thuật</Label>
//       <div className="grid grid-cols-3 gap-2 mb-3">
//         <Input placeholder="Nhãn" value={label} onChange={(e) => setLabel(e.target.value)} className="col-span-1" />
//         <Input placeholder="Giá trị" value={val} onChange={(e) => setVal(e.target.value)} className="col-span-2" />
//         <Button onClick={add} variant="secondary" className="col-span-3">Thêm thông số</Button>
//       </div>
//       <ul className="space-y-1 overflow-y-auto text-sm max-h-28">
//         {value?.map((s, i) => (
//           <li key={`${s.label}-${i}`} className="flex items-center justify-between p-2 rounded bg-zinc-50">
//             <span className="truncate">
//               {s.label}: <span className="text-gray-600">{s.value}</span>
//             </span>
//             <button className="text-red-500 hover:bg-red-50 p-0.5 rounded" onClick={() => removeIdx(i)}>
//               <Trash2 size={14} />
//             </button>
//           </li>
//         ))}
//         {!value?.length && <li className="py-2 text-xs text-zinc-400">Chưa có thông số</li>}
//       </ul>
//     </div>
//   );
// }

// /* ================== MAIN PAGE ================== */
// export default function AdminProductsPage() {
//   const [list, setList] = useState<Product[]>([]);
//   const [allCats, setAllCats] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [q, setQ] = useState('');
//   const [catF, setCatF] = useState<number | 'all'>('all');
//   const [statusF, setStatusF] = useState<'all' | 'open' | 'closed'>('all');

//   const [showDrawer, setShowDrawer] = useState(false);
//   const [editing, setEditing] = useState<Product | null>(null);
//   const [viewing, setViewing] = useState<Product | null>(null);

//   const [gallery, setGallery] = useState<LocalGallery[]>([]);
//   const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
//   const [saving, setSaving] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

//   const urlInputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     Promise.all([loadProducts(), loadCategories()]).finally(() => setLoading(false));
//   }, []);

//   async function loadProducts() {
//     try {
//       const res = await fetch('/api/admin/products', { cache: 'no-store' });
//       const raw = await res.text();
//       const data = raw ? JSON.parse(raw) : [];
//       if (!res.ok) throw new Error();

//       const arr = Array.isArray(data) ? data : data?.items || [];
//       const items = arr.map((p: any) => {
//         const images = normalizeImages(p.images); // nếu BE đã bỏ images ở list → images = []
//         const displayPrice = Number(p.price || 0);
//         const totalStock = Number(p.stock || 0);

//         return {
//           ...p,
//           price: displayPrice,
//           stock: totalStock,
//           images,
//           image: p.image || images[0] || '',
//           categories: Array.isArray(p.categories)
//             ? p.categories.map((c: any) => ({ id: Number(c.id), name: c.name, slug: c.slug }))
//             : [],
//           status: p.status === 'closed' ? 'closed' : 'open',
//           description: p.description || '',
//           colors: p.colors || [],
//           specs: p.specs || [],
//           variants: p.variants || [],
//         };
//       });

//       setList(items);
//     } catch (e) {
//       toast.error('Lỗi tải danh sách sản phẩm');
//     }
//   }

//   async function loadCategories() {
//     try {
//       const res = await fetch('/api/admin/categories');
//       const data = await res.json();
//       setAllCats(
//         (Array.isArray(data) ? data : data.items || []).map((c: any) => ({
//           id: Number(c.id),
//           name: c.name,
//           slug: c.slug,
//         })),
//       );
//     } catch {}
//   }

//   const openEditor = async (p?: Product) => {
//     if (p) {
//       // ✅ nếu list không có images đầy đủ → fetch detail theo id để edit cho chuẩn
//       let full = p;
//       if (p.id) {
//         try {
//           const r = await fetch(`/api/admin/products/${p.id}`, { cache: 'no-store' });
//           if (r.ok) {
//             const d = await r.json();
//             full = {
//               ...d,
//               price: Number(d.price || 0),
//               stock: Number(d.stock || 0),
//               categories: Array.isArray(d.categories)
//                 ? d.categories.map((c: any) => ({ id: Number(c.id), name: c.name, slug: c.slug }))
//                 : [],
//               images: normalizeImages(d.images),
//               image: d.image || normalizeImages(d.images)[0] || '',
//               colors: d.colors || [],
//               specs: d.specs || [],
//               status: d.status === 'closed' ? 'closed' : 'open',
//             };
//           }
//         } catch {}
//       }

//       setEditing({
//         ...full,
//         colors: full.colors || [],
//         specs: full.specs || [],
//         variants: full.variants || [],
//       });

//       setSelectedCatIds((full.categories || []).map((c) => Number(c.id)));

//       const existingImages =
//         full.images && full.images.length > 0 ? full.images : full.image ? [full.image] : [];

//       setGallery(existingImages.filter((u) => IMG_RE.test(u)).map((url) => ({ url, kind: 'url' })));
//     } else {
//       setEditing({
//         name: '',
//         slug: '',
//         price: 0,
//         sku: '',
//         description: '',
//         image: '',
//         images: [],
//         stock: 0,
//         sold: 0,
//         status: 'open',
//         colors: [],
//         specs: [],
//         variants: [],
//       });
//       setSelectedCatIds([]);
//       setGallery([]);
//     }
//     setShowDrawer(true);
//   };

//   // ✅ nhân bản: mở drawer bản sao, mặc định "closed" để không public
//   const handleDuplicate = async (p: Product) => {
//     const base = {
//       ...p,
//       id: undefined,
//       slug: '',
//       name: `${p.name} (Bản sao)`,
//       sold: 0,
//       status: 'closed' as const,
//       sku: p.sku ? `${p.sku}-COPY` : '',
//     };

//     await openEditor(base);
//     toast.success('Đã tạo bản sao (chưa đăng). Hãy chỉnh sửa rồi bấm Lưu.');
//   };

//   const handlePickFiles = async (files: FileList | null) => {
//     if (!files || files.length === 0) return;

//     const maxAdd = 12 - gallery.length;
//     const pick = Array.from(files).slice(0, Math.max(0, maxAdd));
//     if (pick.length === 0) return toast.error('Tối đa 12 ảnh.');

//     try {
//       const urls: string[] = [];
//       for (const f of pick) {
//         const dataUrl = await compressToDataUrl(f, 1600, 0.85);
//         urls.push(dataUrl);
//       }

//       setGallery((prev) => [...prev, ...urls.map((u) => ({ url: u, kind: 'file' as const }))]);
//       toast.success(`Đã thêm ${urls.length} ảnh`);
//     } catch {
//       toast.error('Upload ảnh thất bại');
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   };

//   const handleSave = async () => {
//     if (!editing || !editing.name) return toast.error('Tên sản phẩm là bắt buộc');
//     setSaving(true);

//     const finalImages = gallery.map((g) => g.url).filter((u) => IMG_RE.test(u));

//     // ✅ KHÔNG gửi slug lên BE
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { slug, ...restEditing } = editing as any;

//     const payload = {
//       ...restEditing,
//       price: String(editing.price),
//       stock: Number(editing.stock),
//       image: finalImages[0] || '',
//       images: finalImages,
//       categories: selectedCatIds,
//       colors: editing.colors,
//       specs: editing.specs,
//       variants: undefined, // giữ đúng như bạn yêu cầu
//     };

//     try {
//       const url = editing.id ? `/api/admin/products/${editing.id}` : '/api/admin/products';
//       const method = editing.id ? 'PATCH' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const t = await res.text().catch(() => '');
//         throw new Error(t || 'Save failed');
//       }

//       await loadProducts();
//       setShowDrawer(false);
//       toast.success('Lưu thành công');
//     } catch (e: any) {
//       const msg = String(e?.message || '');
//       if (msg.includes('Payload too large') || msg.includes('413')) {
//         toast.error('Ảnh quá nặng. Hãy giảm dung lượng/giảm số ảnh.');
//       } else {
//         toast.error('Lưu thất bại');
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete?.id) return;
//     await fetch(`/api/admin/products/${confirmDelete.id}`, { method: 'DELETE' });
//     setList((prev) => prev.filter((p) => p.id !== confirmDelete.id));
//     setConfirmDelete(null);
//     toast.success('Đã xóa');
//   };

//   const filtered = useMemo(() => {
//     const lowerQ = q.toLowerCase();
//     return list.filter((p) => {
//       const okQ =
//         !q || p.name.toLowerCase().includes(lowerQ) || p.sku?.toLowerCase().includes(lowerQ);
//       const okCat = catF === 'all' || p.categories?.some((c) => c.id === catF);
//       const okStatus = statusF === 'all' || p.status === statusF;
//       return okQ && okCat && okStatus;
//     });
//   }, [list, q, catF, statusF]);

//   return (
//     <div className="min-h-screen pb-20 font-sans bg-zinc-50 text-zinc-900">
//       <header className="sticky top-0 z-20 bg-white border-b border-zinc-200">
//         <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
//           <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900">
//             📦 Quản lý sản phẩm{' '}
//             <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-600">
//               {list.length}
//             </span>
//           </h1>
//           <Button onClick={() => openEditor()} className="shadow-sm">
//             <Plus size={16} /> Thêm mới
//           </Button>
//         </div>

//         <div className="flex flex-col gap-3 px-4 pb-4 mx-auto max-w-7xl md:flex-row">
//           <div className="relative flex-1">
//             <Search className="absolute -translate-y-1/2 left-3 top-1/2 text-zinc-400" size={16} />
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Tìm kiếm tên, mã SKU..."
//               className="w-full py-2 pr-4 text-sm border rounded-md outline-none pl-9 bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-zinc-900"
//             />
//           </div>

//           <div className="flex gap-2">
//             <select
//               value={catF}
//               onChange={(e) => setCatF(e.target.value === 'all' ? 'all' : Number(e.target.value))}
//               className="px-3 text-sm bg-white border rounded-md outline-none h-9 border-zinc-200"
//             >
//               <option value="all">Tất cả danh mục</option>
//               {allCats.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={statusF}
//               onChange={(e) => setStatusF(e.target.value as any)}
//               className="px-3 text-sm bg-white border rounded-md outline-none h-9 border-zinc-200"
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="open">Đang bán</option>
//               <option value="closed">Ngưng bán</option>
//             </select>
//           </div>
//         </div>
//       </header>

//       <main className="px-4 py-6 mx-auto max-w-7xl">
//         {loading ? (
//           <div className="py-20 text-center text-zinc-400 animate-pulse">Đang tải dữ liệu...</div>
//         ) : (
//           <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-zinc-200">
//             <table className="w-full text-sm text-left">
//               <thead className="text-xs font-semibold uppercase border-b bg-zinc-50 border-zinc-200 text-zinc-500">
//                 <tr>
//                   <th className="w-16 px-4 py-3">Image</th>
//                   <th className="px-4 py-3">Sản phẩm</th>
//                   <th className="px-4 py-3 text-right">Giá bán</th>
//                   <th className="px-4 py-3 text-center">Kho</th>
//                   <th className="px-4 py-3">Trạng thái</th>
//                   <th className="px-4 py-3 text-right">Thao tác</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-zinc-100">
//                 {filtered.map((p) => (
//                   <tr key={p.id} className="transition-colors hover:bg-zinc-50/50 group">
//                     <td className="px-4 py-3">
//                       <div className="w-10 h-10 overflow-hidden border rounded bg-zinc-100 border-zinc-200">
//                         <img
//                           src={p.image || '/placeholder.jpg'}
//                           alt=""
//                           className="object-cover w-full h-full"
//                           onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
//                         />
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 font-medium text-zinc-900">
//                       <div className="truncate max-w-[300px]" title={p.name}>
//                         {p.name}
//                       </div>
//                       <div className="font-mono text-xs text-zinc-400">{p.sku}</div>
//                     </td>

//                     <td className="px-4 py-3 font-medium text-right">{formatVND(p.price)}</td>

//                     <td className="px-4 py-3 text-xs text-center">{p.stock}</td>

//                     <td className="px-4 py-3">
//                       <Badge color={p.status === 'open' ? 'green' : 'zinc'}>
//                         {p.status === 'open' ? 'Bán' : 'Ẩn'}
//                       </Badge>
//                     </td>

//                     <td className="px-4 py-3 text-right">
//                       <div className="flex items-center justify-end gap-1 transition-opacity opacity-0 group-hover:opacity-100">
//                         <button
//                           onClick={() => setViewing(p)}
//                           className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
//                           title="Xem"
//                         >
//                           <Eye size={14} />
//                         </button>

//                         <button
//                           onClick={() => handleDuplicate(p)}
//                           className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
//                           title="Nhân bản"
//                         >
//                           <Copy size={14} />
//                         </button>

//                         <button
//                           onClick={() => openEditor(p)}
//                           className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
//                           title="Sửa"
//                         >
//                           <Edit3 size={14} />
//                         </button>

//                         <button
//                           onClick={() => setConfirmDelete(p)}
//                           className="p-1.5 hover:bg-red-50 rounded text-red-600"
//                           title="Xóa"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </main>

//       {viewing && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setViewing(null)} />
//           <div className="relative flex flex-col w-full h-full max-w-lg duration-300 bg-white shadow-2xl animate-in slide-in-from-right">
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <h2 className="text-lg font-bold">Chi tiết sản phẩm</h2>
//               <button onClick={() => setViewing(null)}><X size={20} /></button>
//             </div>

//             <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//               <div className="overflow-hidden border rounded-lg aspect-square bg-zinc-100">
//                 <img src={viewing.image || '/placeholder.jpg'} className="object-cover w-full h-full" alt="" />
//               </div>

//               <div>
//                 <h3 className="text-xl font-bold text-zinc-900">{viewing.name}</h3>
//                 <div className="mt-1 text-lg font-semibold text-emerald-600">
//                   {formatVND(viewing.price)} ₫
//                 </div>
//               </div>

//               <div className="p-4 space-y-2 text-sm border rounded-lg text-zinc-600 bg-zinc-50">
//                 <div className="flex justify-between">
//                   <span>Slug:</span> <span className="font-mono">{viewing.slug}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>SKU:</span> <span>{viewing.sku || '—'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Kho:</span> <b>{viewing.stock}</b>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Đã bán:</span> <b>{viewing.sold}</b>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="mb-2 text-sm font-bold uppercase text-zinc-500">Mô tả</h4>
//                 <div className="text-sm text-zinc-700 whitespace-pre-wrap bg-white p-3 border rounded-md min-h-[100px]">
//                   {viewing.description || 'Chưa có mô tả'}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end p-4 border-t bg-zinc-50">
//               <Button
//                 onClick={() => {
//                   openEditor(viewing);
//                   setViewing(null);
//                 }}
//               >
//                 Chỉnh sửa
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDrawer && editing && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
//           <div className="relative flex flex-col w-full h-full max-w-2xl duration-300 bg-white shadow-2xl animate-in slide-in-from-right" onClick={(e) => e.stopPropagation()}>
//             <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
//               <h2 className="text-lg font-bold text-zinc-900">{editing.id ? 'Chỉnh sửa' : 'Thêm mới'}</h2>
//               <button onClick={() => setShowDrawer(false)} className="p-2 rounded-full hover:bg-zinc-100">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="flex-1 p-6 space-y-8 overflow-y-auto bg-zinc-50/50">
//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <Package size={18} />
//                   <h3 className="font-bold">Thông tin</h3>
//                 </div>

//                 <div className="grid gap-4">
//                   <div>
//                     <Label required>Tên sản phẩm</Label>
//                     <Input value={editing.name} onChange={(e: any) => setEditing((prev) => ({ ...prev!, name: e.target.value }))} />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>Giá bán (VNĐ)</Label>
//                       <PriceInput value={editing.price} onChange={(v) => setEditing({ ...(editing as Product), price: v })} />
//                     </div>
//                     <div>
//                       <Label>Mã SKU</Label>
//                       <Input value={editing.sku || ''} onChange={(e: any) => setEditing({ ...(editing as Product), sku: e.target.value })} />
//                     </div>
//                   </div>

//                   <div>
//                     <Label>Slug (tự sinh từ server)</Label>
//                     <Input value={editing.slug || ''} readOnly disabled placeholder="Sẽ được tạo sau khi lưu" />
//                   </div>

//                   <div>
//                     <Label>Mô tả</Label>
//                     <textarea
//                       className="w-full p-3 text-sm border border-zinc-300 rounded-md bg-white min-h-[120px]"
//                       value={editing.description || ''}
//                       onChange={(e) => setEditing({ ...(editing as Product), description: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <Layers size={18} />
//                   <h3 className="font-bold">Kho & Trạng thái</h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 p-3 bg-white border rounded">
//                   <div>
//                     <Label>Tồn kho</Label>
//                     <Input type="number" value={editing.stock} onChange={(e: any) => setEditing({ ...(editing as Product), stock: Number(e.target.value) })} />
//                   </div>
//                   <div>
//                     <Label>Đã bán</Label>
//                     <Input type="number" value={editing.sold} onChange={(e: any) => setEditing({ ...(editing as Product), sold: Number(e.target.value) })} />
//                   </div>
//                   <div className="col-span-2">
//                     <Label>Trạng thái</Label>
//                     <select
//                       value={editing.status}
//                       onChange={(e) => setEditing({ ...(editing as Product), status: e.target.value as any })}
//                       className="w-full h-10 px-3 text-sm bg-white border rounded-md border-zinc-300"
//                     >
//                       <option value="open">Đang bán</option>
//                       <option value="closed">Ngưng bán</option>
//                     </select>
//                   </div>
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <Tag size={18} />
//                   <h3 className="font-bold">Thuộc tính & Màu sắc</h3>
//                 </div>
//                 <div className="grid gap-6 md:grid-cols-2">
//                   <ColorsEditor value={editing.colors || []} onChange={(colors) => setEditing({ ...(editing as Product), colors })} />
//                   <SpecsEditor value={editing.specs || []} onChange={(specs) => setEditing({ ...(editing as Product), specs })} />
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <ImageIcon size={18} />
//                   <h3 className="font-bold">Hình ảnh</h3>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     className="hidden"
//                     onChange={(e) => handlePickFiles(e.target.files)}
//                   />
//                   <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
//                     <Upload size={16} /> Upload ảnh từ máy
//                   </Button>
//                   <div className="text-xs text-zinc-500">
//                     Lưu DB base64 (khuyến nghị ảnh nhỏ). Nếu 413/tràn data: giảm dung lượng/giảm số ảnh.
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-3">
//                   <input
//                     ref={urlInputRef}
//                     className="flex-1 h-10 px-3 text-sm bg-white border rounded-md border-zinc-300"
//                     placeholder="Dán URL ảnh (http/https hoặc data:image...)"
//                   />
//                   <Button
//                     variant="secondary"
//                     onClick={() => {
//                       if (urlInputRef.current?.value) {
//                         const urls = urlInputRef.current.value
//                           .split(/[\n,]+/)
//                           .map((s) => s.trim())
//                           .filter((u) => IMG_RE.test(u));
//                         if (urls.length === 0) return toast.error('URL ảnh không hợp lệ');
//                         setGallery((prev) => [...prev, ...urls.map((u) => ({ url: u, kind: 'url' as const }))]);
//                         urlInputRef.current.value = '';
//                       }
//                     }}
//                   >
//                     Thêm
//                   </Button>
//                 </div>

//                 <div className="grid grid-cols-4 gap-3">
//                   {gallery.map((g, i) => (
//                     <div key={i} className="relative overflow-hidden bg-white border rounded-md group aspect-square border-zinc-200">
//                       <img src={g.url} alt="" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
//                       <button
//                         onClick={() => setGallery((prev) => prev.filter((_, idx) => idx !== i))}
//                         className="absolute p-1 text-red-500 rounded opacity-0 top-1 right-1 bg-white/90 group-hover:opacity-100"
//                       >
//                         <Trash2 size={14} />
//                       </button>

//                       <div className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
//                         {g.kind === 'file' ? 'FILE' : 'URL'}
//                       </div>

//                       {i === 0 && (
//                         <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center">
//                           Ảnh chính
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b">
//                   <Layers size={18} />
//                   <h3 className="font-bold">Danh mục</h3>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="p-2 overflow-y-auto bg-white border rounded-md max-h-40 border-zinc-300">
//                     {allCats.map((c) => (
//                       <label
//                         key={c.id}
//                         className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 rounded cursor-pointer text-sm select-none"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedCatIds.includes(c.id)}
//                           onChange={() =>
//                             setSelectedCatIds((prev) =>
//                               prev.includes(c.id) ? prev.filter((i) => i !== c.id) : [...prev, c.id],
//                             )
//                           }
//                           className="rounded border-zinc-300 accent-zinc-900"
//                         />
//                         {c.name}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             </div>

//             <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-zinc-200">
//               <Button variant="ghost" onClick={() => setShowDrawer(false)}>Hủy bỏ</Button>
//               <Button onClick={handleSave} disabled={saving}>
//                 {saving ? 'Đang lưu...' : 'Lưu lại'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {confirmDelete && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
//           <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
//             <h3 className="mb-2 text-lg font-bold text-zinc-900">Xác nhận xóa?</h3>
//             <div className="flex justify-end gap-3 mt-6">
//               <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Hủy</Button>
//               <Button variant="danger" onClick={handleDelete}>Xóa ngay</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














// src/app/admin/products/page.tsx
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
  price: number;
  sku?: string;
  description?: string;
  stock: number;
  sold: number;
  status: "open" | "closed";
  image?: string;
  images?: string[];
  colors?: Color[];
  specs?: Spec[];
  categories?: number[];
};

type Cat = { id: number; name: string };

type GalleryItem = { url: string; kind: "file" | "url" };

const IMG_RE = /^(https?:\/\/|data:image\/|\/uploads\/|uploads\/|\/placeholder\.jpg|\/)/i;

/* ================== UI ATOMS ================== */
function formatVND(n: number) {
  return (Number(n) || 0).toLocaleString("vi-VN");
}

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

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <Input
      value={String(value ?? "")}
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
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-red-600">
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
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-red-600">
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
        <div className="truncate max-w-[300px]" title={p.name}>
          {p.name}
        </div>
        <div className="font-mono text-xs text-zinc-400">{p.sku}</div>
      </td>

      <td className="px-4 py-3 font-medium text-right">{formatVND(p.price)}</td>
      <td className="px-4 py-3 text-xs text-center">{p.stock}</td>

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

/* ================== EDIT DRAWER (tách riêng để giảm lag) ================== */
function buildBaseProduct(p?: Product): Product {
  return p
    ? { ...p }
    : {
        name: "",
        price: 0,
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
  for (const u of urls) {
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

  // Local draft state => gõ tên không làm re-render trang list phía sau
  const [name, setName] = useState(initial.name || "");
  const [price, setPrice] = useState<number>(Number(initial.price) || 0);
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
    const imgs = uniqUrls([...(initial.image ? [initial.image] : []), ...(initial.images || [])]);
    return imgs.map((u) => ({ url: u, kind: "url" as const }));
  }, [initial]);

  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // reset khi mở editor sản phẩm khác
  useEffect(() => {
    setName(initial.name || "");
    setPrice(Number(initial.price) || 0);
    setSku(initial.sku || "");
    setDescription(initial.description || "");
    setStock(Number(initial.stock) || 0);
    setSold(Number(initial.sold) || 0);
    setStatus(initial.status || "closed");
    setColors(initial.colors || []);
    setSpecs(initial.specs || []);
    setSelectedCatIds(Array.isArray(initial.categories) ? initial.categories : []);
    setGallery(initialGallery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id, open]);

  const uploadFilesToServer = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!API_BASE) {
      toast.error("Thiếu NEXT_PUBLIC_API_BASE_URL / NEXT_PUBLIC_API_URL");
      return;
    }

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));

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
  }, []);

  const handleSave = useCallback(async () => {
    const n = String(name || "").trim();
    if (!n) return toast.error("Tên sản phẩm không được rỗng");

    setSaving(true);
    try {
      const images = gallery
        .map((g) => g.url)
        .map((u) => String(u || "").trim())
        .filter((u) => IMG_RE.test(u));

      const payload: any = {
        id: initial.id,
        name: n,
        price: Number(price) || 0,
        sku: sku || "",
        description: description || "",
        stock: Number(stock) || 0,
        sold: Number(sold) || 0,
        status,
        colors,
        specs,
        categories: selectedCatIds,
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex flex-col w-full h-full max-w-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
          <h2 className="text-lg font-bold text-zinc-900">{initial.id ? "Chỉnh sửa" : "Thêm mới"}</h2>
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
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Giá bán (VNĐ)</Label>
                  <PriceInput value={price} onChange={setPrice} />
                </div>
                <div>
                  <Label>Mã SKU</Label>
                  <Input value={sku} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSku(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Slug (tự sinh từ server)</Label>
                <Input value={initial.slug || ""} readOnly disabled placeholder="Sẽ được tạo sau khi lưu" />
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
                onChange={(e) => uploadFilesToServer(e.target.files)}
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

      setProducts(Array.isArray(pJson) ? pJson : []);
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
        catF === "all"
          ? true
          : Array.isArray(p.categories)
            ? p.categories.includes(catF)
            : false;

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
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
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

        <div className="flex items-center justify-between gap-3 px-4 pb-4 mx-auto max-w-7xl">
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

      <main className="px-4 py-6 mx-auto max-w-7xl">
        {loading ? (
          <div className="py-20 text-center text-zinc-400 animate-pulse">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-zinc-200">
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
                <div className="mt-1 text-lg font-semibold text-emerald-600">
                  {formatVND(viewing.price)} ₫
                </div>
              </div>

              <div className="p-4 space-y-2 text-sm border rounded-lg text-zinc-600 bg-zinc-50">
                <div className="flex justify-between">
                  <span>Slug:</span> <span className="font-mono">{viewing.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span> <span>{viewing.sku || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kho:</span> <b>{viewing.stock}</b>
                </div>
                <div className="flex justify-between">
                  <span>Đã bán:</span> <b>{viewing.sold}</b>
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
