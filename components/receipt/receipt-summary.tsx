import { TransactionWithItems } from "@/types/transactions.types";

interface ReceiptSummaryProps {
  transaction: TransactionWithItems;
}

const ReceiptSummary = ({ transaction }: ReceiptSummaryProps) => {
  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>${transaction.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax ({(transaction.tax_rate * 100).toFixed(2)}%):</span>
        <span>${transaction.tax_amount.toFixed(2)}</span>
      </div>
      <div className="border-t-2 border-black my-2"></div>
      <div className="flex justify-between text-lg font-bold">
        <span>TOTAL:</span>
        <span>${transaction.total_amount.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ReceiptSummary;
