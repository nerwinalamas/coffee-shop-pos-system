"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/product.types";
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

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const EditProductModal = ({
  open,
  onOpenChange,
  product,
}: EditProductModalProps) => {
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
        image: product.image,
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
      // TODO: Replace with your actual API call
      console.log("Editing product:", product.id, values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
