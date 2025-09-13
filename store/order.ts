import { create } from "zustand";
import { Product } from "@/types/product.types";

export interface OrderItem extends Product {
  quantity: number;
}

interface OrderStore {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearOrder: () => void;
}

const TAX_RATE = 0.12; // 12%

const calculateTotals = (items: OrderItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
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

  addItem: (product: Product) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);

    let newItems: OrderItem[];
    if (existingItem) {
      newItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...items, { ...product, quantity: 1 }];
    }

    const totals = calculateTotals(newItems);
    set({ items: newItems, ...totals });
  },

  removeItem: (id: number) => {
    const { items } = get();
    const newItems = items.filter((item) => item.id !== id);
    const totals = calculateTotals(newItems);
    set({ items: newItems, ...totals });
  },

  updateQuantity: (id: number, quantity: number) => {
    const { items } = get();

    if (quantity <= 0) {
      const newItems = items.filter((item) => item.id !== id);
      const totals = calculateTotals(newItems);
      set({ items: newItems, ...totals });
      return;
    }

    const newItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    const totals = calculateTotals(newItems);
    set({ items: newItems, ...totals });
  },

  clearOrder: () => {
    set({ items: [], subtotal: 0, tax: 0, total: 0 });
  },
}));
