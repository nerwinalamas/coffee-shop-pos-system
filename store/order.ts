import { create } from "zustand";
import { Products } from "@/types/product.types";

export interface OrderItem extends Products {
  quantity: number;
  maxQuantity: number;
}

interface PromoState {
  promoCode: string | null;
  discountType: "percentage" | "fixed" | null;
  discountValue: number;
  discountAmount: number;
}

interface OrderStore {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  promo: PromoState;
  addItem: (product: Products, maxQuantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromo: (
    code: string,
    type: "percentage" | "fixed",
    value: number,
  ) => void;
  removePromo: () => void;
  clearOrder: () => void;
}

const TAX_RATE = 0.12; // 12%

const EMPTY_PROMO: PromoState = {
  promoCode: null,
  discountType: null,
  discountValue: 0,
  discountAmount: 0,
};

const calculateTotals = (items: OrderItem[], discountAmount = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discounted = Math.max(0, subtotal - discountAmount);
  const tax = discounted * TAX_RATE;
  const total = discounted + tax;
  return { subtotal, tax, total };
};

const calculateDiscount = (
  subtotal: number,
  type: "percentage" | "fixed",
  value: number,
): number => {
  if (type === "percentage")
    return Math.round(((subtotal * value) / 100) * 100) / 100;
  return Math.min(value, subtotal);
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  promo: EMPTY_PROMO,

  addItem: (product, maxQuantity) => {
    const { items, promo } = get();
    const existing = items.find((i) => i.id === product.id);

    let newItems: OrderItem[];
    if (existing) {
      if (existing.quantity >= maxQuantity) return;
      newItems = items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
      );
    } else {
      if (maxQuantity <= 0) return;
      newItems = [...items, { ...product, quantity: 1, maxQuantity }];
    }

    // Recalculate discount against new subtotal
    const rawSubtotal = newItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const newDiscountAmount = promo.promoCode
      ? calculateDiscount(rawSubtotal, promo.discountType!, promo.discountValue)
      : 0;

    const totals = calculateTotals(newItems, newDiscountAmount);
    set({
      items: newItems,
      ...totals,
      promo: { ...promo, discountAmount: newDiscountAmount },
    });
  },

  removeItem: (id) => {
    const { items, promo } = get();
    const newItems = items.filter((i) => i.id !== id);

    const rawSubtotal = newItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const newDiscountAmount = promo.promoCode
      ? calculateDiscount(rawSubtotal, promo.discountType!, promo.discountValue)
      : 0;

    const totals = calculateTotals(newItems, newDiscountAmount);
    set({
      items: newItems,
      ...totals,
      promo: { ...promo, discountAmount: newDiscountAmount },
    });
  },

  updateQuantity: (id, quantity) => {
    const { items, promo } = get();

    let newItems: OrderItem[];
    if (quantity <= 0) {
      newItems = items.filter((i) => i.id !== id);
    } else {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const clamped = Math.min(quantity, item.maxQuantity);
      newItems = items.map((i) =>
        i.id === id ? { ...i, quantity: clamped } : i,
      );
    }

    const rawSubtotal = newItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const newDiscountAmount = promo.promoCode
      ? calculateDiscount(rawSubtotal, promo.discountType!, promo.discountValue)
      : 0;

    const totals = calculateTotals(newItems, newDiscountAmount);
    set({
      items: newItems,
      ...totals,
      promo: { ...promo, discountAmount: newDiscountAmount },
    });
  },

  applyPromo: (code, type, value) => {
    const { items } = get();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountAmount = calculateDiscount(subtotal, type, value);
    const totals = calculateTotals(items, discountAmount);
    set({
      ...totals,
      promo: {
        promoCode: code,
        discountType: type,
        discountValue: value,
        discountAmount,
      },
    });
  },

  removePromo: () => {
    const { items } = get();
    const totals = calculateTotals(items, 0);
    set({ ...totals, promo: EMPTY_PROMO });
  },

  clearOrder: () => {
    set({ items: [], subtotal: 0, tax: 0, total: 0, promo: EMPTY_PROMO });
  },
}));
