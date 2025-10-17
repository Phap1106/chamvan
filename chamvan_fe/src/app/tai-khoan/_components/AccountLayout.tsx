'use client';

import { ReactNode, useState } from 'react';
import { AccountNav } from './AccountNav';

export default function AccountLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12 md:py-10">
      {/* Mobile header */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h1 className="text-lg font-semibold">{title}</h1>
        <button
          onClick={() => setOpen(v => !v)}
          className="px-3 py-2 text-sm border border-gray-300 rounded"
        >
          Danh mục
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="p-2 mb-6 bg-white border border-gray-200 rounded-lg md:hidden">
          <AccountNav />
        </div>
      )}

      {/* Desktop full width: 12 cols -> 3/9 */}
      <div className="grid gap-8 md:grid-cols-12">
        <aside className="hidden md:col-span-3 md:block">
          <AccountNav />
        </aside>

        <section className="md:col-span-9">
          <h1 className="hidden mb-5 text-2xl font-semibold tracking-wide md:block">
            {title.toUpperCase()}
          </h1>
          {children}
        </section>
      </div>
    </div>
  );
}
