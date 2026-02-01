import { createClient } from "@/lib/supabase/server";
import PageHeader from "./_components/page-header";
import ProfileInformationCard from "./_components/profile-information-card";
import PasswordChangeCard from "./_components/password-change-card";
import AccountInformationCard from "./_components/account-information-card";

const ProfilePage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <PageHeader />
      <ProfileInformationCard profile={profile} />
      <PasswordChangeCard />
      <AccountInformationCard profile={profile} />
    </div>
  );
};

export default ProfilePage;
