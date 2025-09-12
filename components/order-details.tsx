"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus } from "lucide-react";
import ReusableImage from "@/components/reusable-image";

const OrderDetails = () => {
  return (
    <div className="hidden col-span-4 xl:col-span-3 md:flex flex-col bg-white rounded-lg shadow-sm h-full p-4 space-y-4">
      <Heading title="Order Details" />

      {/* Order items */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <ReusableImage
              src="https://picsum.photos/300/300?random=1"
              alt="Espresso"
              className="w-14 h-14"
              fallbackText="Espresso"
              priority
            />
            <div className="flex flex-col gap-2">
              <span className="text-sm">Espresso</span>
              <span className="font-semibold text-base">$3.99</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="icon" className="rounded-full">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-semibold">1</span>
            <Button size="icon" className="rounded-full">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <ReusableImage
              src="https://picsum.photos/300/300?random=2"
              alt="Cappuccino"
              className="w-14 h-14"
              fallbackText="Cappuccino"
              priority
            />
            <div className="flex flex-col gap-2">
              <span className="text-sm">Cappuccino</span>
              <span className="font-semibold text-base">$4.49</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="icon" className="rounded-full">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-semibold">1</span>
            <Button size="icon" className="rounded-full">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

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
