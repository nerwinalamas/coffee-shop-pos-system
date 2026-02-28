"use client";

import { useState, useMemo } from "react";
import { useProductsWithInventory } from "@/hooks/useProductsWithInventory";
import { ProductCategory } from "@/types/product.types";
import SearchInput from "@/components/search-input";
import CategoryTabs from "./category-tabs";
import MenuItems from "./menu-items";
import AvailabilityFilter from "./availability-filter";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface MenuProps {
  posUser: { name: string; role: string };
  onSignOut: () => void;
}

const Menu = ({ posUser, onSignOut }: MenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "All" | "Available" | "Out of Stock"
  >("Available");

  const { data: products, isLoading, error } = useProductsWithInventory();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by availability
    if (availabilityFilter !== "All") {
      filtered = filtered.filter((product) => {
        const inventory = Array.isArray(product.inventory)
          ? product.inventory[0]
          : product.inventory;

        if (availabilityFilter === "Available") {
          return (
            inventory?.status === "In Stock" ||
            inventory?.status === "Low Stock"
          );
        } else {
          // Out of Stock
          return inventory?.status === "Out of Stock" || !inventory;
        }
      });
    }

    // Sort: Available items first, then out of stock
    filtered = filtered.sort((a, b) => {
      const inventoryA = Array.isArray(a.inventory)
        ? a.inventory[0]
        : a.inventory;
      const inventoryB = Array.isArray(b.inventory)
        ? b.inventory[0]
        : b.inventory;

      const isAvailableA =
        inventoryA?.status === "In Stock" || inventoryA?.status === "Low Stock";
      const isAvailableB =
        inventoryB?.status === "In Stock" || inventoryB?.status === "Low Stock";

      // Available items (true) come before unavailable (false)
      if (isAvailableA && !isAvailableB) return -1;
      if (!isAvailableA && isAvailableB) return 1;
      return 0;
    });

    // Reset to first page when filters change
    setCurrentPage(0);

    return filtered;
  }, [products, selectedCategory, searchQuery, availabilityFilter]);

  if (isLoading) {
    return (
      <div className="col-span-12 md:col-span-8 xl:col-span-9 bg-white rounded-lg shadow-sm h-full p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 md:col-span-8 xl:col-span-9 bg-white rounded-lg shadow-sm h-full p-4 flex items-center justify-center">
        <div className="text-red-500">
          Error loading products. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 md:col-span-8 xl:col-span-9 bg-white rounded-lg shadow-sm h-full p-4 space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm font-medium text-gray-900">{posUser.name}</p>
          <p className="text-xs text-muted-foreground">{posUser.role}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-500 hover:text-red-600"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CategoryTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="flex items-center gap-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <AvailabilityFilter
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
          />
        </div>
      </div>

      <MenuItems
        data={filteredProducts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Menu;
