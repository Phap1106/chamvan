// //src/app/admin/revenue/page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Download,
  RefreshCw,
  ChevronRight,
  BarChart3,
  LineChart as LineChartIcon,
  CreditCard,
  Wallet,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

/* ================== Types ================== */
type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'shipped' | 'completed';
type PaymentMethod = 'cod' | 'bank' | 'card' | 'momo' | 'zalopay';
type RangeType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

type Order = {
  id: string;
  total: number;
  createdAt?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
};

/* ================== Utils ================== */
const pad = (x: number) => x.toString().padStart(2, '0');
function inRange(d: Date, from: Date, to: Date) { return d >= from && d <= to; }
function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫'; }
function toDateInputValue(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function addDays(d: Date, n: number) { const t = new Date(d); t.setDate(t.getDate()+n); return t; }
function sameDate(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

/* ================== Page ================== */
export default function RevenuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filters
  const [range, setRange] = useState<RangeType>('month');
  const [fromStr, setFromStr] = useState('');
  const [toStr, setToStr] = useState('');
  const [status, setStatus] = useState<'all' | OrderStatus>('all');
  const [payment, setPayment] = useState<'all' | PaymentMethod>('all');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Không tải được đơn hàng');
        setOrders(Array.isArray(data) ? data : []);

        const now = new Date();
        const startMonth = new Date(now);
        startMonth.setDate(1);
        startMonth.setHours(0, 0, 0, 0);
        setFromStr(toDateInputValue(startMonth));
        setToStr(toDateInputValue(now));
      } catch (e: any) {
        setErr(e?.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Period
  const now = new Date();
  const period = useMemo(() => {
    if (range === 'custom' && fromStr && toStr) {
      const from = new Date(fromStr + 'T00:00:00');
      const to = new Date(toStr + 'T23:59:59.999');
      return { from, to };
    }
    const start = new Date(now);
    if (range === 'day') start.setHours(0,0,0,0);
    if (range === 'week') { const day = start.getDay() || 7; start.setDate(start.getDate()-(day-1)); start.setHours(0,0,0,0); }
    if (range === 'month') { start.setDate(1); start.setHours(0,0,0,0); }
    if (range === 'quarter') { const q = Math.floor(start.getMonth()/3)*3; start.setMonth(q,1); start.setHours(0,0,0,0); }
    if (range === 'year') { start.setMonth(0,1); start.setHours(0,0,0,0); }
    return { from: start, to: now };
  }, [range, now, fromStr, toStr]);

  // Filtered
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const d = o.createdAt ? new Date(o.createdAt) : null;
      if (!d || !inRange(d, period.from, period.to)) return false;
      if (status !== 'all' && o.status && o.status !== status) return false;
      if (payment !== 'all' && o.paymentMethod && o.paymentMethod !== payment) return false;
      return true;
    });
  }, [orders, period, status, payment]);

  // KPIs
  const total = useMemo(() => filtered.reduce((s, o) => s + (o.total || 0), 0), [filtered]);
  const count = filtered.length;
  const avg = count ? Math.round(total / count) : 0;
  const paid = filtered.filter(o => o.status === 'paid' || o.status === 'completed');
  const cancelled = filtered.filter(o => o.status === 'cancelled');

  // Chart data per day
  const perDay = useMemo(() => {
    const days: { date: string; total: number }[] = [];
    const start = new Date(period.from); start.setHours(0,0,0,0);
    const end = new Date(period.to); end.setHours(0,0,0,0);
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const sum = filtered
        .filter((o) => (o.createdAt ? sameDate(new Date(o.createdAt), d) : false))
        .reduce((s, o) => s + (o.total || 0), 0);
      days.push({ date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), total: sum });
    }
    return days;
  }, [filtered, period]);

  // Sparkline data: 14 ngày gần nhất
  const spark = useMemo(() => {
    const end = new Date(period.to);
    const start = addDays(end, -13);
    const list: { idx: number; value: number }[] = [];
    for (let i = 0, d = new Date(start); i < 14; i++, d = addDays(d, 1)) {
      const v = filtered
        .filter((o) => (o.createdAt ? sameDate(new Date(o.createdAt), d) : false))
        .reduce((s, o) => s + (o.total || 0), 0);
      list.push({ idx: i + 1, value: v });
    }
    return list;
  }, [filtered, period]);

  // Recent orders for timeline
  const recent = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => (new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()))
        .slice(0, 8),
    [filtered]
  );

  // Export CSV
  const onExport = () => {
    const header = ['id','createdAt','status','paymentMethod','total'];
    const rows = filtered.map((o) => [
      o.id,
      o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '',
      o.status || '',
      o.paymentMethod || '',
      (o.total || 0).toString(),
    ]);
    const csv =
      [header, ...rows]
        .map((row) => row.map((v) => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\n') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_${toDateInputValue(period.from)}_${toDateInputValue(period.to)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white text-zinc-900">
      {/* Top bar + page title */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="font-medium text-zinc-800">Analytics</span>
          <ChevronRight className="w-4 h-4" />
          <span>Overview</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => location.reload()} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button onClick={onExport} className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 text-sm hover:opacity-90">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Tab bar giả lập */}
      <div className="flex items-center gap-6 text-sm">
        <button className="pb-2 font-medium border-b-2 border-black">Overview</button>
        <button className="pb-2 text-zinc-500 hover:text-zinc-800">Audiences</button>
        <button className="pb-2 text-zinc-500 hover:text-zinc-800">Demographics</button>
      </div>

      {/* Separator */}
      <div className="w-full h-px mt-2 mb-4 bg-zinc-200" />

      {/* Portfolio Performance (KPI strip + filters) */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
        {/* KPIs */}
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-[12px] uppercase text-zinc-500">Tổng đơn</div>
            <div className="flex items-center gap-2 mt-1">
              <ShoppingBag className="w-5 h-5" />
              <div className="text-2xl font-semibold">{count}</div>
            </div>
          </div>
          <div>
            <div className="text-[12px] uppercase text-zinc-500">Doanh thu</div>
            <div className="flex items-center gap-2 mt-1">
              <Wallet className="w-5 h-5" />
              <div className="text-2xl font-semibold">{formatVND(total)}</div>
            </div>
          </div>
          <div>
            <div className="text-[12px] uppercase text-zinc-500">Trung bình/đơn</div>
            <div className="flex items-center gap-2 mt-1">
              <CreditCard className="w-5 h-5" />
              <div className="text-2xl font-semibold">{formatVND(avg)}</div>
            </div>
          </div>
        </div>

        {/* Filters on the right */}
        <div className="flex flex-wrap items-end gap-4 ml-auto">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase text-zinc-500">Khoảng thời gian</span>
            <select
              className="bg-transparent py-1.5"
              value={range}
              onChange={(e) => setRange(e.target.value as RangeType)}
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="quarter">Quý</option>
              <option value="year">Năm</option>
              <option value="custom">Tùy chọn</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase text-zinc-500">Từ ngày</span>
            <div className="relative">
              <input
                type="date"
                className="bg-transparent pr-6 py-1.5"
                value={fromStr}
                onChange={(e) => { setFromStr(e.target.value); setRange('custom'); }}
              />
              <CalendarIcon className="absolute right-0 w-4 h-4 pointer-events-none top-2 text-zinc-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase text-zinc-500">Đến ngày</span>
            <div className="relative">
              <input
                type="date"
                className="bg-transparent pr-6 py-1.5"
                value={toStr}
                onChange={(e) => { setToStr(e.target.value); setRange('custom'); }}
              />
              <CalendarIcon className="absolute right-0 w-4 h-4 pointer-events-none top-2 text-zinc-500" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase text-zinc-500">Trạng thái</span>
            <select className="bg-transparent py-1.5" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="paid">Đã thanh toán</option>
              <option value="shipped">Đã gửi</option>
              <option value="completed">Hoàn tất</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase text-zinc-500">Thanh toán</span>
            <select className="bg-transparent py-1.5" value={payment} onChange={(e)=>setPayment(e.target.value as any)}>
              <option value="all">Tất cả</option>
              <option value="cod">COD</option>
              <option value="bank">Chuyển khoản</option>
              <option value="card">Thẻ</option>
              <option value="momo">MoMo</option>
              <option value="zalopay">ZaloPay</option>
            </select>
          </div>
        </div>
      </div>

      {/* View report button */}
      <div className="mt-3">
        <button className="px-4 py-1.5 text-sm bg-zinc-900 text-white hover:opacity-90 inline-flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> View Complete Report
        </button>
      </div>

      {/* Separator */}
      <div className="w-full h-px my-4 bg-zinc-200" />

      {/* 2 columns: left line chart, right timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Technical/Revenue Trend */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LineChartIcon className="w-4 h-4" />
              Biểu đồ doanh thu
            </div>
            <div className="text-xs text-zinc-500">Since {period.from.getFullYear()}</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perDay}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tickMargin={8}/>
                <YAxis tickFormatter={(v)=> v>=1_000_000 ? `${v/1_000_000}tr` : `${v}`} />
                <Tooltip formatter={(value:number)=>[formatVND(value),'Doanh thu']} />
                <Area type="monotone" dataKey="total" stroke="#10b981" fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Sales progress + summary strip */}
          <div className="grid grid-cols-3 mt-2 text-sm">
            <div className="text-zinc-500">Đã thanh toán</div>
            <div className="text-zinc-500">Đơn hủy</div>
            <div className="text-right text-zinc-500">Tổng</div>
            <div className="font-medium">{paid.length}</div>
            <div className="font-medium">{cancelled.length}</div>
            <div className="font-semibold text-right">{formatVND(total)}</div>
          </div>
        </div>

        {/* Right: Timeline recent orders */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock3 className="w-4 h-4" />
              Hoạt động gần đây
            </div>
            <button className="px-2 py-1 text-xs hover:bg-zinc-50">View All Messages</button>
          </div>
          <div className="divide-y divide-zinc-200">
            {recent.map((o) => (
              <div key={o.id} className="flex items-start justify-between py-2">
                <div className="flex items-start gap-2">
                  <span
                    className={[
                      'mt-1 h-2.5 w-2.5 rounded-full',
                      o.status === 'paid' || o.status === 'completed'
                        ? 'bg-emerald-500'
                        : o.status === 'cancelled'
                        ? 'bg-rose-500'
                        : 'bg-zinc-400',
                    ].join(' ')}
                  />
                  <div className="text-sm">
                    <div className="font-medium">Đơn #{o.id}</div>
                    <div className="text-xs text-zinc-500">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '—'} •{' '}
                      <span className="capitalize">{o.status || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatVND(o.total || 0)}</div>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="py-6 text-sm text-zinc-500">Chưa có hoạt động</div>
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full h-px my-6 bg-zinc-200" />

      {/* Bottom stat cards with sparklines */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Card 1: Orders */}
        <div>
          <div className="mb-1 text-xs text-zinc-500">Đơn trong kỳ</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold">{count}</div>
            <div className="h-12 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spark}>
                  <XAxis dataKey="idx" hide />
                  <YAxis hide />
                  <Tooltip formatter={(v:number)=>[`${v}`, 'Đơn']} />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div>
          <div className="mb-1 text-xs text-zinc-500">Doanh thu</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold">{formatVND(total)}</div>
            <div className="h-12 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spark}>
                  <XAxis dataKey="idx" hide />
                  <YAxis hide />
                  <Tooltip formatter={(v:number)=>[formatVND(v), 'VNĐ']} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: AOV */}
        <div>
          <div className="mb-1 text-xs text-zinc-500">AOV (trung bình/đơn)</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold">{formatVND(avg)}</div>
            <div className="h-12 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spark}>
                  <XAxis dataKey="idx" hide />
                  <YAxis hide />
                  <Tooltip formatter={(v:number)=>[formatVND(v), 'VNĐ']} />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4: Paid vs Cancelled (bar tiny) */}
        <div>
          <div className="mb-1 text-xs text-zinc-500">Trạng thái</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold">{paid.length}/{count}</div>
            <div className="h-12 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { k: 'paid', v: paid.length },
                  { k: 'cancel', v: cancelled.length },
                ]}>
                  <XAxis dataKey="k" hide />
                  <YAxis hide />
                  <Tooltip formatter={(v:number)=>[`${v}`, 'Số đơn']} />
                  <Bar dataKey="v" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle footer line */}
      <div className="w-full h-px mt-6 bg-zinc-200" />
      {err && <div className="py-3 text-sm text-red-700">{err}</div>}
      {loading && <div className="py-3 text-sm">Đang tải…</div>}
    </div>
  );
}
