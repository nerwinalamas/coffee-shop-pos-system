import { Database } from "./supabase";

export type Businesses = Database["public"]["Tables"]["businesses"]["Row"];
