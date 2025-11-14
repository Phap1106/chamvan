// src/app/admin/report_good/page.tsx
'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

type ReturnStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'refunded';

type Row = {
  id: number;
  orderCode: string;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  user: { id: number; email?: string; fullName?: string } | null;
};

const BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, '') || 'http://localhost:4000/api';

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export default function AdminReportGoodPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await http<{ statusCode: number; data: Row[] }>(`${BASE}/return-requests`);
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (e: any) {
      toast.error(e?.message || 'Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: ReturnStatus) => {
    try {
      setUpdating(id);
      await http(`${BASE}/return-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
      toast.success('Đã cập nhật trạng thái');
    } catch (e: any) {
      toast.error(e?.message || 'Cập nhật thất bại');
    } finally {
      setUpdating(null);
    }
  };

  const statuses: ReturnStatus[] = ['pending', 'in_review', 'approved', 'rejected', 'refunded'];

  return (
    <div className="max-w-6xl px-6 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Báo cáo đổi/trả hàng</h1>
        <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="w-56 h-4 bg-gray-100 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-500">Chưa có yêu cầu nào.</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium text-gray-700">Ngày</th>
                <th className="px-5 py-3 font-medium text-gray-700">Mã đơn</th>
                <th className="px-5 py-3 font-medium text-gray-700">Khách hàng</th>
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
                    {r.user?.fullName || r.user?.email || `#${r.user?.id}`}
                  </td>
                  <td className="px-5 py-3 max-w-[520px]">
                    <div className="line-clamp-3">{r.reason}</div>
                  </td>
                  <td className="px-5 py-3">{r.status}</td>
                  <td className="px-5 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as ReturnStatus)}
                      disabled={updating === r.id}
                      className="px-2 py-1 border border-gray-300 rounded-lg outline-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
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
