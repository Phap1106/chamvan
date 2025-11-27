// // //src/app/admin/products/page.tsx

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

// const slugify = (s: string) =>
//   s
//     .toLowerCase()
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/đ/g, 'd')
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '')   // bỏ '-' đầu/cuối
//     .replace(/-{2,}/g, '-')    // gộp -- thành -
//     .slice(0, 120);

// const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
// const parseDigits = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;

// const normalizeImages = (imagesRaw: any): string[] => {
//     if (!imagesRaw || !Array.isArray(imagesRaw)) return [];
//     return imagesRaw.map((i: any) => {
//             if (typeof i === 'string') return i.trim();
//             if (i && typeof i.url === 'string') return i.url.trim(); 
//             return '';
//         }).filter(Boolean);
// };

// /* ================== UI COMPONENTS (FIXED) ================== */
// const Button = ({ variant = 'primary', className, ...props }: any) => {
//   const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none disabled:opacity-50 h-10";
//   const variants: Record<string, string> = { // Sử dụng Record<string, string> để tránh lỗi TS phức tạp
//     primary: "bg-zinc-900 text-white hover:bg-zinc-800",
//     secondary: "bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
//     danger: "bg-red-600 text-white hover:bg-red-700",
//     ghost: "hover:bg-zinc-100 text-zinc-600",
//   };
//   const variantClass = variants[variant] || variants.primary; // Lấy class tương ứng
//   return <button className={`${base} ${variantClass} ${className}`} {...props} />;
// };

// const Input = (props: any) => (
//   <input className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent" {...props} />
// );

// const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
//   <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">
//     {children} {required && <span className="text-red-500">*</span>}
//   </label>
// );

// const Badge = ({ children, color = 'zinc' }: { children: React.ReactNode; color?: 'zinc' | 'green' | 'red' }) => {
//   const colors = {
//     zinc: "bg-zinc-100 text-zinc-800 border-zinc-200",
//     green: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     red: "bg-rose-50 text-rose-700 border-rose-200",
//   };
//   return <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold border ${colors[color]} border-opacity-50`}>{children}</span>;
// };

// function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
//   const [raw, setRaw] = useState(formatVND(value));
//   useEffect(() => setRaw(formatVND(value)), [value]);
//   return (
//     <input
//       inputMode="numeric"
//       className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
//       value={raw}
//       onChange={(e) => { const n = parseDigits(e.target.value); setRaw(new Intl.NumberFormat('vi-VN').format(n)); onChange(n); }}
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
//     if (finalHex && !finalHex.startsWith('#')) { finalHex = '#' + finalHex; }
//     onChange([...(value || []), { name: name.trim(), hex: finalHex }]);
//     setName(''); setHex('');
//   }
//   function removeIdx(idx: number) {
//     const n = [...value]; n.splice(idx, 1); onChange(n);
//   }
//   return (
//     <div className="p-4 border border-zinc-200 rounded-md bg-white space-y-3">
//       <Label>Màu sắc</Label>
//       <div className="flex gap-2 mb-3">
//         <Input placeholder="Tên màu" value={name} onChange={(e) => setName(e.target.value)} />
//         <Input placeholder="#hex" value={hex} onChange={(e) => setHex(e.target.value)} className="w-24" />
//         <Button onClick={add} variant="secondary">Thêm</Button>
//       </div>
//       <ul className="space-y-1 text-sm max-h-28 overflow-y-auto">
//         {value?.map((c, i) => (
//           <li key={`${c.name}-${i}`} className="flex items-center justify-between bg-zinc-50 p-2 rounded">
//             <span className="truncate flex items-center gap-2">
//               <span className="w-3 h-3 rounded-full ring-1 ring-zinc-300" style={{ background: c.hex || '#eee' }} />
//               {c.name} {c.hex && <span className="text-xs text-zinc-500">({c.hex})</span>}
//             </span>
//             <button className="text-red-500 hover:bg-red-50 p-0.5 rounded" onClick={() => removeIdx(i)}><Trash2 size={14}/></button>
//           </li>
//         ))}
//         {!value?.length && <li className="text-xs text-zinc-400 py-2">Chưa có màu</li>}
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
//     setLabel(''); setVal('');
//   }
//   function removeIdx(i: number) {
//     const n = [...value]; n.splice(i, 1); onChange(n);
//   }
//   return (
//     <div className="p-4 border border-zinc-200 rounded-md bg-white space-y-3">
//       <Label>Thông số kỹ thuật</Label>
//       <div className="grid grid-cols-3 gap-2 mb-3">
//         <Input placeholder="Nhãn" value={label} onChange={(e) => setLabel(e.target.value)} className="col-span-1" />
//         <Input placeholder="Giá trị" value={val} onChange={(e) => setVal(e.target.value)} className="col-span-2" />
//         <Button onClick={add} variant="secondary" className="col-span-3">Thêm thông số</Button>
//       </div>
//       <ul className="space-y-1 text-sm max-h-28 overflow-y-auto">
//         {value?.map((s, i) => (
//           <li key={`${s.label}-${i}`} className="flex items-center justify-between bg-zinc-50 p-2 rounded">
//             <span className="truncate">{s.label}: <span className="text-gray-600">{s.value}</span></span>
//             <button className="text-red-500 hover:bg-red-50 p-0.5 rounded" onClick={() => removeIdx(i)}><Trash2 size={14}/></button>
//           </li>
//         ))}
//         {!value?.length && <li className="text-xs text-zinc-400 py-2">Chưa có thông số</li>}
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
//     if (!vName.trim()) return toast.error("Nhập tên biến thể (VD: Size L)");
//     if (vPrice <= 0) return toast.error("Giá phải lớn hơn 0");
    
