// // chamvan_fe/src/app/checkout/page.tsx
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import Link from "next/link";

// import { useCart } from "@/components/providers/CartProvider";
// import { postJSON } from "@/lib/api";
// import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";

// // ====================== Types ======================
// type Province = { code: string; name: string };
// type Ward = { code: string; name: string; provinceCode: string };

// type AddressState = {
//   phone: string;
//   fullName: string;
//   province?: Province;
//   ward?: Ward;
//   street: string;
//   isDefault?: boolean;
// };

// type PaymentMethod = "cod" | "online";
// type InvoiceChoice = "no" | "yes";

// // ====================== Helpers ======================
// const DATA_URL = "/vn-address/vn_units.json";

// function s(v: any): string {
//   return String(v ?? "").trim();
// }
// function safeArray(v: any): any[] {
//   return Array.isArray(v) ? v : [];
// }
// function formatCurrency(v: number) {
//   const n = Number(v);
//   return (Number.isFinite(n) ? n : 0).toLocaleString("vi-VN") + " ₫";
// }

// /**
//  * Fallback danh sách 63 tỉnh/thành (để fix trường hợp vn_units.json chỉ có Ward + ProvinceCode
//  * mà không có ProvinceName => UI sẽ bị "Tỉnh (mã undefined)" / hiển thị code xấu)
//  *
//  * Lưu ý: Code dạng chuỗi, thường là "01", "02"... và có thể "79"... tùy bộ dữ liệu.
//  */
// const VN_PROVINCES_FALLBACK: Province[] = [
//   { code: "01", name: "Thành phố Hà Nội" },
//   { code: "02", name: "Tỉnh Hà Giang" },
//   { code: "04", name: "Tỉnh Cao Bằng" },
//   { code: "06", name: "Tỉnh Bắc Kạn" },
//   { code: "08", name: "Tỉnh Tuyên Quang" },
//   { code: "10", name: "Tỉnh Lào Cai" },
//   { code: "11", name: "Tỉnh Điện Biên" },
//   { code: "12", name: "Tỉnh Lai Châu" },
//   { code: "14", name: "Tỉnh Sơn La" },
//   { code: "15", name: "Tỉnh Yên Bái" },
//   { code: "17", name: "Tỉnh Hoà Bình" },
//   { code: "19", name: "Tỉnh Thái Nguyên" },
//   { code: "20", name: "Tỉnh Lạng Sơn" },
//   { code: "22", name: "Tỉnh Quảng Ninh" },
//   { code: "24", name: "Tỉnh Bắc Giang" },
//   { code: "25", name: "Tỉnh Phú Thọ" },
//   { code: "26", name: "Tỉnh Vĩnh Phúc" },
//   { code: "27", name: "Tỉnh Bắc Ninh" },
//   { code: "30", name: "Tỉnh Hải Dương" },
//   { code: "31", name: "Thành phố Hải Phòng" },
//   { code: "33", name: "Tỉnh Hưng Yên" },
//   { code: "34", name: "Tỉnh Thái Bình" },
//   { code: "35", name: "Tỉnh Hà Nam" },
//   { code: "36", name: "Tỉnh Nam Định" },
//   { code: "37", name: "Tỉnh Ninh Bình" },
//   { code: "38", name: "Tỉnh Thanh Hóa" },
//   { code: "40", name: "Tỉnh Nghệ An" },
//   { code: "42", name: "Tỉnh Hà Tĩnh" },
//   { code: "44", name: "Tỉnh Quảng Bình" },
//   { code: "45", name: "Tỉnh Quảng Trị" },
//   { code: "46", name: "Tỉnh Thừa Thiên Huế" },
//   { code: "48", name: "Thành phố Đà Nẵng" },
//   { code: "49", name: "Tỉnh Quảng Nam" },
//   { code: "51", name: "Tỉnh Quảng Ngãi" },
//   { code: "52", name: "Tỉnh Bình Định" },
//   { code: "54", name: "Tỉnh Phú Yên" },
//   { code: "56", name: "Tỉnh Khánh Hòa" },
//   { code: "58", name: "Tỉnh Ninh Thuận" },
//   { code: "60", name: "Tỉnh Bình Thuận" },
//   { code: "62", name: "Tỉnh Kon Tum" },
//   { code: "64", name: "Tỉnh Gia Lai" },
//   { code: "66", name: "Tỉnh Đắk Lắk" },
//   { code: "67", name: "Tỉnh Đắk Nông" },
//   { code: "68", name: "Tỉnh Lâm Đồng" },
//   { code: "70", name: "Tỉnh Bình Phước" },
//   { code: "72", name: "Tỉnh Tây Ninh" },
//   { code: "74", name: "Tỉnh Bình Dương" },
//   { code: "75", name: "Tỉnh Đồng Nai" },
//   { code: "77", name: "Tỉnh Bà Rịa - Vũng Tàu" },
//   { code: "79", name: "Thành phố Hồ Chí Minh" },
//   { code: "80", name: "Tỉnh Long An" },
//   { code: "82", name: "Tỉnh Tiền Giang" },
//   { code: "83", name: "Tỉnh Bến Tre" },
//   { code: "84", name: "Tỉnh Trà Vinh" },
//   { code: "86", name: "Tỉnh Vĩnh Long" },
//   { code: "87", name: "Tỉnh Đồng Tháp" },
//   { code: "89", name: "Tỉnh An Giang" },
//   { code: "91", name: "Tỉnh Kiên Giang" },
//   { code: "92", name: "Thành phố Cần Thơ" },
//   { code: "93", name: "Tỉnh Hậu Giang" },
//   { code: "94", name: "Tỉnh Sóc Trăng" },
//   { code: "95", name: "Tỉnh Bạc Liêu" },
//   { code: "96", name: "Tỉnh Cà Mau" },
// ];

// /**
//  * Parse vn_units.json (tương thích nhiều dạng):
//  * - Dạng A: Province -> Districts -> Wards
//  * - Dạng B: Province -> Wards
//  * - Dạng C: list phẳng wards: [{ Code, FullName, ProvinceCode, (ProvinceName?) }]
//  *
//  * Yêu cầu UI: chỉ Tỉnh/TP + Phường/Xã => ta normalize wards theo provinceCode.
//  */
// function normalizeVnUnits(raw: any): { provinces: Province[]; wards: Ward[] } {
//   const provinces: Province[] = [];
//   const wards: Ward[] = [];

