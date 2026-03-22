"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserRole } from "@/actions/user-actions";
import { Profiles } from "@/types/profiles.types";
import UserRoleForm, {
  ChangeRoleFormValues,
  changeRoleSchema,
} from "@/components/forms/user-role-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface ChangeUserRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profiles | null;
}

const ChangeUserRoleModal = ({
  open,
  onOpenChange,
  user,
}: ChangeUserRoleModalProps) => {
  const queryClient = useQueryClient();
  const { log } = useActivityLogger();

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
    if (!user) return;

    try {
      const result = await updateUserRole(user.id, {
        role: values.role,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await log({
        action: "update",
        subject: "user",
        entityId: user.id,
        entityName: `${user.first_name} ${user.last_name}`,
        changes: {
          old: { role: user.role },
          new: { role: values.role },
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
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
            Change the role for{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>
            . Current role: <strong>{user.role}</strong>
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
