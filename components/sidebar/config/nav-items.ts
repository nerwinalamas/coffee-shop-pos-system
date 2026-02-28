// config/nav-items.ts
import {
  Home,
  ShoppingBag,
  Package,
  User2,
  Receipt,
  BarChart2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Products", url: "/products", icon: ShoppingBag },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Transaction History", url: "/transactions", icon: Receipt },
  { title: "Sales Reports", url: "/sales", icon: BarChart2 },
  { title: "Users", url: "/users", icon: User2 },
];
