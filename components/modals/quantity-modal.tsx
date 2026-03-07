"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useOrderStore } from "@/store/order";

interface QuantityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  quantity: number;
  maxQuantity: number;
}

const QuantityModal = ({
  open,
  onOpenChange,
  id,
  name,
  quantity,
  maxQuantity,
}: QuantityModalProps) => {
  const { updateQuantity, removeItem } = useOrderStore();
  const [inputValue, setInputValue] = useState(String(quantity));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInputValue(String(quantity));
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [open, quantity]);

  const handleConfirm = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateQuantity(id, Math.min(parsed, maxQuantity));
    } else if (!isNaN(parsed) && parsed <= 0) {
      removeItem(id);
    }
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Quantity</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2 truncate">{name}</p>
        <div className="space-y-1">
          <Input
            ref={inputRef}
            type="number"
            min={1}
            max={maxQuantity}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-center text-lg font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            Max: {maxQuantity}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityModal;
