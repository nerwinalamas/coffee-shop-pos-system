import { createClient } from "@/lib/supabase/server";

const UserInfo = async () => {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const userMetaData = currentUser?.user_metadata;
  const displayName =
    `${userMetaData?.first_name || ""} ${userMetaData?.last_name || ""}`.trim() ||
    "User";
  const email = currentUser?.email || "No email";

  return (
    <div className="px-2 py-1.5">
      <p className="text-sm font-medium capitalize">{displayName}</p>
      <p className="text-xs text-gray-500">{email}</p>
    </div>
  );
};

export default UserInfo;
