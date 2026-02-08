"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionWithItems } from "@/types/transactions.types";
import Receipt from "@/components/receipt";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";

interface PrintReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionWithItems | null;
}

const PrintReceiptModal = ({
  open,
  onOpenChange,
  transaction,
}: PrintReceiptModalProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${transaction?.transaction_number}`,
  });

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Print Receipt</DialogTitle>
          <DialogDescription>
            Preview and print receipt for {transaction.transaction_number}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto border rounded-lg">
          <Receipt transaction={transaction} receiptRef={receiptRef} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handlePrint()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintReceiptModal;
