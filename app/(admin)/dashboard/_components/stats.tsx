"use client";

import {
  TrendingUp,
  ShoppingBag,
  UsersIcon,
  Package,
  DollarSign,
  CalendarDays,
  Clock,
} from "lucide-react";
import StatCard from "./stat-card";
import { DashboardStats } from "@/hooks/useDashboardData";

interface StatsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  error?: Error | null;
}

const Stats = ({ stats, isLoading, error }: StatsProps) => {
  const salesDesc = () => {
    if (isLoading) return "Loading...";
    if (error) return "Could not load";
    const p = stats?.salesChangePercent ?? 0;
    if (p > 0) return `+${p}% from yesterday`;
    if (p < 0) return `${p}% from yesterday`;
    return "Same as yesterday";
  };

  const ordersDesc = () => {
    if (isLoading) return "Loading...";
    if (error) return "Could not load";
    const d = stats?.ordersChangeFromLastWeek ?? 0;
    if (d > 0) return `+${d} from last week`;
    if (d < 0) return `${d} from last week`;
    return "Same as last week";
  };

  const stockDesc = () => {
    if (isLoading) return "Loading...";
    if (error) return "Could not load";
    const n = stats?.lowStockCount ?? 0;
    if (n === 0) return "All items in stock";
    return `${n} ${n === 1 ? "item" : "items"} low on stock`;
  };

  const monthDesc = () => {
    if (isLoading) return "Loading...";
    if (error) return "Could not load";
    const p = stats?.monthlyRevenueChange ?? 0;
    if (p > 0) return `+${p}% from last month`;
    if (p < 0) return `${p}% from last month`;
    return "Same as last month";
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: `$${(stats?.todaysSales ?? 0).toFixed(2)}`,
      description: salesDesc(),
      icon: TrendingUp,
      isLoading,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      description: ordersDesc(),
      icon: ShoppingBag,
      isLoading,
    },
    {
      title: "Active Products",
      value: stats?.activeProducts ?? 0,
      description: stockDesc(),
      icon: Package,
      isLoading,
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      description: isLoading
        ? "Loading..."
        : error
          ? "Could not load"
          : "All team members",
      icon: UsersIcon,
      isLoading,
    },
    {
      title: "Avg. Order Value",
      value: `$${(stats?.avgOrderValue ?? 0).toFixed(2)}`,
      description: "Based on this week",
      icon: DollarSign,
      isLoading,
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats?.monthlyRevenue ?? 0).toFixed(2)}`,
      description: monthDesc(),
      icon: CalendarDays,
      isLoading,
    },
    {
      title: "Pending Orders",
      value: stats?.pendingTransactions ?? 0,
      description: "Awaiting completion",
      icon: Clock,
      isLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default Stats;
