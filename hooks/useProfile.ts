"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/types/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useProfile = () => {
  const supabase = createClient();

  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};
