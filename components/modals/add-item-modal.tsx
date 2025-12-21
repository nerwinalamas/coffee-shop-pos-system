"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      productId: "",
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
      // Get product details to generate SKU
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("name, category")
        .eq("id", values.productId)
        .single();

      if (productError) throw productError;

      // Generate SKU (you can customize this format)
      const sku = `${product.category
        .substring(0, 3)
        .toUpperCase()}-${product.name
        .substring(0, 3)
        .toUpperCase()}-${Date.now().toString().slice(-6)}`;

      // Insert inventory item
      const { error: insertError } = await supabase.from("inventory").insert({
        product_id: values.productId,
        sku: sku,
        quantity: values.quantity,
        reorder_level: values.reorderLevel,
      });

      if (insertError) throw insertError;

      toast.success("Inventory item added successfully");
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
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
