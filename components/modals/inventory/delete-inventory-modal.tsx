"use client";

import { useState } from "react";
import { InventoryWithProduct } from "@/types/inventory.types";
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
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface DeleteInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryWithProduct | null;
}

const DeleteInventoryModal = ({
  open,
  onOpenChange,
  item,
}: DeleteInventoryModalProps) => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { log } = useActivityLogger();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      await log({
        action: "delete",
        subject: "inventory",
        entityId: item.id,
        entityName: item.products?.name,
      });

      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
      await queryClient.invalidateQueries({
        queryKey: ["products-with-inventory"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["products-without-inventory"],
      });
      toast.success("Inventory item deleted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Delete inventory error:", error);
      toast.error("Failed to delete inventory item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the inventory record for{" "}
            <span className="font-semibold text-foreground">
              {item?.products?.name}
            </span>{" "}
            (SKU: {item?.sku}). This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end gap-2">
          <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInventoryModal;
