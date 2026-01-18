"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useProfiles } from "@/hooks/useProfiles";
import { Profiles } from "@/types/profiles.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTableFilter from "@/components/data-table-filter";
import { DataTable } from "@/components/data-table";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import AddUserModal from "@/components/modals/add-user-modal";
import ChangeUserRoleModal from "@/components/modals/change-user-role-modal";
import DeleteUserModal from "@/components/modals/delete-user-modal";
import EditUserModal from "@/components/modals/edit-user-modal";
import ResetPasswordModal from "@/components/modals/reset-password";
import UserStatusModal from "@/components/modals/user-status-modal";
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
  const { data, isLoading, error } = useProfiles();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState<Profiles | null>(null);

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
        filters.statuses.includes(item.status),
      );
    }

    return filtered;
  }, [data, filters]);

  const handleEdit = (user: Profiles) => {
    setUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangeRole = (user: Profiles) => {
    setUser(user);
    setIsChangeRoleModalOpen(true);
  };

  const handleResetPassword = (user: Profiles) => {
    setUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleStatus = (user: Profiles) => {
    setUser(user);
    setIsStatusModalOpen(true);
  };

  const handleDelete = (user: Profiles) => {
    setUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns: ColumnDef<Profiles>[] = [
    {
      accessorKey: "first_name",
      header: "First Name",
      size: 140,
      cell: ({ row }) => (
        <div className="font-normal text-sm capitalize">{row.original.first_name}</div>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      size: 140,
      cell: ({ row }) => (
        <div className="font-normal text-sm capitalize">{row.original.last_name}</div>
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
        isLoading={isLoading}
        loadingText="Loading users..."
        error={error}
        errorText="Error loading users"
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
