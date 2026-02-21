import { create } from "zustand";
import { Products } from "@/types/product.types";

export interface OrderItem extends Products {
  quantity: number;
  maxQuantity: number;
}

interface OrderStore {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  addItem: (product: Products, maxQuantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
}

const TAX_RATE = 0.12; // 12%

const calculateTotals = (items: OrderItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,

  addItem: (product: Products, maxQuantity: number) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);

    let newItems: OrderItem[];
    if (existingItem) {
      // Don't exceed maxQuantity
      if (existingItem.quantity >= maxQuantity) return;
      newItems = items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      if (maxQuantity <= 0) return;
      newItems = [...items, { ...product, quantity: 1, maxQuantity }];
    }

    const totals = calculateTotals(newItems);
    set({ items: newItems, ...totals });
  },

  removeItem: (id: string) => {
    const { items } = get();
    const newItems = items.filter((item) => item.id !== id);
    const totals = calculateTotals(newItems);
    set({ items: newItems, ...totals });
  },

  updateQuantity: (id: string, quantity: number) => {
    const { items } = get();

    if (quantity <= 0) {
      const newItems = items.filter((item) => item.id !== id);
      const totals = calculateTotals(newItems);
      set({ items: newItems, ...totals });
      return;
    }

    const item = items.find((i) => i.id === id);
    if (!item) return;

    // Clamp to maxQuantity
    const clampedQuantity = Math.min(quantity, item.maxQuantity);

    const newItems = items.map((item) =>
      item.id === id ? { ...item, quantity: clampedQuantity } : item,
    );
    const totals = calculateTotals(newItems);
    set({ items: newItems, ...totals });
  },

  clearOrder: () => {
    set({ items: [], subtotal: 0, tax: 0, total: 0 });
  },
}));
