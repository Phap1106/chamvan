
// src/app/tai-khoan/doi-mat-khau/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountLayout from '../_components/AccountLayout';
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-[12px] uppercase text-zinc-500">
        <KeyRound className="w-5 h-5" />
        <span>{label}</span>
      </div>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-b border-zinc-200 bg-transparent py-2.5 pr-9 text-[15px] outline-none focus:border-zinc-900 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-0 top-1.5 p-1.5 text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
          aria-label="Hiện/ẩn mật khẩu"
          disabled={disabled}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </label>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();

  const [cur, setCur] = useState('');
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');

  const [loading, setLoading] = useState(false);      // trạng thái loading
  const [success, setSuccess] = useState(false);      // hiển thị thông báo thành công

  const strength = useMemo(() => {
    if (n1.length >= 10) return { label: 'Mạnh', color: 'text-emerald-600' };
    if (n1.length >= 6) return { label: 'Trung bình', color: 'text-amber-600' };
    if (n1.length > 0) return { label: 'Yếu', color: 'text-rose-600' };
    return { label: 'Chưa nhập', color: 'text-zinc-500' };
  }, [n1]);

  const ok = cur.length >= 1 && n1.length >= 6 && n1 === n2;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ok || loading) return;

    setLoading(true);
    setSuccess(false);

    try {
      // TODO: nếu có API thực, gọi tại đây. Ví dụ:
      // await apiChangePassword({ currentPassword: cur, newPassword: n1 });

      // Demo giả lập API 1.2s
      await new Promise((r) => setTimeout(r, 1200));

      setSuccess(true);
      // Đợi 1.1s cho user thấy thông báo rồi về trang chủ
      setTimeout(() => router.replace('/'), 1100);
    } catch {
      // Nếu muốn thêm lỗi server, có thể set một state err để show Alert đỏ
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountLayout title="Thay đổi mật khẩu">
      <form onSubmit={onSubmit} className="max-w-2xl">
        {/* tiêu đề khối */}
        <div className="flex items-center gap-2 mb-3 text-lg font-medium text-zinc-700">
          <ShieldCheck className="w-6 h-6" />
          Bảo mật tài khoản
        </div>

        {/* line */}
        <div className="w-full h-px mb-5 bg-zinc-200" />

        {/* Thông báo thành công */}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-2 p-3 mb-5 text-sm border rounded-lg border-emerald-200 bg-emerald-50 text-emerald-700"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <div>Mật khẩu đã được thay đổi thành công. Đang chuyển về trang chủ…</div>
          </div>
        )}

        <div className="space-y-6">
          <PasswordInput
            label="Mật khẩu hiện tại *"
            value={cur}
            onChange={setCur}
            disabled={loading}
          />

          <div>
            <PasswordInput
              label="Mật khẩu mới *"
              value={n1}
              onChange={setN1}
              disabled={loading}
            />
            <p className={`mt-1 text-[13px] ${strength.color}`}>
              Độ mạnh: {strength.label}
            </p>
            <p className="mt-0.5 text-[13px] text-zinc-500">
              Tối thiểu 6 ký tự, nên có chữ hoa, số hoặc ký tự đặc biệt.
            </p>
          </div>

          <PasswordInput
            label="Xác nhận mật khẩu mới *"
            value={n2}
            onChange={setN2}
            disabled={loading}
          />

          {n1 !== '' && n2 !== '' && n1 !== n2 && (
            <div className="flex items-center gap-2 text-[15px] text-rose-700">
              <AlertCircle className="w-5 h-5" />
              Mật khẩu xác nhận không khớp.
            </div>
          )}

          <div className="w-full h-px bg-zinc-200" />

          <button
            type="submit"
            disabled={!ok || loading}
            className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-[15px] text-white disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang lưu…
              </>
            ) : (
              <>
                Lưu thay đổi
                {success ? <CheckCircle2 className="w-5 h-5" /> : null}
              </>
            )}
          </button>
        </div>
      </form>
    </AccountLayout>
  );
}
