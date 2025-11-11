// 'use client';

// import { useEffect, useState } from 'react';
// import userApi from '@/lib/userApi';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { Calendar, Phone, User2 } from 'lucide-react';
// import AccountLayout from '../_components/AccountLayout';
// type FormState = {
//   fullName: string;
//   phone: string;
//   dob: string; // YYYY-MM-DD
// };

// export default function AccountEditPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState<FormState>({ fullName: '', phone: '', dob: '' });

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const me = await userApi.getMe();
//         if (!mounted) return;
//         setForm({
//           fullName: me.fullName || '',
//           phone: me.phone || '',
//           dob: me.dob || '',
//         });
//       } catch (e: any) {
//         toast.error(e.message || 'Không lấy được thông tin');
//         // tuỳ app, có thể điều hướng về /tai-khoan
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
//     setForm(prev => ({ ...prev, [key]: e.target.value }));

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const payload: any = {};
//       if (form.fullName?.trim() !== '') payload.fullName = form.fullName.trim();
//       if (form.phone?.trim() !== '') payload.phone = form.phone.trim();
//       if (form.dob?.trim() !== '') payload.dob = form.dob.trim();

//       await userApi.updateMe(payload);
//       toast.success('Cập nhật thành công');
//       router.push('/tai-khoan'); // quay lại trang thông tin
//     } catch (e: any) {
//       toast.error(e.message || 'Cập nhật thất bại');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-3xl px-4 py-10 mx-auto">
//         <div className="h-8 mb-6 bg-gray-200 rounded animate-pulse w-60" />
//         <div className="space-y-4">
//           <div className="h-12 bg-gray-100 rounded" />
//           <div className="h-12 bg-gray-100 rounded" />
//           <div className="h-12 bg-gray-100 rounded" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="max-w-3xl px-4 py-10 mx-auto">
//       <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
//         Cập nhật thông tin cá nhân
//       </h1>

//       <form onSubmit={onSubmit} className="space-y-5">
//         {/* Họ và tên */}
//         <label className="block">
//           <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
//             <User2 className="w-4 h-4" /> Họ và tên
//           </span>
//           <div className="relative">
//             <input
//               type="text"
//               value={form.fullName}
//               onChange={onChange('fullName')}
//               placeholder="Nhập họ tên"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
//             />
//           </div>
//         </label>

//         {/* Điện thoại */}
//         <label className="block">
//           <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
//             <Phone className="w-4 h-4" /> Điện thoại
//           </span>
//           <input
//             type="tel"
//             value={form.phone}
//             onChange={onChange('phone')}
//             placeholder="VD: 0901234567"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
//           />
//         </label>

//         {/* Ngày sinh */}
//         <label className="block">
//           <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
//             <Calendar className="w-4 h-4" /> Ngày sinh
//           </span>
//           <input
//             type="date"
//             value={form.dob || ''}
//             onChange={onChange('dob')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
//           />
//         </label>

//         <div className="flex items-center gap-3 pt-2">
//           <button
//             type="submit"
//             disabled={saving}
//             className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
//           >
//             {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push('/tai-khoan')}
//             className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 hover:bg-gray-50"
//           >
//             Huỷ
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }







//src/app/tai-khoan/chinh-sua/page.tsx
'use client';

import { useEffect, useState } from 'react';
import userApi from '@/lib/userApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Calendar, Phone, User2 } from 'lucide-react';
import AccountLayout from '../_components/AccountLayout';

type FormState = {
  fullName: string;
  phone: string;
  dob: string; // ISO: YYYY-MM-DD
};

/** Chuẩn hoá string ngày về ISO YYYY-MM-DD */
function toISO(d?: string | null): string {
  if (!d) return '';
  // Đã là ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  // Các dạng khác -> cố gắng parse Date
  const dt = new Date(d);
  if (!isNaN(dt.getTime())) {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return '';
}

export default function AccountEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({ fullName: '', phone: '', dob: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await userApi.getMe();
        if (!mounted) return;
        setForm({
          fullName: me.fullName || '',
          phone: me.phone || '',
          dob: toISO(me.dob || ''), // chuẩn hoá trước khi bind vào <input type="date">
        });
      } catch (e: any) {
        toast.error(e.message || 'Không lấy được thông tin');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {};
      if (form.fullName?.trim() !== '') payload.fullName = form.fullName.trim();
      if (form.phone?.trim() !== '') payload.phone = form.phone.trim();
      if (form.dob?.trim() !== '') payload.dob = toISO(form.dob.trim()); // đảm bảo ISO trước khi gửi

      await userApi.updateMe(payload);
      toast.success('Cập nhật thành công');
      router.push('/tai-khoan');
    } catch (e: any) {
      toast.error(e.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout title="Cập nhật thông tin cá nhân">
        <div className="max-w-3xl px-4 py-10 mx-auto">
          <div className="h-8 mb-6 bg-gray-200 rounded w-60 animate-pulse" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded" />
            <div className="h-12 bg-gray-100 rounded" />
            <div className="h-12 bg-gray-100 rounded" />
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Cập nhật thông tin cá nhân">
      <section className="max-w-3xl px-4 py-10 mx-auto">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Cập nhật thông tin cá nhân
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Họ và tên */}
          <label className="block">
            <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <User2 className="w-4 h-4" /> Họ và tên
            </span>
            <div className="relative">
              <input
                type="text"
                value={form.fullName}
                onChange={onChange('fullName')}
                placeholder="Nhập họ tên"
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
              />
            </div>
          </label>

          {/* Điện thoại */}
          <label className="block">
            <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" /> Điện thoại
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={onChange('phone')}
              placeholder="VD: 0901234567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
            />
          </label>

          {/* Ngày sinh (native date) */}
          <label className="block">
            <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" /> Ngày sinh
            </span>
            <input
              type="date"
              value={form.dob || ''} // yêu cầu ISO YYYY-MM-DD
              onChange={onChange('dob')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
            />
            <p className="mt-2 text-xs text-gray-500">
              Hệ thống sử dụng định dạng <strong>YYYY-MM-DD</strong> để đồng bộ với cơ sở dữ liệu.
            </p>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/tai-khoan')}
              className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 hover:bg-gray-50"
            >
              Huỷ
            </button>
          </div>
        </form>
      </section>
    </AccountLayout>
  );
}
