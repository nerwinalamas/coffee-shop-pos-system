import { ProductCategory, Products } from "./product.types";
import { Database } from "./supabase";

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

export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];

export type InventoryWithProduct = Inventory & {
  products: Products | null;
};
