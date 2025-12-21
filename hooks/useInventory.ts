import { supabase } from "@/lib/supabase";
import { InventoryWithProduct } from "@/types/inventory.types";
import { useQuery } from "@tanstack/react-query";

export const useInventory = () => {
  return useQuery<InventoryWithProduct[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select(
          `
          *,
          products (
            id,
            name,
            price,
            image,
            category,
            created_at,
            updated_at
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
