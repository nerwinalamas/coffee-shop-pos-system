import { Inventory } from "@/types/inventory.types";
import { Database } from "@/types/supabase";

export enum ProductCategory {
  COFFEE = "Coffee",
  FOOD = "Food",
  DESSERT = "Dessert",
}

export type Products = Database["public"]["Tables"]["products"]["Row"];

export type ProductWithInventory = Products & {
  inventory: Inventory[] | Inventory | null;
};
