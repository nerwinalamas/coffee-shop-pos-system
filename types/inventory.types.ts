import { ProductCategory } from "./product.types";

export type InventoryItem = {
  id: number;
  productName: string;
  sku: string;
  category: ProductCategory;
  quantity: number;
  reorderLevel: number;
  status: StockStatus;
  lastRestocked: string;
  image: string;
};

export enum StockStatus {
  IN_STOCK = "In Stock",
  LOW_STOCK = "Low Stock",
  OUT_OF_STOCK = "Out of Stock",
}
