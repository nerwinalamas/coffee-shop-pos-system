"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";
import { RecentTransaction } from "@/hooks/useDashboardData";

interface RecentTransactionsProps {
  data: RecentTransaction[];
  isLoading?: boolean;
}

const statusStyles: Record<string, string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const RecentTransactions = ({ data, isLoading }: RecentTransactionsProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Recent Transactions
        </CardTitle>
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
            No transactions yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {tx.transaction_number}
                  </span>
                  <span className="text-xs text-gray-400">
                    {tx.customer_name || "Guest"} · {tx.payment_method}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <Badge
                    variant="outline"
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      statusStyles[tx.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tx.status}
                  </Badge>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm font-semibold text-gray-900">
                      ${tx.total_amount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatTime(tx.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
