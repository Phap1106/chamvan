'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AccountLayout from '../_components/AccountLayout';
import { FileText, Send, RefreshCw } from 'lucide-react';

/* ======================= Types ======================= */
type ReturnStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'refunded';

type ReturnItem = {
  id: string;
  orderCode: string;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
};

/* ================== Small fetch helper ================= */
const BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, '') || 'http://localhost:4000/api';

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    // Quan trọng: FE của bạn đang dùng cookie JWT → credentials để BE đọc user
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/* ======================= Page ======================== */
export default function ReturnRequestPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [reason, setReason] = useState('');
  const [items, setItems] = useState<ReturnItem[]>([]);

  const statusBadge = useMemo(
    () =>
      ({
        pending: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
        in_review: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
        approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        rejected: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        refunded: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
      } as Record<ReturnStatus, string>),
    []
  );

  async function loadMine() {
    try {
      setLoading(true);
      const payload = await http<{ data: ReturnItem[] }>(`${BASE}/return-requests/me`);
      setItems(Array.isArray(payload?.data) ? payload.data : []);
    } catch (e: any) {
      toast.error(e?.message || 'Không tải được danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        await loadMine();
      } finally {
        // no-op
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim() || !reason.trim()) {
      toast.error('Vui lòng nhập Mã đơn hàng và Nội dung đổi/trả');
      return;
    }
    setSubmitting(true);
    try {
      await http(`${BASE}/return-requests`, {
        method: 'POST',
        body: JSON.stringify({
          orderCode: orderCode.trim(),
          reason: reason.trim(),
        }),
      });
      toast.success('Đã gửi yêu cầu đổi/trả');
      setOrderCode('');
      setReason('');
      await loadMine();
    } catch (e: any) {
      toast.error(e?.message || 'Không gửi được yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountLayout title="Yêu cầu đổi / trả hàng">
      <section className="max-w-5xl px-4 py-10 mx-auto">
        {/* Heading */}
        <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Yêu cầu đổi / trả hàng
        </h1>

        {/* ====== Form gửi yêu cầu ====== */}
        <form onSubmit={onSubmit} className="mb-10 rounded-xl border border-gray-200 bg-white">
          <div className="px-5 md:px-6 py-5 md:py-6 space-y-4">
            {/* Mã đơn hàng */}
            <label className="block">
              <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                Mã đơn hàng
              </span>
              <input
                type="text"
                placeholder="VD: ORD-2025-0001"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
              />
            </label>

            {/* Nội dung */}
            <label className="block">
              <span className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <Send className="w-4 h-4" />
                Nội dung đổi / trả
              </span>
              <textarea
                rows={5}
                placeholder="Mô tả chi tiết lý do (sai mẫu, lỗi, không như mô tả, ...)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/70"
              />
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
              <button
                type="button"
                onClick={loadMine}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Làm mới
              </button>
              <p className="text-xs text-gray-500">
                Thời gian phản hồi dự kiến 1–3 ngày làm việc.
              </p>
            </div>
          </div>
        </form>

        {/* ====== Danh sách yêu cầu đã gửi ====== */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-medium">Yêu cầu của tôi</h2>
            <button onClick={loadMine} className="text-sm underline underline-offset-4">
              Làm mới
            </button>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">Bạn chưa có yêu cầu nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-5 py-3 font-medium text-gray-700">Ngày</th>
                    <th className="px-5 py-3 font-medium text-gray-700">Mã đơn</th>
                    <th className="px-5 py-3 font-medium text-gray-700">Nội dung</th>
                    <th className="px-5 py-3 font-medium text-gray-700">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="px-5 py-3 whitespace-nowrap">
                        {new Date(it.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-medium">{it.orderCode}</td>
                      <td className="px-5 py-3 max-w-[560px]">
                        <div className="line-clamp-3">{it.reason}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={[
                            'text-xs px-2.5 py-1 rounded-full inline-block',
                            statusBadge[it.status],
                          ].join(' ')}
                        >
                          {it.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AccountLayout>
  );
}
