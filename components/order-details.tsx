"use client";

import Heading from "@/components/heading";
import OrderItems from "@/components/order-items";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const OrderDetails = () => {
  return (
    <div className="hidden col-span-4 xl:col-span-3 md:flex flex-col bg-white rounded-lg shadow-sm h-full p-4 space-y-4">
      <Heading title="Order Details" />

      {/* Order items */}
      <div className="flex-1 space-y-2">
        <OrderItems
          imageUrl="https://picsum.photos/300/300?random=1"
          name="Espresso"
          price={3.99}
        />

        <OrderItems
          imageUrl="https://picsum.photos/300/300?random=2"
          name="Cappuccino"
          price={4.49}
        />

        {/* <div className="text-gray-500 text-center text-sm py-8">
          No items in order
        </div> */}
      </div>

      <Separator />

      {/* Order summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Sub Total</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax 12%</span>
          <span>$0.00</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total Payment</span>
        <span>$0.00</span>
      </div>

      {/* Action buttons */}
      <div className="mt-4 space-y-4">
        <Button className="w-full">Pay Now</Button>
        <Button variant="secondary" className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
