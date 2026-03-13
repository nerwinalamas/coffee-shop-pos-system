import { Database } from "@/types/supabase";

export type ActivityLogs = Database["public"]["Tables"]["activity_logs"]["Row"];

export type ActivityAction = "create" | "update" | "delete" | "view";
export type ActivitySubject =
  | "product"
  | "transaction"
  | "inventory"
  | "user"
  | "business"
  | "profile"
  | "other";
