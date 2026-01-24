"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profiles } from "@/types/profiles.types";
import UserForm, { UserFormValues, userSchema } from "../forms/user-form";
import { updateUser } from "@/actions/user-actions";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profiles | null;
}

const EditUserModal = ({ open, onOpenChange, user }: EditUserModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, open, form]);

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: UserFormValues) => {
    if (!user) return;

    try {
      const result = await updateUser(user.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User updated successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user information below and save your changes.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Update User"
          submitLoadingLabel="Updating User..."
          showRoleField={false}
          showStatusField={false}
          showPasswordField={false}
          disableEmail={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
