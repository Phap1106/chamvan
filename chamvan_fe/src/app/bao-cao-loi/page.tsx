'use client';

import { useState } from 'react';
import AccountLayout from '../tai-khoan/_components/AccountLayout';

export default function ReportBugPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <AccountLayout title="Báo cáo lỗi">
      <form onSubmit={(e) => e.preventDefault()} className="p-5 space-y-5 bg-white border border-gray-200 rounded-lg">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Tiêu đề *</label>
          <input
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Không thêm được vào giỏ hàng trên iPhone"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Mô tả chi tiết *</label>
          <textarea
            rows={6}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-300"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Mô tả các bước tái hiện lỗi, ảnh hưởng, trình duyệt/thiết bị..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-black rounded hover:opacity-90">
            GỬI BÁO CÁO
          </button>
          <span className="text-xs text-gray-500">* Đây là UI demo, bạn nối API sau.</span>
        </div>
      </form>
    </AccountLayout>
  );
}
