"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductImage, Products } from "@/types/product.types";
import ProductForm, {
  ProductFormValues,
  productSchema,
} from "../../forms/product-form";
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
import { useProfile } from "@/hooks/useProfile";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { uploadProductImage } from "@/lib/upload-product-image";

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
  const { data: profile } = useProfile();
  const { log } = useActivityLogger();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: null,
      category: "",
    },
  });

  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name,
        price: product.price,
        image: product.image ?? null,
        category: product.category,
      });
    }
  }, [product, open, form]);

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const handleImageUpload = async (file: File): Promise<ProductImage> => {
    if (!profile?.business_id) throw new Error("No business ID");
    return uploadProductImage({
      supabase,
      file,
      businessId: profile.business_id,
      previousImageUrl: product?.image?.url,
    });
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!product) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: values.name,
          price: values.price,
          category: values.category,
          image: values.image,
        })
        .eq("id", product.id)
        .select()
        .single();

      if (error) throw error;

      await log({
        action: "update",
        subject: "product",
        entityId: product.id,
        entityName: data.name,
        changes: {
          old: {
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image?.url ?? null,
          },
          new: {
            name: data.name,
            price: data.price,
            category: data.category,
            image: (data.image as ProductImage | null)?.url ?? null,
          },
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["products"] });
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
          initialImage={product?.image ?? null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
