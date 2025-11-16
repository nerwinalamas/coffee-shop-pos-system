"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user.types";
import UserRoleForm, {
  ChangeRoleFormValues,
  changeRoleSchema,
} from "../forms/user-role-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ChangeUserRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const ChangeUserRoleModal = ({
  open,
  onOpenChange,
  user,
}: ChangeUserRoleModalProps) => {
  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: undefined,
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        role: user.role,
      });
    }
  }, [user, open, form]);

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: ChangeRoleFormValues) => {
    try {
      // TODO: Replace with your actual API call
      console.log("Changing role for user:", user?.id, "to:", values.role);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Role changed to ${values.role} successfully`);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Change role error:", error);
      toast.error("Failed to change role. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.firstName} {user.lastName}. Current role:{" "}
            <strong>{user.role}</strong>
          </DialogDescription>
        </DialogHeader>
        <UserRoleForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Change Role"
          submitLoadingLabel="Changing..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeUserRoleModal;
