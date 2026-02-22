import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "./profile-form";
import { Profiles } from "@/types/profiles.types";

interface ProfileInformationCardProps {
  profile: Pick<
    Profiles,
    "first_name" | "last_name" | "phone" | "email" | "status" | "role"
  >;
}

const ProfileInformationCard = ({ profile }: ProfileInformationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={profile.status === "Active" ? "default" : "destructive"}
            >
              {profile.status}
            </Badge>
            <Badge variant="outline">{profile.role}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ProfileForm profile={profile} />
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;
