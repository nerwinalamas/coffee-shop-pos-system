import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type ReportPreset =
  | "today"
  | "this_week"
  | "this_month"
  | "last_month"
  | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SalesReportItem {
  product_name: string;
  quantity: number;
  subtotal: number;
}

export interface SalesReportRow {
  id: string;
  transaction_number: string;
  created_at: string;
  customer_name: string | null;
  items: SalesReportItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  status: string;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalTax: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  byPaymentMethod: Record<string, number>;
}

export interface SalesReport {
  rows: SalesReportRow[];
  summary: SalesReportSummary;
  dateRange: DateRange;
}

export function getPresetDateRange(preset: ReportPreset): DateRange {
  const now = new Date();

  switch (preset) {
    case "today": {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "this_week": {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "this_month": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "last_month": {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    default: {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
  }
}

interface TransactionRow {
  id: string;
  transaction_number: string;
  created_at: string;
  customer_name: string | null;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  status: string;
  transaction_items: {
    product_name: string;
    quantity: number;
    subtotal: number;
  }[];
}

export const useSalesReport = (dateRange: DateRange) => {
  const supabase = createClient();

  return useQuery<SalesReport>({
    queryKey: [
      "sales-report",
      dateRange.from.toISOString(),
      dateRange.to.toISOString(),
    ],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          transaction_number,
          created_at,
          customer_name,
          subtotal,
          tax_amount,
          total_amount,
          payment_method,
          status,
          transaction_items (
            product_name,
            quantity,
            subtotal
          )
        `,
        )
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: false })
        .returns<TransactionRow[]>();

      if (error) throw error;

      const rows: SalesReportRow[] = (data ?? []).map((tx) => ({
        id: tx.id,
        transaction_number: tx.transaction_number,
        created_at: tx.created_at,
        customer_name: tx.customer_name,
        items: tx.transaction_items ?? [],
        subtotal: tx.subtotal ?? 0,
        tax_amount: tx.tax_amount ?? 0,
        total_amount: tx.total_amount ?? 0,
        payment_method: tx.payment_method,
        status: tx.status,
      }));

      // Summary
      const completedRows = rows.filter((r) => r.status === "Completed");
      const totalRevenue = completedRows.reduce(
        (s, r) => s + r.total_amount,
        0,
      );
      const totalTax = completedRows.reduce((s, r) => s + r.tax_amount, 0);
      const avgOrderValue =
        completedRows.length > 0 ? totalRevenue / completedRows.length : 0;

      const byPaymentMethod: Record<string, number> = {};
      completedRows.forEach((r) => {
        byPaymentMethod[r.payment_method] =
          (byPaymentMethod[r.payment_method] ?? 0) + r.total_amount;
      });

      const summary: SalesReportSummary = {
        totalRevenue,
        totalOrders: rows.length,
        avgOrderValue,
        totalTax,
        completedOrders: completedRows.length,
        pendingOrders: rows.filter((r) => r.status === "Pending").length,
        cancelledOrders: rows.filter((r) => r.status === "Cancelled").length,
        byPaymentMethod,
      };

      return { rows, summary, dateRange };
    },
    staleTime: 30_000,
  });
};
