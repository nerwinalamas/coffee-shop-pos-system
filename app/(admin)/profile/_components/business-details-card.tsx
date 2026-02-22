import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BusinessDetailsForm } from "./business-details-form";
import { type BusinessFormData } from "@/actions/business-actions";

interface BusinessDetailsCardProps {
  business: BusinessFormData;
}

const BusinessDetailsCard = ({ business }: BusinessDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
        <CardDescription>
          Update your business information used on receipts and reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BusinessDetailsForm business={business} />
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsCard;