//     onChange([...value, { name: vName, price: vPrice, stock: vStock, sku: vSku }]);
//     setVName(''); setVPrice(0); setVStock(0); setVSku('');
//   }

//   function removeIdx(idx: number) {
//     const n = [...value]; n.splice(idx, 1); onChange(n);
//   }

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-12 gap-2 items-end border border-zinc-200 p-3 rounded-lg bg-white shadow-sm">
//         <div className="col-span-4"><Label>Tên biến thể</Label><Input placeholder="Màu Đỏ - Size L" value={vName} onChange={(e) => setVName(e.target.value)} /></div>
//         <div className="col-span-3"><Label>Giá tiền</Label><PriceInput value={vPrice} onChange={setVPrice} /></div>
//         <div className="col-span-2"><Label>Kho</Label><Input type="number" value={vStock} onChange={(e) => setVStock(Number(e.target.value))} /></div>
//         <div className="col-span-2"><Label>SKU (Opt)</Label><Input value={vSku} onChange={(e) => setVSku(e.target.value)} /></div>
//         <div className="col-span-1"><Button onClick={add} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-0 h-10"><Plus size={18}/></Button></div>
//       </div>

//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {value.map((v, idx) => (
//           <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border shadow-sm">
//              <div>
//                 <div className="font-medium text-sm">{v.name}</div>
//                 <div className="text-xs text-gray-500">SKU: {v.sku || '—'}</div>
//              </div>
//              <div className="flex items-center gap-4 text-sm">
//                 <span className="font-semibold text-emerald-600">{formatVND(v.price)} ₫</span>
//                 <span className="text-gray-600">Kho: {v.stock}</span>
//                 <button onClick={() => removeIdx(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
//              </div>
//           </div>
//         ))}
//         {value.length === 0 && <div className="text-center text-sm text-zinc-400 py-2 border rounded-lg">Chưa có biến thể nào.</div>}
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
//   const [slugTouched, setSlugTouched] = useState(false);
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
//           categories: Array.isArray(p.categories) ? p.categories.map((c:any) => ({ id: Number(c.id), name: c.name, slug: c.slug })) : [],
//           status: p.status === 'closed' ? 'closed' : 'open',
//           description: p.description || '',
//           colors: p.colors || [],
//           specs: p.specs || [],
//           variants: p.variants || [],
//         };
//       });
//       setList(items);
//     } catch (e) { toast.error("Lỗi tải danh sách sản phẩm"); }
//   }

//   async function loadCategories() {
//     try {
//       const res = await fetch('/api/admin/categories');
//       const data = await res.json();
//       setAllCats((Array.isArray(data) ? data : data.items || []).map((c:any) => ({ id: Number(c.id), name: c.name, slug: c.slug })));
//     } catch {}
//   }

//   const openEditor = (p?: Product) => {
//     if (p) {
//       setEditing({ ...p, colors: p.colors || [], specs: p.specs || [], variants: p.variants || [] });
//       setSelectedCatIds((p.categories || []).map(c => Number(c.id)));
//       const existingImages = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
//       setGallery(existingImages.map(url => ({ url, kind: 'url' })));
//       setSlugTouched(true);
//     } else {
//       setEditing({ name: '', slug: '', price: 0, sku: '', description: '', image: '', images: [], stock: 0, sold: 0, status: 'open', colors: [], specs: [], variants: [] });
//       setSelectedCatIds([]); setGallery([]); setSlugTouched(false);
//     }
//     setShowDrawer(true);
//   };

//   const handleSave = async () => {
//     if (!editing || !editing.name) return toast.error('Tên sản phẩm là bắt buộc');
//     setSaving(true);
    
//     const finalImages = gallery.map(g => g.url);
    
//     const payload = {
//       ...editing,
//       slug: editing.slug || slugify(editing.name),
//       price: String(editing.price), 
//       stock: Number(editing.stock),
//       image: finalImages[0] || '',
//       images: finalImages,
//       categories: selectedCatIds,
//       colors: editing.colors,
//       specs: editing.specs,
//       variants: undefined // KHÔNG GỬI VARIANTS
//     };

