
// src/app/admin/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Users,
  PackageOpen,
  ChevronRight,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

type Order = {
  id: string | number;
  total: number;
  status?: string;
  createdAt?: string;
};

type User = {
  id: string;
  fullName?: string | null;
  email: string;
  createdAt?: string | null;
};

function VND(n: number) {
  return (n || 0).toLocaleString('vi-VN') + '₫';
}

export default function AdminHome() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const [oRes, uRes] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/users?limit=6', { cache: 'no-store' }).catch(() => null),
      ]);
      const oData = await oRes.json();
      if (!oRes.ok) throw new Error(oData?.message || 'Không tải được đơn hàng');

      let uData: any = { items: [] };
      if (uRes) {
        uData = await uRes.json().catch(() => ({ items: [] }));
      }

      setOrders(Array.isArray(oData) ? oData : []);
      setUsers(Array.isArray(uData?.items) ? uData.items : []);
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải dữ liệu');
      setOrders([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // số liệu tổng
  const today = new Date();
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const ordersThisMonth = useMemo(
    () =>
      orders.filter((o) => (o.createdAt ? new Date(o.createdAt) >= startMonth : false)),
    [orders, startMonth]
  );
  const revenueThisMonth = useMemo(
    () => ordersThisMonth.reduce((s, o) => s + (o.total || 0), 0),
    [ordersThisMonth]
  );
  const ordersToday = useMemo(
    () =>
      orders.filter((o) => {
        if (!o.createdAt) return false;
        const d = new Date(o.createdAt);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      }).length,
    [orders, today]
  );

  // sparkline 14 ngày gần nhất
  const spark = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 13);
    const days: { idx: number; value: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const sum = orders
        .filter((o) => (o.createdAt ? sameDay(new Date(o.createdAt), d) : false))
        .reduce((s, o) => s + (o.total || 0), 0);
      days.push({ idx: i + 1, value: sum });
    }
    return days;
  }, [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            (new Date(b.createdAt || 0).getTime() || 0) -
            (new Date(a.createdAt || 0).getTime() || 0)
        )
        .slice(0, 5),
    [orders]
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <LayoutDashboard className="w-5 h-5 text-zinc-800" />
          <span className="font-medium text-zinc-800">Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span>Tổng quan</span>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50"
          title="Làm mới"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* line */}
      <div className="w-full h-px mb-4 bg-zinc-200" />

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-4 md:divide-x md:divide-zinc-200">
        <Kpi
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Đơn hôm nay"
          value={ordersToday.toString()}
        />
        <Kpi
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Đơn trong tháng"
          value={ordersThisMonth.length.toString()}
        />
        <Kpi
          icon={<Wallet className="w-5 h-5" />}
          label="Doanh thu tháng"
          value={VND(revenueThisMonth)}
          rightSpark={
            <MiniSpark data={spark} stroke="#10b981" tooltipLabel="Doanh thu" money />
          }
        />
        <Kpi
          icon={<Users className="w-5 h-5" />}
          label="Người dùng mới"
          value={users.length.toString()}
        />
      </div>

      {/* line */}
      <div className="w-full h-px my-4 bg-zinc-200" />

      {/* 2 cột: Hoạt động gần đây + Lối tắt */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent orders */}
        <section>
          <header className="mb-2 text-sm font-medium text-zinc-700">
            Hoạt động gần đây
          </header>
          <div className="divide-y divide-zinc-200">
            {recentOrders.map((o) => (
              <div key={String(o.id)} className="flex items-center justify-between py-2">
                <div className="text-sm">
                  <div className="font-medium">Đơn #{o.id}</div>
                  <div className="text-xs text-zinc-500">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString('vi-VN')
                      : '—'}{' '}
                    • <span className="capitalize">{o.status || 'chờ duyệt'}</span>
                  </div>
                </div>
                <div className="text-sm font-semibold">{VND(o.total || 0)}</div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="py-6 text-sm text-zinc-500">Chưa có dữ liệu</div>
            )}
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 mt-3 text-sm hover:underline"
          >
            Xem tất cả đơn hàng <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Quick links */}
        <section>
          <header className="mb-2 text-sm font-medium text-zinc-700">
            Lối tắt quản trị
          </header>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Quick href="/admin/products" icon={<PackageOpen className="w-5 h-5" />} title="Sản phẩm" />
            <Quick href="/admin/orders" icon={<ShoppingBag className="w-5 h-5" />} title="Đơn hàng" />
            <Quick href="/admin/users" icon={<Users className="w-5 h-5" />} title="Người dùng" />
            <Quick href="/admin/revenue" icon={<Wallet className="w-5 h-5" />} title="Doanh thu" />
            <Quick href="/admin/staff" icon={<Users className="w-5 h-5" />} title="Nhân viên" />
            <Quick href="/" icon={<LayoutDashboard className="w-5 h-5" />} title="Trang chủ" />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Kpi({
  icon,
  label,
  value,
  rightSpark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  rightSpark?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-0 py-2 md:px-4">
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {icon}
          <span>{label}</span>
        </div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </div>
      {rightSpark}
    </div>
  );
}

function MiniSpark({
  data,
  stroke,
  tooltipLabel,
  money,
}: {
  data: { idx: number; value: number }[];
  stroke: string;
  tooltipLabel: string;
  money?: boolean;
}) {
  return (
    <div className="h-12 w-36">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="idx" hide />
          <YAxis hide />
          <Tooltip
            formatter={(v: number) =>
              [money ? VND(Number(v)) : String(v), tooltipLabel]
            }
          />
          <Line type="monotone" dataKey="value" stroke={stroke} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Quick({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-3 group hover:bg-zinc-50"
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium group-hover:underline">{title}</span>
    </Link>
  );
}
