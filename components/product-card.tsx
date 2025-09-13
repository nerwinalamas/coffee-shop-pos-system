"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";
import ReusableImage from "@/components/reusable-image";
import { useOrderStore } from "@/store/order";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useOrderStore((state) => state.addItem);

  const handleAddToOrder = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="p-2 aspect-square flex flex-col justify-between bg-white border rounded-lg">
      <ReusableImage
        src={product.image}
        alt={product.name}
        className="w-full h-2/3 mb-2"
        priority={product.id <= 4} // Prioritize first 4 images
        fallbackText={product.name}
      />
      <div className="text-sm font-medium">{product.name}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </div>
        <Button onClick={() => handleAddToOrder(product)}>Add</Button>
      </div>
    </div>
  );
};

export default ProductCard;
