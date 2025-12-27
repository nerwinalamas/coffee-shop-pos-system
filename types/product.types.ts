import { Database } from "./supabase";

export enum ProductCategory {
  COFFEE = "Coffee",
  FOOD = "Food",
  DESSERT = "Dessert",
}

export type Products = Database["public"]["Tables"]["products"]["Row"];
