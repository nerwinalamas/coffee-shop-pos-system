"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PaymentMethodBreakdown } from "@/hooks/useDashboardData";

const COLORS = ["#18181b", "#52525b", "#a1a1aa", "#d4d4d8"];

interface Props {
  data: PaymentMethodBreakdown[];
  isLoading: boolean;
}

const PaymentMethodChart = ({ data, isLoading }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm animate-pulse">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            No data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="method"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Revenue",
                ]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodChart;
