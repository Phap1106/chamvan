// src/components/Toaster.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { createPortal } from 'react-dom';

type ToastItem = {
  id: string;
  type?: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number; // ms
};

type NotifyFn = (t: Omit<ToastItem, 'id'>) => void;

const ToastCtx = createContext<NotifyFn | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <Toaster/>');
  return ctx;
}

export default function Toaster({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const notify: NotifyFn = (t) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, ...t }]);
    const ms = t.duration ?? 2400;
    // Chỉ chạy khi đã ở client
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }, ms);
    }
  };

  // Chỉ tạo portal khi đã mounted và có document
  const portal =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed top-4 right-4 z-[70] space-y-2 pointer-events-none">
            {items.map((t) => {
              const tone =
                t.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50'
                  : t.type === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-neutral-200 bg-white';
              return (
                <div
                  key={t.id}
                  className={`pointer-events-auto w-80 rounded-lg border shadow-md p-3 ${tone}`}
                >
                  {t.title && (
                    <div className="mb-1 text-sm font-semibold">{t.title}</div>
                  )}
                  <div className="text-sm text-neutral-700">{t.message}</div>
                </div>
              );
            })}
          </div>,
          document.body
        )
      : null;

  return (
    <ToastCtx.Provider value={notify}>
      {children}
      {portal}
    </ToastCtx.Provider>
  );
}