//   // ===== Case 1/2: array provinces =====
//   const provincesRaw = safeArray(raw);
//   if (
//     provincesRaw.length &&
//     (raw?.[0]?.Districts || raw?.[0]?.Wards || raw?.[0]?.FullName || raw?.[0]?.Name)
//   ) {
//     for (const p of provincesRaw) {
//       const pCode = s(p?.Code || p?.code);
//       const pName = s(p?.FullName || p?.name || p?.Name);
//       const hasNested = Array.isArray(p?.Districts) || Array.isArray(p?.Wards);

//       // Nếu object không phải tỉnh (ví dụ list wards phẳng) thì bỏ qua case này
//       if (!hasNested && (p?.ProvinceCode || p?.WardCode || p?.FullName) && !p?.Districts && !p?.Wards) {
//         // vẫn có thể là object tỉnh không nested, nhưng đa phần nếu có ProvinceCode là ward
//         if (p?.ProvinceCode) continue;
//       }

//       if (pCode && pName) provinces.push({ code: pCode, name: pName });

//       // Case 1: Districts -> Wards
//       const districtsRaw = safeArray(p?.Districts || p?.districts);
//       if (districtsRaw.length) {
//         for (const d of districtsRaw) {
//           const wardsRaw = safeArray(d?.Wards || d?.wards);
//           for (const w of wardsRaw) {
//             const wCode = s(w?.Code || w?.code);
//             const wName = s(w?.FullName || w?.name || w?.Name);
//             if (!wCode || !wName || !pCode) continue;
//             wards.push({ code: wCode, name: wName, provinceCode: pCode });
//           }
//         }
//         continue;
//       }

//       // Case 2: Province has Wards directly
//       const wardsRaw = safeArray(p?.Wards || p?.wards);
//       for (const w of wardsRaw) {
//         const wCode = s(w?.Code || w?.code);
//         const wName = s(w?.FullName || w?.name || w?.Name);
//         if (!wCode || !wName || !pCode) continue;
//         wards.push({ code: wCode, name: wName, provinceCode: pCode });
//       }
//     }

//     if (provinces.length) {
//       provinces.sort((a, b) => a.name.localeCompare(b.name, "vi"));
//       wards.sort((a, b) => a.name.localeCompare(b.name, "vi"));
//       return { provinces, wards };
//     }
//   }

//   // ===== Case 3: list phẳng wards =====
//   const flat = safeArray(raw);
//   const provinceMap = new Map<string, string>();

//   for (const item of flat) {
//     const wCode = s(item?.Code || item?.code);
//     const wName = s(item?.FullName || item?.name || item?.Name);
//     const pCode = s(item?.ProvinceCode || item?.provinceCode);
//     const pName = s(item?.ProvinceName || item?.provinceName || item?.ProvinceFullName);

//     if (pCode) {
//       // nếu dataset có ProvinceName thì dùng luôn
//       if (pName) provinceMap.set(pCode, pName);
//     }
//     if (wCode && wName && pCode) {
//       wards.push({ code: wCode, name: wName, provinceCode: pCode });
//     }
//   }

//   // Nếu không có ProvinceName trong file => fallback 63 tỉnh/thành
//   if (provinceMap.size === 0 && wards.length) {
//     // chỉ lấy những tỉnh có xuất hiện trong wards để dropdown gọn
//     const used = new Set<string>(wards.map((w) => w.provinceCode));
//     const fallback = VN_PROVINCES_FALLBACK.filter((p) => used.has(p.code));
//     fallback.forEach((p) => provinces.push(p));
//   } else {
//     for (const [code, name] of provinceMap.entries()) {
//       provinces.push({ code, name });
//     }
//   }

//   provinces.sort((a, b) => a.name.localeCompare(b.name, "vi"));
//   wards.sort((a, b) => a.name.localeCompare(b.name, "vi"));
//   return { provinces, wards };
// }

// async function loadVnUnits(): Promise<{ provinces: Province[]; wards: Ward[] }> {
//   const res = await fetch(DATA_URL, { cache: "force-cache" });
//   if (!res.ok) throw new Error(`Cannot load ${DATA_URL}. HTTP ${res.status}`);
//   const json = await res.json();
//   return normalizeVnUnits(json);
// }

// function fullAddr(a?: AddressState | null) {
//   if (!a) return "";
//   return [a.street, a.ward?.name, a.province?.name].filter(Boolean).join(", ");
// }

// // ====================== Page ======================
// export default function CheckoutPage() {
//   const { items, subtotal, clear } = useCart();

//   // yêu cầu tạm thời
//   const disableOnlinePayment = true;

//   const [loadingAddr, setLoadingAddr] = useState(false);
//   const [addrData, setAddrData] = useState<{ provinces: Province[]; wards: Ward[] }>({
//     provinces: [],
//     wards: [],
//   });

//   const [provinceList, setProvinceList] = useState<Province[]>([]);
//   const [wardList, setWardList] = useState<Ward[]>([]);

//   const [addr, setAddr] = useState<AddressState>({
//     phone: "",
//     fullName: "",
//     street: "",
//     isDefault: true,
//   });

//   // ✅ địa chỉ đã chốt để mở khoá bước sau
//   const [savedAddr, setSavedAddr] = useState<AddressState | null>(null);

//   // Step 2
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
//   const [customerNote, setCustomerNote] = useState<string>("");

//   // Step 2 - invoice
//   const [invoiceChoice, setInvoiceChoice] = useState<InvoiceChoice | "">("");

//   // Step 3
//   const [placing, setPlacing] = useState(false);
// const [successOpen, setSuccessOpen] = useState(false);
// const [successOrderCode, setSuccessOrderCode] = useState<string | null>(null);

//   const shippingFee = 0;
//   const discount = 0;

//   const total = useMemo(() => {
//     const s1 = Number(subtotal || 0);
//     return Math.max(0, s1 + Number(shippingFee) - Number(discount));
//   }, [subtotal]);

//   useEffect(() => {
//     let alive = true;
//     setLoadingAddr(true);

//     loadVnUnits()
//       .then((data) => {
//         if (!alive) return;
//         setAddrData(data);
//         setProvinceList(Array.isArray(data.provinces) ? data.provinces : []);
//       })
//       .catch((e) => {
//         console.error("Load vn address error:", e);
//         if (!alive) return;
//         setAddrData({ provinces: [], wards: [] });
//         setProvinceList([]);
//         setWardList([]);
//       })
//       .finally(() => {
//         if (alive) setLoadingAddr(false);
//       });

//     return () => {
//       alive = false;
//     };
//   }, []);

//   const onPickProvince = (code: string) => {
//     const pCode = s(code);
//     const p = provinceList.find((x) => x.code === pCode);

//     // đổi tỉnh => reset ward + savedAddr
//     setSavedAddr(null);

