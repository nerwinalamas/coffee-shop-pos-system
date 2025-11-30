"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { INITIAL_USERS } from "@/app/data";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user.types";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import AddUserModal from "@/components/modals/add-user-modal";
import EditUserModal from "@/components/modals/edit-user-modal";
import ChangeUserRoleModal from "@/components/modals/change-user-role-modal";
import ResetPasswordModal from "@/components/modals/reset-password";
import UserStatusModal from "@/components/modals/user-status-modal";
import DeleteUserModal from "@/components/modals/delete-user-modal";
import DataTableFilter from "@/components/data-table-filter";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  KeyRound,
  Plus,
  Trash2,
  UserCheck,
  UserCog,
  UserX,
} from "lucide-react";

const UserTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [filters, setFilters] = useState<{
    statuses: string[];
  }>({
    statuses: [],
  });

  const handleEdit = (user: User) => {
    setUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangeRole = (user: User) => {
    setUser(user);
    setIsChangeRoleModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleStatus = (user: User) => {
    setUser(user);
    setIsStatusModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUser(user);
    setIsDeleteModalOpen(true);
  };

  const filteredData = useMemo(() => {
    let filtered = [...INITIAL_USERS];

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((item) =>
        filters.statuses.includes(item.status)
      );
    }

    return filtered;
  }, [filters]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 150,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.firstName}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      size: 150,
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.original.lastName}</div>
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
            label: "Edit",
            icon: Edit2,
            onClick: () => handleEdit(row.original),
          },
          {
            label: "Change Role",
            icon: UserCog,
            onClick: () => handleChangeRole(row.original),
          },
          {
            label: "Reset Password",
            icon: KeyRound,
            onClick: () => handleResetPassword(row.original),
          },
          {
            label: user.status === "Active" ? "Deactivate" : "Activate",
            icon: user.status === "Active" ? UserX : UserCheck,
            onClick: () => handleStatus(row.original),
          },
          {
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            onClick: () => handleDelete(row.original),
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
          <DataTableFilter filterType="user" onFilterChange={setFilters} />
        }
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
      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={user}
      />
      <ChangeUserRoleModal
        open={isChangeRoleModalOpen}
        onOpenChange={setIsChangeRoleModalOpen}
        user={user}
      />
      <ResetPasswordModal
        open={isResetPasswordModalOpen}
        onOpenChange={setIsResetPasswordModalOpen}
        user={user}
      />
      <UserStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        user={user}
      />
      <DeleteUserModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        user={user}
      />
    </>
  );
};

export default UserTable;