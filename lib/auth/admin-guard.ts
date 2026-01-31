import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function adminGuard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || !["Owner", "Admin"].includes(profile.role)) {
    await supabase.auth.signOut();
    redirect("/auth/sign-in?error=admin_only");
  }

  if (profile.status !== "Active") {
    await supabase.auth.signOut();
    redirect("/auth/sign-in?error=account_inactive");
  }

  return { user, profile };
}
