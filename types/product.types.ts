export type ProductCategory = "Coffee" | "Food" | "Dessert";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
};
