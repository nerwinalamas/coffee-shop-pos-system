"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Products } from "@/types/product.types";
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

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Products | null;
}

const EditProductModal = ({
  open,
  onOpenChange,
  product,
}: EditProductModalProps) => {
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

  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name,
        price: product.price,
        image: product.image || "",
        category: product.category,
      });
    }
  }, [product, open, form]);

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!product) return;

    try {
      const { error } = await supabase
        .from("products")
        .update(values)
        .eq("id", product.id)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Edit product error:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update the product information</DialogDescription>
        </DialogHeader>
        <ProductForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Update Product"
          submitLoadingLabel="Updating Product..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
