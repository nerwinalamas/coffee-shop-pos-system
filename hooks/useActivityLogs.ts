import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ActivityLogs } from "@/types/activity-logs.types";

export const useActivityLogs = () => {
  const supabase = createClient();

  return useQuery<ActivityLogs[]>({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activity_logs").select("*");
      if (error) throw error;
      return data;
    },
  });
};
