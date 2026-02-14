"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  image: z.string().min(1, "Image is required"),
  category: z.string().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  handleCancel: () => void;
  submitLabel: string;
  submitLoadingLabel: string;
  onImageUpload: (file: File) => Promise<string>;
  initialImageUrl?: string;
}

const ProductForm = ({
  form,
  onSubmit,
  handleCancel,
  submitLabel,
  submitLoadingLabel,
  onImageUpload,
  initialImageUrl,
}: ProductFormProps) => {
  const isSubmitting = form.formState.isSubmitting;
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    } else {
      setImagePreview("");
    }
  }, [initialImageUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      form.setError("image", { message: "Please select a valid image file" });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      form.setError("image", { message: "Image must be less than 5MB" });
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const imageUrl = await onImageUpload(file);
      form.setValue("image", imageUrl);
      form.clearErrors("image");
    } catch (error) {
      console.error("Image upload error:", error);
      form.setError("image", { message: "Failed to upload image" });
      setImagePreview(initialImageUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    form.setValue("image", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Enter product name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  disabled={isSubmitting}
                  placeholder="0.00"
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    if (rawValue === "" || rawValue === "0") {
                      field.onChange(0);
                      return;
                    }
                    const cleaned = rawValue.replace(/^0+/, "");
                    field.onChange(parseFloat(cleaned) || 0);
                  }}
                  value={field.value === 0 ? "" : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {!imagePreview ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting || isUploading}
                        onChange={handleImageChange}
                        className="cursor-pointer"
                      />
                      {isUploading && (
                        <Upload className="animate-pulse h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? submitLoadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
