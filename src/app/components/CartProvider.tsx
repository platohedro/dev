"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { productId: string; name: string; priceCop: number; imageUrl: string | null; quantity: number };
type CartContextValue = { items: CartItem[]; count: number; total: number; add: (item: Omit<CartItem, "quantity">) => void; remove: (productId: string) => void; setQuantity: (productId: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { const saved = window.localStorage.getItem("platohedro-cart"); if (saved) setItems(JSON.parse(saved)); } catch { setItems([]); } }, []);
  useEffect(() => { window.localStorage.setItem("platohedro-cart", JSON.stringify(items)); }, [items]);
  const value = useMemo(() => ({
    items, count: items.reduce((sum, item) => sum + item.quantity, 0), total: items.reduce((sum, item) => sum + item.priceCop * item.quantity, 0),
    add: (item: Omit<CartItem, "quantity">) => setItems((current) => { const found = current.find((entry) => entry.productId === item.productId); return found ? current.map((entry) => entry.productId === item.productId ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }]; }),
    remove: (productId: string) => setItems((current) => current.filter((item) => item.productId !== productId)),
    setQuantity: (productId: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => item.productId !== productId) : current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, quantity) } : item)),
    clear: () => setItems([]),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart debe usarse dentro de CartProvider"); return value; }
