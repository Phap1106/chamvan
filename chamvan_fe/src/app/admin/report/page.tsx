'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Filter, Loader2, TriangleAlert } from 'lucide-react';

type Report = {
  id: number;
  title: string;
  description: string;
  status: 'open'|'in_progress'|'resolved'|'closed';
  pageUrl?: string | null;
  userAgent?: string | null;
  userId?: number | null;
  userEmail?: string | null;
  createdAt: string;
};

export default function AdminReportsPage() {
  const [list, setList] = useState<Report[]>([]);
  const [status, setStatus] = useState<string>('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true); setErr(null);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    try {
      const res = await fetch(`/api/admin/reports?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setList(data.items || []);
    } catch (e:any) {
      setErr(e?.message || 'Không tải được báo cáo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // first load

  const filtered = useMemo(() => list, [list]);

  async function setReportStatus(id: number, next: Report['status']) {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setList((prev) => prev.map(r => r.id === id ? { ...r, status: next } : r));
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Báo cáo lỗi</h1>
        <button
          onClick={load}
          className="border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Làm mới
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="flex items-center gap-2 border px-2 py-1.5">
          <Filter className="w-4 h-4" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tiêu đề…"
          className="border px-3 py-1.5 text-sm w-64"
        />
        <button onClick={load} className="border px-3 py-1.5 text-sm hover:bg-gray-50">Lọc</button>
      </div>

      {err && (
        <div className="mb-4 flex items-center gap-2 border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 text-sm">
          <TriangleAlert className="w-4 h-4" /> {err}
        </div>
      )}

      <div className="overflow-x-auto border">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Tiêu đề</th>
              <th className="px-3 py-2 text-left">Trang</th>
              <th className="px-3 py-2 text-left">Người dùng</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center">
                <Loader2 className="inline w-5 h-5 animate-spin" />
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                Không có báo cáo
              </td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="border-b">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-gray-600 line-clamp-2">{r.description}</div>
                </td>
                <td className="px-3 py-2">
                  {r.pageUrl ? <a className="underline text-blue-600" href={r.pageUrl} target="_blank">{r.pageUrl}</a> : '—'}
                </td>
                <td className="px-3 py-2">{r.userEmail || (r.userId ? `#${r.userId}` : 'guest')}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 ring-1 ring-gray-300 text-gray-700">
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  {r.status !== 'resolved' && (
                    <button
                      onClick={() => setReportStatus(r.id, 'resolved')}
                      className="inline-flex items-center gap-1 border px-2 py-1 hover:bg-gray-50"
                      title="Đánh dấu đã xử lý"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
