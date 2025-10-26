
// src/app/admin/staff/page.tsx
'use client';

import { useState } from 'react';
import {
  UserPlus,
  Mail,
  KeyRound,
  Phone,
  Calendar as CalendarIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function StaffPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
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
      setErr('Vui lòng nhập đủ họ tên, email và mật khẩu.');
      return;
    }
    if (password.length < 6) {
      setErr('Mật khẩu phải từ 6 ký tự trở lên.');
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
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6" />
          <h1 className="text-[22px] font-semibold tracking-tight">
            Quản lý nhân viên (Support Admin)
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setFullName('');
            setEmail('');
            setPassword('');
            setPhone('');
            setDob('');
            setErr(null);
            setMsg(null);
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50"
          title="Làm mới form"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* line */}
      <div className="w-full h-px mb-3 bg-zinc-200" />

      {/* Banners */}
      {err && (
        <div className="flex items-start gap-2 mb-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{err}</span>
        </div>
      )}
      {msg && (
        <div className="flex items-start gap-2 mb-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Form: no border, chỉ gạch chân inputs; chia 2 cột trên desktop */}
      <form onSubmit={createSupport} className="max-w-3xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {/* Họ tên */}
          <Field
            label="Họ tên"
            icon={<UserPlus className="w-4 h-4 text-zinc-500" />}
            input={
              <input
                className="w-full bg-transparent py-1.5 pr-6 outline-none border-b border-zinc-200 focus:border-zinc-900"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            }
          />

          {/* Email */}
          <Field
            label="Email"
            icon={<Mail className="w-4 h-4 text-zinc-500" />}
            input={
              <input
                className="w-full bg-transparent py-1.5 pr-6 outline-none border-b border-zinc-200 focus:border-zinc-900"
                placeholder="email@domain.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            }
          />

          {/* Mật khẩu */}
          <Field
            label="Mật khẩu (>=6 ký tự)"
            icon={<KeyRound className="w-4 h-4 text-zinc-500" />}
            input={
              <div className="relative">
                <input
                  className="w-full bg-transparent py-1.5 pr-8 outline-none border-b border-zinc-200 focus:border-zinc-900"
                  placeholder="••••••••"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-0 top-1.5 p-1 text-zinc-600 hover:text-zinc-900"
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            }
          />

          {/* Phone */}
          <Field
            label="Số điện thoại (tuỳ chọn)"
            icon={<Phone className="w-4 h-4 text-zinc-500" />}
            input={
              <input
                className="w-full bg-transparent py-1.5 pr-6 outline-none border-b border-zinc-200 focus:border-zinc-900"
                placeholder="0987 654 321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            }
          />

          {/* DOB */}
          <Field
            label="Ngày sinh (YYYY-MM-DD, tuỳ chọn)"
            icon={<CalendarIcon className="w-4 h-4 text-zinc-500" />}
            input={
              <input
                className="w-full bg-transparent py-1.5 pr-6 outline-none border-b border-zinc-200 focus:border-zinc-900"
                placeholder="1999-12-31"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            }
          />
        </div>

        {/* line */}
        <div className="w-full h-px my-5 bg-zinc-200" />

        <button
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-black disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Đang tạo…' : 'Tạo support admin'}
        </button>
      </form>

      {/* Note */}
      <div className="w-full h-px my-6 bg-zinc-200" />
      <p className="text-sm text-zinc-500">
        Khi backend có API liệt kê/sửa/xoá nhân viên (ví dụ
        <code className="mx-1 font-mono">GET /users?role=support_admin</code>
        ), trang này sẽ bổ sung bảng danh sách để quản lý.
      </p>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function Field({
  label,
  icon,
  input,
}: {
  label: string;
  icon?: React.ReactNode;
  input: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase text-zinc-500">
        {icon}
        <span>{label}</span>
      </div>
      {input}
    </label>
  );
}
