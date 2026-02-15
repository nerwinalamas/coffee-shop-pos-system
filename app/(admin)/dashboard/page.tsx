"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import Stats from "./_components/stats";
import SalesTrendChart from "./_components/sales-trend-chart";
import CategoryRevenueChart from "./_components/category-revenue-chart";
import RecentTransactions from "./_components/recent-transactions";
import LowStockAlerts from "./_components/low-stock-alerts";
import TopProducts from "./_components/top-products";

const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardData();

  return (
    <div className="p-8 space-y-6">
      <Stats stats={data?.stats} isLoading={isLoading} error={error} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesTrendChart data={data?.salesTrend ?? []} isLoading={isLoading} />
        <CategoryRevenueChart
          data={data?.categoryRevenue ?? []}
          isLoading={isLoading}
        />
      </div>

      <RecentTransactions
        data={data?.recentTransactions ?? []}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopProducts data={data?.topProducts ?? []} isLoading={isLoading} />
        <LowStockAlerts
          data={data?.lowStockItems ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
