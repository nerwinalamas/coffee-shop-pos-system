"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserForm, { UserFormValues, userSchema } from "../forms/user-form";
import { createUser } from "@/actions/user-actions";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal = ({ open, onOpenChange }: AddUserModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Staff",
      status: "Active",
      password: "",
    },
  });

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (!values.password || !values.role) {
        toast.error("Password and role are required");
        return;
      }

      const result = await createUser({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        role: values.role,
        status: values.status,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User added successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Add user error:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new user to the system.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Add User"
          submitLoadingLabel="Adding User..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
