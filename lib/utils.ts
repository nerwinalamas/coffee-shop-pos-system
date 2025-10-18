import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryVariant = (category: string) => {
  switch (category) {
    case "Coffee":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "Food":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Dessert":
      return "bg-pink-100 text-pink-800 hover:bg-pink-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getStatusVariant = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Out of Stock":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "";
  }
};
