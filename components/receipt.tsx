"use client";

import { TransactionWithItems } from "@/types/transactions.types";
import { RefObject } from "react";

interface ReceiptProps {
  transaction: TransactionWithItems;
  receiptRef?: RefObject<HTMLDivElement | null>;
}

const Receipt = ({ transaction, receiptRef }: ReceiptProps) => {
  const transactionDate = transaction.created_at
    ? new Date(transaction.created_at)
    : null;
  const items = transaction.transaction_items || [];

  return (
    <div
      ref={receiptRef}
      className="p-8 max-w-[80mm] mx-auto bg-white text-black"
    >
      {/* Store Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Your Store Name</h1>
        <p className="text-sm">123 Store Address</p>
        <p className="text-sm">City, State 12345</p>
        <p className="text-sm">Phone: (123) 456-7890</p>
      </div>

      <div className="border-t-2 border-dashed border-black my-4"></div>

      {/* Transaction Info */}
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
          <span>Payment:</span>
          <span>{transaction.payment_method}</span>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-black my-4"></div>

      {/* Items */}
      <div className="mb-4">
        <div className="font-bold text-sm mb-2 pb-1 border-b-2 border-black">
          ITEMS
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="text-sm">
              {/* Product name */}
              <div className="font-semibold">{item.product_name}</div>

              {/* Quantity, Price, and Total on one line */}
              <div className="flex justify-between text-xs text-gray-700 mt-1">
                <span>
                  {item.quantity} x ${item.product_price.toFixed(2)}
                </span>
                <span className="font-semibold">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>

              {/* Divider between items */}
              <div className="border-b border-dashed border-gray-400 mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-dashed border-black my-4"></div>

      {/* Totals */}
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

      <div className="border-t-2 border-dashed border-black my-4"></div>

      {/* Footer */}
      <div className="text-center text-sm mt-6">
        <p className="font-semibold">Thank you for your purchase!</p>
        <p className="mt-2">Please come again</p>
        <p className="mt-4 text-xs">
          Status: <span className="font-bold">{transaction.status}</span>
        </p>
      </div>
    </div>
  );
};

export default Receipt;
