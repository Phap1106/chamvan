'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiRegister } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(''); // YYYY-MM-DD
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!fullName.trim()) return setErr('Vui lòng nhập họ tên');
    if (!email.trim()) return setErr('Vui lòng nhập email');
    if (pass1.length < 6) return setErr('Mật khẩu tối thiểu 6 ký tự');
    if (pass1 !== pass2) return setErr('Mật khẩu nhập lại không khớp');

    setLoading(true);
    try {
      await apiRegister({ fullName: fullName.trim(), email: email.trim(), password: pass1, phone: phone || undefined, dob: dob || undefined });
      router.push('/dang-nhap');
    } catch (e: any) {
      setErr(e?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm px-4 py-10 mx-auto">
      <h1 className="mb-2 text-xl font-bold">Đăng ký</h1>
      <p className="mb-4 text-sm text-gray-500">Vai trò mặc định: <b>user</b> (BE set sẵn)</p>
      {err && <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Họ tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Mật khẩu" type="password" value={pass1} onChange={(e) => setPass1(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Nhập lại mật khẩu" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Số điện thoại (tuỳ chọn)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Ngày sinh (YYYY-MM-DD)" value={dob} onChange={(e) => setDob(e.target.value)} />
        <button className="w-full py-2 text-white bg-black rounded disabled:opacity-60" disabled={loading}>
          {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </button>
      </form>
      <p className="mt-6 text-sm text-gray-600">Đã có tài khoản? <Link className="underline" href="/dang-nhap">Đăng nhập</Link></p>
    </div>
  );
}
