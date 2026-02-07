"use client";

import { useOrderStore } from "@/store/order";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OrderItems from "./order-items";
import PaymentModal from "@/components/modals/payment-modal";
import { useState } from "react";

const OrderDetails = () => {
  const { items, subtotal, tax, total, clearOrder } = useOrderStore();
  const [isPaymentModalOpen, setIsPaymentAddModalOpen] = useState(false);

  return (
    <>
      <div className="hidden col-span-4 xl:col-span-3 md:flex flex-col bg-white rounded-lg shadow-sm h-full p-4 space-y-4 max-h-screen">
        <Heading title="Order Details" />

        {/* Order items */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {items.length > 0 ? (
            items.map((item) => (
              <OrderItems
                key={item.id}
                id={item.id}
                imageUrl={item.image || ""}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center text-sm py-8">
              No items in order
            </div>
          )}
        </div>

        <Separator />

        {/* Order summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax 12%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Payment</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-4">
          <Button
            className="w-full"
            disabled={items.length === 0}
            onClick={() => setIsPaymentAddModalOpen(true)}
          >
            Pay Now
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={clearOrder}
            disabled={items.length === 0}
          >
            Cancel
          </Button>
        </div>
      </div>

      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentAddModalOpen}
      />
    </>
  );
};

export default OrderDetails;