//     setAddr((a) => ({
//       ...a,
//       province: p,
//       ward: undefined,
//     }));

//     if (!pCode) {
//       setWardList([]);
//       return;
//     }

//     const w = addrData.wards.filter((x) => x.provinceCode === pCode);
//     setWardList(w);
//   };

//   const onPickWard = (code: string) => {
//     const wCode = s(code);
//     const w = wardList.find((x) => x.code === wCode);
//     setSavedAddr(null);
//     setAddr((a) => ({ ...a, ward: w }));
//   };

//   const canUseAddress =
//     s(addr.phone).length >= 8 &&
//     s(addr.fullName).length >= 2 &&
//     !!addr.province?.code &&
//     !!addr.ward?.code &&
//     s(addr.street).length >= 2;

//   const handleUseAddress = () => {
//     if (!canUseAddress) return;
//     setSavedAddr({ ...addr });

//     // khi chốt địa chỉ, giữ nguyên step2 nhưng nếu chưa chọn invoice thì vẫn bắt chọn
//   };

//   // STEP 2: hợp lệ khi có savedAddr + chọn invoiceChoice
//   const step2Ready = !!savedAddr && (invoiceChoice === "no" || invoiceChoice === "yes");

//   // STEP 3: có hàng + step2Ready + payment ok
//   const canPlaceOrder =
//     !!items?.length &&
//     step2Ready &&
//     (paymentMethod !== "online" || !disableOnlinePayment) &&
//     !placing;

//   async function handlePlaceOrder() {
//     if (!canPlaceOrder) return;

//     const notesParts: string[] = [];
//     const note = s(customerNote);
//     if (note) notesParts.push(`Ghi chú khách: ${note}`);

//     if (invoiceChoice === "yes") {
//       notesParts.push("Yêu cầu xuất hóa đơn: Có (shop sẽ phản hồi hỗ trợ sớm nhất).");
//     } else if (invoiceChoice === "no") {
//       notesParts.push("Yêu cầu xuất hóa đơn: Không.");
//     }

//     const payload = {
//       customerName: savedAddr?.fullName || "Khách lẻ",
//       customerEmail: "guest@example.com",
//       customerPhone: savedAddr?.phone || "",
//       shippingAddress: fullAddr(savedAddr),
//       notes: notesParts.join(" | "),
//       paymentMethod,
//       invoiceRequested: invoiceChoice === "yes",
//       items: items.map((it: any) => ({
//         productId: String(it.id),
//         qty: Number(it.qty || 1),
//       })),
//     };

//     try {
//      setPlacing(true);
// const res = await postJSON("/orders", payload);

// // nếu BE trả về mã đơn / id thì lấy hiển thị (không có cũng ok)
// setSuccessOrderCode(res?.code || res?.orderCode || res?.id || null);

// clear();
// setSuccessOpen(true);

//     } catch (err) {
//       console.error("Create order error", err);
//       alert("Tạo đơn không thành công. Vui lòng thử lại!");
//     } finally {
//       setPlacing(false);
//     }
//   }

//   return (
//      <>
//        <div className="min-h-[70vh]">
//       <div className="max-w-[1320px] px-4 sm:px-6 mx-auto py-8">
//         <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
//           <Link href="/gio-hang" className="text-sm font-medium tracking-wide uppercase hover:underline">
//             TRỞ LẠI GIỎ HÀNG
//           </Link>

//           <div className="text-4xl font-medium tracking-tight">chamvan</div>

//           <div className="w-[120px]" />
//         </div>

//         <div className="grid gap-8 mt-8 lg:grid-cols-[1fr_420px]">
//           {/* LEFT */}
//           <div className="border border-neutral-200 rounded-xl">
//             {/* STEP 1 */}
//             <div className="px-6 py-4 border-b border-neutral-200">
//               <div className="flex items-center gap-3">
//                 <div className="grid text-sm font-semibold border rounded-full w-7 h-7 place-items-center border-neutral-300">
//                   1
//                 </div>
//                 <div className="text-sm font-semibold tracking-wide uppercase">ĐỊA CHỈ GIAO HÀNG</div>
//               </div>
//             </div>

//             <div className="px-6 py-6">
//               {/* Nếu đã chốt địa chỉ thì show box + nút chỉnh sửa */}
//               {savedAddr ? (
//                 <div className="space-y-4">
//                   <div className="p-4 border rounded-lg border-neutral-200 bg-neutral-50">
//                     <div className="text-sm">
//                       <div className="font-semibold">{savedAddr.fullName}</div>
//                       <div className="mt-1 text-neutral-600">{savedAddr.phone}</div>
//                       <div className="mt-1 text-neutral-600">{fullAddr(savedAddr)}</div>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     className="px-6 py-3 text-sm font-semibold border rounded-lg border-neutral-300 hover:bg-neutral-50"
//                     onClick={() => setSavedAddr(null)}
//                   >
//                     CHỈNH SỬA
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid gap-4">
//                   <div>
//                     <label className="block mb-2 text-sm font-medium">Số điện thoại *</label>
//                     <input
//                       value={addr.phone}
//                       onChange={(e) => setAddr((a) => ({ ...a, phone: e.target.value }))}
//                       className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-2 text-sm font-medium">Họ và tên *</label>
//                     <input
//                       value={addr.fullName}
//                       onChange={(e) => setAddr((a) => ({ ...a, fullName: e.target.value }))}
//                       className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
//                     />
//                   </div>

//                   {/* ✅ Chỉ còn Tỉnh/TP + Phường/Xã */}
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <div>
//                       <label className="block mb-2 text-sm font-medium">Tỉnh/Thành phố *</label>
//                       <select
//                         value={addr.province?.code ?? ""}
//                         onChange={(e) => onPickProvince(e.target.value)}
//                         className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
//                       >
//                         <option value="">{loadingAddr ? "Đang tải..." : "— Chọn —"}</option>
//                         {provinceList.map((p) => (
//                           <option key={p.code} value={p.code}>
//                             {p.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block mb-2 text-sm font-medium">Phường/Xã *</label>
//                       <select
//                         value={addr.ward?.code ?? ""}
//                         onChange={(e) => onPickWard(e.target.value)}
//                         disabled={!addr.province}
//                         className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400 disabled:bg-neutral-50"
//                       >
//                         <option value="">— Chọn —</option>
//                         {wardList.map((w) => (
//                           <option key={w.code} value={w.code}>
//                             {w.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block mb-2 text-sm font-medium">Địa chỉ cụ thể *</label>
//                     <input
//                       value={addr.street}
//                       onChange={(e) => setAddr((a) => ({ ...a, street: e.target.value }))}
//                       placeholder="Số nhà, thôn/xóm, đường..."
//                       className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleUseAddress}
//                     disabled={!canUseAddress}
//                     className={[
//                       "inline-flex items-center justify-center w-fit px-6 py-3 text-sm font-semibold rounded-lg",
//                       canUseAddress
//                         ? "bg-neutral-900 text-white hover:bg-black"
//                         : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
//                     ].join(" ")}
//                   >
//                     SỬ DỤNG ĐỊA CHỈ NÀY
//                   </button>
//                 </div>
//               )}

