"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { PRODUCTS } from "@/app/data";
import { Product } from "@/types/product.types";
import { getCategoryVariant } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import AddProductModal from "@/components/modals/add-product-modal";
import EditProductModal from "@/components/modals/edit-product-modal";
import DeleteProductModal from "@/components/modals/delete-product-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus } from "lucide-react";

const ProductTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

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
      size: 60,
      cell: ({ row }) => {
        const actions: ActionItem[] = [
          {
            label: "Edit",
            icon: Edit2,
            onClick: () => handleEdit(row.original),
          },
          {
            label: "Delete",
            icon: Trash2,
            onClick: () => handleDelete(row.original),
            variant: "destructive",
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
        data={PRODUCTS}
        headerActions={
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        }
        emptyMessage="No products found."
      />

      <AddProductModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={selectedProduct}
      />
      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductTable;
