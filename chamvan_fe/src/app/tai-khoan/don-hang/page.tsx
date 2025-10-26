
// src/app/tai-khoan/don-hang/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AccountLayout from '../_components/AccountLayout';
import { getJSON } from '@/lib/api';

/* ================= Types ================= */
type OrderItem = {
  productId: number | string;
  name?: string;
  qty: number;
  unitPrice?: number;
  lineTotal?: number;
};

type Order = {
  id: number | string;
  code?: string;

  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  notes?: string | null;
  eta?: string | null;

  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  status?: string;
  createdAt?: string;
};

const ORDERS_ME_ENDPOINT = '/orders/my';

/* ================ Helpers ================ */
const STATUS_COLOR: Record<string, string> = {
  'chờ duyệt': 'text-amber-700 bg-amber-50 ring-amber-200/60',
  'duyệt': 'text-blue-700 bg-blue-50 ring-blue-200/60',
  'đang chuẩn bị': 'text-cyan-700 bg-cyan-50 ring-cyan-200/60',
  'đang giao': 'text-indigo-700 bg-indigo-50 ring-indigo-200/60',
  'hoàn thành': 'text-emerald-700 bg-emerald-50 ring-emerald-200/60',
  'xóa': 'text-rose-700 bg-rose-50 ring-rose-200/60',
};

