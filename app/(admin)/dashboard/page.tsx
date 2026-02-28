"use client";

import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import Stats from "./_components/stats";
import SalesTrendChart from "./_components/sales-trend-chart";
import CategoryRevenueChart from "./_components/category-revenue-chart";
import RecentTransactions from "./_components/recent-transactions";
import LowStockAlerts from "./_components/low-stock-alerts";
import TopProducts from "./_components/top-products";
import PageTransition from "@/components/page-transition";
import { Variants } from "framer-motion";
import PaymentMethodChart from "./_components/payment-method-chart";
import TransactionStatusChart from "./_components/transaction-status-chart";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const, // ← dagdag ng "as const"
    },
  },
};
const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardData();

  return (
    <PageTransition>
      <motion.div
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Stats stats={data?.stats} isLoading={isLoading} error={error} />
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-1 xl:grid-cols-3 gap-4"
        >
          <SalesTrendChart
            data={data?.salesTrend ?? []}
            isLoading={isLoading}
          />
          <CategoryRevenueChart
            data={data?.categoryRevenue ?? []}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={item}>
          <RecentTransactions
            data={data?.recentTransactions ?? []}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
        >
          <PaymentMethodChart
            data={data?.paymentMethodBreakdown ?? []}
            isLoading={isLoading}
          />
          <TransactionStatusChart
            data={data?.statusBreakdown ?? []}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
        >
          <TopProducts data={data?.topProducts ?? []} isLoading={isLoading} />
          <LowStockAlerts
            data={data?.lowStockItems ?? []}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default DashboardPage;
