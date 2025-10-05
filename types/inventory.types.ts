export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type InventoryItem = {
  id: number;
  productName: string;
  sku: string;
  category: "Coffee" | "Food" | "Dessert";
  quantity: number;
  reorderLevel: number;
  status: StockStatus;
  lastRestocked: string;
  image: string;
};
