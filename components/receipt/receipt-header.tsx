import { Businesses } from "@/types/businesses.types";

interface ReceiptHeaderProps {
  business: Businesses | null;
}

const ReceiptHeader = ({ business }: ReceiptHeaderProps) => {
  if (!business) return null;

  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold">{business.name}</h1>
      <p className="text-sm">{business.address}</p>
      <p className="text-sm">{business.phone}</p>
    </div>
  );
};

export default ReceiptHeader;
