import { Products } from "./product.types";
import { Database } from "./supabase";

export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];

export type InventoryWithProduct = Inventory & {
  products: Products | null;
};
