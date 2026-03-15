import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SalesTargetData } from "@/hooks/useDashboardData";

export const useSalesTarget = (year: number, month: number) => {
  const supabase = createClient();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const isCurrentMonth = year === currentYear && month === currentMonth;

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  return useQuery<SalesTargetData | null>({
    queryKey: ["sales-target", year, month],
    // Skip kung current month — handled na ng useDashboardData
    enabled: !isCurrentMonth,
    queryFn: async () => {
      const [targetRow, revenueTx] = await Promise.all([
        // Target mula sa sales_targets table
        supabase
          .from("sales_targets")
          .select("id, month, target_amount")
          .eq("month", monthKey)
          .maybeSingle(),

        // Actual revenue mula sa transactions
        supabase
          .from("transactions")
          .select("total_amount")
          .eq("status", "Completed")
          .gte("created_at", monthStart.toISOString())
          .lt("created_at", monthEnd.toISOString()),
      ]);

      if (!targetRow.data) return null;

      const currentRevenue =
        revenueTx.data?.reduce((sum, t) => sum + (t.total_amount ?? 0), 0) ?? 0;

      const targetAmount = targetRow.data.target_amount;
      const progressPercent =
        targetAmount > 0
          ? Math.min(100, Math.round((currentRevenue / targetAmount) * 100))
          : 0;

      return {
        id: targetRow.data.id,
        month: targetRow.data.month,
        targetAmount,
        currentRevenue,
        progressPercent,
        remaining: Math.max(0, targetAmount - currentRevenue),
        isAchieved: currentRevenue >= targetAmount,
      };
    },
    // Past months ay hindi na magbabago — cache forever
    staleTime: Infinity,
    refetchInterval: false,
  });
};
