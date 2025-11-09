"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { INITIAL_USERS } from "@/app/data";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user.types";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import AddUserModal from "@/components/modals/add-user-modal";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Eye,
  KeyRound,
  Plus,
  Trash2,
  UserCheck,
  UserCog,
  UserX,
} from "lucide-react";

const UserTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      cell: ({ row }) => {
        const isActive = row.original.status === "Active";

        return (
          <Badge
            variant="secondary"
            className={cn("rounded-full", !isActive && "text-destructive")}
          >
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => {
        const user = row.original;
        const actions: ActionItem[] = [
          {
            label: "View Details",
            icon: Eye,
            onClick: () => console.log("View details:", user),
          },
          {
            label: "Edit",
            icon: Edit2,
            onClick: () => console.log("Edit user:", user),
          },
          {
            label: "Change Role",
            icon: UserCog,
            onClick: () => console.log("Change role:", user),
          },
          {
            label: "Reset Password",
            icon: KeyRound,
            onClick: () => console.log("Reset password:", user),
          },
          {
            label: user.status === "Active" ? "Deactivate" : "Activate",
            icon: user.status === "Active" ? UserX : UserCheck,
            onClick: () => console.log("Toggle status:", user),
          },
          {
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            onClick: () => console.log("Delete user:", user),
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
        data={INITIAL_USERS}
        headerActions={
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        }
        emptyMessage="No users found."
        searchPlaceholder="Search users"
      />

      <AddUserModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </>
  );
};

export default UserTable;
