"use client";

import { motion } from "framer-motion";
import { ProductWithInventory } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableImage from "@/components/reusable-image";
import { useOrderStore } from "@/store/order";

interface ProductCardProps {
  product: ProductWithInventory;
  isOutOfStock: boolean;
}

const ProductCard = ({ product, isOutOfStock }: ProductCardProps) => {
  const addItem = useOrderStore((state) => state.addItem);

  const inventory = Array.isArray(product.inventory)
    ? product.inventory[0]
    : product.inventory;

  const availableQty = inventory?.quantity ?? 0;

  const handleAddToOrder = () => {
    if (isOutOfStock) return;
    addItem(product, availableQty);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" as const }}
      className={`p-2 flex flex-col gap-1.5 bg-white border rounded-lg ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <div className="relative">
        <ReusableImage
          src={product.image || ""}
          alt={product.name}
          className="w-full aspect-[3/2] object-cover rounded"
          fallbackText={product.name}
        />
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <div className="text-sm font-medium line-clamp-1">{product.name}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </div>
        <Button size="sm" onClick={handleAddToOrder} disabled={isOutOfStock}>
          Add
        </Button>
      </div>
      <div className="text-xs text-gray-400">
        {isOutOfStock ? "Out of stock" : `${availableQty} available`}
      </div>
    </motion.div>
  );
};

export default ProductCard;
