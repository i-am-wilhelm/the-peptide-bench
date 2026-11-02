"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/lib/catalog";

export interface CartLine {
  sku: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  add: (sku: string, qty?: number) => void;
  remove: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  items: Array<CartLine & { product: Product }>;
  subtotal: number;
  count: number;
  hydrated: boolean;
}

const KEY = "cart.v1";
const CartCtx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const add = useCallback((sku: string, qty = 1) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => l.sku === sku);
      if (i === -1) return [...ls, { sku, qty }];
      const next = [...ls];
      next[i] = { sku, qty: Math.min(99, next[i].qty + qty) };
      return next;
    });
  }, []);
  const remove = useCallback((sku: string) => setLines((ls) => ls.filter((l) => l.sku !== sku)), []);
  const setQty = useCallback(
    (sku: string, qty: number) =>
      setLines((ls) => (qty <= 0 ? ls.filter((l) => l.sku !== sku) : ls.map((l) => (l.sku === sku ? { ...l, qty } : l)))),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const items = useMemo(
    () =>
      lines
        .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.sku === l.sku)! }))
        .filter((l) => l.product && l.product.price != null),
    [lines],
  );
  const subtotal = items.reduce((s, l) => s + (l.product.price ?? 0) * l.qty, 0);
  const count = items.reduce((s, l) => s + l.qty, 0);

  return (
    <CartCtx.Provider value={{ lines, add, remove, setQty, clear, items, subtotal, count, hydrated }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
