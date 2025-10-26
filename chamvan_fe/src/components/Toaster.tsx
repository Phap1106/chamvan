// // src/components/Toaster.tsx

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
  id: string;
  type?: ToastType;
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
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }, ms);
    }
  };

  const portal =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div className="pointer-events-none fixed right-4 top-4 z-[70] space-y-2">
            {items.map((t) => {
              const tone =
                t.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : t.type === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-900'
                  : t.type === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-neutral-200 bg-white text-neutral-900'; // info/default

              return (
                <div
                  key={t.id}
                  className={`pointer-events-auto w-80 rounded-lg border p-3 shadow-md ${tone}`}
                >
                  {t.title && (
                    <div className="mb-1 text-sm font-semibold">{t.title}</div>
                  )}
                  <div className="text-sm text-current/90">{t.message}</div>
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
