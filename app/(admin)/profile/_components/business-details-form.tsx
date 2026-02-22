"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  updateBusiness,
  type BusinessFormData,
} from "@/actions/business-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .nullable(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .nullable(),
});

type BusinessDetailsFormProps = {
  business: BusinessFormData;
};

export function BusinessDetailsForm({ business }: BusinessDetailsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business.name ?? "",
      address: business.address ?? "",
      phone: business.phone ?? "",
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    startTransition(async () => {
      const result = await updateBusiness(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Business details updated successfully");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Brewhaus Coffee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St, City"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="(02) 8123-4567"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
