"use client";

import { useState, useMemo } from "react";
import { useInventory } from "@/hooks/useInventory";
import { ProductCategory } from "@/types/product.types";
import SearchInput from "@/components/search-input";
import CategoryTabs from "./category-tabs";
import MenuItems from "./menu-items";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const { data: inventory, isLoading, error } = useInventory();

  const filteredProducts = useMemo(() => {
    if (!inventory) return [];

    let filtered = inventory;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (item) => item.products?.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.products?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Reset to first page when filters change
    setCurrentPage(0);

    return filtered;
  }, [inventory, selectedCategory, searchQuery]);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CategoryTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
