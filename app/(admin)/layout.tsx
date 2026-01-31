import { adminGuard } from "@/lib/auth/admin-guard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AppHeader from "@/components/app-header";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await adminGuard();

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
