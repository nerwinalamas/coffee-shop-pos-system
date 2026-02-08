import React from "react";
import { TransactionItems } from "@/types/transaction-items.types";

interface ReceiptItemProps {
  item: TransactionItems;
}

const ReceiptItem = ({ item }: ReceiptItemProps) => {
  return (
    <div key={item.id} className="text-sm">
      {/* Product name */}
      <div className="font-semibold">{item.product_name}</div>

      {/* Quantity, Price, and Total on one line */}
      <div className="flex justify-between text-xs text-gray-700 mt-1">
        <span>
          {item.quantity} x ${item.product_price.toFixed(2)}
        </span>
        <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
      </div>

      {/* Divider between items */}
      <div className="border-b border-dashed border-gray-400 mt-2"></div>
    </div>
  );
};

export default ReceiptItem;
