"use client";

import { usePathname } from "next/navigation";
import { getPageName } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import NotificationBell from "./notification-bell";
import { useProfile } from "@/hooks/useProfile";

const AppHeader = () => {
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  const { data: profile } = useProfile();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <div className="flex flex-1 items-center justify-between gap-2">
        <h1 className="text-sm font-semibold">{pageName}</h1>
        <NotificationBell businessId={profile?.business_id ?? undefined} />
      </div>
    </header>
  );
};

export default AppHeader;
