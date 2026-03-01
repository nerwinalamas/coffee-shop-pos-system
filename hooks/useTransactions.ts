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
            transaction_items (*),
            cashier:profiles!transactions_user_id_fkey (
              first_name,
              last_name,
              role
            )
          `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
