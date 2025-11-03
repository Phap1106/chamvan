// src/quen-mat-khau/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AccountLayout from '../tai-khoan/_components/AccountLayout';
import { Mail, SendHorizonal, CheckCircle2, AlertCircle, X } from 'lucide-react';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api').replace(/\/$/, '');

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setErr(null);
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
    <AccountLayout title="Quên mật khẩu">
      <form onSubmit={onSubmit} className="max-w-md">
        {err && (
          <div className="mb-4 flex items-start gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <div>{err}</div>
          </div>
        )}

        <label className="block mb-6">
          <div className="mb-2 flex items-center gap-2 text-[12px] uppercase text-zinc-500">
            <Mail className="h-5 w-5" />
            Nhập email tài khoản *
          </div>
          <input
            type="email"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </label>

        <button
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          disabled={!email.trim() || submitting}
        >
          <SendHorizonal className="h-5 w-5" />
          {submitting ? 'Đang gửi…' : 'Gửi yêu cầu đặt lại'}
        </button>

        <p className="mt-3 text-[13px] text-zinc-500">
          Hệ thống sẽ tạo mật khẩu mới và gửi tới email của bạn.
        </p>
      </form>

      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-lg">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div className="text-[15px]">
            <div className="font-medium">Đã gửi yêu cầu!</div>
            <div className="text-[13px] opacity-80">Vui lòng kiểm tra hộp thư của bạn.</div>
          </div>
          <button
            className="ml-2 rounded p-1 text-emerald-700/80 hover:bg-emerald-100"
            onClick={() => setShowToast(false)}
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}
