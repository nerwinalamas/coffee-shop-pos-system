"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fallbackImage = `https://via.placeholder.com/300x300/e2e8f0/64748b?text=${encodeURIComponent(
    product.name
  )}`;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="p-2 aspect-square flex flex-col justify-between bg-white border rounded-lg">
      <div className="relative w-full h-2/3 mb-2">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-xs">Loading...</div>
          </div>
        )}
        <Image
          src={imageError ? fallbackImage : product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover rounded-lg"
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={product.id <= 4} // Prioritize first 4 images
        />
      </div>
      <div className="text-sm font-medium">{product.name}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </div>
        <Button>Add</Button>
      </div>
    </div>
  );
};

export default ProductCard;
