"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ItemForm, { ItemFormValues, itemSchema } from "../forms/item-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddItemModal = ({ open, onOpenChange }: AddItemModalProps) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      productId: 0,
      quantity: 0,
      reorderLevel: 0,
    },
  });

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: ItemFormValues) => {
    try {
      // TODO: Replace with your actual API call
      console.log("Adding inventory:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Inventory item added successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Add inventory item error:", error);
      toast.error("Failed to add inventory item. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Add a new item to your inventory
          </DialogDescription>
        </DialogHeader>
        <ItemForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Add Item"
          submitLoadingLabel="Adding Item..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
