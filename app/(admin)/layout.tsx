import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Get user profile to check role and status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  // Redirect if not Admin
  if (!profile || profile.role !== "Admin") {
    await supabase.auth.signOut();
    redirect("/auth/sign-in?error=admin_only");
  }

  // Redirect if account is inactive
  if (profile.status !== "Active") {
    await supabase.auth.signOut();
    redirect("/auth/sign-in?error=account_inactive");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
