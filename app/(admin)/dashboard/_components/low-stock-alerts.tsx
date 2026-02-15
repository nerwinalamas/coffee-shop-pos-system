"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { LowStockItem } from "@/hooks/useDashboardData";

interface LowStockAlertsProps {
  data: LowStockItem[];
  isLoading?: boolean;
}

const statusStyles: Record<string, string> = {
  "Low Stock": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Out of Stock": "bg-red-100 text-red-700 border-red-200",
};

const LowStockAlerts = ({ data, isLoading }: LowStockAlertsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Alerts
          </CardTitle>
          {data.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {data.length}
            </span>
          )}
        </div>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="text-2xl">✓</span>
            All items are well stocked!
          </div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-[280px] overflow-y-auto">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50/60 transition-colors"
              >
                {item.product?.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-md bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400">
                    N/A
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-gray-400">{item.sku}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      statusStyles[item.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {item.quantity} / {item.reorder_level} units
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
