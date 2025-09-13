import ReusableImage from "@/components/reusable-image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useOrderStore } from "@/store/order";

interface OrderItemsProps {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

const OrderItems = ({
  id,
  imageUrl,
  name,
  price,
  quantity,
}: OrderItemsProps) => {
  const { updateQuantity, removeItem } = useOrderStore();

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

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
        <Button size="icon" className="rounded-full" onClick={handleIncrement}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OrderItems;
