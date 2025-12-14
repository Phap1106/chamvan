//src/app/admin/orders/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { getJSON, patchJSON } from "@/lib/api";
import {
  RefreshCw,
  Search,
  Pencil,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

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
  createdAt?: string;
  eta?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

const ALL_STATUSES = [
  "tất cả",
  "chờ duyệt",
  "duyệt",
  "đang chuẩn bị",
  "đang giao",
  "hoàn thành",
  "xóa",
];

function VND(n: number | string | null | undefined) {
  const num = Number(n ?? 0) || 0;
  return num.toLocaleString("vi-VN") + "₫";
}

function normalizeOrder(raw: any): Order {
  const items: OrderItem[] = (raw.items ?? []).map((it: any) => {
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

  const subtotal = items.reduce((s, it) => s + (Number(it.lineTotal) || 0), 0);
  const shippingFee = Number(raw?.shippingFee ?? 0) || 0;
  const total = subtotal + shippingFee;

  return {
    id: raw.id,
    userId: raw.userId ?? null,
    customerName: raw.customerName ?? "",
    customerEmail: raw.customerEmail ?? "",
    customerPhone: raw.customerPhone ?? "",
    shippingAddress: raw.shippingAddress ?? "",
    notes: raw.notes ?? "",
    items,
    subtotal,
    shippingFee,
    total,
    status: raw.status ?? "chờ duyệt",
    createdAt: raw.createdAt,
    eta: raw.eta ?? null,

    ipAddress: raw.ipAddress ?? raw.ip_address ?? null,
    userAgent: raw.userAgent ?? raw.user_agent ?? null,
  };
}

export default function AdminOrdersPage() {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("tất cả");
  const [q, setQ] = useState<string>("");

  const [openId, setOpenId] = useState<number | string | null>(null);

  const [editing, setEditing] = useState<Order | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  async function fetchList() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getJSON<any[]>("/admin/orders", true);
      const normalized = (data || []).map(normalizeOrder);
      const sorted: Order[] = normalized.sort((a, b) => {
        const at = (a.createdAt ? new Date(a.createdAt).getTime() : 0) || 0;
        const bt = (b.createdAt ? new Date(b.createdAt).getTime() : 0) || 0;
        return bt - at;
      });
      setList(sorted);
    } catch (e: any) {
      setErr(e?.message || "Lỗi tải dữ liệu");
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
      const okStatus =
        status === "tất cả" || (o.status || "chờ duyệt") === status;
      const okSearch =
        !qLower ||
        [o.customerName, o.customerEmail, o.customerPhone, o.shippingAddress]
          .filter(Boolean)
          .some((x) => String(x).toLowerCase().includes(qLower));
      return okStatus && okSearch;
    });
  }, [list, status, q]);

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      await patchJSON(
        `/admin/orders/${editing.id}`,
        { status: editing.status, eta: editing.eta },
        true
      );
      await fetchList();
      setEditing(null);
    } catch (e: any) {
      alert(e?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">
            Quản lý đơn hàng
          </h1>
          <p className="text-sm text-zinc-500">
            Theo dõi, cập nhật trạng thái & giao hàng
          </p>
        </div>
        <button
          onClick={fetchList}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50"
          title="Làm mới"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* Line */}
      <div className="w-full h-px mb-3 bg-zinc-200" />

      {/* Toolbar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase text-zinc-500">
            Trạng thái
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent py-1.5"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-6 bg-zinc-200" />

        <div className="flex flex-col">
          <span className="text-[11px] uppercase text-zinc-500">Tìm kiếm</span>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tên / email / SĐT / địa chỉ"
              className="bg-transparent pr-6 py-1.5 w-[320px]"
            />
            <Search className="absolute right-0 w-4 h-4 pointer-events-none top-2 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Line */}
      <div className="w-full h-px mt-3 mb-4 bg-zinc-200" />

      {/* Stats strip (no card, chia bằng divide-x) */}
      <div className="grid grid-cols-2 gap-0 md:grid-cols-4 md:divide-x md:divide-zinc-200">
        <div className="px-0 py-3 md:px-4">
          <div className="text-xs text-zinc-500">Số đơn (lọc)</div>
          <div className="mt-1 text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="px-0 py-3 md:px-4">
          <div className="text-xs text-zinc-500">Doanh thu (lọc)</div>
          <div className="mt-1 text-2xl font-semibold">{VND(totalRevenue)}</div>
        </div>
        <div className="px-0 py-3 md:px-4">
          <div className="text-xs text-zinc-500">Đang mở</div>
          <div className="mt-1 text-2xl font-semibold">
            {
              filtered.filter((o) =>
                ["chờ duyệt", "đang chuẩn bị", "đang giao", "duyệt"].includes(
                  o.status || ""
                )
              ).length
            }
          </div>
        </div>
        <div className="px-0 py-3 md:px-4">
          <div className="text-xs text-zinc-500">Hoàn thành</div>
          <div className="mt-1 text-2xl font-semibold">
            {filtered.filter((o) => (o.status || "") === "hoàn thành").length}
          </div>
        </div>
      </div>

      {/* Line */}
      <div className="w-full h-px my-3 bg-zinc-200" />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="border-b border-zinc-200">
            <tr className="text-left text-zinc-600">
              <th className="px-2 py-2">Ngày</th>
              <th className="px-2 py-2">Khách hàng</th>
              <th className="px-2 py-2">Liên hệ</th>
              <th className="px-2 py-2">Trạng thái</th>
              <th className="px-2 py-2 text-right">Tổng</th>
              <th className="w-[140px] px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-2 py-6 text-center text-zinc-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-6 text-center text-zinc-500">
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

      {/* Edit modal (vuông, không border; line header/footer) */}
      {editing && (
        <div className="fixed inset-0 z-50 grid p-4 place-items-center bg-black/40">
          <div className="w-full max-w-xl bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
              <div className="font-semibold">Cập nhật đơn #{editing.id}</div>
              <button
                onClick={() => setEditing(null)}
                className="grid w-8 h-8 place-items-center hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="mb-1 text-sm text-zinc-600">Trạng thái</div>
                <select
                  className="w-full bg-transparent py-1.5"
                  value={editing.status || "chờ duyệt"}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                >
                  {ALL_STATUSES.filter((s) => s !== "tất cả").map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="mb-1 text-sm text-zinc-600">
                  Ngày giao dự kiến (ETA)
                </div>
                <input
                  type="datetime-local"
                  className="w-full bg-transparent py-1.5"
                  value={
                    editing.eta
                      ? new Date(editing.eta).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      eta: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 border-t border-zinc-200">
              <button
                className="px-3 py-1.5 hover:bg-zinc-100"
                onClick={() => setEditing(null)}
              >
                Hủy
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-3 py-1.5 text-white bg-black disabled:opacity-60"
              >
                {saving ? "Đang lưu…" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* error banner */}
      {err && <div className="py-3 text-sm text-red-700">{err}</div>}
    </div>
  );
}

/* -------- Row item (expand) -------- */
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
      <tr className="align-top hover:bg-zinc-50">
        <td className="px-2 py-2">
          <div className="font-medium">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("vi-VN")
              : "—"}
          </div>
          {order.eta && (
            <div className="text-xs text-amber-700">
              ETA: {new Date(order.eta).toLocaleString("vi-VN")}
            </div>
          )}
        </td>
        <td className="px-2 py-2">
          <div className="font-medium">{order.customerName}</div>
          {order.userId != null && (
            <div className="text-xs text-zinc-500">userId: {order.userId}</div>
          )}
        </td>
        <td className="px-2 py-2">
          <div>{order.customerEmail}</div>
          {order.customerPhone && (
            <div className="text-xs text-zinc-500">{order.customerPhone}</div>
          )}
        </td>
        <td className="px-2 py-2 capitalize">{order.status || "chờ duyệt"}</td>
        <td className="px-2 py-2 font-semibold text-right">
          {VND(order.total)}
        </td>
        <td className="px-2 py-2 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={onToggle}
              className="inline-flex items-center gap-1 px-2 py-1 hover:bg-zinc-100"
            >
              {isOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Ẩn
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Chi tiết
                </>
              )}
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 px-2 py-1 hover:bg-zinc-100"
            >
              <Pencil className="w-4 h-4" /> Cập nhật
            </button>
          </div>
        </td>
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={6} className="px-2 pt-0 pb-4">
            {/* Info grid (no border cards, chỉ tiêu đề + dòng) */}
            <div className="grid gap-6 py-3 md:grid-cols-3">
              <div>
                <div className="mb-2 text-sm font-semibold">Giao hàng</div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-zinc-500">Địa chỉ:</span>{" "}
                    {order.shippingAddress || "—"}
                  </div>
                  {order.notes && (
                    <div>
                      <span className="text-zinc-500">Ghi chú:</span>{" "}
                      {order.notes}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Tổng tiền</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tạm tính</span>
                    <span>{VND(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Vận chuyển</span>
                    <span>{VND(order.shippingFee || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-1 mt-1 font-semibold border-t border-zinc-200">
                    <span>TỔNG</span>
                    <span>{VND(order.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Thông tin khác</div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-zinc-500">Mã đơn:</span> #{order.id}
                  </div>
                  <div className="capitalize">
                    <span className="text-zinc-500">Trạng thái:</span>{" "}
                    {order.status || "chờ duyệt"}
                  </div>
                  <div>
                    <span className="text-zinc-500">IP:</span>{" "}
                    {order.ipAddress || "—"}
                  </div>
                  <div className="break-words">
                    <span className="text-zinc-500">User-Agent:</span>{" "}
                    <span title={order.userAgent || ""}>
                      {order.userAgent || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items table (line-only) */}
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full text-sm">
                <thead className="border-b border-zinc-200">
                  <tr className="text-left text-zinc-600">
                    <th className="px-2 py-2">Sản phẩm</th>
                    <th className="w-[120px] px-2 py-2 text-right">SL</th>
                    <th className="w-[160px] px-2 py-2 text-right">Đơn giá</th>
                    <th className="w-[160px] px-2 py-2 text-right">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {order.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-2">
                        <div className="font-medium">
                          {it.name || `#${it.productId}`}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right">{it.qty}</td>
                      <td className="px-2 py-2 text-right">
                        {VND(it.unitPrice || 0)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {VND(it.lineTotal || 0)}
                      </td>
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
