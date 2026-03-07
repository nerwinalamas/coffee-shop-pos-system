import { Database } from "./supabase";

export type Notifications =
  Database["public"]["Tables"]["notifications"]["Row"];
