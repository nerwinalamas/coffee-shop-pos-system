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

export type ActivityLogChanges = {
  old?: Record<string, unknown>;
  new?: Record<string, unknown>;
};

export type ActivityLogsWithProfile = Omit<ActivityLogs, "changes"> & {
  changes: ActivityLogChanges | null;
  profiles: Pick<Profiles, "first_name" | "last_name" | "email"> | null;
};