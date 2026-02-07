"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PaymentForm, {
  PaymentFormValues,
  paymentSchema,
} from "../forms/payment-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrderStore } from "@/store/order";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentModal = ({ open, onOpenChange }: PaymentModalProps) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { items, subtotal, tax, total, clearOrder } = useOrderStore();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customer_name: "",
      payment_method: "Cash",
    },
  });

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: PaymentFormValues) => {
    if (items.length === 0) return;

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // 1. Insert transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          customer_name: values.customer_name || null,
          subtotal: subtotal,
          payment_method: values.payment_method,
          status: "Completed",
          user_id: user.id,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // 2. Insert transaction items
      const itemsToInsert = items.map((item) => ({
        transaction_id: transaction.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("transaction_items")
        .insert(itemsToInsert);

      if (itemsError) {
        // Rollback transaction
        await supabase.from("transactions").delete().eq("id", transaction.id);
        throw itemsError;
      }

      // 3. Update inventory quantities
      for (const item of items) {
        const { data: inventory, error: inventoryFetchError } = await supabase
          .from("inventory")
          .select("quantity")
          .eq("product_id", item.id)
          .single();

        if (inventoryFetchError) {
          console.error("Inventory fetch error:", inventoryFetchError);
          continue;
        }

        const newQuantity = inventory.quantity - item.quantity;

        const { error: inventoryUpdateError } = await supabase
          .from("inventory")
          .update({ quantity: Math.max(0, newQuantity) })
          .eq("product_id", item.id);

        if (inventoryUpdateError) {
          console.error("Inventory update error:", inventoryUpdateError);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(
        `Transaction ${transaction.transaction_number} completed successfully!`,
      );
      clearOrder();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to complete payment. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Enter customer details and select payment method
          </DialogDescription>
        </DialogHeader>
        <PaymentForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          subtotal={subtotal}
          tax={tax}
          total={total}
          submitLabel="Confirm Payment"
          submitLoadingLabel="Processing..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
