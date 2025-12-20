import { supabase } from "@/lib/supabase";
import { Inventory } from "@/types/inventory.types";
import { useQuery } from "@tanstack/react-query";

export const useInventory = () => {
  return useQuery<Inventory[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory").select("*");
      if (error) throw error;
      return data;
    },
  });
};
