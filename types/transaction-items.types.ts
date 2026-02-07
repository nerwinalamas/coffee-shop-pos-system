import { Database } from "./supabase";

export type TransactionItems =
  Database["public"]["Tables"]["transaction_items"]["Row"];
