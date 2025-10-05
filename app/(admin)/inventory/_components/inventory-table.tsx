"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { INVENTORY } from "@/app/data";
import { InventoryItem } from "@/types/inventory.types";
import { getCategoryVariant } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, RotateCw, Plus } from "lucide-react";

const InventoryTable = () => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "Out of Stock":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "";
    }
  };

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "image",
      header: "Image",
      size: 80,
      cell: ({ row }) => (
        <Image
          src={row.original.image}
          alt={row.original.productName}
          className="w-14 h-14 rounded-lg"
          width={1000}
          height={1000}
          priority
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      size: 200,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.productName}</div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      size: 120,
      cell: ({ row }) => (
        <div className="font-mono text-sm text-muted-foreground">
          {row.original.sku}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 120,
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <Badge className={`rounded-full ${getCategoryVariant(category)}`}>
            {category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      size: 100,
      cell: ({ row }) => (
        <div className="font-medium text-sm">{row.original.quantity}</div>
      ),
    },
    {
      accessorKey: "reorderLevel",
      header: "Reorder Level",
      size: 120,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.reorderLevel}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={`rounded-full ${getStatusVariant(status)}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastRestocked",
      header: "Last Restocked",
      size: 140,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.lastRestocked).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 120,
      cell: () => {
        return (
          <div className="flex items-center justify-center gap-x-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Restock"
              title="Restock Item"
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              aria-label="View Details"
              title="View Details"
            >
              <Package className="w-4 h-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={INVENTORY}
      headerActions={
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      }
      emptyMessage="No inventory items found."
    />
  );
};

export default InventoryTable;
