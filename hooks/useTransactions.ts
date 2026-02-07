import { createClient } from "@/lib/supabase/client";
import { Transactions } from "@/types/transactions.types";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const supabase = createClient();

  return useQuery<Transactions[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*");
      if (error) throw error;
      return data;
    },
  });
};
