"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InventoryItem } from "@/types/inventory.types";
import RestockForm, {
  RestockFormValues,
  restockSchema,
} from "../forms/restock-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

const RestockModal = ({ open, onOpenChange, item }: RestockModalProps) => {
  const form = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      addQuantity: 0,
    },
  });

  const addQuantity = form.watch("addQuantity") || 0;
  const newTotal = (item?.quantity || 0) + addQuantity;

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: RestockFormValues) => {
    if (!item) return;

    try {
      console.log("Restocking item:", {
        itemId: item.id,
        sku: item.sku,
        previousQuantity: item.quantity,
        addQuantity: values.addQuantity,
        newQuantity: newTotal,
      });

      // TODO: Replace with your actual API call
      // await restockInventoryItem(item.id, values.addQuantity);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Successfully restocked ${item.productName}`);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Restock error:", error);
      toast.error("Failed to restock item. Please try again.");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restock Item</DialogTitle>
          <DialogDescription>
            Add stock for {item.productName}
          </DialogDescription>
        </DialogHeader>
        <RestockForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Restock"
          submitLoadingLabel="Restocking..."
          item={item}
          newTotal={newTotal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RestockModal;
