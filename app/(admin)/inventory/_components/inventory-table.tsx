"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { InventoryWithProduct } from "@/types/inventory.types";
import { getCategoryVariant, getStatusVariant } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import DataTableFilter from "@/components/data-table-filter";
import AddItemModal from "@/components/modals/add-item-modal";
import RestockModal from "@/components/modals/restock-modal";
import ViewItemDetailsModal from "@/components/modals/view-item-details-modal";
import DeleteInventoryModal from "@/components/modals/delete-inventory-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, RotateCw, Plus, Trash2 } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";

const InventoryTable = () => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryWithProduct | null>(
    null,
  );

  const { data: inventory, isLoading, error } = useInventory();

  const [filters, setFilters] = useState<{
    categories: string[];
    statuses: string[];
  }>({
    categories: [],
    statuses: [],
  });

  const handleRestock = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setIsRestockModalOpen(true);
  };

  const handleViewDetails = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setIsViewDetailsModalOpen(true);
  };

  const handleDelete = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!inventory) return [];

    let filtered = [...inventory];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((item) =>
        filters.categories.includes(item.products?.category || "Unknown"),
      );
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((item) =>
        filters.statuses.includes(item.status),
      );
    }

    return filtered;
  }, [filters, inventory]);

  const columns: ColumnDef<InventoryWithProduct>[] = [
    {
      accessorKey: "image",
      header: "Image",
      size: 80,
      cell: ({ row }) => (
        <Image
          src={row.original.products?.image || ""}
          alt={row.original.products?.name || "Product Image"}
          className="w-14 h-14 rounded-lg"
          width={1000}
          height={1000}
          priority
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "products.name",
      header: "Product Name",
      size: 200,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.products?.name}</div>
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
      accessorKey: "products.category",
      header: "Category",
      size: 120,
      cell: ({ row }) => {
        const category = row.original.products?.category || "Unknown";
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
      accessorKey: "reorder_level",
      header: "Reorder Level",
      size: 120,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.reorder_level}
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
      accessorKey: "last_restocked",
      header: "Last Restocked",
      size: 140,
      accessorFn: (row) => {
        if (!row.last_restocked) return "Never";
        return new Date(row.last_restocked).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.last_restocked
            ? new Date(row.original.last_restocked).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )
            : "Never"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => {
        const actions: ActionItem[] = [
          {
            label: "Restock",
            icon: RotateCw,
            onClick: () => handleRestock(row.original),
          },
          {
            label: "View Details",
            icon: Package,
            onClick: () => handleViewDetails(row.original),
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
        data={filteredData}
        filterComponent={
          <DataTableFilter filterType="inventory" onFilterChange={setFilters} />
        }
        headerActions={
          <Button className="gap-2" onClick={() => setIsAddItemModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        }
        emptyMessage="No inventory items found."
        searchPlaceholder="Search products"
        isLoading={isLoading}
        loadingText="Loading inventory..."
        error={error}
        errorText="Error loading inventory"
      />

      <AddItemModal
        open={isAddItemModalOpen}
        onOpenChange={setIsAddItemModalOpen}
      />

      <RestockModal
        open={isRestockModalOpen}
        onOpenChange={setIsRestockModalOpen}
        item={selectedItem}
      />

      <ViewItemDetailsModal
        open={isViewDetailsModalOpen}
        onOpenChange={setIsViewDetailsModalOpen}
        item={selectedItem}
      />

      <DeleteInventoryModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        item={selectedItem}
      />
    </>
  );
};

export default InventoryTable;
