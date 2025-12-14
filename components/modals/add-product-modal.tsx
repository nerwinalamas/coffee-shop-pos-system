"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductForm, {
  ProductFormValues,
  productSchema,
} from "../forms/product-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProductModal = ({ open, onOpenChange }: AddProductModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: "",
      category: "",
    },
  });

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const { error } = await supabase
        .from("products")
        .insert([values])
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Add product error:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Add Product"
          submitLoadingLabel="Adding Product..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
