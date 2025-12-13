import { supabase } from "@/lib/supabase";
import { Products } from "@/types/product.types";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery<Products[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });
};
