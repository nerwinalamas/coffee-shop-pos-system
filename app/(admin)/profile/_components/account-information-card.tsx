import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Profiles } from "@/types/profiles.types";

interface AccountInformationCardProps {
  profile: Pick<Profiles, "id" | "created_at" | "updated_at" | "role">;
}

const AccountInformationCard = ({ profile }: AccountInformationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>View your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="text-sm font-mono">{profile.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Created At
            </p>
            <p className="text-sm">
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Last Updated
            </p>
            <p className="text-sm">
              {profile.updated_at
                ? new Date(profile.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account Type
            </p>
            <p className="text-sm">{profile.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformationCard;
