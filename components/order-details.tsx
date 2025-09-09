"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const OrderDetails = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fallbackImage = `https://via.placeholder.com/300x300/e2e8f0/64748b?text=${encodeURIComponent(
    "Espresso"
  )}`;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="hidden col-span-4 xl:col-span-3 md:flex flex-col bg-white rounded-lg shadow-sm h-full p-4 space-y-4">
      <Heading title="Order Details" />

      {/* Order items */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="relative w-full h-2/3 mb-2">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-xs">Loading...</div>
                </div>
              )}
              <Image
                src={
                  imageError
                    ? fallbackImage
                    : "https://picsum.photos/300/300?random=1"
                }
                alt="Espresso"
                width={300}
                height={300}
                className="w-14 h-14 object-cover rounded-lg"
                onError={handleImageError}
                onLoad={handleImageLoad}
                priority
              />
            </div>
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
            <div className="relative w-full h-2/3 mb-2">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-xs">Loading...</div>
                </div>
              )}
              <Image
                src={
                  imageError
                    ? fallbackImage
                    : "https://picsum.photos/300/300?random=2"
                }
                alt="Espresso"
                width={300}
                height={300}
                className="w-14 h-14 object-cover rounded-lg"
                onError={handleImageError}
                onLoad={handleImageLoad}
                priority
              />
            </div>
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
