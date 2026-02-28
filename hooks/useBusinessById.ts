import { createClient } from "@/lib/supabase/client";
import { Businesses } from "@/types/businesses.types";
import { useQuery } from "@tanstack/react-query";

export const useBusinessById = (businessId: string | undefined) => {
  const supabase = createClient();

  return useQuery<Businesses>({
    queryKey: ["business", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });
};
