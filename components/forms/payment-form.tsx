"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useOrderStore } from "@/store/order";

export const paymentSchema = z.object({
  customer_name: z.string().optional(),
  payment_method: z.enum(["Cash", "Credit Card", "Debit Card", "E-Wallet"]),
  promo_code: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  form: UseFormReturn<PaymentFormValues>;
  onSubmit: (values: PaymentFormValues) => Promise<void> | void;
  handleCancel: () => void;
  subtotal: number;
  tax: number;
  total: number;
  submitLabel: string;
  submitLoadingLabel: string;
}

const PaymentForm = ({
  form,
  onSubmit,
  handleCancel,
  subtotal,
  tax,
  total,
  submitLabel,
  submitLoadingLabel,
}: PaymentFormProps) => {
  const supabase = createClient();
  const { data: profile } = useProfile();
  const { promo, applyPromo, removePromo } = useOrderStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const isSubmitting = form.formState.isSubmitting;

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    setPromoError("");
    setIsValidating(true);

    const { data, error } = await supabase
      .from("promo_codes")
      .select("code, type, value, min_order")
      .eq("business_id", profile?.business_id)
      .eq("code", code)
      .eq("is_active", true)
      .single();

    setIsValidating(false);

    if (error || !data) {
      setPromoError("Invalid or expired promo code.");
      return;
    }

    if (subtotal < (data.min_order ?? 0)) {
      setPromoError(
        `Minimum order of $${data.min_order.toFixed(2)} required for this code.`,
      );
      return;
    }

    applyPromo(data.code, data.type as "percentage" | "fixed", data.value);
    form.setValue("promo_code", data.code);
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoInput("");
    setPromoError("");
    form.setValue("promo_code", undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Enter customer name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cash" className="cursor-pointer">
                    Cash
                  </SelectItem>
                  <SelectItem value="Credit Card" className="cursor-pointer">
                    Credit Card
                  </SelectItem>
                  <SelectItem value="Debit Card" className="cursor-pointer">
                    Debit Card
                  </SelectItem>
                  <SelectItem value="E-Wallet" className="cursor-pointer">
                    E-Wallet
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Promo Code</FormLabel>
          {promo.promoCode ? (
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-green-700 bg-green-50">
                {promo.promoCode} —{" "}
                {promo.discountType === "percentage"
                  ? `${promo.discountValue}% off`
                  : `$${promo.discountValue.toFixed(2)} off`}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive h-auto py-0.5 cursor-pointer"
                onClick={handleRemovePromo}
                disabled={isSubmitting}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value.toUpperCase());
                  setPromoError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyPromo();
                  }
                }}
                placeholder="Enter code"
                disabled={isSubmitting}
                className={promoError ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyPromo}
                disabled={isSubmitting || isValidating || !promoInput.trim()}
                className="cursor-pointer"
              >
                {isValidating ? "Checking..." : "Apply"}
              </Button>
            </div>
          )}
          {promoError && (
            <p className="text-xs text-destructive mt-1">{promoError}</p>
          )}
        </FormItem>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {promo.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({promo.promoCode})</span>
              <span>-${promo.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tax 12%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? submitLoadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
