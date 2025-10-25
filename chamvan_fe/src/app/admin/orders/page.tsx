// chamvan_fe/src/app/admin/orders/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { getJSON, patchJSON } from '@/lib/api';

type OrderItem = {
  productId: number | string;
  name?: string;
  qty: number;
  unitPrice?: number;
  lineTotal?: number;
};

type Order = {
  id: number | string;
  userId?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  status?: string;
  createdAt?: string; // ISO
  eta?: string | null; // ISO
};

const ALL_STATUSES = [
  'tất cả',
  'chờ duyệt',
  'duyệt',
  'đang chuẩn bị',
  'đang giao',
  'hoàn thành',
  'xóa',
];

function VND(n: number | string | null | undefined) {
  const num = Number(n ?? 0) || 0;
  return num.toLocaleString('vi-VN') + '₫';
}

// Chuẩn hoá 1 đơn hàng (ép kiểu về number + tính lại nếu thiếu)
// ép kiểu item + luôn tính lại tiền
function normalizeOrder(raw: any): Order {
  const items: OrderItem[] = (raw.items ?? []).map((it: any) => {
    const qty = Number(it?.qty ?? 0) || 0;
    const unitPrice = Number(it?.unitPrice ?? it?.price ?? 0) || 0;
    // ưu tiên tự tính lineTotal từ qty * unitPrice
    const lineTotal = qty * unitPrice;
    return {
      productId: it?.productId ?? it?.id,
      name: it?.name,
      qty,
      unitPrice,
      lineTotal,
    };
  });

  // ✅ luôn tự tính subtotal từ items
  const subtotal = items.reduce((s, it) => s + (Number(it.lineTotal) || 0), 0);

  // shippingFee lấy từ BE (nếu có), mặc định 0
  const shippingFee = Number(raw?.shippingFee ?? 0) || 0;

  // ✅ total = subtotal + shippingFee (KHÔNG dùng raw.total để tránh x10)
  const total = subtotal + shippingFee;

  return {
    id: raw.id,
    userId: raw.userId ?? null,
    customerName: raw.customerName ?? '',
    customerEmail: raw.customerEmail ?? '',
    customerPhone: raw.customerPhone ?? '',
    shippingAddress: raw.shippingAddress ?? '',
    notes: raw.notes ?? '',
    items,
    subtotal,
    shippingFee,
    total,
    status: raw.status ?? 'chờ duyệt',
    createdAt: raw.createdAt,
    eta: raw.eta ?? null,
  };
}


