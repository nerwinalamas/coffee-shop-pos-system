import { createClient } from "@/lib/supabase/client";
import { Products } from "@/types/product.types";
import { useQuery } from "@tanstack/react-query";

export const useProductsWithoutInventory = () => {
  const supabase = createClient();

  return useQuery<Products[]>({
    queryKey: ["products-without-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          inventory ( id )
        `,
        )
        .order("name");

      if (error) throw error;

      return (data ?? []).filter((product) => product.inventory.length === 0);
    },
  });
};
