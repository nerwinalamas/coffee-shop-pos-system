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
