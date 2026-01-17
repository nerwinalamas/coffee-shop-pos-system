"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import DataTableFilter from "@/components/data-table-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { Profiles } from "@/types/profiles.types";

const UserTable = () => {
  const { data, isLoading, error } = useProfiles();

  const [filters, setFilters] = useState<{
    statuses: string[];
  }>({
    statuses: [],
  });

  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((item) =>
        filters.statuses.includes(item.status)
      );
    }

    return filtered;
  }, [data, filters]);

  const columns: ColumnDef<Profiles>[] = [
    {
      accessorKey: "first_name",
      header: "First Name",
      size: 140,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.first_name}</div>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      size: 140,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.last_name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 140,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 120,
      cell: ({ row }) => {
        const role = row.original.role;

        const roleColors = {
          Owner: "bg-amber-100 text-amber-800",
          Admin: "bg-purple-100 text-purple-800",
          Manager: "bg-blue-100 text-blue-800",
          Staff: "bg-gray-100 text-gray-800",
        } as const;

        return <Badge className={roleColors[role]}>{role}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      cell: ({ row }) => {
        const status = row.original.status;

        const statusColors = {
          Active: "bg-green-100 text-green-800",
          Inactive: "bg-red-100 text-red-800",
        } as const;

        return <Badge className={statusColors[status]}>{status}</Badge>;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredData}
        filterComponent={
          <DataTableFilter filterType="user" onFilterChange={setFilters} />
        }
        headerActions={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        }
        emptyMessage="No users found."
        searchPlaceholder="Search users"
        isLoading={isLoading}
        loadingText="Loading users..."
        error={error}
        errorText="Error loading users"
      />
    </>
  );
};

export default UserTable;
