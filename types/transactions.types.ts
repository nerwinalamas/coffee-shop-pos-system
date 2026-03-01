import { Database } from "./supabase";
import { TransactionItems } from "./transaction-items.types";
import { Profiles } from "./profiles.types";

export type Transactions = Database["public"]["Tables"]["transactions"]["Row"];

type TransactionCashier = Pick<Profiles, "first_name" | "last_name" | "role">;

export type TransactionWithItems = Transactions & {
  transaction_items: TransactionItems[];
  cashier: TransactionCashier | null;
};
