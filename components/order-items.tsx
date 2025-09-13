import ReusableImage from "@/components/reusable-image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface OrderItemsProps {
  imageUrl: string;
  name: string;
  price: number;
}

const OrderItems = ({ imageUrl, name, price }: OrderItemsProps) => {
  return (
    <div className="flex justify-between items-center text-sm">
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
          <span className="font-semibold text-base">${price}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button size="icon" className="rounded-full">
          <Minus className="w-4 h-4" />
        </Button>
        <span className="font-semibold">1</span>
        <Button size="icon" className="rounded-full">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OrderItems;
