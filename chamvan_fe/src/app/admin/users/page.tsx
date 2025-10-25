'use client';

import { useEffect, useMemo, useState } from 'react';

type User = {
  id: string;
  fullName?: string | null;
  email: string;
  role: 'admin' | 'support_admin' | 'user' | string;
  phone?: string | null;
  dob?: string | null;
  createdAt?: string | null;
};

const ROLES = ['all', 'user', 'support_admin', 'admin'] as const;

export default function AdminUsersPage() {
  const [list, setList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState('');
  const [role, setRole] = useState<typeof ROLES[number]>('all');
  const [view, setView] = useState<User | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams();
      // nếu BE có hỗ trợ q/role thì để lại 2 dòng này
      if (q) params.set('q', q);
      if (role !== 'all') params.set('role', role);

      const res = await fetch(
        `/api/admin/users${params.toString() ? `?${params}` : ''}`,
        { cache: 'no-store' }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'API chưa sẵn sàng cho danh sách user');

      // API dạng { items, total, page, limit }
      const items = Array.isArray(data?.items) ? data.items : [];
      setList(items);
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải dữ liệu');
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  // tải lần đầu
  useEffect(() => { load(); }, []);
  // nếu muốn query qua BE thì giữ debounce; nếu BE chưa hỗ trợ, vẫn OK vì filter local (rows) bên dưới
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q, role]);

  // filter local (phòng trường hợp BE chưa hỗ trợ q/role)
  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return (list || []).filter(u => {
      const okRole = role === 'all' ? true : (u.role === role);
      const okKw =
        !kw ||
        (u.fullName || '').toLowerCase().includes(kw) ||
        (u.email || '').toLowerCase().includes(kw);
      return okRole && okKw;
    });
  }, [list, q, role]);

  return (
    <>
      <div className="flex flex-col justify-between gap-3 mb-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold">Quản lý user</h1>
          <p className="text-sm text-gray-600">Tìm kiếm thành viên hoặc Support Admin. Nhấn “Xem” để xem hồ sơ nhanh.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            className="w-full rounded border p-2 text-sm md:w-[260px]"
            placeholder="Tìm theo tên hoặc email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded border p-2 text-sm md:w-[180px]"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'Tất cả vai trò' : r}</option>)}
          </select>
          <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50" onClick={load}>Làm mới</button>
        </div>
      </div>

      {err && <div className="p-3 mb-3 text-sm border rounded border-amber-200 bg-amber-50 text-amber-800">{err}</div>}

      {loading ? (
        <div>Đang tải…</div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-[980px] w-full table-fixed text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[64px] px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Họ tên</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="w-[160px] px-3 py-2 text-left">Vai trò</th>
                <th className="w-[180px] px-3 py-2 text-left">Ngày tạo</th>
                <th className="w-[160px] px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((u, i) => (
                <tr key={u.id} className="hover:bg-amber-50/40">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{u.fullName || '—'}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2 capitalize">{u.role || 'user'}</td>
                  <td className="px-3 py-2">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString('vi-VN') : '—'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="px-2 py-1 border rounded" onClick={() => setView(u)}>Xem</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                    Không có kết quả
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg bg-white border rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold">Hồ sơ người dùng</div>
              <button className="w-8 h-8 border rounded" onClick={() => setView(null)}>✕</button>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4">
              <Row label="Họ tên" value={view.fullName || '—'} />
              <Row label="Email" value={view.email} />
              <Row label="Vai trò" value={String(view.role)} />
              <Row label="Điện thoại" value={view.phone || '—'} />
              <Row label="Ngày sinh" value={view.dob || '—'} />
              <Row
                label="Tạo lúc"
                value={view.createdAt ? new Date(view.createdAt).toLocaleString('vi-VN') : '—'}
              />
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button className="px-3 py-2 border rounded" onClick={() => setView(null)}>Đóng</button>
              <button className="px-3 py-2 text-gray-500 border rounded" disabled>Chỉnh sửa (chờ API)</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[160px,1fr]">
      <dt className="text-xs font-medium tracking-wide text-gray-600">{label}</dt>
      <dd className="text-sm break-words">{value}</dd>
    </div>
  );
}
