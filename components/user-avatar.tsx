import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserAvatar = async () => {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const userMetaData = currentUser?.user_metadata;
  const displayName =
    `${userMetaData?.first_name || ""} ${userMetaData?.last_name || ""}`.trim() ||
    "User";
  const initials = getInitials(displayName);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-amber-100 text-amber-700 text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium capitalize">{displayName}</span>
      </div>
    </div>
  );
};

export default UserAvatar;
