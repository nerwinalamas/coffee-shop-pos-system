"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { InventoryItem } from "@/types/inventory.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const restockSchema = z.object({
  addQuantity: z.number().min(1, "Please add at least 1 item"),
});

export type RestockFormValues = z.infer<typeof restockSchema>;

interface RestockFormProps {
  form: UseFormReturn<RestockFormValues>;
  onSubmit: (values: RestockFormValues) => Promise<void> | void;
  handleCancel: () => void;
  submitLabel: string;
  submitLoadingLabel: string;
  item: InventoryItem;
  newTotal: number;
}

const RestockForm = ({
  form,
  onSubmit,
  handleCancel,
  submitLabel,
  submitLoadingLabel,
  item,
  newTotal,
}: RestockFormProps) => {
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Stock:</span>
            <span className="font-medium">{item.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reorder Level:</span>
            <span className="font-medium">{item.reorderLevel}</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="addQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Quantity</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  disabled={isSubmitting}
                  placeholder="Enter quantity to add"
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">New Total:</span>
            <span className="text-2xl font-bold">{newTotal}</span>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 justify-end pt-2">
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

export default RestockForm;
