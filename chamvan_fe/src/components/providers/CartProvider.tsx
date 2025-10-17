"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  id: string;         // product id
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;     // biến thể (tùy chọn)
};

type AddPayload = {
  id: string;
  qty: number;
  color?: string;
};

type CartCtx = {
  items: CartLine[];
  add: (payload: AddPayload) => void;
  updateQty: (id: string, color: string | undefined, next: number) => void;
  remove: (id: string, color?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

// Helper: load thông tin sản phẩm từ lib
import { findProduct } from "@/lib/products";

const STORAGE_KEY = "cv_cart_v1";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: CartLine[] = JSON.parse(raw);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (payload: AddPayload) => {
    const { id, qty, color } = payload;
    const p = findProduct(id);
    if (!p) return;

    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id && x.color === color);
      if (i >= 0) {
        const cloned = [...prev];
        cloned[i] = { ...cloned[i], qty: cloned[i].qty + qty };
        return cloned;
      }
      return [
        ...prev,
        {
          id,
          name: p.name,
          image: p.image,
          price: p.price,
          qty,
          color,
        },
      ];
    });
  };

  const updateQty = (id: string, color: string | undefined, next: number) => {
    setItems((prev) => {
      const cloned = prev.map((it) =>
        it.id === id && it.color === color ? { ...it, qty: Math.max(1, next) } : it
      );
      return cloned;
    });
  };

  const remove = (id: string, color?: string) => {
    setItems((prev) => prev.filter((x) => !(x.id === id && x.color === color)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const value: CartCtx = { items, add, updateQty, remove, clear, count, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
