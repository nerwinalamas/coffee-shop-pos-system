import { TransactionWithItems } from "@/types/transactions.types";

interface ReceiptTransactionInfoProps {
  transaction: TransactionWithItems;
}

const ReceiptTransactionInfo = ({
  transaction,
}: ReceiptTransactionInfoProps) => {
  const transactionDate = transaction.created_at
    ? new Date(transaction.created_at)
    : null;

  const cashierName = transaction.cashier
    ? `${transaction.cashier.first_name} ${transaction.cashier.last_name}`
    : "Unknown";

  return (
    <div className="mb-4 text-sm">
      <div className="flex justify-between">
        <span>Transaction #:</span>
        <span className="font-bold">{transaction.transaction_number}</span>
      </div>
      <div className="flex justify-between">
        <span>Date:</span>
        <span>
          {transactionDate
            ? transactionDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Customer:</span>
        <span>{transaction.customer_name || "Walk-in Customer"}</span>
      </div>
      <div className="flex justify-between">
        <span>Cashier:</span>
        <span>{cashierName}</span>
      </div>
      <div className="flex justify-between">
        <span>Payment:</span>
        <span>{transaction.payment_method}</span>
      </div>
    </div>
  );
};

export default ReceiptTransactionInfo;
