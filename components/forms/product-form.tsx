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

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  image: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  handleCancel: () => void;
  submitLabel: string;
  submitLoadingLabel: string;
}

const ProductForm = ({
  form,
  onSubmit,
  handleCancel,
  submitLabel,
  submitLoadingLabel,
}: ProductFormProps) => {
  const isSubmitting = form.formState.isSubmitting;

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
                  disabled={isSubmitting}
                  placeholder="0.00"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="https://example.com/image.jpg"
                />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? submitLoadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
