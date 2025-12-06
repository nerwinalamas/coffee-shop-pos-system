import { TrendingUp, ShoppingBag, UsersIcon } from "lucide-react";
import StatCard from "./stat-card";

const Stats = () => {
  const stats = [
    {
      title: "Today's Sales",
      value: "$2,100",
      description: "+12% from yesterday",
      icon: TrendingUp,
    },
    {
      title: "Total Orders",
      value: 127,
      description: "+5 from last week",
      icon: ShoppingBag,
    },
    {
      title: "Active Products",
      value: 48,
      description: "3 low on stock",
      icon: ShoppingBag,
    },
    {
      title: "Active Users",
      value: 12,
      description: "All team members",
      icon: UsersIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default Stats;