export default function AdminOrdersPage() {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // filter/search
  const [status, setStatus] = useState<string>('tất cả');
  const [q, setQ] = useState<string>('');

  // row expand
  const [openId, setOpenId] = useState<number | string | null>(null);

  // edit modal
  const [editing, setEditing] = useState<Order | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  async function fetchList() {
    setLoading(true);
    setErr(null);
    try {
      // Gọi thẳng BE: /admin/orders (y/c Bearer)
      const data = await getJSON<any[]>('/admin/orders', true);

      // ✨ Chuẩn hoá dữ liệu để mọi thứ là number
      const normalized = (data || []).map(normalizeOrder);

      // sort newest
      const sorted: Order[] = normalized.sort((a, b) => {
        const at = (a.createdAt ? new Date(a.createdAt).getTime() : 0) || 0;
        const bt = (b.createdAt ? new Date(b.createdAt).getTime() : 0) || 0;
        return bt - at;
      });
      setList(sorted);
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return list.filter((o) => {
      const okStatus = status === 'tất cả' || (o.status || 'chờ duyệt') === status;
      const okSearch =
        !qLower ||
        [o.customerName, o.customerEmail, o.customerPhone, o.shippingAddress]
          .filter(Boolean)
          .some((x) => String(x).toLowerCase().includes(qLower));
      return okStatus && okSearch;
    });
  }, [list, status, q]);

  // vì đã ép kiểu, reduce chắc chắn ra number đúng
  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      await patchJSON(
        `/admin/orders/${editing.id}`,
        {
          status: editing.status,
          eta: editing.eta,
        },
        true,
      );
      await fetchList();
      setEditing(null);
    } catch (e: any) {
      alert(e?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500">Theo dõi, cập nhật trạng thái & giao hàng</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-sm border rounded"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm: tên / email / SĐT / địa chỉ"
            className="rounded border px-3 py-2 text-sm w-[280px]"
          />
          <button
            onClick={fetchList}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
            title="Làm mới"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded-lg">
          <div className="text-xs text-gray-500">Số đơn (lọc)</div>
          <div className="mt-1 text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-xs text-gray-500">Doanh thu (lọc)</div>
          <div className="mt-1 text-2xl font-semibold">{VND(totalRevenue)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Ngày</th>
              <th className="px-3 py-2 text-left">Khách hàng</th>
              <th className="px-3 py-2 text-left">Liên hệ</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-right">Tổng</th>
              <th className="w-[120px]" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  Không có đơn phù hợp
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((o) => {
                const isOpen = openId === o.id;
                return (
                  <RowItem
                    key={String(o.id)}
                    order={o}
                    isOpen={isOpen}
                    onToggle={() => setOpenId(isOpen ? null : o.id)}
                    onEdit={() => setEditing(o)}
                  />
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid p-4 place-items-center bg-black/40">
          <div className="w-full max-w-xl overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold">Cập nhật đơn #{editing.id}</div>
              <button onClick={() => setEditing(null)} className="w-8 h-8 border rounded">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="mb-1 text-sm text-gray-600">Trạng thái</div>
                <select
                  className="w-full p-2 capitalize border rounded"
                  value={editing.status || 'chờ duyệt'}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  {ALL_STATUSES.filter((s) => s !== 'tất cả').map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-600">Ngày giao dự kiến (ETA)</div>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={editing.eta ? new Date(editing.eta).toISOString().slice(0, 16) : ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      eta: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button className="px-3 py-2 border rounded" onClick={() => setEditing(null)}>
                Hủy
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-3 py-2 text-white bg-black rounded disabled:opacity-60"
              >
                {saving ? 'Đang lưu…' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* error banner */}
      {err && (
        <div className="p-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
          {err}
        </div>
      )}
    </div>
  );
}

/* -------- chi tiết dòng (expand) -------- */
function RowItem({
  order,
  isOpen,
  onToggle,
  onEdit,
}: {
  order: Order;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <>
      <tr className="align-top hover:bg-amber-50/40">
        <td className="px-3 py-2">
          <div className="font-medium">
            {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '—'}
          </div>
          {order.eta && (
            <div className="text-xs text-amber-700">
              ETA: {new Date(order.eta).toLocaleString('vi-VN')}
            </div>
          )}
        </td>
        <td className="px-3 py-2">
          <div className="font-medium">{order.customerName}</div>
          {order.userId != null && (
            <div className="text-xs text-gray-500">userId: {order.userId}</div>
          )}
        </td>
        <td className="px-3 py-2">
          <div>{order.customerEmail}</div>
          {order.customerPhone && <div className="text-xs text-gray-500">{order.customerPhone}</div>}
        </td>
        <td className="px-3 py-2 capitalize">{order.status || 'chờ duyệt'}</td>
        <td className="px-3 py-2 font-semibold text-right">{VND(order.total)}</td>
        <td className="px-3 py-2 text-right">
          <div className="flex justify-end gap-2">
            <button onClick={onToggle} className="px-2 py-1 border rounded">
              {isOpen ? 'Ẩn' : 'Chi tiết'}
            </button>
            <button onClick={onEdit} className="px-2 py-1 border rounded">
              Cập nhật
            </button>
          </div>
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-gray-50/40">
          <td colSpan={6} className="px-3 pt-0 pb-4">
            <div className="grid gap-4 py-3 md:grid-cols-3">
              {/* Giao hàng */}
              <div className="p-3 bg-white border rounded">
                <div className="mb-2 font-semibold">Giao hàng</div>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-500">Địa chỉ:</span> {order.shippingAddress || '—'}
                  </div>
                  {order.notes && (
                    <div className="mt-1">
                      <span className="text-gray-500">Ghi chú:</span> {order.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="p-3 bg-white border rounded">
                <div className="mb-2 font-semibold">Tổng tiền</div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính</span>
                    <span>{VND(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vận chuyển</span>
                    <span>{VND(order.shippingFee || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-1 mt-1 font-semibold border-t">
                    <span>TỔNG</span>
                    <span>{VND(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Thông tin khác */}
              <div className="p-3 bg-white border rounded">
                <div className="mb-2 font-semibold">Thông tin khác</div>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-500">Mã đơn:</span> #{order.id}
                  </div>
                  <div className="capitalize">
                    <span className="text-gray-500">Trạng thái:</span> {order.status || 'chờ duyệt'}
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="overflow-x-auto bg-white border rounded">
              <table className="min-w-[700px] w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Sản phẩm</th>
                    <th className="w-[120px] px-3 py-2 text-right">SL</th>
                    <th className="w-[160px] px-3 py-2 text-right">Đơn giá</th>
                    <th className="w-[160px] px-3 py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <div className="font-medium">{it.name || `#${it.productId}`}</div>
                      </td>
                      <td className="px-3 py-2 text-right">{it.qty}</td>
                      <td className="px-3 py-2 text-right">{VND(it.unitPrice || 0)}</td>
                      <td className="px-3 py-2 text-right">{VND(it.lineTotal || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
