import { Database } from "@/types/supabase";
import { Profiles } from "./profiles.types";

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

export type ActivityLogsWithProfile = ActivityLogs & {
  profiles: Pick<Profiles, "first_name" | "last_name" | "email"> | null;
};
