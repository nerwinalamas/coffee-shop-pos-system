import { ProductCategory } from "@/types/product.types";

export const CATEGORIES = [
  "All",
  ProductCategory.COFFEE,
  ProductCategory.FOOD,
  ProductCategory.DESSERT,
] as const;
