'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-3xl px-6 py-16 mx-auto text-center">
      <div className="font-bold tracking-tight text-7xl">404</div>
      <h1 className="mt-3 text-2xl font-semibold">Không tìm thấy trang</h1>
      <p className="mt-2 text-zinc-600">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
      </p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <Link
          href="/"
          className="px-4 py-2 text-white bg-black rounded hover:opacity-90"
        >
          Về trang chủ
        </Link>
        <Link
          href="/san-pham"
          className="px-4 py-2 border rounded hover:bg-zinc-50"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </main>
  );
}
