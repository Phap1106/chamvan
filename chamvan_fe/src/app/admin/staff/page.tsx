'use client';

import { useState } from 'react';

export default function StaffPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function createSupport(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!fullName || !email || !password) {
      setErr('Vui lòng nhập đủ họ tên, email, mật khẩu');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone: phone || undefined,
          dob: dob || undefined,
          role: 'support_admin',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Tạo tài khoản thất bại');
      setMsg('Tạo nhân viên thành công!');
      setFullName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setDob('');
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tạo tài khoản');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Quản lý nhân viên (Support Admin)</h1>

      {err && (
        <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
          {err}
        </div>
      )}
      {msg && (
        <div className="p-3 mb-3 text-sm text-green-700 border border-green-200 rounded bg-green-50">
          {msg}
        </div>
      )}

      <form onSubmit={createSupport} className="grid max-w-2xl grid-cols-1 gap-3">
        <input
          className="p-2 border rounded"
          placeholder="Họ tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Mật khẩu (>=6 ký tự)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Số điện thoại (tuỳ chọn)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Ngày sinh (YYYY-MM-DD, tuỳ chọn)"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <button
          className="px-3 py-2 text-white bg-black rounded disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Đang tạo…' : 'Tạo support admin'}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        (Ghi chú) Khi backend có API liệt kê/sửa/xoá nhân viên (ví dụ:
        <code> GET /users?role=support_admin</code>), trang này sẽ bổ sung bảng danh sách để quản lý.
      </p>
    </>
  );
}






