function Badge({ children, status }: { children: React.ReactNode; status?: string }) {
  const cls = STATUS_COLOR[(status || '').toLowerCase()] || 'text-gray-700 bg-gray-50 ring-gray-200/60';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ring-1 ${cls}`}>
      {children}
    </span>
  );
}

function VND(n: number | string | null | undefined) {
  return (Number(n ?? 0) || 0).toLocaleString('vi-VN') + ' ₫';
}

function normalizeOrder(raw: any): Order {
  const items: OrderItem[] = (raw?.items || []).map((it: any) => {
    const qty = Number(it?.qty ?? 0) || 0;
    const unitPrice = Number(it?.unitPrice ?? it?.price ?? 0) || 0;
    const lineTotal = qty * unitPrice;
    return {
      productId: it?.productId ?? it?.id,
      name: it?.name,
      qty,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = items.reduce((s, it) => s + (it.lineTotal || 0), 0);
  const shippingFee = Number(raw?.shippingFee ?? 0) || 0;
  const total = subtotal + shippingFee;

  return {
    id: raw?.id,
    code: raw?.code,
    customerName: raw?.customerName ?? '',
    customerEmail: raw?.customerEmail ?? '',
    customerPhone: raw?.customerPhone ?? null,
    shippingAddress: raw?.shippingAddress ?? null,
    notes: raw?.notes ?? null,
    eta: raw?.eta ?? null,
    items,
    subtotal,
    shippingFee,
    total,
    status: (raw?.status || 'chờ duyệt') as string,
    createdAt: raw?.createdAt,
  };
}

function formatDate(dt?: string | null, withTime = false) {
  if (!dt) return '—';
  const d = new Date(dt);
  return withTime ? d.toLocaleString('vi-VN') : d.toLocaleDateString('vi-VN');
}

/* small icons (inline) */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2" aria-hidden>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5Z" fill="currentColor" />
  </svg>
);
const IconTruck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2" aria-hidden>
    <path d="M3 7h11v7h2.5l2.5-3h2v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3z" fill="currentColor" />
  </svg>
);
const IconBill = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2" aria-hidden>
    <path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM8 7h8M8 11h8M8 15h6" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);
const IconBox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2" aria-hidden>
    <path d="M3 7l9-4 9 4v10l-9 4-9-4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 3v18M3 7l9 5 9-5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/* ================ Page =================== */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<Order | null>(null);

  const search = useSearchParams();
  const codeParam = search.get('code');

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getJSON<any[]>(ORDERS_ME_ENDPOINT, true);
      const list = (data || []).map(normalizeOrder).sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      });
      setOrders(list);
      if (codeParam) {
        const o = list.find((x) => (x.code || String(x.id).padStart(10, '0')) === codeParam);
        if (o) setOpen(o);
      }
    } catch (e: any) {
      setErr(e?.message || 'Không tải được đơn hàng của bạn.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeParam]);

  const view = useMemo(() => {
    return orders.map((o) => {
      const qty = o.items.reduce((s, it) => s + (Number(it.qty) || 0), 0);
      const code = o.code || String(o.id).padStart(10, '0');
      const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '—';
      return { id: o.id, code, dateStr, qty, subtotal: o.subtotal, status: o.status || 'chờ duyệt' };
    });
  }, [orders]);

  return (
    <AccountLayout title="Đơn đặt hàng của tôi">
      {/* Header note */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-[15px] text-gray-700">
          Bạn có <span className="font-semibold text-gray-900">{orders.length}</span> đơn hàng.
        </div>
        <div className="text-[13px] text-gray-600">
          <span className="font-medium text-gray-900">Lưu ý:</span> Thời gian giao dự kiến{' '}
          <span className="font-semibold text-gray-900">7–10 ngày</span> kể từ ngày đặt.
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 bg-red-50">
          {err}
        </div>
      )}

      {/* List */}
      <div className="overflow-x-auto border border-gray-200">
        <table className="min-w-[980px] w-full table-fixed">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[240px]" />
            <col className="w-[100px]" />
            <col className="w-[180px]" />
            <col className="w-[180px]" />
            <col className="w-[60px]" />
          </colgroup>

          <thead className="text-[13px] font-semibold uppercase tracking-wide text-gray-700 bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Mã đơn hàng</th>
              <th className="px-4 py-3 text-right">SL</th>
              <th className="px-4 py-3 text-right">Tạm tính</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>

          <tbody className="text-[14px] divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6">
                  <div className="w-1/3 h-5 mb-2 bg-gray-100" />
                  <div className="w-1/2 h-5 bg-gray-100" />
                </td>
              </tr>
            )}

            {!loading && view.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            )}

            {!loading &&
              view.map((o) => (
                <tr key={String(o.id)} className="transition hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">{o.dateStr}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setOpen(orders.find((x) => x.id === o.id) || null)}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      {o.code}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">{o.qty}</td>
                  <td className="px-4 py-4 font-semibold text-right text-gray-900">{VND(o.subtotal)}</td>
                  <td className="px-4 py-4">
                    <Badge status={o.status}>{o.status}</Badge>
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => setOpen(orders.find((x) => x.id === o.id) || null)}
                      aria-label="Xem chi tiết"
                      className="flex items-center justify-center w-8 h-8 ml-auto transition border border-gray-300 hover:bg-gray-50"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết – layout phẳng, chia line mảnh, icon và heading đậm */}
      {open && (
        <div className="fixed inset-0 z-50 grid p-3 sm:p-4 place-items-center bg-black/40">
          <div className="w-full max-w-5xl bg-white border border-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sm:px-5">
              <div className="text-[16px] sm:text-[18px] font-bold text-gray-900">
                Chi tiết đơn <span className="tracking-wider">#{open.code || String(open.id).padStart(10, '0')}</span>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="w-8 h-8 border border-gray-300 hover:bg-gray-50"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            {/* 3 cột info */}
            <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
              <section className="p-4 sm:p-5">
                <div className="mb-2 flex items-center text-[13px] font-extrabold uppercase tracking-wide text-gray-900">
                  <IconUser /> Khách hàng
                </div>
                <div className="space-y-0.5 text-[14px]">
                  <div className="font-semibold text-gray-900">{open.customerName || '—'}</div>
                  <div className="text-gray-700">{open.customerEmail || '—'}</div>
                  {open.customerPhone && <div className="text-gray-700">{open.customerPhone}</div>}
                </div>
              </section>

              <section className="p-4 sm:p-5">
                <div className="mb-2 flex items-center text-[13px] font-extrabold uppercase tracking-wide text-gray-900">
                  <IconTruck /> Giao hàng
                </div>
                <div className="space-y-1 text-[14px] text-gray-800">
                  <div><span className="text-gray-600">Địa chỉ:</span> {open.shippingAddress || '—'}</div>
                  {open.notes && (
                    <div className="whitespace-pre-line">
                      <span className="text-gray-600">Ghi chú:</span> {open.notes}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">ETA:</span> {open.eta ? formatDate(open.eta, true) : '—'}
                  </div>
                  <div className="text-[13px] text-gray-600">
                    * Thời gian giao dự kiến <span className="font-semibold text-gray-900">7–10 ngày</span> kể từ ngày đặt.
                  </div>
                </div>
              </section>

              <section className="p-4 sm:p-5">
                <div className="mb-2 flex items-center text-[13px] font-extrabold uppercase tracking-wide text-gray-900">
                  <IconBill /> Tổng tiền
                </div>
                <div className="text-[14px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold text-gray-900">{VND(open.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vận chuyển</span>
                    <span className="font-semibold text-gray-900">{VND(open.shippingFee || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-1 border-t border-gray-200">
                    <span className="font-bold text-gray-900">TỔNG</span>
                    <span className="font-bold text-gray-900">{VND(open.total)}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sản phẩm */}
            <div className="border-t border-gray-200">
              <div className="p-4 sm:p-5">
                <div className="mb-2 flex items-center text-[13px] font-extrabold uppercase tracking-wide text-gray-900">
                  <IconBox /> Sản phẩm
                </div>

                <div className="overflow-x-auto border border-gray-200">
                  <table className="min-w-[700px] w-full text-[14px]">
                    <thead className="text-gray-700 bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left">Tên</th>
                        <th className="w-[100px] px-3 py-2 text-right">SL</th>
                        <th className="w-[160px] px-3 py-2 text-right">Đơn giá</th>
                        <th className="w-[160px] px-3 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {open.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-900">{it.name || `#${it.productId}`}</div>
                          </td>
                          <td className="px-3 py-2 text-right">{it.qty}</td>
                          <td className="px-3 py-2 text-right">{VND(it.unitPrice || 0)}</td>
                          <td className="px-3 py-2 font-semibold text-right text-gray-900">{VND(it.lineTotal || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* footer info line */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-[14px] text-gray-700">
                  <div>
                    <span className="text-gray-600">Ngày đặt:</span> {formatDate(open.createdAt, true)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge status={open.status}>{open.status}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 px-4 py-3 bg-white border-t border-gray-200 sm:px-5">
              <button
                onClick={() => setOpen(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[14px]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}



