//src/app/tai-khoan/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AccountLayout from './_components/AccountLayout';
import {
  UserRound,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
  Pencil,
  ShoppingBag,
  ArrowRight,
  ReceiptText,
} from 'lucide-react';

type Me = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'support_admin' | 'user';
  phone?: string | null;
  dob?: string | null;
};

type OrderItem = { productId: string; qty: number };
type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDob?: string;
  shippingAddress?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  createdAt?: string;
  status?: string;
};

/* ---------- helpers ---------- */
function toVND(n: number) {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n.toLocaleString('vi-VN')} ₫`;
  }
}
function toVNDate(s?: string | null) {
  if (!s) return '';
  const d = s.length === 10 ? new Date(`${s}T00:00:00`) : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
const Line = () => <div className="w-full h-px bg-zinc-200" />;

function Field({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 px-0 py-3 md:grid-cols-[200px,1fr]">
      <dt className="flex items-center gap-2 text-[12px] uppercase text-zinc-500">
        {icon}
        <span>{label}</span>
      </dt>
      <dd className="text-[15px] md:text-base">{value}</dd>
    </div>
  );
}

export default function Page() {
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!meRes.ok) throw new Error('Vui lòng đăng nhập để xem thông tin tài khoản.');
        const meData: Me = await meRes.json();
        if (!mounted) return;
        setMe(meData);

        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
        const odRes = await fetch(`${base}/orders`, { cache: 'no-store' });
        if (odRes.ok) {
          const list: Order[] = await odRes.json();
          if (!mounted) return;
          const mine = (list || [])
            .filter((o) => o.customerEmail?.toLowerCase() === meData.email.toLowerCase())
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
          setOrders(mine);
        } else setOrders([]);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || 'Không tải được dữ liệu.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const recent = useMemo(() => {
    return orders.slice(0, 5).map((o) => ({
      date: toVNDate(o.createdAt || ''),
      code: o.id,
      qty: o.items?.reduce((sum, it) => sum + (it?.qty || 0), 0) || 0,
      subtotal: toVND(o.subtotal ?? o.total ?? 0),
      status: o.status || '—',
      href: `/tai-khoan/don-hang?code=${encodeURIComponent(o.id)}`,
    }));
  }, [orders]);

  return (
    <AccountLayout title="Thông tin cá nhân">
      {/* banners */}
      {loading && (
        <div className="flex items-center gap-2 mb-4 text-[15px] text-zinc-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang tải thông tin tài khoản…
        </div>
      )}
      {err && (
        <div className="flex items-center gap-2 mb-4 text-[15px] text-rose-700">
          <AlertCircle className="w-5 h-5" />
          {err}
        </div>
      )}

      {/* profile block */}
      <section className="bg-white">
        <div className="flex items-center gap-2 mb-3 text-lg font-medium text-zinc-700">
          <UserRound className="w-6 h-6" />
          Thông tin hồ sơ
        </div>

        <Line />

        <dl className="divide-y divide-zinc-200">
          <Field label="Họ và tên" icon={<UserRound className="w-5 h-5" />} value={me?.full_name || '—'} />
          <Field label="Email" icon={<Mail className="w-5 h-5" />} value={me?.email || '—'} />
          <Field label="Điện thoại" icon={<Phone className="w-5 h-5" />} value={me?.phone || '—'} />
          <Field label="Ngày sinh" icon={<CalendarIcon className="w-5 h-5" />} value={toVNDate(me?.dob)} />
        </dl>

        <div className="mt-4">
          <Link
            href="/tai-khoan/chinh-sua"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[15px] text-white bg-black hover:opacity-90"
          >
            <Pencil className="w-5 h-5" />
            Thay đổi thông tin
          </Link>
        </div>
      </section>

      {/* recent orders */}
      <div className="w-full h-px my-8 bg-zinc-200" />
      <section className="bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-medium text-zinc-700">
            <ShoppingBag className="w-6 h-6" />
            Đơn hàng gần đây
          </div>
          <Link href="/tai-khoan/don-hang" className="text-[15px] hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="divide-y divide-zinc-200">
          {recent.map((r) => (
            <Link
              key={r.code}
              href={r.href}
              className="flex items-center justify-between py-3.5 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <ReceiptText className="w-5 h-5 text-zinc-600" />
                <div className="text-[15px]">
                  <div className="font-medium">Đơn #{r.code}</div>
                  <div className="text-[13px] text-zinc-500">
                    {r.date} • {r.qty} sản phẩm • {r.status}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[15px] font-semibold">{r.subtotal}</div>
                <ArrowRight className="w-5 h-5 text-zinc-500" />
              </div>
            </Link>
          ))}
          {recent.length === 0 && (
            <div className="py-7 text-[15px] text-zinc-500">Bạn chưa có đơn nào.</div>
          )}
        </div>
      </section>
    </AccountLayout>
  );
}
