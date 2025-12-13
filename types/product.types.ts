import { Database } from "./supabase";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
};

export enum ProductCategory {
  COFFEE = "Coffee",
  FOOD = "Food",
  DESSERT = "Dessert",
}

export type Products = Database["public"]["Tables"]["products"]["Row"];
