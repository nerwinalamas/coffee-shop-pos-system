import { createClient } from "@/lib/supabase/client";
import { ProductWithInventory } from "@/types/product.types";
import { useQuery } from "@tanstack/react-query";

export const useProductsWithInventory = () => {
  const supabase = createClient();

  return useQuery<ProductWithInventory[]>({
    queryKey: ["products-with-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select(`
          *,
          inventory (
            quantity,
            status
          )
        `);
      if (error) throw error;
      return data;
    },
  });
};
