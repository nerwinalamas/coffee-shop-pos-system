import { Database } from "@/types/supabase";
import { Inventory } from "@/types/inventory.types";

export enum ProductCategory {
  COFFEE = "Coffee",
  FOOD = "Food",
  DESSERT = "Dessert",
}

export type ProductImage = {
  file_name: string;
  file_size: number;
  mime_type: string;
  url: string;
};

export type Products = Omit<
  Database["public"]["Tables"]["products"]["Row"],
  "image"
> & {
  image: ProductImage | null;
};

export type ProductWithInventory = Products & {
  inventory: Inventory[] | Inventory | null;
};