//               {/* STEP 2 */}
//               <div className="pt-6 mt-6 border-t border-neutral-200">
//                 <div className="flex items-center gap-3">
//                   <div className="grid text-sm font-semibold border rounded-full w-7 h-7 place-items-center border-neutral-300">
//                     2
//                   </div>
//                   <div className="text-sm font-semibold tracking-wide uppercase">THANH TOÁN & GHI CHÚ</div>
//                 </div>

//                 <div className={["mt-5", !savedAddr ? "opacity-50 pointer-events-none" : ""].join(" ")}>
//                   <div className="text-sm font-semibold tracking-wide uppercase">PHƯƠNG THỨC THANH TOÁN</div>

//                   <div className="flex flex-col gap-3 mt-4">
//                     <label className="flex items-center gap-2 text-sm">
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="cod"
//                         checked={paymentMethod === "cod"}
//                         onChange={() => setPaymentMethod("cod")}
//                       />
//                       <span>Thanh toán khi nhận hàng (COD)</span>
//                     </label>

//                     <label className="flex items-center gap-2 text-sm opacity-50 cursor-not-allowed">
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="online"
//                         checked={paymentMethod === "online"}
//                         onChange={() => setPaymentMethod("online")}
//                         disabled={disableOnlinePayment}
//                       />
//                       <span>Thanh toán online (tạm khóa)</span>
//                     </label>

//                     {paymentMethod === "online" && disableOnlinePayment ? (
//                       <div className="text-xs text-neutral-500">Thanh toán online đang tạm khóa.</div>
//                     ) : null}
//                   </div>

//                   {/* Ghi chú khách */}
//                   <div className="mt-6">
//                     <label className="block mb-2 text-sm font-medium">Tin nhắn để lại cho shop (tuỳ chọn)</label>
//                     <textarea
//                       value={customerNote}
//                       onChange={(e) => setCustomerNote(e.target.value)}
//                       rows={3}
//                       placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
//                       className="w-full px-4 py-3 border rounded-lg outline-none resize-none border-neutral-200 focus:border-neutral-400"
//                     />
//                   </div>

//                   {/* Xuất hoá đơn: bắt buộc chọn 1 trong 2 */}
//                   <div className="mt-6">
//                     <div className="text-sm font-semibold tracking-wide uppercase">XUẤT HÓA ĐƠN</div>
//                     <div className="flex flex-col gap-3 mt-3">
//                       <label className="flex items-start gap-2 text-sm">
//                         <input
//                           type="radio"
//                           name="invoice"
//                           value="no"
//                           checked={invoiceChoice === "no"}
//                           onChange={() => setInvoiceChoice("no")}
//                         />
//                         <span>Không xuất hóa đơn</span>
//                       </label>

//                       <label className="flex items-start gap-2 text-sm">
//                         <input
//                           type="radio"
//                           name="invoice"
//                           value="yes"
//                           checked={invoiceChoice === "yes"}
//                           onChange={() => setInvoiceChoice("yes")}
//                         />
//                         <span>
//                           Xuất hóa đơn{" "}
//                           <span className="text-neutral-500">
//                             (chúng tôi sẽ phản hồi hỗ trợ sớm nhất tới bạn)
//                           </span>
//                         </span>
//                       </label>

//                       {savedAddr && invoiceChoice === "" ? (
//                         <div className="text-xs text-neutral-500">
//                           Vui lòng chọn <b>1</b> trong <b>2</b> lựa chọn xuất hóa đơn trước khi đặt hàng.
//                         </div>
//                       ) : null}
//                     </div>
//                   </div>
//                 </div>

//                 {!savedAddr ? (
//                   <div className="mt-4 text-xs text-neutral-500">
//                     Vui lòng hoàn tất <b>Bước 1</b> và bấm <b>SỬ DỤNG ĐỊA CHỈ NÀY</b> để mở khóa Bước 2.
//                   </div>
//                 ) : null}
//               </div>

//               {/* STEP 3 */}
//               <div className="pt-6 mt-6 border-t border-neutral-200">
//                 <div className="flex items-center gap-3">
//                   <div className="grid text-sm font-semibold border rounded-full w-7 h-7 place-items-center border-neutral-300">
//                     3
//                   </div>
//                   <div className="text-sm font-semibold tracking-wide uppercase">XÁC NHẬN & ĐẶT HÀNG</div>
//                 </div>

//                 <div className="mt-4 text-sm text-neutral-600">
//                   {step2Ready ? (
//                     <span>Thông tin đã đủ. Bạn có thể đặt hàng ở khung “TÓM TẮT ĐƠN HÀNG”.</span>
//                   ) : (
//                     <span>Vui lòng hoàn tất Bước 1 và Bước 2 để đặt hàng.</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="border border-neutral-200 rounded-xl h-fit">
//             <div className="px-6 py-4 border-b border-neutral-200">
//               <div className="text-sm font-semibold tracking-wide uppercase">TÓM TẮT ĐƠN HÀNG</div>
//             </div>

//             <div className="px-6 py-6">
//               {items?.length ? (
//                 <div className="space-y-4">
//                   {items.map((line: any) => (
//                     <div key={`${line.id}-${line.color || ""}`} className="flex gap-4 pb-4 border-b border-neutral-200">
//                       <div className="w-16 h-16 overflow-hidden border rounded-lg border-neutral-200 bg-neutral-50">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                           src={line.image || "/placeholder.jpg"}
//                           alt={line.name || "Sản phẩm"}
//                           className="object-cover w-full h-full"
//                           loading="lazy"
//                         />
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-semibold line-clamp-2">{line.name}</div>
//                         <div className="mt-1 text-xs text-neutral-500">MÀU SẮC: {line.color || "—"}</div>
//                       </div>

//                       <div className="text-right">
//                         <div className="text-xs text-neutral-500">x{line.qty || 1}</div>
//                         <div className="mt-1 text-sm font-semibold">
//                           {formatCurrency((Number(line.price) || 0) * (Number(line.qty) || 1))}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-sm text-neutral-500">Giỏ hàng đang trống.</div>
//               )}

