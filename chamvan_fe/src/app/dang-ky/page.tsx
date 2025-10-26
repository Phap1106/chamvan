// //src/app/dang-ky/page.tsx
// 'use client';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { apiRegister } from '@/lib/api';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [pass1, setPass1] = useState('');
//   const [pass2, setPass2] = useState('');
//   const [phone, setPhone] = useState('');
//   const [dob, setDob] = useState(''); // YYYY-MM-DD
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr(null);
//     if (!fullName.trim()) return setErr('Vui lòng nhập họ tên');
//     if (!email.trim()) return setErr('Vui lòng nhập email');
//     if (pass1.length < 6) return setErr('Mật khẩu tối thiểu 6 ký tự');
//     if (pass1 !== pass2) return setErr('Mật khẩu nhập lại không khớp');

//     setLoading(true);
//     try {
//       await apiRegister({ fullName: fullName.trim(), email: email.trim(), password: pass1, phone: phone || undefined, dob: dob || undefined });
//       router.push('/dang-nhap');
//     } catch (e: any) {
//       setErr(e?.message || 'Đăng ký thất bại');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-sm px-4 py-10 mx-auto">
//       <h1 className="mb-2 text-xl font-bold">Đăng ký</h1>
//       <p className="mb-4 text-sm text-gray-500">Vai trò mặc định: <b>user</b> (BE set sẵn)</p>
//       {err && <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">{err}</div>}
//       <form onSubmit={onSubmit} className="space-y-3">
//         <input className="w-full p-2 border rounded" placeholder="Họ tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
//         <input className="w-full p-2 border rounded" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <input className="w-full p-2 border rounded" placeholder="Mật khẩu" type="password" value={pass1} onChange={(e) => setPass1(e.target.value)} />
//         <input className="w-full p-2 border rounded" placeholder="Nhập lại mật khẩu" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} />
//         <input className="w-full p-2 border rounded" placeholder="Số điện thoại (tuỳ chọn)" value={phone} onChange={(e) => setPhone(e.target.value)} />
//         <input className="w-full p-2 border rounded" placeholder="Ngày sinh (YYYY-MM-DD)" value={dob} onChange={(e) => setDob(e.target.value)} />
//         <button className="w-full py-2 text-white bg-black rounded disabled:opacity-60" disabled={loading}>
//           {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
//         </button>
//       </form>
//       <p className="mt-6 text-sm text-gray-600">Đã có tài khoản? <Link className="underline" href="/dang-nhap">Đăng nhập</Link></p>
//     </div>
//   );
// }












'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { apiRegister } from '@/lib/api';
import {
  Loader2,
  UserRound,
  Mail,
  KeyRound,
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 my-5 text-xs text-zinc-400">
      <span className="flex-1 h-px bg-zinc-200" />
      {text}
      <span className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [accepted, setAccepted] = useState(false); // <-- NEW
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    if (pass1.length >= 10) return { label: 'Mạnh', color: 'text-emerald-600' };
    if (pass1.length >= 6) return { label: 'Trung bình', color: 'text-amber-600' };
    if (pass1.length > 0) return { label: 'Yếu', color: 'text-rose-600' };
    return { label: 'Chưa nhập', color: 'text-zinc-400' };
  }, [pass1]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOkMsg(null);

    if (!fullName.trim()) return setErr('Vui lòng nhập họ tên.');
    if (!email.trim()) return setErr('Vui lòng nhập email.');
    if (pass1.length < 6) return setErr('Mật khẩu tối thiểu 6 ký tự.');
    if (pass1 !== pass2) return setErr('Mật khẩu nhập lại không khớp.');
    if (!accepted) return setErr('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');

    setLoading(true);
    try {
      await apiRegister({
        fullName: fullName.trim(),
        email: email.trim(),
        password: pass1,
        phone: phone || undefined,
        dob: dob || undefined,
      });
      setOkMsg('Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.');
      setTimeout(() => router.push('/dang-nhap?registered=1'), 700);
    } catch (e: any) {
      setErr(e?.message || 'Đăng ký thất bại. Nếu bạn đã có tài khoản, hãy đăng nhập.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4">
      <section className="mx-auto min-h-[72vh] max-w-6xl py-10 md:py-16">
   

        <div className="mx-auto w-full max-w-[520px]">
          <div className="flex gap-8 mx-auto mb-6 text-sm w-fit">
            <Link href="/dang-nhap" className="text-zinc-400 hover:text-zinc-700">
              Đăng nhập
            </Link>
            <span className="font-semibold text-black cursor-default">
              Đăng ký
              <span className="mt-1 block h-[2px] w-full rounded bg-black" />
            </span>
          </div>

          <h1 className="mb-1 text-center text-[22px] font-semibold tracking-tight">Tạo tài khoản</h1>
          <p className="mb-5 text-sm text-center text-zinc-500">
            Chúng tôi rất vui được chào đón bạn! Hãy cá nhân hoá hồ sơ để bắt đầu.
          </p>

          <button
            type="button"
            className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-zinc-50"
          >
            <img alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
            Đăng ký với Google
          </button>

          <Divider text="Hoặc đăng ký bằng email" />

          {err && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm border rounded-lg border-rose-200 bg-rose-50 text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{err}</div>
            </div>
          )}
          {okMsg && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm border rounded-lg border-emerald-200 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{okMsg}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <UserRound className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                placeholder="Họ và tên"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

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
                type={show1 ? 'text' : 'password'}
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute p-1 -translate-y-1/2 rounded right-2 top-1/2 text-zinc-500 hover:bg-zinc-100"
                aria-label="Hiện/ẩn mật khẩu"
                disabled={loading}
              >
                {show1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className={`-mt-1 text-[11px] ${strength.color}`}>Độ mạnh: {strength.label}</p>

            <div className="relative">
              <KeyRound className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                type={show2 ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute p-1 -translate-y-1/2 rounded right-2 top-1/2 text-zinc-500 hover:bg-zinc-100"
                aria-label="Hiện/ẩn mật khẩu"
                disabled={loading}
              >
                {show2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <PhoneIcon className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                placeholder="Số điện thoại (tuỳ chọn)"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <CalendarIcon className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400" />
              <input
                placeholder="Ngày sinh (YYYY-MM-DD)"
                className="w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Checkbox điều khoản – bắt buộc */}
            <label className="flex items-start gap-3 mt-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-black rounded border-zinc-300 focus:ring-black/30"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={loading}
              />
              <span className="text-zinc-600">
                Tôi đã đọc và đồng ý với{' '}
                <Link href="/dieu-khoan-chinh-sach" className="font-medium text-black underline underline-offset-4">
                  Điều khoản dịch vụ và Chính sách bảo mật
                </Link>
                .
              </span>
            </label>

            <button
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              disabled={loading || !accepted}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
