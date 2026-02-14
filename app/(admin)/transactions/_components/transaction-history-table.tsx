"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionWithItems } from "@/types/transactions.types";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, Printer } from "lucide-react";
import ViewTransactionDetailsModal from "@/components/modals/view-transaction-details-modal";
import PrintReceiptModal from "@/components/modals/print-receipt-modal";
import { useState } from "react";
import { toast } from "sonner";

const TransactionHistoryTable = () => {
  const { data: transactions = [], isLoading, error } = useTransactions();

  const [
    isViewTransactionDetailsModalOpen,
    setIsViewTransactionDetailsModalOpen,
  ] = useState(false);
  const [isPrintReceiptModalOpen, setIsPrintReceiptModalOpen] = useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionWithItems | null>(null);

  const handleCopyTransactionId = (transaction: TransactionWithItems) => {
    navigator.clipboard.writeText(transaction.transaction_number);
    toast.success("Transaction ID copied to clipboard!");
  };

  const handleViewTransactionDetails = (transaction: TransactionWithItems) => {
    setSelectedTransaction(transaction);
    setIsViewTransactionDetailsModalOpen(true);
  };

  const handlePrintReceipt = (transaction: TransactionWithItems) => {
    setSelectedTransaction(transaction);
    setIsPrintReceiptModalOpen(true);
  };

  const columns: ColumnDef<TransactionWithItems>[] = [
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
        const status = row.getValue("status") as TransactionWithItems["status"];
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
      header: "",
      size: 60,
      cell: ({ row }) => {
        const transaction = row.original;

        const actions: ActionItem[] = [
          {
            label: "Copy Transaction #",
            icon: Copy,
            onClick: () => handleCopyTransactionId(transaction),
          },
          {
            label: "View Details",
            icon: Eye,
            onClick: () => handleViewTransactionDetails(transaction),
          },
          {
            label: "Print Receipt",
            icon: Printer,
            onClick: () => handlePrintReceipt(transaction),
          },
        ];

        return <ActionsDropdown actions={actions} />;
      },
      enableSorting: false,
    },
  ];

  return (
    <>
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

      <ViewTransactionDetailsModal
        open={isViewTransactionDetailsModalOpen}
        onOpenChange={setIsViewTransactionDetailsModalOpen}
        transaction={selectedTransaction}
      />

      <PrintReceiptModal
        open={isPrintReceiptModalOpen}
        onOpenChange={setIsPrintReceiptModalOpen}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionHistoryTable;
