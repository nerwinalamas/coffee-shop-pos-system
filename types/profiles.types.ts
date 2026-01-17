import { Database } from "./supabase";

export type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
