"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionWithItems } from "@/types/transactions.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ViewTransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionWithItems | null;
}

const ViewTransactionDetailsModal = ({
  open,
  onOpenChange,
  transaction,
}: ViewTransactionDetailsModalProps) => {
  if (!transaction) return null;

  const transactionDate = transaction.created_at
    ? new Date(transaction.created_at)
    : null;
  const items = transaction.transaction_items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information for transaction{" "}
            {transaction.transaction_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Header */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-semibold">
                  {transaction.transaction_number}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {transactionDate
                    ? transactionDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date not available"}
                </p>
              </div>
              <Badge
                variant={
                  transaction.status === "Completed"
                    ? "default"
                    : transaction.status === "Pending"
                      ? "secondary"
                      : "destructive"
                }
                className="rounded-full"
              >
                {transaction.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Customer & Payment Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Customer & Payment
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="text-base font-medium">
                  {transaction.customer_name || "Walk-in Customer"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="text-base font-medium">
                  {transaction.payment_method}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction Items */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Items ({items.length})
            </h4>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No items found for this transaction
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-3 rounded-lg border bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Transaction Summary */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${transaction.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">
                  Tax {(transaction.tax_rate * 100)}%
                </span>
                <span className="font-medium">
                  ${transaction.tax_amount.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold">
                  ${transaction.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTransactionDetailsModal;
