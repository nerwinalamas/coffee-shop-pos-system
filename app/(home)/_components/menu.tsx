"use client";

import { useState, useMemo } from "react";
import { useProductsWithInventory } from "@/hooks/useProductsWithInventory";
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

    // Reset to first page when filters change
    setCurrentPage(0);

    return filtered;
  }, [products, selectedCategory, searchQuery]);

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
