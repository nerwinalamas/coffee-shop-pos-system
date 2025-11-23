"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user.types";
import ResetPasswordForm, {
  resetPasswordSchema,
  ResetPasswordValues,
} from "../forms/reset-password-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const ResetPasswordModal = ({
  open,
  onOpenChange,
  user,
}: ResetPasswordModalProps) => {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleDialogChange = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      // TODO: Replace with your actual API call
      console.log("Resetting password:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Password reset successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset the password for{" "}
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>
        <ResetPasswordForm
          form={form}
          onSubmit={onSubmit}
          handleCancel={handleDialogChange}
          submitLabel="Reset Password"
          submitLoadingLabel="Resetting..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
