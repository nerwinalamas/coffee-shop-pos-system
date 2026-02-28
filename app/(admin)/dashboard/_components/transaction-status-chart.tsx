"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { StatusBreakdown } from "@/hooks/useDashboardData";

const STATUS_COLORS: Record<string, string> = {
  Completed: "#16a34a",
  Pending: "#ca8a04",
  Cancelled: "#dc2626",
};

interface Props {
  data: StatusBreakdown[];
  isLoading: boolean;
}

const TransactionStatusChart = ({ data, isLoading }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          Transaction Status
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
            <BarChart data={data} barSize={40}>
              <XAxis
                dataKey="status"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value: number) => [value, "Orders"]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.status] ?? "#a1a1aa"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionStatusChart;
