"use client";

import { AnimatePresence } from "framer-motion";
import { ProductWithInventory } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

interface MenuItemsProps {
  data: ProductWithInventory[] | undefined;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const MenuItems = ({ data, currentPage, setCurrentPage }: MenuItemsProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-center text-sm py-8">
        <p>No products found.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentData = data.slice(startIndex, endIndex);

  const goToPreviousPage = () => setCurrentPage(Math.max(0, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        <AnimatePresence mode="popLayout">
          {currentData.map((product) => {
            let isOutOfStock = true;

            if (product.inventory) {
              if (Array.isArray(product.inventory)) {
                isOutOfStock =
                  product.inventory.length === 0 ||
                  product.inventory[0]?.quantity === 0;
              } else {
                isOutOfStock = product.inventory.quantity === 0;
              }
            }

            return (
              <ProductCard
                key={product.id}
                product={product}
                isOutOfStock={isOutOfStock}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
