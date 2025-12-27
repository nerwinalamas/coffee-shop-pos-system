"use client";

import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { ProductCategory } from "@/types/product.types";
import CategoryTabs from "@/components/category-tabs";
import MenuItems from "@/components/menu-items";
import SearchInput from "@/components/search-input";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const { data: inventory, isLoading, error } = useInventory();

  // const filteredProducts = useMemo(() => {
  //   let filtered = PRODUCTS;

  //   // Filter by category
  //   if (selectedCategory !== "All") {
  //     filtered = filtered.filter(
  //       (product) => product.category === selectedCategory
  //     );
  //   }

  //   // Filter by search query
  //   if (searchQuery.trim()) {
  //     filtered = filtered.filter((product) =>
  //       product.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   setCurrentPage(0);

  //   return filtered;
  // }, [selectedCategory, searchQuery]);

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
        data={inventory}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Menu;
