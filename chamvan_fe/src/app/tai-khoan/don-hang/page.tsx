
// src/app/tai-khoan/don-hang/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AccountLayout from '../_components/AccountLayout';
import { getJSON } from '@/lib/api';

/* ================= Types ================= */
type OrderItem = {
  productId: number | string;
  name?: string;
  qty: number;
  unitPrice?: number;   // đơn giá / 1 sp
  lineTotal?: number;   // thành tiền dòng
};

type Order = {
  id: number | string;
  code?: string;        // nếu BE có mã riêng
  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  status?: string;
  createdAt?: string;   // ISO
};

// const ORDERS_ME_ENDPOINT = '/orders/me'; // ⬅️ chỉnh nếu BE khác
const ORDERS_ME_ENDPOINT = '/orders/my'
/* ================ Helpers ================ */
function VND(n: number) {
  return (Number(n) || 0).toLocaleString('vi-VN') + ' ₫';
}

/** Chuẩn hoá & tự tính tiền */
function normalizeOrder(raw: any): Order {
  const items: OrderItem[] = (raw?.items || []).map((it: any) => {
    const qty = Number(it?.qty ?? 0) || 0;
    const unitPrice = Number(it?.unitPrice ?? it?.price ?? 0) || 0;
    const lineTotal = qty * unitPrice; // luôn tự tính lại
    return {
      productId: it?.productId ?? it?.id,
      name: it?.name,
      qty,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = items.reduce((s, it) => s + (Number(it.lineTotal) || 0), 0);
  const shippingFee = Number(raw?.shippingFee ?? 0) || 0;
  const total = subtotal + shippingFee;

  return {
    id: raw?.id,
    code: raw?.code,
    items,
    subtotal,
    shippingFee,
    total,
    status: raw?.status ?? 'chờ duyệt',
    createdAt: raw?.createdAt,
  };
}

/* ================ Page =================== */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getJSON<any[]>(ORDERS_ME_ENDPOINT, true); // yêu cầu Bearer
      const list = (data || []).map(normalizeOrder).sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      });
      setOrders(list);
    } catch (e: any) {
      setErr(e?.message || 'Không tải được đơn hàng của bạn.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const view = useMemo(() => {
    return orders.map((o) => {
      const qty = o.items.reduce((s, it) => s + (Number(it.qty) || 0), 0);
      // mã đơn: ưu tiên o.code, fallback padding từ id
      const code = o.code || String(o.id).padStart(10, '0');
      const dateStr = o.createdAt
        ? new Date(o.createdAt).toLocaleDateString('vi-VN')
        : '—';
      return { id: o.id, code, dateStr, qty, subtotal: o.subtotal, status: o.status || 'chờ duyệt' };
    });
  }, [orders]);

  return (
    <AccountLayout title="Đơn đặt hàng của tôi">
      {/* Thanh công cụ nhỏ */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={load}
          className="px-3 py-1.5 text-sm rounded border hover:bg-gray-50"
        >
          Làm mới
        </button>
      </div>

      {/* Error banner */}
      {err && (
        <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
          {err}
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-[980px] w-full table-fixed">
          {/* Chia tỉ lệ cột: ngày | mã | SL | tạm tính | trạng thái | icon */}
          <colgroup>
            <col className="w-[140px]" />
            <col className="w-[240px]" />
            <col className="w-[110px]" />
            <col className="w-[200px]" />
            <col className="w-[160px]" />
            <col className="w-[60px]" />
          </colgroup>

          <thead className="text-sm font-medium text-gray-700 bg-amber-50">
            <tr>
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Mã đơn hàng</th>
              <th className="px-4 py-3 text-right">Số lượng</th>
              <th className="px-4 py-3 text-right">Tạm tính</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Đang tải…
                </td>
              </tr>
            )}

            {!loading && view.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Bạn chưa có đơn hàng nào.
                </td>
              </tr>
            )}

            {!loading &&
              view.map((o) => (
                <tr key={String(o.id)} className="hover:bg-amber-50/60">
                  <td className="px-4 py-4 whitespace-nowrap">{o.dateStr}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/tai-khoan/don-hang?code=${o.code}`}
                      className="font-semibold hover:underline"
                    >
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-right">{o.qty}</td>
                  <td className="px-4 py-4 text-right">{VND(o.subtotal)}</td>
                  <td className="px-4 py-4 capitalize">{o.status}</td>
                  <td className="px-2 py-4">
                    <Link
                      href={`/tai-khoan/don-hang?code=${o.code}`}
                      aria-label="Xem chi tiết"
                      className="flex items-center justify-center w-8 h-8 ml-auto border border-gray-300 rounded-full"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AccountLayout>
  );
}







