// //src/app/bao-cao-loi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import AccountLayout from '../tai-khoan/_components/AccountLayout';
import {
  Bug, Type, AlignLeft, SendHorizonal, CheckCircle2, X,
} from 'lucide-react';

export default function ReportBugPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);
  const [showToast, setShowToast] = useState(false); // điều khiển hiệu ứng

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;
    // demo UI
    setSent(true);
  }

  // điều khiển toast: xuất hiện khi sent = true và tự tắt sau 2.5s
  useEffect(() => {
    if (!sent) return;
    setShowToast(true);
    const hide = setTimeout(() => setShowToast(false), 2500);
    const reset = setTimeout(() => setSent(false), 2700); // reset state sau khi ẩn
    return () => {
      clearTimeout(hide);
      clearTimeout(reset);
    };
  }, [sent]);

  return (
    <AccountLayout title="Báo cáo lỗi">
      <form onSubmit={submit} className="max-w-3xl">
        {/* header */}
        <div className="flex items-center gap-2 mb-3 text-lg font-medium text-zinc-700">
          <Bug className="w-6 h-6" />
          Gửi báo cáo cho đội kỹ thuật
        </div>

        {/* line */}
        <div className="w-full h-px mb-5 bg-zinc-200" />

        {/* title */}
        <label className="block mb-6">
          <div className="mb-2 flex items-center gap-2 text-[12px] uppercase text-zinc-500">
            <Type className="w-5 h-5" />
            Tiêu đề *
          </div>
          <input
            className="w-full bg-transparent py-2.5 text-[15px] outline-none border-b border-zinc-200 focus:border-zinc-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Không thêm được vào giỏ hàng trên iPhone"
          />
        </label>

        {/* desc */}
        <label className="block mb-7">
          <div className="mb-2 flex items-center gap-2 text-[12px] uppercase text-zinc-500">
            <AlignLeft className="w-5 h-5" />
            Mô tả chi tiết *
          </div>
          <textarea
            rows={6}
            className="w-full bg-transparent py-2.5 text-[15px] outline-none border-b border-zinc-200 focus:border-zinc-900"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Các bước tái hiện lỗi, ảnh hưởng, trình duyệt/thiết bị…"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="inline-flex items-center gap-2 bg-black px-5 py-2.5 text-[15px] text-white hover:opacity-90 disabled:opacity-50"
            disabled={!title.trim() || !desc.trim()}
          >
            <SendHorizonal className="w-5 h-5" />
            Gửi báo cáo
          </button>
          <span className="text-[13px] text-zinc-500">
            * Đây là UI demo, bạn sẽ nối API sau.
          </span>
        </div>
      </form>

      {/* Toast success */}
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
            <div className="font-medium">Đã gửi báo cáo!</div>
            <div className="text-[13px] opacity-80">
              Cảm ơn bạn, đội kỹ thuật sẽ kiểm tra sớm nhất.
            </div>
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
    </AccountLayout>
  );
}
