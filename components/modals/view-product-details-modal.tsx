"use client";

import Image from "next/image";
import { Products } from "@/types/product.types";
import { getCategoryVariant } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Products | null;
}

const ViewProductDetailsModal = ({
  open,
  onOpenChange,
  product,
}: ViewProductDetailsModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Complete information for {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image and Basic Info */}
          <div className="flex gap-6">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-32 h-32 rounded-lg object-cover"
              width={128}
              height={128}
              priority
            />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  ID: {product.id.slice(-8)}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={`rounded-full ${getCategoryVariant(product.category)}`}
                >
                  {product.category}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pricing
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Unit Price
                </span>
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Product Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-base font-medium">
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-base font-medium">
                  {product.updated_at
                    ? new Date(product.updated_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductDetailsModal;
