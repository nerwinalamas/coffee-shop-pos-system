"use client";

import Image from "next/image";
import { InventoryItem } from "@/types/inventory.types";
import { getCategoryVariant, getStatusVariant } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewItemDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

const ViewItemDetailsModal = ({
  open,
  onOpenChange,
  item,
}: ViewItemDetailsModalProps) => {
  if (!item) return null;

  const stockPercentage = (item.quantity / item.reorderLevel) * 100;
  const isLowStock = item.quantity <= item.reorderLevel;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
          <DialogDescription>
            Complete information for {item.productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image and Basic Info */}
          <div className="flex gap-6">
            <Image
              src={item.image}
              alt={item.productName}
              className="w-32 h-32 rounded-lg object-cover"
              width={200}
              height={200}
              priority
            />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-semibold">{item.productName}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {item.sku}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={`rounded-full ${getCategoryVariant(
                    item.category
                  )}`}
                >
                  {item.category}
                </Badge>
                <Badge
                  className={`rounded-full ${getStatusVariant(item.status)}`}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Stock Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Current Quantity
                </p>
                <p className="text-3xl font-bold">{item.quantity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reorder Level</p>
                <p className="text-3xl font-bold text-muted-foreground">
                  {item.reorderLevel}
                </p>
              </div>
            </div>

            {/* Stock Level Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock Level</span>
                <span
                  className={
                    isLowStock
                      ? "text-yellow-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  {stockPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isLowStock ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                />
              </div>
              {isLowStock && (
                <p className="text-sm text-yellow-600">
                  ⚠️ Stock is below reorder level
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Additional Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Restocked</p>
                <p className="text-base font-medium">
                  {new Date(item.lastRestocked).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Days Since Restock
                </p>
                <p className="text-base font-medium">
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(item.lastRestocked).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewItemDetailsModal;
