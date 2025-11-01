import { Coffee } from "lucide-react";

const SidebarLogo = () => {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
        <Coffee className="h-6 w-6 text-amber-600" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-lg text-gray-900">CafeAdmin</span>
        <span className="text-xs text-gray-500">Coffee Shop POS</span>
      </div>
    </div>
  );
};

export default SidebarLogo;
