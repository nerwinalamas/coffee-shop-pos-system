import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface SalesTrendPoint {
  date: string;
  label: string;
  sales: number;
  orders: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface RecentTransaction {
  id: string;
  transaction_number: string;
  customer_name: string | null;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface LowStockItem {
  id: string;
  sku: string;
  quantity: number;
  reorder_level: number;
  status: string;
  product: {
    id: string;
    name: string;
    image: string | null;
    category: string;
  };
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  category: string;
  image: string | null;
  total_quantity: number;
  total_revenue: number;
}

export interface DashboardStats {
  todaysSales: number;
  totalOrders: number;
  activeProducts: number;
  activeUsers: number;
  salesChangePercent: number;
  ordersChangeFromLastWeek: number;
  lowStockCount: number;
  avgOrderValue: number;
  monthlyRevenue: number;
  lastMonthRevenue: number;
  monthlyRevenueChange: number;
  pendingTransactions: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  amount: number;
  count: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  salesTrend: SalesTrendPoint[];
  categoryRevenue: CategoryRevenue[];
  recentTransactions: RecentTransaction[];
  lowStockItems: LowStockItem[];
  topProducts: TopProduct[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
  statusBreakdown: StatusBreakdown[];
}

// Local types matching what Supabase returns for joined queries
interface InventoryWithProductRow {
  id: string;
  sku: string;
  quantity: number;
  reorder_level: number;
  status: string;
  products: {
    id: string;
    name: string;
    image: string | null;
    category: string;
  } | null;
}

interface TxItemRow {
  product_id: string;
  product_name: string;
  quantity: number;
  subtotal: number;
  products: {
    category: string;
    image: string | null;
  } | null;
}

export const useDashboardData = () => {
  const supabase = createClient();

  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const now = new Date();

      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const fourteenDaysAgo = new Date(today);
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
      );

      const [
        todayTx,
        yesterdayTx,
        thisWeekTx,
        lastWeekTx,
        allProductsCount,
        inventoryLow,
        activeUsers,
        recentTx,
        thisMonthTx,
        lastMonthTx,
        pendingTx,
        last7DaysTx,
        txItems,
        thisMonthDetailTx,
      ] = await Promise.all([
        // Today's sales
        supabase
          .from("transactions")
          .select("total_amount")
          .eq("status", "Completed")
          .gte("created_at", today.toISOString()),

        // Yesterday's sales
        supabase
          .from("transactions")
          .select("total_amount")
          .eq("status", "Completed")
          .gte("created_at", yesterday.toISOString())
          .lt("created_at", today.toISOString()),

        // This week order count
        supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString()),

        // Last week order count
        supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", fourteenDaysAgo.toISOString())
          .lt("created_at", sevenDaysAgo.toISOString()),

        // Total products
        supabase.from("products").select("id", { count: "exact", head: true }),

        // Low/out of stock inventory with product info
        supabase
          .from("inventory")
          .select(
            "id, sku, quantity, reorder_level, status, products(id, name, image, category)",
          )
          .in("status", ["Low Stock", "Out of Stock"])
          .order("quantity", { ascending: true })
          .returns<InventoryWithProductRow[]>(),

        // Active users (non-owner)
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("status", "Active")
          .neq("role", "Owner"),

        // Recent 5 transactions
        supabase
          .from("transactions")
          .select(
            "id, transaction_number, customer_name, total_amount, payment_method, status, created_at",
          )
          .order("created_at", { ascending: false })
          .limit(5),

        // This month revenue
        supabase
          .from("transactions")
          .select("total_amount")
          .eq("status", "Completed")
          .gte("created_at", thisMonthStart.toISOString()),

        // Last month revenue
        supabase
          .from("transactions")
          .select("total_amount")
          .eq("status", "Completed")
          .gte("created_at", lastMonthStart.toISOString())
          .lte("created_at", lastMonthEnd.toISOString()),

        // Pending transactions count
        supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .eq("status", "Pending"),

        // Last 7 days transactions for trend
        supabase
          .from("transactions")
          .select("total_amount, created_at, status")
          .gte("created_at", sevenDaysAgo.toISOString())
          .order("created_at", { ascending: true }),

        // Transaction items for category revenue + top products
        supabase
          .from("transaction_items")
          .select(
            "product_id, product_name, quantity, subtotal, products(category, image)",
          )
          .gte("created_at", thisMonthStart.toISOString())
          .returns<TxItemRow[]>(),

        supabase
          .from("transactions")
          .select("payment_method, status, total_amount")
          .gte("created_at", thisMonthStart.toISOString()),
      ]);

      // ---- STATS ----
      const todaysSales =
        todayTx.data?.reduce((s, t) => s + (t.total_amount || 0), 0) ?? 0;
      const yesterdaysSales =
        yesterdayTx.data?.reduce((s, t) => s + (t.total_amount || 0), 0) ?? 0;
      const salesChangePercent =
        yesterdaysSales > 0
          ? Math.round(
              ((todaysSales - yesterdaysSales) / yesterdaysSales) * 100,
            )
          : todaysSales > 0
            ? 100
            : 0;

      const thisWeekCount = thisWeekTx.count ?? 0;
      const lastWeekCount = lastWeekTx.count ?? 0;

      const monthlyRevenue =
        thisMonthTx.data?.reduce((s, t) => s + (t.total_amount || 0), 0) ?? 0;
      const lastMonthRevenue =
        lastMonthTx.data?.reduce((s, t) => s + (t.total_amount || 0), 0) ?? 0;
      const monthlyRevenueChange =
        lastMonthRevenue > 0
          ? Math.round(
              ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
            )
          : monthlyRevenue > 0
            ? 100
            : 0;

      const avgOrderValue =
        thisWeekCount > 0
          ? (last7DaysTx.data
              ?.filter((t) => t.status === "Completed")
              .reduce((s, t) => s + (t.total_amount || 0), 0) ?? 0) /
            thisWeekCount
          : 0;

      const stats: DashboardStats = {
        todaysSales,
        totalOrders: thisWeekCount,
        activeProducts: allProductsCount.count ?? 0,
        activeUsers: activeUsers.count ?? 0,
        salesChangePercent,
        ordersChangeFromLastWeek: thisWeekCount - lastWeekCount,
        lowStockCount: inventoryLow.data?.length ?? 0,
        avgOrderValue,
        monthlyRevenue,
        lastMonthRevenue,
        monthlyRevenueChange,
        pendingTransactions: pendingTx.count ?? 0,
      };

      // ---- SALES TREND (last 7 days) ----
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const salesTrend: SalesTrendPoint[] = Array.from(
        { length: 7 },
        (_, i) => {
          const d = new Date(sevenDaysAgo);
          d.setDate(d.getDate() + i);
          const dateStr = d.toISOString().split("T")[0];
          const isToday = i === 6;
          return {
            date: dateStr,
            label: isToday ? "Today" : dayLabels[d.getDay()],
            sales: 0,
            orders: 0,
          };
        },
      );

      last7DaysTx.data?.forEach((t) => {
        if (t.status !== "Completed") return;
        const dateStr = t.created_at.split("T")[0];
        const point = salesTrend.find((p) => p.date === dateStr);
        if (point) {
          point.sales += t.total_amount || 0;
          point.orders += 1;
        }
      });

      // ---- CATEGORY REVENUE ----
      const catMap: Record<string, number> = {};
      txItems.data?.forEach((item) => {
        const cat = item.products?.category ?? "Unknown";
        catMap[cat] = (catMap[cat] ?? 0) + (item.subtotal || 0);
      });
      const totalCatRevenue = Object.values(catMap).reduce((a, b) => a + b, 0);
      const categoryRevenue: CategoryRevenue[] = Object.entries(catMap)
        .map(([category, revenue]) => ({
          category,
          revenue,
          percentage:
            totalCatRevenue > 0
              ? Math.round((revenue / totalCatRevenue) * 100)
              : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);

      // ---- TOP PRODUCTS ----
      const productMap: Record<string, TopProduct> = {};
      txItems.data?.forEach((item) => {
        const pid = item.product_id;
        if (!productMap[pid]) {
          productMap[pid] = {
            product_id: pid,
            product_name: item.product_name,
            category: item.products?.category ?? "Unknown",
            image: item.products?.image ?? null,
            total_quantity: 0,
            total_revenue: 0,
          };
        }
        productMap[pid].total_quantity += item.quantity || 0;
        productMap[pid].total_revenue += item.subtotal || 0;
      });
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 5);

      // ---- LOW STOCK ----
      const lowStockItems: LowStockItem[] = (inventoryLow.data ?? [])
        .filter((item) => item.products !== null)
        .map((item) => ({
          id: item.id,
          sku: item.sku,
          quantity: item.quantity,
          reorder_level: item.reorder_level,
          status: item.status,
          product: item.products!,
        }));

      // ---- PAYMENT METHOD BREAKDOWN ----
      const paymentMap: Record<string, { amount: number; count: number }> = {};
      thisMonthDetailTx.data?.forEach((t) => {
        const method = t.payment_method ?? "Unknown";
        if (!paymentMap[method]) paymentMap[method] = { amount: 0, count: 0 };
        paymentMap[method].amount += t.total_amount || 0;
        paymentMap[method].count += 1;
      });
      const paymentMethodBreakdown: PaymentMethodBreakdown[] = Object.entries(
        paymentMap,
      )
        .map(([method, val]) => ({ method, ...val }))
        .sort((a, b) => b.amount - a.amount);

      // ---- STATUS BREAKDOWN ----
      const statusMap: Record<string, number> = {};
      thisMonthDetailTx.data?.forEach((t) => {
        const s = t.status ?? "Unknown";
        statusMap[s] = (statusMap[s] ?? 0) + 1;
      });
      const statusBreakdown: StatusBreakdown[] = Object.entries(statusMap).map(
        ([status, count]) => ({ status, count }),
      );

      return {
        stats,
        salesTrend,
        categoryRevenue,
        recentTransactions: (recentTx.data ?? []) as RecentTransaction[],
        lowStockItems,
        topProducts,
        paymentMethodBreakdown,
        statusBreakdown,
      };
    },
    refetchInterval: 60_000,
  });
};
