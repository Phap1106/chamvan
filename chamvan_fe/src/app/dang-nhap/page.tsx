'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER'|'ADMIN'|'SUPPORT_ADMIN'>('USER');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sau này gọi API thật, giờ demo:
    login(role);
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-4 text-xl font-bold">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full border p-2" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUPPORT_ADMIN">SUPPORT ADMIN</option>
        </select>
        <button className="w-full bg-black py-2 text-white">Đăng nhập</button>
      </form>
    </div>
  );
}
