import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";

const menuItems = [
  {
    icon: User2,
    label: "Profile Settings",
  },
  // {
  //   icon: CreditCard,
  //   label: "Billing",
  // },
  // {
  //   icon: Bell,
  //   label: "Notifications",
  // },
  // {
  //   icon: Settings,
  //   label: "Settings",
  // },
];

const AppSidebarMenuItems = () => {
  return (
    <div>
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <DropdownMenuItem key={index}>
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        );
      })}
    </div>
  );
};

export default AppSidebarMenuItems;
