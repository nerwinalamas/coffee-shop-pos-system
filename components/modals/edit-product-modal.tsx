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
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();
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

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // Delete old image if exists
      if (product?.image) {
        const oldImagePath = product.image.split("/").pop();
        if (oldImagePath) {
          await supabase.storage.from("product_images").remove([oldImagePath]);
        }
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product_images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product_images").getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
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
          onImageUpload={handleImageUpload}
          initialImageUrl={product?.image || ""}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
