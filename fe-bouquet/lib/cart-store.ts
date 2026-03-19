import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  sareeId: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (sareeId: string) => void;
  updateQty: (sareeId: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.sareeId === item.sareeId);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.sareeId === item.sareeId ? { ...i, qty: i.qty + 1 } : i
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { ...item, qty: 1 }] }));
        }
      },
      removeItem: (sareeId) =>
        set((s) => ({ items: s.items.filter((i) => i.sareeId !== sareeId) })),
      updateQty: (sareeId, qty) => {
        if (qty <= 0) {
          get().removeItem(sareeId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.sareeId === sareeId ? { ...i, qty } : i)),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'priyas-cart' }
  )
);
