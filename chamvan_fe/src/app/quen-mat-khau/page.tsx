// src/quen-mat-khau/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, SendHorizonal, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

// Đọc base URL theo thứ tự ưu tiên và bỏ "/" cuối nếu có
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api'
).replace(/\/$/, '');

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null); // thông báo thành công inline
  const [err, setErr] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false); // giữ nếu sau này muốn toast

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setErr(null);
    setOk(false);
    setOkMsg(null);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j?.success === false) {
        throw new Error(j?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
      }
      setOk(true);
      setOkMsg('Yêu cầu đã được gửi. Vui lòng kiểm tra email để nhận mật khẩu mới.');
      setShowToast(true);
      setEmail('');
    } catch (e: any) {
      setErr(e?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <main className="px-4">
      <section className="mx-auto min-h-[72vh] max-w-6xl py-10 md:py-16">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Tabs giống trang /dang-nhap */}
          <div className="flex gap-8 mx-auto mb-6 text-sm w-fit">
            <Link href="/dang-nhap" className="text-zinc-400 hover:text-zinc-700">
              Đăng nhập
            </Link>
            <span className="font-semibold text-black cursor-default">
              Quên mật khẩu
              <span className="mt-1 block h-[2px] w-full rounded bg-black" />
            </span>
          </div>

          <h1 className="mb-1 text-center text-[22px] font-semibold tracking-tight">Quên mật khẩu</h1>
          <p className="mb-5 text-sm text-center text-zinc-500">
            Nhập email tài khoản, hệ thống sẽ tạo <b>mật khẩu mới (8 ký tự)</b> và gửi vào email của bạn.
          </p>

          {/* Thông báo lỗi */}
          {err && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm border rounded-lg border-rose-200 bg-rose-50 text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{err}</div>
            </div>
          )}

          {/* Thông báo thành công */}
          {ok && okMsg && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm border rounded-lg border-emerald-200 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{okMsg}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                type="email"
                placeholder="Nhập email tài khoản"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              disabled={submitting || !email.trim()}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang gửi yêu cầu…
                </>
              ) : (
                <>
                  <SendHorizonal className="w-4 h-4" />
                  Gửi yêu cầu đặt lại
                </>
              )}
            </button>
          </form>

          {/* Liên kết quay lại đăng nhập */}
          <p className="mx-auto mt-6 max-w-[360px] text-center text-[12px] text-zinc-500">
            Đã nhớ mật khẩu?{' '}
            <Link href="/dang-nhap" className="underline">
              Quay về đăng nhập
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Toast nhỏ (nếu muốn giữ) */}
      <div
        className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 px-4 py-3 border rounded-md shadow-lg border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div className="text-[15px]">
            <div className="font-medium">Đã gửi yêu cầu!</div>
            <div className="text-[13px] opacity-80">Vui lòng kiểm tra hộp thư của bạn.</div>
          </div>
          <button
            className="p-1 ml-2 rounded text-emerald-700/80 hover:bg-emerald-100"
            onClick={() => setShowToast(false)}
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
