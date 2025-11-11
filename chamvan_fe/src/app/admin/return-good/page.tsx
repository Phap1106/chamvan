// src/app/admin/doi-tra/page.tsx
"use client";

import * as React from "react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@udecode/cn";

type ReturnStatus = "pending" | "in_review" | "approved" | "rejected" | "refunded";

type ReturnRow = {
  id: string;
  orderCode: string;
  reason: string;
  status: ReturnStatus;
  user: { id: string; email?: string; fullName?: string } | null;
  createdAt: string;
  updatedAt: string;
};

const BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "http://localhost:4000/api";

export default function AdminReturnsPage() {
  const { token } = useAuthStore();
  const headers = React.useMemo(
    () =>
      token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" },
    [token]
  );

  const [rows, setRows] = React.useState<ReturnRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState<string | null>(null);

  async function loadAll() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/return-requests`, { headers, cache: "no-store" });
      if (!res.ok) throw new Error("Load failed");
      const data = await res.json();
      setRows(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      console.error(e);
      alert("Không tải được danh sách.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: string, status: ReturnStatus) {
    try {
      setUpdating(id);
      const res = await fetch(`${BASE}/return-requests/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadAll();
    } catch (e) {
      console.error(e);
      alert("Cập nhật thất bại.");
    } finally {
      setUpdating(null);
    }
  }

  const statuses: ReturnStatus[] = [
    "pending",
    "in_review",
    "approved",
    "rejected",
    "refunded",
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý đổi/ trả</h1>
        <button onClick={loadAll} className="text-sm underline">
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Đang tải…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-500">Chưa có yêu cầu.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium text-gray-700">Ngày</th>
                <th className="px-5 py-3 font-medium text-gray-700">Mã đơn</th>
                <th className="px-5 py-3 font-medium text-gray-700">Khách</th>
                <th className="px-5 py-3 font-medium text-gray-700">Nội dung</th>
                <th className="px-5 py-3 font-medium text-gray-700">Trạng thái</th>
                <th className="px-5 py-3 font-medium text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-5 py-3 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">{r.orderCode}</td>
                  <td className="px-5 py-3">
                    {r.user?.fullName || r.user?.email || r.user?.id}
                  </td>
                  <td className="px-5 py-3 max-w-[520px]">
                    <div className="line-clamp-3">{r.reason}</div>
                  </td>
                  <td className="px-5 py-3">{r.status}</td>
                  <td className="px-5 py-3">
                    <select
                      disabled={updating === r.id}
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as ReturnStatus)}
                      className={cn(
                        "rounded-lg border border-gray-300 px-2 py-1 outline-none",
                        updating === r.id && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
