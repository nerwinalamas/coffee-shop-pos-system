import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";

const menuItems = [
  {
    icon: User2,
    label: "Profile Settings",
    href: "/profile",
  },
  // {
  //   icon: CreditCard,
  //   label: "Billing",
  //   href: "/billing",
  // },
  // {
  //   icon: Bell,
  //   label: "Notifications",
  //   href: "/notifications",
  // },
  // {
  //   icon: Settings,
  //   label: "Settings",
  //   href: "/settings",
  // },
];

const MenuItems = () => {
  return (
    <div>
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <DropdownMenuItem key={index} asChild>
            <Link href={item.href} className="cursor-pointer">
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </div>
  );
};

export default MenuItems;
