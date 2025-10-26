
// src/dang-nhap/page.tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Loader2, Mail, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';

function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 my-5 text-xs text-zinc-400">
      <span className="flex-1 h-px bg-zinc-200" />
      {text}
      <span className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  // Nếu vẫn muốn cho phép ?next=... thì chuyển thành:
  // const next = sp.get('next') || '/';
  // Còn yêu cầu hiện tại: luôn về trang chủ:
  const next = '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // về trang chủ và thay thế lịch sử để không quay lại trang đăng nhập khi bấm Back
      router.replace(next);
    } catch (e: any) {
      setErr(e?.message || 'Đăng nhập thất bại. Nếu bạn chưa có tài khoản, hãy đăng ký.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4">
      <section className="mx-auto min-h-[72vh] max-w-6xl py-10 md:py-16">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="flex gap-8 mx-auto mb-6 text-sm w-fit">
            <span className="font-semibold text-black cursor-default">
              Đăng nhập
              <span className="mt-1 block h-[2px] w-full rounded bg-black" />
            </span>
            <Link href="/dang-ky" className="text-zinc-400 hover:text-zinc-700">
              Đăng ký
            </Link>
          </div>

          <h1 className="mb-1 text-center text-[22px] font-semibold tracking-tight">Đăng nhập</h1>
          <p className="mb-5 text-sm text-center text-zinc-500">
            Rất vui được gặp lại bạn! Hãy đăng nhập để tiếp tục.
          </p>

          <button
            type="button"
            className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-zinc-50"
          >
            <img alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
            Đăng nhập với Google
          </button>

          <Divider text="Hoặc đăng nhập bằng email" />

          {err && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm border rounded-lg border-rose-200 bg-rose-50 text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{err}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute p-1 -translate-y-1/2 rounded right-2 top-1/2 text-zinc-500 hover:bg-zinc-100"
                aria-label="Hiện/ẩn mật khẩu"
                disabled={loading}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              disabled={loading || !email || !password}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mx-auto mt-6 max-w-[360px] text-center text-[11px] text-zinc-500">
            Khi đăng nhập, bạn đồng ý với{' '}
            <a href="/dieu-khoan-su-dung" className="underline">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="/bao-ve-du-lieu-ca-nhan" className="underline">
              Chính sách bảo mật
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