//     try {
//       const url = editing.id ? `/api/admin/products/${editing.id}` : '/api/admin/products';
//       const method = editing.id ? 'PATCH' : 'POST';
//       const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       if (!res.ok) throw new Error();
//       await loadProducts(); setShowDrawer(false); toast.success('Lưu thành công');
//     } catch { toast.error('Lưu thất bại'); } 
//     finally { setSaving(false); }
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete?.id) return;
//     await fetch(`/api/admin/products/${confirmDelete.id}`, { method: 'DELETE' });
//     setList(prev => prev.filter(p => p.id !== confirmDelete.id));
//     setConfirmDelete(null);
//     toast.success('Đã xóa');
//   };

//   const filtered = useMemo(() => {
//     const lowerQ = q.toLowerCase();
//     return list.filter(p => (!q || p.name.toLowerCase().includes(lowerQ) || p.sku?.toLowerCase().includes(lowerQ)) && (catF === 'all' || p.categories?.some(c => c.id === catF)));
//   }, [list, q, catF]);

//   return (
//     <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-20">
//       <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <h1 className="text-lg font-bold tracking-tight text-zinc-900 flex items-center gap-2">
//             📦 Quản lý sản phẩm <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-600">{list.length}</span>
//           </h1>
//           <Button onClick={() => openEditor()} className="shadow-sm"><Plus size={16} /> Thêm mới</Button>
//         </div>
//         <div className="max-w-7xl mx-auto px-4 pb-4 flex flex-col md:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
//             <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm kiếm tên, mã SKU..." className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
//           </div>
//           <div className="flex gap-2">
//             <select value={catF} onChange={e => setCatF(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="h-9 px-3 bg-white border border-zinc-200 rounded-md text-sm outline-none">
//               <option value="all">Tất cả danh mục</option>
//               {allCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//             <select value={statusF} onChange={e => setStatusF(e.target.value as any)} className="h-9 px-3 bg-white border border-zinc-200 rounded-md text-sm outline-none">
//               <option value="all">Tất cả trạng thái</option>
//               <option value="open">Đang bán</option>
//               <option value="closed">Ngưng bán</option>
//             </select>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         {loading ? <div className="text-center py-20 text-zinc-400 animate-pulse">Đang tải dữ liệu...</div> : (
//           <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase text-zinc-500 font-semibold">
//                 <tr>
//                   <th className="px-4 py-3 w-16">Image</th>
//                   <th className="px-4 py-3">Sản phẩm</th>
//                   <th className="px-4 py-3 text-right">Giá bán</th>
//                   <th className="px-4 py-3 text-center">Kho</th>
//                   <th className="px-4 py-3">Trạng thái</th>
//                   <th className="px-4 py-3 text-right">Thao tác</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-zinc-100">
//                 {filtered.map(p => (
//                   <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
//                     <td className="px-4 py-3">
//                       <div className="w-10 h-10 rounded bg-zinc-100 border border-zinc-200 overflow-hidden">
//                          <img src={p.image || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" onError={e => e.currentTarget.src='/placeholder.jpg'} />
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-zinc-900">
//                       <div className="truncate max-w-[300px]" title={p.name}>{p.name}</div>
//                       <div className="text-xs text-zinc-400 font-mono">{p.sku}</div>
//                     </td>
//                     <td className="px-4 py-3 text-right font-medium">{formatVND(p.price)}</td>
//                     <td className="px-4 py-3 text-center text-xs">{p.stock}</td>
//                     <td className="px-4 py-3"><Badge color={p.status === 'open' ? 'green' : 'zinc'}>{p.status === 'open' ? 'Bán' : 'Ẩn'}</Badge></td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button onClick={() => setViewing(p)} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600" title="Xem"><Eye size={14}/></button>
//                         <button onClick={() => openEditor(p)} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600" title="Sửa"><Edit3 size={14}/></button>
//                         <button onClick={() => setConfirmDelete(p)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Xóa"><Trash2 size={14}/></button>
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
//           <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <h2 className="text-lg font-bold">Chi tiết sản phẩm</h2>
//               <button onClick={() => setViewing(null)}><X size={20}/></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden border"><img src={viewing.image || '/placeholder.jpg'} className="w-full h-full object-cover" alt="" /></div>
//               <div>
//                 <h3 className="text-xl font-bold text-zinc-900">{viewing.name}</h3>
//                 <div className="text-lg font-semibold text-emerald-600 mt-1">{formatVND(viewing.price)} ₫</div>
//               </div>
//               <div className="space-y-2 text-sm text-zinc-600 bg-zinc-50 p-4 rounded-lg border">
//                  <div className="flex justify-between"><span>Slug:</span> <span className="font-mono">{viewing.slug}</span></div>
//                  <div className="flex justify-between"><span>SKU:</span> <span>{viewing.sku || '—'}</span></div>
//                  <div className="flex justify-between"><span>Kho:</span> <b>{viewing.stock}</b></div>
//                  <div className="flex justify-between"><span>Đã bán:</span> <b>{viewing.sold}</b></div>
//               </div>
//               <div>
//                  <h4 className="font-bold text-sm mb-2 uppercase text-zinc-500">Mô tả</h4>
//                  <div className="text-sm text-zinc-700 whitespace-pre-wrap bg-white p-3 border rounded-md min-h-[100px]">
//                     {viewing.description || 'Chưa có mô tả'}
//                  </div>
//               </div>
//             </div>
//             <div className="p-4 border-t bg-zinc-50 flex justify-end">
//                <Button onClick={() => { openEditor(viewing); setViewing(null); }}>Chỉnh sửa</Button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {showDrawer && editing && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
//           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
//             <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
//               <h2 className="text-lg font-bold text-zinc-900">{editing.id ? 'Chỉnh sửa' : 'Thêm mới'}</h2>
//               <button onClick={() => setShowDrawer(false)} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20}/></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50/50">
//               <section className="space-y-4">
//                 <div className="flex items-center gap-2 pb-2 border-b"><Package size={18}/><h3 className="font-bold">Thông tin</h3></div>
//                 <div className="grid gap-4">
//                   <div><Label required>Tên sản phẩm</Label><Input value={editing.name} onChange={(e:any) => setEditing(prev => ({ ...prev!, name: e.target.value, slug: slugTouched ? prev!.slug : slugify(e.target.value) }))} /></div>
//                   <div className="grid grid-cols-2 gap-4">
//                      <div><Label>Giá bán (VNĐ)</Label><PriceInput value={editing.price} onChange={(v) => setEditing({...editing!, price: v})} /></div>
//                      <div><Label>Mã SKU</Label><Input value={editing.sku || ''} onChange={(e:any) => setEditing({...editing!, sku: e.target.value})} /></div>
//                   </div>
//                   <div><Label>Slug</Label><Input value={editing.slug} onChange={(e:any) => { setSlugTouched(true); setEditing({...editing!, slug: slugify(e.target.value)}) }} /></div>
//                   <div><Label>Mô tả</Label><textarea className="w-full p-3 text-sm border border-zinc-300 rounded-md bg-white min-h-[120px]" value={editing.description || ''} onChange={e => setEditing({...editing!, description: e.target.value})} /></div>
//                 </div>
//               </section>

