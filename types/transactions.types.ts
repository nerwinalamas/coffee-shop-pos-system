import { Database } from "./supabase";
import { TransactionItems } from "./transaction-items.types";

export type Transactions = Database["public"]["Tables"]["transactions"]["Row"];

export type TransactionWithItems = Transactions & {
  transaction_items: TransactionItems[];
};
