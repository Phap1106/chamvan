'use client';

import { useEffect, useMemo, useState } from 'react';

type Order = { id: string; total: number; createdAt?: string };

function inRange(d: Date, from: Date, to: Date) {
  return d >= from && d <= to;
}

export default function RevenuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [range, setRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Không tải được đơn hàng');
        setOrders(data || []);
      } catch (e: any) {
        setErr(e?.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = new Date();
  const period = useMemo(() => {
    const start = new Date(now);
    if (range === 'day') start.setHours(0, 0, 0, 0);
    if (range === 'week') {
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - (day - 1));
      start.setHours(0, 0, 0, 0);
    }
    if (range === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }
    if (range === 'quarter') {
      const q = Math.floor(start.getMonth() / 3) * 3;
      start.setMonth(q, 1);
      start.setHours(0, 0, 0, 0);
    }
    if (range === 'year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }
    return { from: start, to: now };
  }, [range, now]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const d = o.createdAt ? new Date(o.createdAt) : null;
      return d ? inRange(d, period.from, period.to) : false;
    });
  }, [orders, period]);

  const total = useMemo(() => filtered.reduce((s, o) => s + (o.total || 0), 0), [filtered]);
  const count = filtered.length;
  const avg = count ? Math.round(total / count) : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý doanh thu</h1>
        <select
          className="p-2 border rounded"
          value={range}
          onChange={(e) => setRange(e.target.value as any)}
        >
          <option value="day">Ngày</option>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="quarter">Quý</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {err && (
        <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
          {err}
        </div>
      )}

      {loading ? (
        <div>Đang tải…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Số đơn</div>
              <div className="text-xl font-semibold">{count}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Doanh thu</div>
              <div className="text-xl font-semibold">{total.toLocaleString('vi-VN')}₫</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Trung bình/đơn</div>
              <div className="text-xl font-semibold">{avg.toLocaleString('vi-VN')}₫</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Khoảng thời gian</div>
              <div className="text-sm">
                {period.from.toLocaleDateString('vi-VN')} → {period.to.toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          <h3 className="mt-6 mb-2 text-lg font-semibold">Đơn hàng trong kỳ</h3>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-[780px] w-full table-fixed text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[160px] px-3 py-2 text-left">Ngày</th>
                  <th className="px-3 py-2 text-left">Mã đơn</th>
                  <th className="w-[130px] px-3 py-2 text-right">Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="px-3 py-2">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '—'}
                    </td>
                    <td className="px-3 py-2">{o.id}</td>
                    <td className="px-3 py-2 text-right">
                      {(o.total || 0).toLocaleString('vi-VN')}₫
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