//               <div className="pt-4 mt-4 border-t border-neutral-200">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between">
//                     <span className="text-neutral-600">Tổng tiền</span>
//                     <span className="font-medium">{formatCurrency(subtotal || 0)}</span>
//                   </div>
//               <div className="flex items-start justify-between gap-3">
//   <span className="text-sm text-neutral-600">Vận chuyển</span>

//   <div className="text-right">
//     <div className="text-sm text-neutral-900">
//       {shippingFee.toLocaleString("vi-VN")} đ
//     </div>

//   {Number(shippingFee) === 0 && (
//   <div className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600">
//     <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
//     Miễn phí vận chuyển
//   </div>
// )}
//   </div>
// </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-neutral-600">Giảm giá</span>
//                     <span className="font-medium">{formatCurrency(discount)}</span>
//                   </div>
//                 </div>

//                 <div className="pt-4 mt-4 border-t border-neutral-200">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-semibold tracking-wide uppercase">TẠM TÍNH</span>
//                     <span className="text-sm font-semibold">{formatCurrency(total)}</span>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handlePlaceOrder}
//                   disabled={!canPlaceOrder}
//                   className={[
//                     "w-full mt-6 px-6 py-3 text-sm font-semibold rounded-lg",
//                     !canPlaceOrder
//                       ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
//                       : "bg-neutral-900 text-white hover:bg-black",
//                   ].join(" ")}
//                 >
//                   {placing ? "ĐANG TẠO ĐƠN..." : "ĐẶT HÀNG"}
//                 </button>

//                 {!savedAddr ? (
//                   <div className="mt-3 text-xs text-neutral-500">
//                     Bạn cần bấm <b>SỬ DỤNG ĐỊA CHỈ NÀY</b> (Bước 1) trước khi đặt hàng.
//                   </div>
//                 ) : null}

//                 {savedAddr && invoiceChoice === "" ? (
//                   <div className="mt-3 text-xs text-neutral-500">
//                     Bạn cần chọn <b>XUẤT HÓA ĐƠN</b> (Bước 2) trước khi đặt hàng.
//                   </div>
//                 ) : null}

//                 {paymentMethod === "online" && disableOnlinePayment ? (
//                   <div className="mt-3 text-xs text-neutral-500">Thanh toán online đang tạm khóa.</div>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//      <OrderSuccessModal
//       open={successOpen}
//       onClose={() => setSuccessOpen(false)}
//       title="Đơn hàng của bạn đã đặt thành công"
//       message="Chúng tôi sẽ phản hồi hỗ trợ sớm nhất tới bạn."
//       orderCode={successOrderCode}
//       primaryText="Tiếp tục mua sắm"
//       onPrimary={() => {
//         // tuỳ bạn: điều hướng về trang chủ / sản phẩm
//         // window.location.href = "/";
//       }}
//       secondaryText="Đóng"
//       onSecondary={() => {
//         // không làm gì cũng được
//       }}
//     />
//      </>
  



//   );
// }





// chamvan_fe/src/app/checkout/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useCart } from "@/components/providers/CartProvider";
import { postJSON } from "@/lib/api";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";

// ====================== Types ======================
type Province = { code: string; name: string };
type Ward = { code: string; name: string; provinceCode: string };

type AddressState = {
  phone: string;
  fullName: string;
  province?: Province;
  ward?: Ward;
  street: string;
  isDefault?: boolean;
};

type PaymentMethod = "cod" | "online";
type InvoiceChoice = "no" | "yes";

// ====================== Helpers ======================
const DATA_URL = "/vn-address/vn_units.json";

function s(v: any): string {
  return String(v ?? "").trim();
}
function safeArray(v: any): any[] {
  return Array.isArray(v) ? v : [];
}
function formatCurrency(v: number) {
  const n = Number(v);
  return (Number.isFinite(n) ? n : 0).toLocaleString("vi-VN") + " ₫";
}

/**
 * Fallback danh sách 63 tỉnh/thành
 */
const VN_PROVINCES_FALLBACK: Province[] = [
  { code: "01", name: "Thành phố Hà Nội" },
  { code: "02", name: "Tỉnh Hà Giang" },
  { code: "04", name: "Tỉnh Cao Bằng" },
  { code: "06", name: "Tỉnh Bắc Kạn" },
  { code: "08", name: "Tỉnh Tuyên Quang" },
  { code: "10", name: "Tỉnh Lào Cai" },
  { code: "11", name: "Tỉnh Điện Biên" },
  { code: "12", name: "Tỉnh Lai Châu" },
  { code: "14", name: "Tỉnh Sơn La" },
  { code: "15", name: "Tỉnh Yên Bái" },
  { code: "17", name: "Tỉnh Hoà Bình" },
  { code: "19", name: "Tỉnh Thái Nguyên" },
  { code: "20", name: "Tỉnh Lạng Sơn" },
  { code: "22", name: "Tỉnh Quảng Ninh" },
  { code: "24", name: "Tỉnh Bắc Giang" },
  { code: "25", name: "Tỉnh Phú Thọ" },
  { code: "26", name: "Tỉnh Vĩnh Phúc" },
  { code: "27", name: "Tỉnh Bắc Ninh" },
  { code: "30", name: "Tỉnh Hải Dương" },
  { code: "31", name: "Thành phố Hải Phòng" },
  { code: "33", name: "Tỉnh Hưng Yên" },
  { code: "34", name: "Tỉnh Thái Bình" },
  { code: "35", name: "Tỉnh Hà Nam" },
  { code: "36", name: "Tỉnh Nam Định" },
  { code: "37", name: "Tỉnh Ninh Bình" },
  { code: "38", name: "Tỉnh Thanh Hóa" },
  { code: "40", name: "Tỉnh Nghệ An" },
  { code: "42", name: "Tỉnh Hà Tĩnh" },
  { code: "44", name: "Tỉnh Quảng Bình" },
  { code: "45", name: "Tỉnh Quảng Trị" },
  { code: "46", name: "Tỉnh Thừa Thiên Huế" },
  { code: "48", name: "Thành phố Đà Nẵng" },
  { code: "49", name: "Tỉnh Quảng Nam" },
  { code: "51", name: "Tỉnh Quảng Ngãi" },
  { code: "52", name: "Tỉnh Bình Định" },
  { code: "54", name: "Tỉnh Phú Yên" },
  { code: "56", name: "Tỉnh Khánh Hòa" },
  { code: "58", name: "Tỉnh Ninh Thuận" },
  { code: "60", name: "Tỉnh Bình Thuận" },
  { code: "62", name: "Tỉnh Kon Tum" },
  { code: "64", name: "Tỉnh Gia Lai" },
  { code: "66", name: "Tỉnh Đắk Lắk" },
  { code: "67", name: "Tỉnh Đắk Nông" },
  { code: "68", name: "Tỉnh Lâm Đồng" },
  { code: "70", name: "Tỉnh Bình Phước" },
  { code: "72", name: "Tỉnh Tây Ninh" },
  { code: "74", name: "Tỉnh Bình Dương" },
  { code: "75", name: "Tỉnh Đồng Nai" },
  { code: "77", name: "Tỉnh Bà Rịa - Vũng Tàu" },
  { code: "79", name: "Thành phố Hồ Chí Minh" },
  { code: "80", name: "Tỉnh Long An" },
  { code: "82", name: "Tỉnh Tiền Giang" },
  { code: "83", name: "Tỉnh Bến Tre" },
  { code: "84", name: "Tỉnh Trà Vinh" },
  { code: "86", name: "Tỉnh Vĩnh Long" },
  { code: "87", name: "Tỉnh Đồng Tháp" },
  { code: "89", name: "Tỉnh An Giang" },
  { code: "91", name: "Tỉnh Kiên Giang" },
  { code: "92", name: "Thành phố Cần Thơ" },
  { code: "93", name: "Tỉnh Hậu Giang" },
  { code: "94", name: "Tỉnh Sóc Trăng" },
  { code: "95", name: "Tỉnh Bạc Liêu" },
  { code: "96", name: "Tỉnh Cà Mau" },
];

