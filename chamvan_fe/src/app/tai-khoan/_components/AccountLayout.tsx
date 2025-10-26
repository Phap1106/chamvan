// //src/app/tai-khoan/_components/AccountLayout.tsx


'use client';

import { ReactNode, useState } from 'react';
import { AccountNav } from './AccountNav';
import { Menu } from 'lucide-react';

export default function AccountLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full px-4 py-6 bg-white md:px-10 lg:px-14 md:py-10">
      {/* Mobile header */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        {/* ↑ tăng size tiêu đề mobile */}
        <h1 className="text-2xl font-semibold tracking-tight leading-[1.1]">
          {title}
        </h1>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          <Menu className="w-4 h-4" />
          Danh mục
        </button>
      </div>

      {open && (
        <div className="mb-8 md:hidden">
          <AccountNav />
        </div>
      )}

      {/* Desktop grid */}
      <div className="grid gap-12 md:grid-cols-12">
        <aside className="hidden md:col-span-3 md:block">
          <AccountNav />
        </aside>

        <section className="md:col-span-9">
          {/* ↑↑ tăng size tiêu đề desktop cho tương xứng nav */}
          <h1 className="hidden md:block mb-8 text-[36px] font-semibold tracking-tight leading-[1.1]">
            {title.toUpperCase()}
          </h1>
          {children}
        </section>
      </div>
    </div>
  );
}
