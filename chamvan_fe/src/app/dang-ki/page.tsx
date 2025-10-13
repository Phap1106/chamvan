'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gọi API tạo tài khoản sau. Demo xong điều hướng:
    router.push('/dang-nhap');
  };
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-4 text-xl font-bold">Đăng ký</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Họ tên" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" placeholder="Mật khẩu" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        <button className="w-full bg-black py-2 text-white">Tạo tài khoản</button>
      </form>
    </div>
  );
}