/**
 * Parse vn_units.json (tương thích nhiều dạng)
 */
function normalizeVnUnits(raw: any): { provinces: Province[]; wards: Ward[] } {
  const provinces: Province[] = [];
  const wards: Ward[] = [];

  // ===== Case 1/2: array provinces =====
  const provincesRaw = safeArray(raw);
  if (
    provincesRaw.length &&
    (raw?.[0]?.Districts || raw?.[0]?.Wards || raw?.[0]?.FullName || raw?.[0]?.Name)
  ) {
    for (const p of provincesRaw) {
      const pCode = s(p?.Code || p?.code);
      const pName = s(p?.FullName || p?.name || p?.Name);
      const hasNested = Array.isArray(p?.Districts) || Array.isArray(p?.Wards);

      if (!hasNested && (p?.ProvinceCode || p?.WardCode || p?.FullName) && !p?.Districts && !p?.Wards) {
        if (p?.ProvinceCode) continue;
      }

      if (pCode && pName) provinces.push({ code: pCode, name: pName });

      // Case 1: Districts -> Wards
      const districtsRaw = safeArray(p?.Districts || p?.districts);
      if (districtsRaw.length) {
        for (const d of districtsRaw) {
          const wardsRaw = safeArray(d?.Wards || d?.wards);
          for (const w of wardsRaw) {
            const wCode = s(w?.Code || w?.code);
            const wName = s(w?.FullName || w?.name || w?.Name);
            if (!wCode || !wName || !pCode) continue;
            wards.push({ code: wCode, name: wName, provinceCode: pCode });
          }
        }
        continue;
      }

      // Case 2: Province has Wards directly
      const wardsRaw = safeArray(p?.Wards || p?.wards);
      for (const w of wardsRaw) {
        const wCode = s(w?.Code || w?.code);
        const wName = s(w?.FullName || w?.name || w?.Name);
        if (!wCode || !wName || !pCode) continue;
        wards.push({ code: wCode, name: wName, provinceCode: pCode });
      }
    }

    if (provinces.length) {
      provinces.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      wards.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      return { provinces, wards };
    }
  }

  // ===== Case 3: list phẳng wards =====
  const flat = safeArray(raw);
  const provinceMap = new Map<string, string>();

  for (const item of flat) {
    const wCode = s(item?.Code || item?.code);
    const wName = s(item?.FullName || item?.name || item?.Name);
    const pCode = s(item?.ProvinceCode || item?.provinceCode);
    const pName = s(item?.ProvinceName || item?.provinceName || item?.ProvinceFullName);

    if (pCode) {
      if (pName) provinceMap.set(pCode, pName);
    }
    if (wCode && wName && pCode) {
      wards.push({ code: wCode, name: wName, provinceCode: pCode });
    }
  }

  if (provinceMap.size === 0 && wards.length) {
    const used = new Set<string>(wards.map((w) => w.provinceCode));
    const fallback = VN_PROVINCES_FALLBACK.filter((p) => used.has(p.code));
    fallback.forEach((p) => provinces.push(p));
  } else {
    for (const [code, name] of provinceMap.entries()) {
      provinces.push({ code, name });
    }
  }

  provinces.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  wards.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return { provinces, wards };
}

