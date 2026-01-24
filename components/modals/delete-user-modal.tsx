"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/actions/user-actions";
import { Profiles } from "@/types/profiles.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profiles | null;
}

const DeleteUserModal = ({
  open,
  onOpenChange,
  user,
}: DeleteUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const result = await deleteUser(user.id);

      if (result.error) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User deleted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>
            ? This action cannot be undone and all user data will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;