//               <section className="space-y-4">
//                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2"><Layers size={18}/><h3 className="font-bold">Phân loại hàng</h3></h3>
//                  {/* Logic giá/kho đơn (ĐÃ KHÔI PHỤC) */}
//                  <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded border">
//                     <div><Label>Tồn kho</Label><Input type="number" value={editing.stock} onChange={(e:any) => setEditing({...editing!, stock: Number(e.target.value)})} /></div>
//                     <div><Label>Đã bán</Label><Input type="number" value={editing.sold} onChange={(e:any) => setEditing({...editing!, sold: Number(e.target.value)})} /></div>
//                  </div>
//               </section>

//               <section className="space-y-4">
//                  <div className="flex items-center gap-2 pb-2 border-b"><Tag size={18}/><h3 className="font-bold">Thuộc tính & Màu sắc</h3></div>
//                  <div className="grid md:grid-cols-2 gap-6">
//                    <ColorsEditor value={editing.colors || []} onChange={(colors) => setEditing({ ...(editing as Product), colors })} />
//                    <SpecsEditor value={editing.specs || []} onChange={(specs) => setEditing({ ...(editing as Product), specs })} />
//                  </div>
//               </section>

//               <section className="space-y-4">
//                  <h3 className="flex items-center gap-2 pb-2 border-b"><ImageIcon size={18}/><h3 className="font-bold">Hình ảnh</h3></h3>
//                 <div className="flex gap-2 mb-3">
//                    <input ref={urlInputRef} className="flex-1 h-10 px-3 text-sm border border-zinc-300 rounded-md bg-white" placeholder="Dán URL ảnh..." />
//                    <Button variant="secondary" onClick={() => {
//                       if(urlInputRef.current?.value) {
//                          const urls = urlInputRef.current.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
//                          setGallery(prev => [...prev, ...urls.map(u => ({ url: u, kind: 'url' as const }))]);
//                          urlInputRef.current.value = '';
//                       }
//                    }}>Thêm</Button>
//                 </div>
//                 <div className="grid grid-cols-4 gap-3">
//                   {gallery.map((g, i) => (
//                     <div key={i} className="relative group aspect-square bg-white rounded-md overflow-hidden border border-zinc-200">
//                       <img src={g.url} alt="" className="w-full h-full object-cover" onError={e => e.currentTarget.style.display='none'} />
//                       <button onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
//                       {i === 0 && <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center">Ảnh chính</div>}
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="space-y-4">
//                  <h3 className="flex items-center gap-2 pb-2 border-b"><Layers size={18}/><h3 className="font-bold">Danh mục</h3></h3>
//                  <div className="space-y-2">
//                     <div className="max-h-40 overflow-y-auto border border-zinc-300 rounded-md p-2 bg-white">
//                          {allCats.map(c => (
//                             <label key={c.id} className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 rounded cursor-pointer text-sm select-none">
//                                <input type="checkbox" checked={selectedCatIds.includes(c.id)} onChange={() => setSelectedCatIds(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} className="rounded border-zinc-300 accent-zinc-900" />
//                                {c.name}
//                             </label>
//                          ))}
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                          <div><Label>Trạng thái</Label><select value={editing.status} onChange={e => setEditing({...editing!, status: e.target.value as any})} className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm bg-white"><option value="open">Đang bán</option><option value="closed">Ngưng bán</option></select></div>
//                          <div><Label>SKU Gốc (Tùy chọn)</Label><Input value={editing.sku || ''} onChange={(e:any) => setEditing({...editing!, sku: e.target.value})} placeholder="Mã SKU chung" /></div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                          <div><Label>Tồn kho Chung</Label><Input type="number" value={editing.stock} onChange={(e:any) => setEditing({...editing!, stock: Number(e.target.value)})} /></div>
//                          <div><Label>Đã bán Chung</Label><Input type="number" value={editing.sold} onChange={(e:any) => setEditing({...editing!, sold: Number(e.target.value)})} /></div>
//                       </div>
//                    </div>
//               </section>
//             </div>
//             <div className="p-4 border-t border-zinc-200 bg-white flex items-center justify-end gap-3">
//               <Button variant="ghost" onClick={() => setShowDrawer(false)}>Hủy bỏ</Button>
//               <Button onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu lại'}</Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {confirmDelete && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
//           <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
//             <h3 className="text-lg font-bold text-zinc-900 mb-2">Xác nhận xóa?</h3>
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















