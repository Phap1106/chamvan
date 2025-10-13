'use client';
import { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = { id: number; name: string; price: number; image: string; qty: number };
type CartCtx = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartCtx['add'] = (item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...item, qty }];
    });
  };
  const remove = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const value = useMemo(() => ({ items, count, add, remove, clear }), [items, count]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart must be used within CartProvider');
  return v;
};
