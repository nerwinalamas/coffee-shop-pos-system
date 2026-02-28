"use client";

import { motion } from "framer-motion";
import ReusableImage from "@/components/reusable-image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useOrderStore } from "@/store/order";

interface OrderItemsProps {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
}

const OrderItems = ({
  id,
  imageUrl,
  name,
  price,
  quantity,
  maxQuantity,
}: OrderItemsProps) => {
  const { updateQuantity, removeItem } = useOrderStore();

  const handleIncrement = () => updateQuantity(id, quantity + 1);
  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" as const }}
      className="flex justify-between items-center text-sm"
    >
      <div className="flex items-center gap-2">
        <ReusableImage
          src={imageUrl}
          alt={name}
          className="w-14 h-14"
          fallbackText={name}
          priority
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm">{name}</span>
          <span className="font-semibold text-base">${price.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          className="rounded-full"
          variant="outline"
          onClick={handleDecrement}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="font-semibold min-w-[20px] text-center">
          {quantity}
        </span>
        <Button
          size="icon"
          className="rounded-full"
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default OrderItems;
