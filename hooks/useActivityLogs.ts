import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ActivityLogsWithProfile } from "@/types/activity-logs.types";

export const useActivityLogs = () => {
  const supabase = createClient();

  return useQuery<ActivityLogsWithProfile[]>({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(
          `
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `,
        )
        .not("user_id", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