'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, Plus, X, Trash2, Edit3, Eye, Image as ImageIcon, Package, Layers, Tag
} from 'lucide-react';
import { toast } from 'sonner';

/* ================== TYPES & UTILS ================== */
type Color = { name: string; hex?: string };
type Spec = { label: string; value: string };
type Variant = { name: string; price: number; stock: number; sku?: string };

type Product = {
  id?: number | string;
  name: string;
  slug: string;
  price: number;
  sku?: string;
  description?: string;
  image?: string;
  images?: string[];
  colors?: Color[];
  specs?: Spec[];
  variants?: Variant[];
  categories?: Array<{ id: number; name: string; slug: string }>;
  stock?: number;
  sold?: number;
  status?: 'open' | 'closed';
};

type Category = { id: number; name: string; slug: string };
type LocalGallery = { url: string; kind: 'url' | 'file'; file?: File };

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
const parseDigits = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;

const normalizeImages = (imagesRaw: any): string[] => {
  if (!imagesRaw || !Array.isArray(imagesRaw)) return [];
  return imagesRaw
    .map((i: any) => {
      if (typeof i === 'string') return i.trim();
      if (i && typeof i.url === 'string') return i.url.trim();
      return '';
    })
    .filter(Boolean);
};

/* ================== UI COMPONENTS (FIXED) ================== */
const Button = ({ variant = 'primary', className, ...props }: any) => {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none disabled:opacity-50 h-10';
  const variants: Record<string, string> = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800',
    secondary: 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-zinc-100 text-zinc-600',
  };
  const variantClass = variants[variant] || variants.primary;
  return <button className={`${base} ${variantClass} ${className}`} {...props} />;
};

