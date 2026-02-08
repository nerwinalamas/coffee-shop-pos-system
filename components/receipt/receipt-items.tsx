import { TransactionWithItems } from "@/types/transactions.types";
import ReceiptItem from "./receipt-item";

interface ReceiptItemsProps {
  transaction: TransactionWithItems;
}

const ReceiptItems = ({ transaction }: ReceiptItemsProps) => {
  const items = transaction.transaction_items || [];

  return (
    <div className="mb-4">
      <div className="font-bold text-sm mb-2 pb-1 border-b-2 border-black">
        ITEMS
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <ReceiptItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ReceiptItems;
