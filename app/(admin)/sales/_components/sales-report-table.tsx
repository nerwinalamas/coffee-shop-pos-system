"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileDown,
  FileText,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Receipt,
} from "lucide-react";
import { useSalesReport, SalesReportRow } from "@/hooks/useSalesReport";
import { exportToCSV, exportToPDF } from "@/lib/sales-export";
import DateRangeFilter, {
  DateRangeValue,
  getPresetDateRange,
} from "@/components/date-range-filter";
import { format } from "date-fns";

const statusVariant = (status: string) => {
  if (status === "Completed") return "default";
  if (status === "Pending") return "secondary";
  return "destructive";
};

const SalesReportTable = () => {
  const [dateRange, setDateRange] = useState<DateRangeValue>(
    getPresetDateRange("this_month"),
  );

  const { data: report, isLoading, error } = useSalesReport(dateRange);

  const handleDateRangeChange = (range: DateRangeValue) => {
    setDateRange(range);
  };

  const periodLabel = `${format(dateRange.from, "MMM d, yyyy")} – ${format(dateRange.to, "MMM d, yyyy")}`;

  const columns: ColumnDef<SalesReportRow>[] = [
    {
      accessorKey: "transaction_number",
      header: "Transaction #",
      cell: ({ row }) => (
        <span className="font-medium text-sm">
          {row.getValue("transaction_number")}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const d = new Date(row.getValue("created_at") as string);
        return (
          <span className="text-sm text-gray-600">
            {d.toLocaleString("en-PH", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <span className="text-sm">
          {(row.getValue("customer_name") as string) ?? "Walk-in"}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.items;
        return (
          <span className="text-sm text-gray-600">
            {items.length === 0
              ? "—"
              : items.map((i) => `${i.product_name} ×${i.quantity}`).join(", ")}
          </span>
        );
      },
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: ({ row }) => (
        <span className="text-sm">
          ${(row.getValue("subtotal") as number).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "tax_amount",
      header: "Tax",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          ${(row.getValue("tax_amount") as number).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold text-sm">
          ${(row.getValue("total_amount") as number).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "payment_method",
      header: "Payment",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("payment_method")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={statusVariant(status)} className="text-xs">
            {status}
          </Badge>
        );
      },
    },
  ];

  const s = report?.summary;

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${(s?.totalRevenue ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      highlight: true,
    },
    {
      label: "Total Orders",
      value: String(s?.totalOrders ?? 0),
      icon: ShoppingBag,
    },
    {
      label: "Avg Order Value",
      value: `$${(s?.avgOrderValue ?? 0).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Total Tax",
      value: `$${(s?.totalTax ?? 0).toFixed(2)}`,
      icon: Receipt,
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sales Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">{periodLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <DateRangeFilter onChange={handleDateRangeChange} />

          {/* Export buttons */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm"
            disabled={!report || isLoading}
            onClick={() => report && exportToCSV(report)}
          >
            <FileDown className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button
            size="sm"
            className="gap-2 text-sm"
            disabled={!report || isLoading}
            onClick={() => report && exportToPDF(report)}
          >
            <FileText className="h-3.5 w-3.5" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className={
              card.highlight ? "bg-gray-900 text-white border-gray-900" : ""
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium uppercase tracking-wide ${
                    card.highlight ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {card.label}
                </span>
                <card.icon
                  className={`h-4 w-4 ${card.highlight ? "text-gray-400" : "text-gray-400"}`}
                />
              </div>
              <div
                className={`text-2xl font-bold ${
                  isLoading ? "text-gray-300 animate-pulse" : ""
                }`}
              >
                {isLoading ? "—" : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment method breakdown */}
      {s && Object.keys(s.byPaymentMethod).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(s.byPaymentMethod).map(([method, amount]) => (
            <div
              key={method}
              className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-sm"
            >
              <span className="text-gray-500">{method}</span>
              <span className="font-semibold text-gray-900">
                ${amount.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-gray-500">Completed</span>
            <span className="font-semibold text-green-700">
              {s.completedOrders}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">Pending</span>
            <span className="font-semibold text-yellow-600">
              {s.pendingOrders}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">Cancelled</span>
            <span className="font-semibold text-red-600">
              {s.cancelledOrders}
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={report?.rows ?? []}
        emptyMessage="No transactions for this period."
        searchPlaceholder="Search transactions..."
        isLoading={isLoading}
        loadingText="Loading report..."
        error={error}
        errorText="Error loading report"
      />
    </div>
  );
};

export default SalesReportTable;
