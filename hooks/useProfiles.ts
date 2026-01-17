import { createClient } from "@/lib/supabase/client";
import { Profiles } from "@/types/profiles.types";
import { useQuery } from "@tanstack/react-query";

export const useProfiles = () => {
  const supabase = createClient();

  return useQuery<Profiles[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });
};
