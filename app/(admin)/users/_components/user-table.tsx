"use client";

import { ColumnDef } from "@tanstack/react-table";
import { INITIAL_USERS } from "@/app/data";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user.types";

const UserTable = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      size: 200,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 250,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 150,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 120,
      cell: ({ row }) => (
        <Badge className="rounded-full">{row.original.role}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      cell: ({ row }) => (
        <Badge className="rounded-full">{row.original.status}</Badge>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={INITIAL_USERS}
        emptyMessage="No users found."
      />
    </>
  );
};

export default UserTable;
