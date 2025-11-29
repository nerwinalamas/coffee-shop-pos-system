"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user.types";
import UserStatusForm, {
  UserStatusFormValues,
  userStatusSchema,
} from "../forms/user-status-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface UserStatusModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserStatusModal = ({
  user,
  open,
  onOpenChange,
}: UserStatusModalProps) => {
  const form = useForm<UserStatusFormValues>({
    resolver: zodResolver(userStatusSchema),
    defaultValues: {
      status: "Active",
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        status: user.status,
      });
    }
  }, [user, form]);

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: UserStatusFormValues) => {
    try {
      // TODO: Replace with your actual API call
      console.log("Updating user status:", { userId: user?.id, ...values });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`User status updated to ${values.status}`);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Status</DialogTitle>
          <DialogDescription>
            Change the status for{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>
        <UserStatusForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Update Status"
          submitLoadingLabel="Updating..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserStatusModal;
