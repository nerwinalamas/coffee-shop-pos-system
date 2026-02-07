"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transactions } from "@/types/transactions.types";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

const TransactionHistoryTable = () => {
  const { data: transactions = [], isLoading, error } = useTransactions();

  const columns: ColumnDef<Transactions>[] = [
    {
      accessorKey: "transaction_number",
      header: "Transaction #",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("transaction_number")}</div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("customer_name") || "Walk-in Customer"}
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = row.getValue("total_amount") as number;
        return <div className="font-medium">${amount.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
      cell: ({ row }) => {
        const method = row.getValue("payment_method") as string;
        return <div>{method}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Transactions["status"];
        return (
          <Badge
            variant={
              status === "Completed"
                ? "default"
                : status === "Pending"
                  ? "secondary"
                  : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const dateString = row.getValue("created_at") as string;
        if (!dateString) return <div>-</div>;

        const date = new Date(dateString);
        return (
          <div>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(transaction.transaction_number)
                }
              >
                Copy transaction #
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Print receipt</DropdownMenuItem>
              {transaction.status === "Pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Cancel transaction
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={transactions}
      emptyMessage="No transactions found."
      searchPlaceholder="Search transactions..."
      isLoading={isLoading}
      loadingText="Loading transactions..."
      error={error}
      errorText="Error loading transactions"
    />
  );
};

export default TransactionHistoryTable;
