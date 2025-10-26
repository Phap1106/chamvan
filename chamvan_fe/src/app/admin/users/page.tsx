// //src/app/admin/users/page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, Eye, X } from 'lucide-react';

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
      if (q) params.set('q', q);
      if (role !== 'all') params.set('role', role);

      const res = await fetch(`/api/admin/users${params.toString() ? `?${params}` : ''}`, {
        cache: 'no-store',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'API chưa sẵn sàng cho danh sách user');

      const items = Array.isArray(data?.items) ? data.items : [];
      setList(items);
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải dữ liệu');
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q, role]);

  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return (list || []).filter((u) => {
      const okRole = role === 'all' ? true : u.role === role;
      const okKw =
        !kw ||
        (u.fullName || '').toLowerCase().includes(kw) ||
        (u.email || '').toLowerCase().includes(kw);
      return okRole && okKw;
    });
  }, [list, q, role]);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Quản lý user</h1>
          <p className="text-sm text-zinc-500">
            Tìm kiếm thành viên hoặc Support Admin. Nhấn “Xem” để mở hồ sơ nhanh.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50"
            onClick={load}
            title="Làm mới"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      {/* Line */}
      <div className="w-full h-px mb-3 bg-zinc-200" />

      {/* Toolbar (no border, chỉ line ngăn cách) */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase text-zinc-500">Từ khóa</span>
          <div className="relative">
            <input
              className="bg-transparent pr-7 py-1.5 w-[260px]"
              placeholder="Tìm theo tên hoặc email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Search className="absolute right-0 w-4 h-4 pointer-events-none top-2 text-zinc-500" />
          </div>
        </div>

        <div className="w-px h-6 bg-zinc-200" />

        <div className="flex flex-col">
          <span className="text-[11px] uppercase text-zinc-500">Vai trò</span>
          <select
            className="bg-transparent py-1.5 md:w-[180px]"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'Tất cả vai trò' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line */}
      <div className="w-full h-px mt-3 mb-2 bg-zinc-200" />

      {/* Table (no border, dùng line nhạt) */}
      {err && (
        <div className="py-2 text-sm text-amber-700">
          {err}
        </div>
      )}
      {loading ? (
        <div className="py-4 text-sm">Đang tải…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full table-fixed text-sm">
            <thead className="border-b border-zinc-200">
              <tr className="text-left text-zinc-600">
                <th className="w-[64px] px-2 py-2">#</th>
                <th className="px-2 py-2">Họ tên</th>
                <th className="px-2 py-2">Email</th>
                <th className="w-[160px] px-2 py-2">Vai trò</th>
                <th className="w-[180px] px-2 py-2">Ngày tạo</th>
                <th className="w-[120px] px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {rows.map((u, i) => (
                <tr key={u.id} className="hover:bg-zinc-50">
                  <td className="px-2 py-2">{i + 1}</td>
                  <td className="px-2 py-2">{u.fullName || '—'}</td>
                  <td className="px-2 py-2">{u.email}</td>
                  <td className="px-2 py-2 capitalize">{u.role || 'user'}</td>
                  <td className="px-2 py-2">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString('vi-VN') : '—'}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 text-sm hover:bg-zinc-100"
                      onClick={() => setView(u)}
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-2 py-6 text-center text-zinc-500">
                    Không có kết quả
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xem nhanh (vuông, không border, có line top/bottom) */}
      {view && (
        <div className="fixed inset-0 z-50 grid p-4 place-items-center bg-black/40">
          <div className="w-full max-w-lg bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
              <div className="font-semibold">Hồ sơ người dùng</div>
              <button
                className="inline-flex items-center justify-center w-8 h-8 hover:bg-zinc-100"
                onClick={() => setView(null)}
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
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

            <div className="flex justify-end gap-2 px-4 py-3 border-t border-zinc-200">
              <button className="px-3 py-1.5 hover:bg-zinc-100" onClick={() => setView(null)}>
                Đóng
              </button>
              <button className="px-3 py-1.5 text-zinc-500 hover:bg-zinc-50" disabled>
                Chỉnh sửa (chờ API)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 md:grid-cols-[160px,1fr]">
      <dt className="text-xs font-medium tracking-wide text-zinc-600">{label}</dt>
      <dd className="text-sm break-words">{value}</dd>
    </div>
  );
}
