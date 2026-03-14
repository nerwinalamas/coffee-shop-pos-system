import { createClient } from "@/lib/supabase/client";
import { ActivityAction, ActivitySubject } from "@/types/activity-logs.types";
import { QueryClient } from "@tanstack/react-query";

interface LogActivityParams {
  action: ActivityAction;
  subject: ActivitySubject;
  entityId?: string;
  entityName?: string;
  changes?: { old?: Record<string, unknown>; new?: Record<string, unknown> };
  businessId: string;
  userId: string;
  queryClient: QueryClient;
}

export async function logActivity({
  action,
  subject,
  entityId,
  entityName,
  changes,
  businessId,
  userId,
  queryClient,
}: LogActivityParams) {
  const supabase = createClient();

  const { error } = await supabase.from("activity_logs").insert({
    action,
    subject,
    entity_id: entityId,
    entity_name: entityName,
    changes,
    business_id: businessId,
    user_id: userId,
  });

  if (error) {
    console.error("[logActivity] Failed to log activity:", error.message);
  }

  await queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
}
