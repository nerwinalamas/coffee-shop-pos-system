"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { SalesTrendPoint } from "@/hooks/useDashboardData";

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
  isLoading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-gray-900">
          <span className="text-gray-500">Sales: </span>
          <span className="font-medium">
            ${(payload[0]?.value as number)?.toFixed(2)}
          </span>
        </p>
        <p className="text-gray-900">
          <span className="text-gray-500">Orders: </span>
          <span className="font-medium">
            {(payload[1]?.value as number) ?? 0}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesTrendChart = ({ data, isLoading }: SalesTrendChartProps) => {
  const maxSales = Math.max(...data.map((d) => d.sales), 1);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Sales Trend — Last 7 Days
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                domain={[0, Math.ceil(maxSales * 1.2)]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#18181b"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={{ r: 3, fill: "#18181b", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#18181b" }}
              />
              {/* Invisible area just for orders tooltip data */}
              <Area
                type="monotone"
                dataKey="orders"
                stroke="transparent"
                fill="transparent"
                legendType="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesTrendChart;
