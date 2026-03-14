import { useProfile } from "@/hooks/useProfile";
import { logActivity } from "@/lib/activity-logger";
import { ActivityAction, ActivitySubject } from "@/types/activity-logs.types";
import { useQueryClient } from "@tanstack/react-query";

interface LogParams {
  action: ActivityAction;
  subject: ActivitySubject;
  entityId?: string;
  entityName?: string;
  changes?: { old?: Record<string, unknown>; new?: Record<string, unknown> };
}

export function useActivityLogger() {
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  const log = async (params: LogParams) => {
    if (!profile?.business_id || !profile?.id) {
      console.warn("[useActivityLogger] Missing profile data");
      return;
    }

    await logActivity({
      ...params,
      businessId: profile.business_id,
      userId: profile.id,
      queryClient,
    });
  };

  return { log };
}