const Input = (props: any) => (
  <input
    className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
    {...props}
  />
);

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Badge = ({
  children,
  color = 'zinc',
}: {
  children: React.ReactNode;
  color?: 'zinc' | 'green' | 'red';
}) => {
  const colors = {
    zinc: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold border ${colors[color]} border-opacity-50`}
    >
      {children}
    </span>
  );
};

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState(formatVND(value));
  useEffect(() => setRaw(formatVND(value)), [value]);
  return (
    <input
      inputMode="numeric"
      className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
      value={raw}
      onChange={(e) => {
        const n = parseDigits(e.target.value);
        setRaw(new Intl.NumberFormat('vi-VN').format(n));
        onChange(n);
      }}
      onBlur={() => setRaw(formatVND(value))}
    />
  );
}

// === HELPER EDITORS ===

function ColorsEditor({ value, onChange }: { value: Color[]; onChange: (v: Color[]) => void }) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('');
  function add() {
    if (!name.trim()) return;
    let finalHex = hex.trim();
    if (finalHex && !finalHex.startsWith('#')) {
      finalHex = '#' + finalHex;
    }
    onChange([...(value || []), { name: name.trim(), hex: finalHex }]);
    setName('');
    setHex('');
  }
  function removeIdx(idx: number) {
    const n = [...value];
    n.splice(idx, 1);
    onChange(n);
  }
  return (
    <div className="p-4 border border-zinc-200 rounded-md bg-white space-y-3">
      <Label>Màu sắc</Label>
      <div className="flex gap-2 mb-3">
        <Input placeholder="Tên màu" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          placeholder="#hex"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-24"
        />
        <Button onClick={add} variant="secondary">
          Thêm
        </Button>
      </div>
      <ul className="space-y-1 text-sm max-h-28 overflow-y-auto">
        {value?.map((c, i) => (
          <li
            key={`${c.name}-${i}`}
            className="flex items-center justify-between bg-zinc-50 p-2 rounded"
          >
            <span className="truncate flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full ring-1 ring-zinc-300"
                style={{ background: c.hex || '#eee' }}
              />
              {c.name} {c.hex && <span className="text-xs text-zinc-500">({c.hex})</span>}
            </span>
            <button
              className="text-red-500 hover:bg-red-50 p-0.5 rounded"
              onClick={() => removeIdx(i)}
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {!value?.length && <li className="text-xs text-zinc-400 py-2">Chưa có màu</li>}
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
    <div className="p-4 border border-zinc-200 rounded-md bg-white space-y-3">
      <Label>Thông số kỹ thuật</Label>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Input
          placeholder="Nhãn"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="col-span-1"
        />
        <Input
          placeholder="Giá trị"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="col-span-2"
        />
        <Button onClick={add} variant="secondary" className="col-span-3">
          Thêm thông số
        </Button>
      </div>
      <ul className="space-y-1 text-sm max-h-28 overflow-y-auto">
        {value?.map((s, i) => (
          <li
            key={`${s.label}-${i}`}
            className="flex items-center justify-between bg-zinc-50 p-2 rounded"
          >
            <span className="truncate">
              {s.label}: <span className="text-gray-600">{s.value}</span>
            </span>
            <button
              className="text-red-500 hover:bg-red-50 p-0.5 rounded"
              onClick={() => removeIdx(i)}
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {!value?.length && <li className="text-xs text-zinc-400 py-2">Chưa có thông số</li>}
      </ul>
    </div>
  );
}

function VariantsEditor({ value, onChange }: { value: Variant[]; onChange: (v: Variant[]) => void }) {
  const [vName, setVName] = useState('');
  const [vPrice, setVPrice] = useState(0);
  const [vStock, setVStock] = useState(0);
  const [vSku, setVSku] = useState('');

  function add() {
    if (!vName.trim()) return toast.error('Nhập tên biến thể (VD: Size L)');
    if (vPrice <= 0) return toast.error('Giá phải lớn hơn 0');

    onChange([...value, { name: vName, price: vPrice, stock: vStock, sku: vSku }]);
    setVName('');
    setVPrice(0);
    setVStock(0);
    setVSku('');
  }

  function removeIdx(idx: number) {
    const n = [...value];
    n.splice(idx, 1);
    onChange(n);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 items-end border border-zinc-200 p-3 rounded-lg bg-white shadow-sm">
        <div className="col-span-4">
          <Label>Tên biến thể</Label>
          <Input
            placeholder="Màu Đỏ - Size L"
            value={vName}
            onChange={(e) => setVName(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <Label>Giá tiền</Label>
          <PriceInput value={vPrice} onChange={setVPrice} />
        </div>
        <div className="col-span-2">
          <Label>Kho</Label>
          <Input
            type="number"
            value={vStock}
            onChange={(e) => setVStock(Number(e.target.value))}
          />
        </div>
        <div className="col-span-2">
          <Label>SKU (Opt)</Label>
          <Input value={vSku} onChange={(e) => setVSku(e.target.value)} />
        </div>
        <div className="col-span-1">
          <Button
            onClick={add}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-0 h-10"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {value.map((v, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white p-3 rounded border shadow-sm"
          >
            <div>
              <div className="font-medium text-sm">{v.name}</div>
              <div className="text-xs text-gray-500">SKU: {v.sku || '—'}</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-emerald-600">
                {formatVND(v.price)} ₫
              </span>
              <span className="text-gray-600">Kho: {v.stock}</span>
              <button
                onClick={() => removeIdx(idx)}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {value.length === 0 && (
          <div className="text-center text-sm text-zinc-400 py-2 border rounded-lg">
            Chưa có biến thể nào.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================== MAIN PAGE ================== */
export default function AdminProductsPage() {
  const [list, setList] = useState<Product[]>([]);
  const [allCats, setAllCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [catF, setCatF] = useState<number | 'all'>('all');
  const [statusF, setStatusF] = useState<'all' | 'open' | 'closed'>('all');

  const [showDrawer, setShowDrawer] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);

  const [gallery, setGallery] = useState<LocalGallery[]>([]);
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([loadProducts(), loadCategories()]).finally(() => setLoading(false));
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : [];
      if (!res.ok) throw new Error();

      const arr = Array.isArray(data) ? data : data?.items || [];
      const items = arr.map((p: any) => {
        const images = normalizeImages(p.images);

        const displayPrice = Number(p.price || 0);
        const totalStock = Number(p.stock || 0);

        return {
          ...p,
          price: displayPrice,
          stock: totalStock,
          images,
          image: p.image || images[0] || '',
          categories: Array.isArray(p.categories)
            ? p.categories.map((c: any) => ({ id: Number(c.id), name: c.name, slug: c.slug }))
            : [],
          status: p.status === 'closed' ? 'closed' : 'open',
          description: p.description || '',
          colors: p.colors || [],
          specs: p.specs || [],
          variants: p.variants || [],
        };
      });
      setList(items);
    } catch (e) {
      toast.error('Lỗi tải danh sách sản phẩm');
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setAllCats(
        (Array.isArray(data) ? data : data.items || []).map((c: any) => ({
          id: Number(c.id),
          name: c.name,
          slug: c.slug,
        })),
      );
    } catch {}
  }

  const openEditor = (p?: Product) => {
    if (p) {
      setEditing({
        ...p,
        colors: p.colors || [],
        specs: p.specs || [],
        variants: p.variants || [],
      });
      setSelectedCatIds((p.categories || []).map((c) => Number(c.id)));
      const existingImages =
        p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
      setGallery(existingImages.map((url) => ({ url, kind: 'url' })));
    } else {
      setEditing({
        name: '',
        slug: '',
        price: 0,
        sku: '',
        description: '',
        image: '',
        images: [],
        stock: 0,
        sold: 0,
        status: 'open',
        colors: [],
        specs: [],
        variants: [],
      });
      setSelectedCatIds([]);
      setGallery([]);
    }
    setShowDrawer(true);
  };

  const handleSave = async () => {
    if (!editing || !editing.name) return toast.error('Tên sản phẩm là bắt buộc');
    setSaving(true);

    const finalImages = gallery.map((g) => g.url);

    // KHÔNG gửi slug lên BE – để BE tự sinh / giữ
    const { slug, ...restEditing } = editing as any;

    const payload = {
      ...restEditing,
      price: String(editing.price),
      stock: Number(editing.stock),
      image: finalImages[0] || '',
      images: finalImages,
      categories: selectedCatIds,
      colors: editing.colors,
      specs: editing.specs,
      variants: undefined, // KHÔNG GỬI VARIANTS
    };

    try {
      const url = editing.id ? `/api/admin/products/${editing.id}` : '/api/admin/products';
      const method = editing.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      await loadProducts();
      setShowDrawer(false);
      toast.success('Lưu thành công');
    } catch {
      toast.error('Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete?.id) return;
    await fetch(`/api/admin/products/${confirmDelete.id}`, { method: 'DELETE' });
    setList((prev) => prev.filter((p) => p.id !== confirmDelete.id));
    setConfirmDelete(null);
    toast.success('Đã xóa');
  };

  const filtered = useMemo(() => {
    const lowerQ = q.toLowerCase();
    return list.filter(
      (p) =>
        (!q ||
          p.name.toLowerCase().includes(lowerQ) ||
          p.sku?.toLowerCase().includes(lowerQ)) &&
        (catF === 'all' || p.categories?.some((c) => c.id === catF)),
    );
  }, [list, q, catF]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-20">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            📦 Quản lý sản phẩm{' '}
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-600">
              {list.length}
            </span>
          </h1>
          <Button onClick={() => openEditor()} className="shadow-sm">
            <Plus size={16} /> Thêm mới
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm tên, mã SKU..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm focus:ring-2 focus:ring-zinc-900 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={catF}
              onChange={(e) =>
                setCatF(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="h-9 px-3 bg-white border border-zinc-200 rounded-md text-sm outline-none"
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
              className="h-9 px-3 bg-white border border-zinc-200 rounded-md text-sm outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="open">Đang bán</option>
              <option value="closed">Ngưng bán</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-zinc-400 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase text-zinc-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 w-16">Image</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3 text-right">Giá bán</th>
                  <th className="px-4 py-3 text-center">Kho</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded bg-zinc-100 border border-zinc-200 overflow-hidden">
                        <img
                          src={p.image || '/placeholder.jpg'}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      <div
                        className="truncate max-w-[300px]"
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        {p.sku}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatVND(p.price)}
                    </td>
                    <td className="px-4 py-3 text-center text-xs">
                      {p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={p.status === 'open' ? 'green' : 'zinc'}>
                        {p.status === 'open' ? 'Bán' : 'Ẩn'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewing(p)}
                          className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
                          title="Xem"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => openEditor(p)}
                          className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600"
                          title="Sửa"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-600"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {viewing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setViewing(null)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Chi tiết sản phẩm</h2>
              <button onClick={() => setViewing(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden border">
                <img
                  src={viewing.image || '/placeholder.jpg'}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  {viewing.name}
                </h3>
                <div className="text-lg font-semibold text-emerald-600 mt-1">
                  {formatVND(viewing.price)} ₫
                </div>
              </div>
              <div className="space-y-2 text-sm text-zinc-600 bg-zinc-50 p-4 rounded-lg border">
                <div className="flex justify-between">
                  <span>Slug:</span>{' '}
                  <span className="font-mono">{viewing.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span> <span>{viewing.sku || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kho:</span> <b>{viewing.stock}</b>
                </div>
                <div className="flex justify-between">
                  <span>Đã bán:</span> <b>{viewing.sold}</b>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 uppercase text-zinc-500">
                  Mô tả
                </h4>
                <div className="text-sm text-zinc-700 whitespace-pre-wrap bg-white p-3 border rounded-md min-h-[100px]">
                  {viewing.description || 'Chưa có mô tả'}
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-zinc-50 flex justify-end">
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

      {showDrawer && editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />
          <div
            className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
              <h2 className="text-lg font-bold text-zinc-900">
                {editing.id ? 'Chỉnh sửa' : 'Thêm mới'}
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 hover:bg-zinc-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50/50">
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Package size={18} />
                  <h3 className="font-bold">Thông tin</h3>
                </div>
                <div className="grid gap-4">
                  <div>
                    <Label required>Tên sản phẩm</Label>
                    <Input
                      value={editing.name}
                      onChange={(e: any) =>
                        setEditing((prev) => ({ ...prev!, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Giá bán (VNĐ)</Label>
                      <PriceInput
                        value={editing.price}
                        onChange={(v) =>
                          setEditing({ ...(editing as Product), price: v })
                        }
                      />
                    </div>
                    <div>
                      <Label>Mã SKU</Label>
                      <Input
                        value={editing.sku || ''}
                        onChange={(e: any) =>
                          setEditing({ ...(editing as Product), sku: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Slug (tự sinh từ server)</Label>
                    <Input
                      value={editing.slug || ''}
                      readOnly
                      disabled
                      placeholder="Sẽ được tạo sau khi lưu"
                    />
                  </div>
                  <div>
                    <Label>Mô tả</Label>
                    <textarea
                      className="w-full p-3 text-sm border border-zinc-300 rounded-md bg-white min-h-[120px]"
                      value={editing.description || ''}
                      onChange={(e) =>
                        setEditing({
                          ...(editing as Product),
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Layers size={18} />
                  <h3 className="font-bold">Phân loại hàng</h3>
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded border">
                  <div>
                    <Label>Tồn kho</Label>
                    <Input
                      type="number"
                      value={editing.stock}
                      onChange={(e: any) =>
                        setEditing({
                          ...(editing as Product),
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Đã bán</Label>
                    <Input
                      type="number"
                      value={editing.sold}
                      onChange={(e: any) =>
                        setEditing({
                          ...(editing as Product),
                          sold: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Tag size={18} />
                  <h3 className="font-bold">Thuộc tính & Màu sắc</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <ColorsEditor
                    value={editing.colors || []}
                    onChange={(colors) =>
                      setEditing({ ...(editing as Product), colors })
                    }
                  />
                  <SpecsEditor
                    value={editing.specs || []}
                    onChange={(specs) =>
                      setEditing({ ...(editing as Product), specs })
                    }
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="flex items-center gap-2 pb-2 border-b">
                  <ImageIcon size={18} />
                  <h3 className="font-bold">Hình ảnh</h3>
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    ref={urlInputRef}
                    className="flex-1 h-10 px-3 text-sm border border-zinc-300 rounded-md bg-white"
                    placeholder="Dán URL ảnh..."
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (urlInputRef.current?.value) {
                        const urls = urlInputRef.current.value
                          .split(/[\n,]+/)
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setGallery((prev) => [
                          ...prev,
                          ...urls.map((u) => ({ url: u, kind: 'url' as const })),
                        ]);
                        urlInputRef.current.value = '';
                      }
                    }}
                  >
                    Thêm
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((g, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square bg-white rounded-md overflow-hidden border border-zinc-200"
                    >
                      <img
                        src={g.url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <button
                        onClick={() =>
                          setGallery((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
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
                <h3 className="flex items-center gap-2 pb-2 border-b">
                  <Layers size={18} />
                  <h3 className="font-bold">Danh mục</h3>
                </h3>
                <div className="space-y-2">
                  <div className="max-h-40 overflow-y-auto border border-zinc-300 rounded-md p-2 bg-white">
                    {allCats.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 rounded cursor-pointer text-sm select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCatIds.includes(c.id)}
                          onChange={() =>
                            setSelectedCatIds((prev) =>
                              prev.includes(c.id)
                                ? prev.filter((i) => i !== c.id)
                                : [...prev, c.id],
                            )
                          }
                          className="rounded border-zinc-300 accent-zinc-900"
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Trạng thái</Label>
                      <select
                        value={editing.status}
                        onChange={(e) =>
                          setEditing({
                            ...(editing as Product),
                            status: e.target.value as any,
                          })
                        }
                        className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm bg-white"
                      >
                        <option value="open">Đang bán</option>
                        <option value="closed">Ngưng bán</option>
                      </select>
                    </div>
                    <div>
                      <Label>SKU Gốc (Tùy chọn)</Label>
                      <Input
                        value={editing.sku || ''}
                        onChange={(e: any) =>
                          setEditing({ ...(editing as Product), sku: e.target.value })
                        }
                        placeholder="Mã SKU chung"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tồn kho Chung</Label>
                      <Input
                        type="number"
                        value={editing.stock}
                        onChange={(e: any) =>
                          setEditing({
                            ...(editing as Product),
                            stock: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Đã bán Chung</Label>
                      <Input
                        type="number"
                        value={editing.sold}
                        onChange={(e: any) =>
                          setEditing({
                            ...(editing as Product),
                            sold: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="p-4 border-t border-zinc-200 bg-white flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDrawer(false)}>
                Hủy bỏ
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu lại'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Xác nhận xóa?</h3>
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
