"use client";

import { RefObject } from "react";
import { TransactionWithItems } from "@/types/transactions.types";
import ReceiptHeader from "./receipt/receipt-header";
import ReceiptTransactionInfo from "./receipt/receipt-transaction-info";
import ReceiptFooter from "./receipt/receipt-footer";
import ReceiptSummary from "./receipt/receipt-summary";
import ReceiptItems from "./receipt/receipt-items";
import Dash from "./receipt/dash";
import { Businesses } from "@/types/businesses.types";

interface ReceiptProps {
  transaction: TransactionWithItems;
  receiptRef?: RefObject<HTMLDivElement | null>;
  business: Businesses | null;
}

const Receipt = ({ transaction, receiptRef, business }: ReceiptProps) => {
  return (
    <div
      ref={receiptRef}
      className="p-8 max-w-[80mm] mx-auto bg-white text-black"
    >
      <ReceiptHeader business={business} />
      <Dash />
      <ReceiptTransactionInfo transaction={transaction} />
      <Dash />
      <ReceiptItems transaction={transaction} />
      <Dash />
      <ReceiptSummary transaction={transaction} />
      <Dash />
      <ReceiptFooter />
    </div>
  );
};

export default Receipt;
