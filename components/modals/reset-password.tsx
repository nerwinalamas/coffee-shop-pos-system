"use client";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetUserPassword } from "@/actions/user-actions";
import { Profiles } from "@/types/profiles.types";
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
  user: Profiles | null;
}

const ResetPasswordModal = ({
  open,
  onOpenChange,
  user,
}: ResetPasswordModalProps) => {
  const queryClient = useQueryClient();

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
    if (!user) return;

    try {
      const result = await resetUserPassword(user.id, {
        newPassword: values.newPassword,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Password reset successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.",
      );
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
              {user.first_name} {user.last_name}
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