async function loadVnUnits(): Promise<{ provinces: Province[]; wards: Ward[] }> {
  const res = await fetch(DATA_URL, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Cannot load ${DATA_URL}. HTTP ${res.status}`);
  const json = await res.json();
  return normalizeVnUnits(json);
}

function fullAddr(a?: AddressState | null) {
  if (!a) return "";
  return [a.street, a.ward?.name, a.province?.name].filter(Boolean).join(", ");
}

// ====================== Page ======================
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();

  const disableOnlinePayment = true;

  const [loadingAddr, setLoadingAddr] = useState(false);
  const [addrData, setAddrData] = useState<{ provinces: Province[]; wards: Ward[] }>({
    provinces: [],
    wards: [],
  });

  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);

  const [addr, setAddr] = useState<AddressState>({
    phone: "",
    fullName: "",
    street: "",
    isDefault: true,
  });

  const [savedAddr, setSavedAddr] = useState<AddressState | null>(null);

  // Step 2
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [customerNote, setCustomerNote] = useState<string>("");

  // Step 2 - invoice
  const [invoiceChoice, setInvoiceChoice] = useState<InvoiceChoice | "">("");

  // Step 3
  const [placing, setPlacing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successOrderCode, setSuccessOrderCode] = useState<string | null>(null);

  const shippingFee = 0;
  const discount = 0;

  const total = useMemo(() => {
    const s1 = Number(subtotal || 0);
    return Math.max(0, s1 + Number(shippingFee) - Number(discount));
  }, [subtotal, shippingFee, discount]);

  useEffect(() => {
    let alive = true;
    setLoadingAddr(true);

    loadVnUnits()
      .then((data) => {
        if (!alive) return;
        setAddrData(data);
        setProvinceList(Array.isArray(data.provinces) ? data.provinces : []);
      })
      .catch((e) => {
        console.error("Load vn address error:", e);
        if (!alive) return;
        setAddrData({ provinces: [], wards: [] });
        setProvinceList([]);
        setWardList([]);
      })
      .finally(() => {
        if (alive) setLoadingAddr(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const onPickProvince = (code: string) => {
    const pCode = s(code);
    const p = provinceList.find((x) => x.code === pCode);

    setSavedAddr(null);

    setAddr((a) => ({
      ...a,
      province: p,
      ward: undefined,
    }));

    if (!pCode) {
      setWardList([]);
      return;
    }

    const w = addrData.wards.filter((x) => x.provinceCode === pCode);
    setWardList(w);
  };

  const onPickWard = (code: string) => {
    const wCode = s(code);
    const w = wardList.find((x) => x.code === wCode);
    setSavedAddr(null);
    setAddr((a) => ({ ...a, ward: w }));
  };

  const canUseAddress =
    s(addr.phone).length >= 8 &&
    s(addr.fullName).length >= 2 &&
    !!addr.province?.code &&
    !!addr.ward?.code &&
    s(addr.street).length >= 2;

  const handleUseAddress = () => {
    if (!canUseAddress) return;
    setSavedAddr({ ...addr });
  };

  const step2Ready = !!savedAddr && (invoiceChoice === "no" || invoiceChoice === "yes");

  const canPlaceOrder =
    !!items?.length &&
    step2Ready &&
    (paymentMethod !== "online" || !disableOnlinePayment) &&
    !placing;

  async function handlePlaceOrder() {
    if (!canPlaceOrder) return;

    const notesParts: string[] = [];
    const note = s(customerNote);
    if (note) notesParts.push(`Ghi chú khách: ${note}`);

    if (invoiceChoice === "yes") {
      notesParts.push("Yêu cầu xuất hóa đơn: Có (shop sẽ phản hồi hỗ trợ sớm nhất).");
    } else if (invoiceChoice === "no") {
      notesParts.push("Yêu cầu xuất hóa đơn: Không.");
    }

    const payload = {
      customerName: savedAddr?.fullName || "Khách lẻ",
      customerEmail: "guest@example.com",
      customerPhone: savedAddr?.phone || "",
      shippingAddress: fullAddr(savedAddr),
      notes: notesParts.join(" | "),
      paymentMethod,
      invoiceRequested: invoiceChoice === "yes",
      items: items.map((it: any) => ({
        productId: String(it.id),
        qty: Number(it.qty || 1),
      })),
    };

    try {
      setPlacing(true);

      const res = await postJSON("/orders", payload);

      setSuccessOrderCode(res?.code || res?.orderCode || res?.id || null);

      clear();
      setSuccessOpen(true);
    } catch (err) {
      console.error("Create order error", err);
      alert("Tạo đơn không thành công. Vui lòng thử lại!");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      {/* FIX: isolate + padding đáy lớn để CTA không bị widget nổi che trên mobile */}
      <div className="min-h-[70vh] relative isolate pb-[160px] lg:pb-0">
        <div className="max-w-[1320px] px-4 sm:px-6 mx-auto py-8">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <Link href="/gio-hang" className="text-sm font-medium tracking-wide uppercase hover:underline">
              TRỞ LẠI GIỎ HÀNG
            </Link>

            <div className="text-4xl font-medium tracking-tight">chamvan</div>

            <div className="w-[120px]" />
          </div>

          <div className="grid gap-8 mt-8 lg:grid-cols-[1fr_420px]">
            {/* LEFT */}
            <div className="border border-neutral-200 rounded-xl relative z-[1]">
              {/* STEP 1 */}
              <div className="px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="grid text-sm font-semibold border rounded-full w-7 h-7 place-items-center border-neutral-300">
                    1
                  </div>
                  <div className="text-sm font-semibold tracking-wide uppercase">ĐỊA CHỈ GIAO HÀNG</div>
                </div>
              </div>

              <div className="px-6 py-6">
                {savedAddr ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg border-neutral-200 bg-neutral-50">
                      <div className="text-sm">
                        <div className="font-semibold">{savedAddr.fullName}</div>
                        <div className="mt-1 text-neutral-600">{savedAddr.phone}</div>
                        <div className="mt-1 text-neutral-600">{fullAddr(savedAddr)}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-6 py-3 text-sm font-semibold border rounded-lg border-neutral-300 hover:bg-neutral-50 touch-manipulation"
                      onPointerUp={() => setSavedAddr(null)}
                    >
                      CHỈNH SỬA
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Số điện thoại *</label>
                      <input
                        value={addr.phone}
                        onChange={(e) => setAddr((a) => ({ ...a, phone: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Họ và tên *</label>
                      <input
                        value={addr.fullName}
                        onChange={(e) => setAddr((a) => ({ ...a, fullName: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Tỉnh/Thành phố *</label>
                        <select
                          value={addr.province?.code ?? ""}
                          onChange={(e) => onPickProvince(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400 touch-manipulation"
                        >
                          <option value="">{loadingAddr ? "Đang tải..." : "— Chọn —"}</option>
                          {provinceList.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium">Phường/Xã *</label>
                        <select
                          value={addr.ward?.code ?? ""}
                          onChange={(e) => onPickWard(e.target.value)}
                          disabled={!addr.province}
                          className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400 disabled:bg-neutral-50 touch-manipulation"
                        >
                          <option value="">— Chọn —</option>
                          {wardList.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Địa chỉ cụ thể *</label>
                      <input
                        value={addr.street}
                        onChange={(e) => setAddr((a) => ({ ...a, street: e.target.value }))}
                        placeholder="Số nhà, thôn/xóm, đường..."
                        className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-200 focus:border-neutral-400"
                      />
                    </div>

                    <button
                      type="button"
                      onPointerUp={handleUseAddress}
                      disabled={!canUseAddress}
                      className={[
                        "inline-flex items-center justify-center w-fit px-6 py-3 text-sm font-semibold rounded-lg touch-manipulation",
                        canUseAddress
                          ? "bg-neutral-900 text-white hover:bg-black"
                          : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
                      ].join(" ")}
                    >
                      SỬ DỤNG ĐỊA CHỈ NÀY
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                <div className="pt-6 mt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="grid text-sm font-semibold border rounded-full w-7 h-7 place-items-center border-neutral-300">
                      2
                    </div>
                    <div className="text-sm font-semibold tracking-wide uppercase">THANH TOÁN & GHI CHÚ</div>
                  </div>

                  <div className={["mt-5", !savedAddr ? "opacity-50 pointer-events-none" : ""].join(" ")}>
                    <div className="text-sm font-semibold tracking-wide uppercase">PHƯƠNG THỨC THANH TOÁN</div>

                    <div className="flex flex-col gap-3 mt-4">
                      <label className="flex items-center gap-2 text-sm touch-manipulation">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                        />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </label>

                      <label className="flex items-center gap-2 text-sm opacity-50 cursor-not-allowed touch-manipulation">
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                          disabled={disableOnlinePayment}
                        />
                        <span>Thanh toán online (tạm khóa)</span>
                      </label>

                      {paymentMethod === "online" && disableOnlinePayment ? (
                        <div className="text-xs text-neutral-500">Thanh toán online đang tạm khóa.</div>
                      ) : null}
                    </div>

                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium">Tin nhắn để lại cho shop (tuỳ chọn)</label>
                      <textarea
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        rows={3}
                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                        className="w-full px-4 py-3 border rounded-lg outline-none resize-none border-neutral-200 focus:border-neutral-400"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="text-sm font-semibold tracking-wide uppercase">XUẤT HÓA ĐƠN</div>
                      <div className="flex flex-col gap-3 mt-3">
                        <label className="flex items-start gap-2 text-sm touch-manipulation">
                          <input
                            type="radio"
                            name="invoice"
                            value="no"
                            checked={invoiceChoice === "no"}
                            onChange={() => setInvoiceChoice("no")}
                          />
                          <span>Không xuất hóa đơn</span>
                        </label>

                        <label className="flex items-start gap-2 text-sm touch-manipulation">
                          <input
                            type="radio"
                            name="invoice"
                            value="yes"
                            checked={invoiceChoice === "yes"}
                            onChange={() => setInvoiceChoice("yes")}
                          />
                          <span>
                            Xuất hóa đơn{" "}
                            <span className="text-neutral-500">(chúng tôi sẽ phản hồi hỗ trợ sớm nhất tới bạn)</span>
                          </span>
                        </label>

                        {savedAddr && invoiceChoice === "" ? (
                          <div className="text-xs text-neutral-500">
                            Vui lòng chọn <b>1</b> trong <b>2</b> lựa chọn xuất hóa đơn trước khi đặt hàng.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {!savedAddr ? (
                    <div className="mt-4 text-xs text-neutral-500">
                      Vui lòng hoàn tất <b>Bước 1</b> và bấm <b>SỬ DỤNG ĐỊA CHỈ NÀY</b> để mở khóa Bước 2.
                    </div>
                  ) : null}
                </div>

                {/* STEP 3 */}
                <div className="pt-6 mt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="grid text-sm font-semibold border rounded-full w-7 h-7 place-items-center border-neutral-300">
                      3
                    </div>
                    <div className="text-sm font-semibold tracking-wide uppercase">XÁC NHẬN & ĐẶT HÀNG</div>
                  </div>

                  <div className="mt-4 text-sm text-neutral-600">
                    {step2Ready ? (
                      <span>Thông tin đã đủ. Bạn có thể đặt hàng ở khung “TÓM TẮT ĐƠN HÀNG”.</span>
                    ) : (
                      <span>Vui lòng hoàn tất Bước 1 và Bước 2 để đặt hàng.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            {/* FIX: nâng z-index trên mobile để tránh widget nổi che CTA */}
            <div className="border border-neutral-200 rounded-xl h-fit relative z-[60] lg:z-auto">
              <div className="px-6 py-4 border-b border-neutral-200">
                <div className="text-sm font-semibold tracking-wide uppercase">TÓM TẮT ĐƠN HÀNG</div>
              </div>

              <div className="px-6 py-6">
                {items?.length ? (
                  <div className="space-y-4">
                    {items.map((line: any) => (
                      <div key={`${line.id}-${line.color || ""}`} className="flex gap-4 pb-4 border-b border-neutral-200">
                        <div className="w-16 h-16 overflow-hidden border rounded-lg border-neutral-200 bg-neutral-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={line.image || "/placeholder.jpg"}
                            alt={line.name || "Sản phẩm"}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold line-clamp-2">{line.name}</div>
                          <div className="mt-1 text-xs text-neutral-500">MÀU SẮC: {line.color || "—"}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-neutral-500">x{line.qty || 1}</div>
                          <div className="mt-1 text-sm font-semibold">
                            {formatCurrency((Number(line.price) || 0) * (Number(line.qty) || 1))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500">Giỏ hàng đang trống.</div>
                )}

                <div className="pt-4 mt-4 border-t border-neutral-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Tổng tiền</span>
                      <span className="font-medium">{formatCurrency(subtotal || 0)}</span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm text-neutral-600">Vận chuyển</span>

                      <div className="text-right">
                        <div className="text-sm text-neutral-900">{shippingFee.toLocaleString("vi-VN")} đ</div>

                        {Number(shippingFee) === 0 && (
                          <div className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Miễn phí vận chuyển
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Giảm giá</span>
                      <span className="font-medium">{formatCurrency(discount)}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold tracking-wide uppercase">TẠM TÍNH</span>
                      <span className="text-sm font-semibold">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onPointerUp={handlePlaceOrder}
                    disabled={!canPlaceOrder}
                    className={[
                      "w-full mt-6 px-6 py-3 text-sm font-semibold rounded-lg touch-manipulation relative z-[70]",
                      !canPlaceOrder
                        ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        : "bg-neutral-900 text-white hover:bg-black",
                    ].join(" ")}
                  >
                    {placing ? "ĐANG TẠO ĐƠN..." : "ĐẶT HÀNG"}
                  </button>

                  {!savedAddr ? (
                    <div className="mt-3 text-xs text-neutral-500">
                      Bạn cần bấm <b>SỬ DỤNG ĐỊA CHỈ NÀY</b> (Bước 1) trước khi đặt hàng.
                    </div>
                  ) : null}

                  {savedAddr && invoiceChoice === "" ? (
                    <div className="mt-3 text-xs text-neutral-500">
                      Bạn cần chọn <b>XUẤT HÓA ĐƠN</b> (Bước 2) trước khi đặt hàng.
                    </div>
                  ) : null}

                  {paymentMethod === "online" && disableOnlinePayment ? (
                    <div className="mt-3 text-xs text-neutral-500">Thanh toán online đang tạm khóa.</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Đơn hàng của bạn đã đặt thành công"
        message="Chúng tôi sẽ phản hồi hỗ trợ sớm nhất tới bạn."
        orderCode={successOrderCode}
        primaryText="Tiếp tục mua sắm"
        onPrimary={() => {
          // tuỳ bạn: điều hướng về trang chủ / sản phẩm
          window.location.href = "/tat-ca-san-pham";
        }}
        secondaryText="Đóng"
        onSecondary={() => {}}
      />
    </>
  );
}
