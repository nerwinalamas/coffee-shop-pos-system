"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2 } from "lucide-react";
import { TopProduct } from "@/hooks/useDashboardData";
import { getCategoryVariant } from "@/lib/utils";

interface TopProductsProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const TopProducts = ({ data, isLoading }: TopProductsProps) => {
  const maxQty = Math.max(...data.map((p) => p.total_quantity), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Top Selling Products
        </CardTitle>
        <BarChart2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
            No sales data this month.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.map((product, index) => (
              <div
                key={product.product_id}
                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50/60 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-300 w-4 shrink-0">
                  {index + 1}
                </span>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.product_name}
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
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.product_name}
                    </p>
                    <Badge
                      className={`rounded-full text-xs shrink-0 ${getCategoryVariant(product.category)}`}
                    >
                      {product.category}
                    </Badge>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-800 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((product.total_quantity / maxQty) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {product.total_quantity}x
                  </span>
                  <span className="text-xs text-gray-400">
                    ${product.total_revenue.toFixed(2)}
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

export default TopProducts;
