"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { PRODUCTS } from "@/app/data";
import { Product } from "@/types/product.types";
import { getCategoryVariant } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus } from "lucide-react";

const ProductTable = () => {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "Image",
      size: 80,
      cell: ({ row }) => (
        <Image
          src={row.original.image}
          alt={row.original.name}
          className="w-14 h-14 rounded-lg"
          width={1000}
          height={1000}
          priority
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 200,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 120,
      cell: ({ row }) => (
        <div className="font-normal text-sm">
          ${row.original.price.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 150,
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
      id: "actions",
      header: "",
      size: 120,
      cell: () => {
        return (
          <div className="flex items-center justify-center gap-x-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Edit"
              title="Edit Product"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              aria-label="Remove"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
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
      data={PRODUCTS}
      headerActions={
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      }
      emptyMessage="No products found."
    />
  );
};

export default ProductTable;
