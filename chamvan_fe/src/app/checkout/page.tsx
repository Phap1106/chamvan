'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
  Province,
  District,
  Ward,
} from 'sub-vn';
import { useCart } from '@/components/providers/CartProvider';
import { postJSON } from '@/lib/api';

/* ================= Types & helpers ================= */
type Address = {
  phone: string;
  fullName: string;
  province?: Province;
  district?: District;
  ward?: Ward;
  street: string;
  isDefault?: boolean;
};
type PaymentMethod = 'cod' | 'online';
type InvoiceMode = 'none' | 'company';

const quickNotes = [
  'Đóng gói cẩn thận giúp mình',
  'Lên đơn ngay nhé',
  'Mình cần gấp, giao nhanh ạ',
  'Liên hệ trước khi giao',
  'Giao giờ hành chính',
];

const currency = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

function fullAddr(a?: Address | null) {
  if (!a) return '';
  return [a.street, a.ward?.name, a.district?.name, a.province?.name]
    .filter(Boolean)
    .join(', ');
}

/* ================= Page ================= */
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // địa chỉ VN
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [addr, setAddr] = useState<Address>({
    phone: '',
    fullName: '',
    street: '',
    isDefault: false,
  });

  useEffect(() => setProvinces(getProvinces()), []);
  useEffect(() => {
    if (!addr.province) {
      setDistricts([]);
      setWards([]);
      return;
    }
    setDistricts(getDistrictsByProvinceCode(addr.province.code));
    setAddr((a) => ({ ...a, district: undefined, ward: undefined }));
    setWards([]);
  }, [addr.province?.code]);
  useEffect(() => {
    if (!addr.district) {
      setWards([]);
      return;
    }
    setWards(getWardsByDistrictCode(addr.district.code));
    setAddr((a) => ({ ...a, ward: undefined }));
  }, [addr.district?.code]);

  // xác nhận địa chỉ
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedAddr, setSavedAddr] = useState<Address | null>(null);

  // B2
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [invoiceMode, setInvoiceMode] = useState<InvoiceMode>('none');
  const [companyInvoice, setCompanyInvoice] = useState({
    name: '',
    address: '',
    taxId: '',
  });

  // B3
  const [note, setNote] = useState('');
  const [noteChips, setNoteChips] = useState<string[]>([]);
  const toggleChip = (v: string) =>
    setNoteChips((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  // tính tiền
  const shippingFee = 0;
  const discount = 0;
  const total = useMemo(() => subtotal + shippingFee - discount, [subtotal]);

  const openConfirmAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };
  const confirmAddress = () => {
    setSavedAddr(addr);
    setShowConfirm(false);
    setStep(2);
  };

  // Đặt hàng + PDF
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [askInvoice, setAskInvoice] = useState(false);

  async function handlePlaceOrder() {
    if (!items.length) return;
    if (!savedAddr) {
      setStep(1);
      setShowConfirm(true);
      return;
    }

    const payload = {
      customerName: savedAddr.fullName || 'Khách lẻ',
      customerEmail: 'guest@example.com',
      customerPhone: savedAddr.phone || '',
      shippingAddress: fullAddr(savedAddr),
      notes: [note, ...noteChips].filter(Boolean).join(' | '),
      items: items.map((it) => ({
        productId: String(it.id), // DTO yêu cầu string
        qty: Number(it.qty),      // đảm bảo number
      })),
    };

    try {
      setPlacing(true);
      await postJSON('/orders', payload); // http://localhost:4000/api/orders
      clear(); // xoá giỏ khi tạo đơn OK
      setOrderPlaced(true);
      setTimeout(() => setAskInvoice(true), 380);
    } catch (err) {
      console.error('Create order error', err);
      alert('Tạo đơn không thành công. Vui lòng thử lại!');
    } finally {
      setPlacing(false);
    }
  }

  async function downloadInvoicePDF() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 64;
    doc.setFontSize(20);
    doc.text('CHAMVAN - HOÁ ĐƠN BÁN HÀNG', 40, y);
    y += 28;
    doc.setFontSize(12);
    doc.text(`Ngày: ${new Date().toLocaleString('vi-VN')}`, 40, y);
    y += 20;
    if (savedAddr) {
      doc.text(`Khách hàng: ${savedAddr.fullName}`, 40, y); y += 18;
      doc.text(`SĐT: ${savedAddr.phone}`, 40, y); y += 18;
      doc.text(`Địa chỉ: ${fullAddr(savedAddr)}`, 40, y); y += 22;
    }
    if (invoiceMode === 'company') {
      doc.text('Xuất hoá đơn công ty:', 40, y); y += 18;
      doc.text(`Tên: ${companyInvoice.name}`, 40, y); y += 18;
      doc.text(`Địa chỉ: ${companyInvoice.address}`, 40, y); y += 18;
      doc.text(`MST: ${companyInvoice.taxId}`, 40, y); y += 22;
    }
    doc.setFontSize(14);
    doc.text('Chi tiết đơn hàng', 40, y); y += 12;
    doc.setLineWidth(0.6); doc.line(40, y, 555, y); y += 14; doc.setFontSize(12);
    items.forEach((it, i) => {
      doc.text(
        `${i + 1}. ${it.name}${it.color ? ` (${it.color})` : ''} x${it.qty} — ${currency(it.price * it.qty)}`,
        40, y,
      );
      y += 18;
    });
    y += 8; doc.line(40, y, 555, y); y += 16;
    doc.text(`Tạm tính: ${currency(subtotal)}`, 40, y); y += 18;
    doc.text(`Vận chuyển: ${currency(shippingFee)}`, 40, y); y += 18;
    doc.text(`Giảm giá: ${currency(discount)}`, 40, y); y += 20;
    doc.setFontSize(14); doc.text(`TỔNG CỘNG: ${currency(total)}`, 40, y); y += 34;
    const fullNote = [note, ...noteChips].filter(Boolean).join(' | ');
    if (fullNote) {
      doc.setFontSize(12);
      doc.text('Ghi chú khách hàng:', 40, y); y += 16;
      doc.text(doc.splitTextToSize(fullNote, 500), 40, y); y += 36;
    }
    doc.setFontSize(12); doc.text('Đại diện cửa hàng', 400, y); y += 56;
    doc.setFontSize(13); doc.text('CHAMVAN (đã ký)', 396, y);
    doc.save('hoa-don-chamvan.pdf');
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white">
      {/* top bar */}
      <div className="border-b">
        <div className="mx-auto flex h-[64px] max-w-[1600px] items-center justify-between px-8">
          <Link href="/gio-hang" className="text-[14px] font-semibold hover:underline">
            TRỞ LẠI GIỎ HÀNG
          </Link>
          <div className="font-[var(--font-display)] text-[42px] md:text-[50px] tracking-wide">
            chamvan
          </div>
          <span />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-8 pt-2 pb-3 text-center text-[13px] text-neutral-600">
        Chọn <Link href="/qua-tang" className="underline">Quà tặng!</Link> của bạn
      </div>

      {/* layout */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-8 pb-16 lg:grid-cols-[minmax(0,1fr)_1px_520px]">
        {/* LEFT */}
        <div>
          {/* STEP 1 */}
          <section className="cv-card">
            <div className="cv-section-hd">
              <span className="cv-badge">1</span>
              <h2 className="text-[18px] font-extrabold tracking-wide">ĐỊA CHỈ GIAO HÀNG</h2>
            </div>

            {!savedAddr ? (
              <form onSubmit={openConfirmAddress} className="grid grid-cols-1 gap-4 p-5">
                <Field
                  label="Số điện thoại *"
                  value={addr.phone}
                  onChange={(v) => setAddr({ ...addr, phone: v })}
                  required
                />
                <Field
                  label="Họ và tên *"
                  value={addr.fullName}
                  onChange={(v) => setAddr({ ...addr, fullName: v })}
                  required
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Select
                    label="Tỉnh/Thành phố *"
                    value={addr.province?.code ?? ''}
                    onChange={(code) =>
                      setAddr((a) => ({
                        ...a,
                        province: getProvinces().find((p) => p.code === code),
                      }))
                    }
                    options={provinces.map((p) => ({ label: p.name, value: p.code }))}
                    required
                  />
                  <Select
                    label="Quận/Huyện *"
                    value={addr.district?.code ?? ''}
                    onChange={(code) =>
                      setAddr((a) => ({
                        ...a,
                        district: districts.find((d) => d.code === code),
                      }))
                    }
                    options={districts.map((d) => ({ label: d.name, value: d.code }))}
                    disabled={!addr.province}
                    required
                  />
                  <Select
                    label="Phường/Xã *"
                    value={addr.ward?.code ?? ''}
                    onChange={(code) =>
                      setAddr((a) => ({ ...a, ward: wards.find((w) => w.code === code) }))
                    }
                    options={wards.map((w) => ({ label: w.name, value: w.code }))}
                    disabled={!addr.district}
                    required
                  />
                </div>

                <Field
                  label="Địa chỉ cụ thể *"
                  value={addr.street}
                  onChange={(v) => setAddr({ ...addr, street: v })}
                  required
                />

                <div className="pt-1">
                  <button className="btn-lg btn-black">SỬ DỤNG ĐỊA CHỈ NÀY</button>
                </div>
              </form>
            ) : (
              <div className="p-5">
                <div className="rounded-[12px] border border-[var(--cv-border)] bg-neutral-50">
                  <Row label="Họ và tên" value={savedAddr.fullName} />
                  <Row label="Số điện thoại" value={savedAddr.phone} />
                  <Row label="Địa chỉ" value={fullAddr(savedAddr)} last />
                </div>

                <div className="mt-4">
                  <RadioLine
                    checked={!!savedAddr.isDefault}
                    onChange={() =>
                      setSavedAddr((a) => (a ? { ...a, isDefault: !a.isDefault } : a))
                    }
                    label="Đặt làm địa chỉ mặc định"
                  />
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-[12px] border bg-[#e9f1ef] px-4 py-3 text-[14px]">
                  <TruckIcon />
                  <div>Chuyển phát nhanh – Thời gian nhận hàng dự kiến từ ngày 17/10 đến ngày 22/10</div>
                  <span className="ml-auto cv-radio cv-radio--on"><span className="cv-radio__dot" /></span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="btn-lg btn-ghost"
                    onClick={() => { setSavedAddr(null); setStep(1); }}
                  >
                    CHỈNH SỬA
                  </button>
                  <button className="btn-lg btn-black" onClick={() => setStep(2)}>
                    TIẾP TỤC MUA HÀNG
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* STEP 2 */}
          {step >= 2 && (
            <section className="mt-8 cv-card">
              <div className="cv-section-hd">
                <span className="cv-badge">2</span>
                <h2 className="text-[18px] font-extrabold tracking-wide">PHƯƠNG THỨC THANH TOÁN</h2>
              </div>

              <div className="p-5 space-y-4">
                <RadioCard
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                  title="Thanh toán khi nhận hàng (COD)"
                  desc="Kiểm tra hàng rồi thanh toán."
                />
                <RadioCard
                  checked={payment === 'online'}
                  onChange={() => setPayment('online')}
                  title="Thanh toán online qua VNPAY/Thẻ"
                  desc="Quét QR / thẻ ATM nội địa / thẻ quốc tế."
                />

                <div className="pt-2">
                  <div className="mb-2 text-[14px] font-extrabold">HÓA ĐƠN</div>
                  <RadioCard
                    checked={invoiceMode === 'none'}
                    onChange={() => setInvoiceMode('none')}
                    title="Không xuất hóa đơn"
                  />
                  <RadioCard
                    checked={invoiceMode === 'company'}
                    onChange={() => setInvoiceMode('company')}
                    title="Xuất hóa đơn công ty"
                    desc="Điền thông tin doanh nghiệp bên dưới."
                  />
                </div>

                {invoiceMode === 'company' && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Field
                      label="Tên công ty *"
                      value={companyInvoice.name}
                      onChange={(v) => setCompanyInvoice((s) => ({ ...s, name: v }))}
                      required
                    />
                    <Field
                      label="Địa chỉ công ty *"
                      value={companyInvoice.address}
                      onChange={(v) => setCompanyInvoice((s) => ({ ...s, address: v }))}
                      required
                    />
                    <Field
                      label="Mã số thuế *"
                      value={companyInvoice.taxId}
                      onChange={(v) => setCompanyInvoice((s) => ({ ...s, taxId: v }))}
                      required
                    />
                  </div>
                )}

                <button className="btn-lg btn-black" onClick={() => setStep(3)}>
                  TIẾP TỤC
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step >= 3 && (
            <section className="mt-8 cv-card">
              <div className="cv-section-hd">
                <span className="cv-badge">3</span>
                <h2 className="text-[18px] font-extrabold tracking-wide">GHI CHÚ CHO SHOP</h2>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {quickNotes.map((q) => (
                    <button
                      key={q}
                      onClick={() => toggleChip(q)}
                      className={`rounded-full border px-3 py-1.5 text-[13px] ${
                        noteChips.includes(q) ? 'bg-black text-white border-black' : 'hover:bg-neutral-50'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <label className="block text-[14px]">
                  <span className="inline-block mb-2 text-neutral-600">Nội dung khác</span>
                  <textarea
                    rows={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full input-neo"
                    placeholder="Ví dụ: Giao sau 18h, gọi trước khi giao…"
                  />
                </label>

                <button
                  className="btn-lg btn-black"
                  onClick={handlePlaceOrder}
                  disabled={placing || !items.length}
                >
                  {placing ? 'ĐANG TẠO ĐƠN…' : 'ĐẶT HÀNG'}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* DIVIDER */}
        <div className="hidden lg:block cv-divider" />

        {/* RIGHT: tóm tắt */}
        <aside className="cv-card h-max lg:sticky lg:top-[88px]">
          <div className="cv-section-hd">
            <h3 className="text-[18px] font-extrabold tracking-wide">TÓM TẮT ĐƠN HÀNG</h3>
          </div>

          <div className="divide-y">
            {items.map((it) => (
              <div key={`${it.id}-${it.color ?? ''}`} className="flex gap-3 px-5 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.name} className="h-[64px] w-[64px] rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold uppercase leading-[18px]">{it.name}</div>
                  <div className="text-[12px] text-neutral-500">MÀU SẮC: {it.color || '—'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px]">x{it.qty}</div>
                  <div className="text-[14px] font-bold">{currency(it.price * it.qty)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t px-5 py-5 text-[14px]">
            <RowInline label="Tổng tiền" value={currency(subtotal)} />
            <RowInline label="Vận chuyển" value={currency(0)} />
            <RowInline label="Giảm giá" value={currency(0)} />
            <div className="pt-3 mt-3 border-t">
              <RowInline
                label={<span className="font-extrabold">TẠM TÍNH</span>}
                value={<span className="font-extrabold">{currency(total)}</span>}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Modal confirm địa chỉ */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <div className="w-[620px] max-w-[94vw] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-6 py-5 border-b">
              <div className="text-[18px] font-extrabold">Xác nhận địa chỉ</div>
            </div>
            <div className="p-6 space-y-3 text-[14px]">
              <RowFlat label="Họ và tên" value={addr.fullName || '—'} />
              <RowFlat label="Số điện thoại" value={addr.phone || '—'} />
              <RowFlat label="Địa chỉ" value={fullAddr(addr) || '—'} />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button className="btn-lg btn-ghost" onClick={() => setShowConfirm(false)}>Quay lại</button>
              <button className="btn-lg btn-black" onClick={confirmAddress}>Xác nhận</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal thành công + hỏi tải PDF */}
      {orderPlaced && (
        <Modal onClose={() => {}}>
          <div className="w-[560px] max-w-[94vw] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="grid py-8 text-white place-items-center bg-black/90">
              <div className="p-4 rounded-full animate-bounce bg-white/10"><CheckIcon /></div>
              <div className="mt-2 text-[20px] font-extrabold">Đặt hàng thành công!</div>
              <div className="text-[12px] text-white/80">Cảm ơn bạn đã mua sắm tại CHAMVAN</div>
            </div>
            <div className="p-6 space-y-3">
              {askInvoice ? (
                <>
                  <div className="text-[14px]">Bạn có muốn tải hoá đơn không?</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="btn-lg btn-ghost"
                      onClick={() => { setOrderPlaced(false); setAskInvoice(false); }}
                    >
                      Không, cảm ơn
                    </button>
                    <button className="btn-lg btn-black" onClick={downloadInvoicePDF}>
                      Tải hoá đơn (PDF)
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-2 text-center text-[12px] text-neutral-600">Đang chuẩn bị…</div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link href="/" className="grid place-items-center btn-lg btn-ghost" onClick={() => setOrderPlaced(false)}>
                  Về trang chủ
                </Link>
                <Link href="/tat-ca-san-pham" className="grid place-items-center btn-lg btn-black" onClick={() => setOrderPlaced(false)}>
                  Tiếp tục mua hàng
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= Smaller UI ================= */
function Field({
  label, value, onChange, required,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; }) {
  return (
    <label className="block text-[14px]">
      <span className="inline-block mb-2 text-neutral-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full input-neo" />
    </label>
  );
}
function Select({
  label, value, onChange, options, disabled, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[]; disabled?: boolean; required?: boolean;
}) {
  return (
    <label className="block text-[14px]">
      <span className="inline-block mb-2 text-neutral-600">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} required={required} className="w-full bg-white input-neo">
        <option value="" disabled>— Chọn —</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function RadioCard({ checked, onChange, title, desc }: { checked: boolean; onChange: () => void; title: string; desc?: string; }) {
  return (
    <button type="button" onClick={onChange}
      className={`w-full text-left rounded-[12px] border px-4 py-3 ${checked ? 'border-black ring-1 ring-black/15' : 'border-[var(--cv-border)] hover:bg-neutral-50'}`}>
      <div className="flex items-start gap-3">
        <span className={`cv-radio ${checked ? 'cv-radio--on' : ''}`}><span className="cv-radio__dot"/></span>
        <div><div className="text-[14px] font-semibold">{title}</div>{desc && <div className="text-[12px] text-neutral-500">{desc}</div>}</div>
      </div>
    </button>
  );
}
function RadioLine({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string; }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-3 text-[14px]">
      <span className={`cv-radio ${checked ? 'cv-radio--on' : ''}`}><span className="cv-radio__dot"/></span>{label}
    </button>
  );
}
function Row({ label, value, last = false }: { label: string; value: string; last?: boolean; }) {
  return (
    <div className={`grid grid-cols-[160px_1fr] items-start gap-3 px-4 py-3 text-[14px] ${last ? '' : 'border-b border-[var(--cv-border)]'}`}>
      <div className="text-neutral-500">{label}</div><div>{value}</div>
    </div>
  );
}
function RowInline({ label, value }: { label: React.ReactNode; value: React.ReactNode; }) {
  return (<div className="flex items-center justify-between mb-2"><div className="text-neutral-600">{label}</div><div>{value}</div></div>);
}
function RowFlat({ label, value }: { label: string; value: string; }) {
  return (<div className="grid grid-cols-[150px_1fr] gap-3"><div className="text-neutral-500">{label}</div><div>{value}</div></div>);
}
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void; }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative animate-[pop_.18s_ease-out]">{children}</div>
      <style jsx>{`@keyframes pop{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-neutral-700">
      <path d="M3 7h10v7H3V7Zm10 3h4l3 4h-7v-4Z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="18" r="1.5" fill="currentColor"/><circle cx="17" cy="18" r="1.5" fill="currentColor"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
      <path d="M7 12.5 10.5 16 17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
