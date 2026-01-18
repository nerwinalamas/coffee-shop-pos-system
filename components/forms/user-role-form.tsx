"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const changeRoleSchema = z.object({
  role: z.enum(["Owner", "Admin", "Manager", "Staff"], {
    message: "Role is required",
  }),
});

export type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

interface UserRoleFormProps {
  form: UseFormReturn<ChangeRoleFormValues>;
  onSubmit: (values: ChangeRoleFormValues) => Promise<void> | void;
  handleCancel: () => void;
  submitLabel: string;
  submitLoadingLabel: string;
}

const UserRoleForm = ({
  form,
  onSubmit,
  handleCancel,
  submitLabel,
  submitLoadingLabel,
}: UserRoleFormProps) => {
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? submitLoadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserRoleForm;
