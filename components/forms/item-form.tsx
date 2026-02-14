"use client";

import { useState } from "react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

export const itemSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  reorderLevel: z.number().min(0, "Reorder level must be 0 or greater"),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormProps {
  form: UseFormReturn<ItemFormValues>;
  onSubmit: (values: ItemFormValues) => Promise<void> | void;
  handleCancel: () => void;
  submitLabel: string;
  submitLoadingLabel: string;
}

const ItemForm = ({
  form,
  onSubmit,
  handleCancel,
  submitLabel,
  submitLoadingLabel,
}: ItemFormProps) => {
  const isSubmitting = form.formState.isSubmitting;
  const [open, setOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Product</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={isSubmitting || isLoading}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? products?.find(
                            (product) => product.id === field.value,
                          )?.name
                        : "Select a product"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        {isLoading && (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        )}

                        {error && (
                          <div className="px-2 py-6 text-center text-sm text-destructive">
                            Error loading products. Please try again.
                          </div>
                        )}

                        {!isLoading &&
                          !error &&
                          products?.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={`${product.name} ${product.category}`}
                              onSelect={() => {
                                field.onChange(product.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === product.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {product.name} - {product.category}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isSubmitting}
                    placeholder="0"
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      if (rawValue === "" || rawValue === "0") {
                        field.onChange(0);
                        return;
                      }
                      const cleaned = rawValue.replace(/^0+/, "");
                      field.onChange(parseInt(cleaned) || 0);
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
            name="reorderLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reorder Level</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isSubmitting}
                    placeholder="0"
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      if (rawValue === "" || rawValue === "0") {
                        field.onChange(0);
                        return;
                      }
                      const cleaned = rawValue.replace(/^0+/, "");
                      field.onChange(parseInt(cleaned) || 0);
                    }}
                    value={field.value === 0 ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

export default ItemForm;
