import { Database } from "./supabase";

export type Transactions = Database["public"]["Tables"]["transactions"]["Row"];
