import { createClient } from "@/lib/supabase/client";
import { TransactionWithItems } from "@/types/transactions.types";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const supabase = createClient();

  return useQuery<TransactionWithItems[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          transaction_items (*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
