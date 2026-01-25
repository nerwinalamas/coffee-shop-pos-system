import AppLogo from "@/components/app-logo";
import AppName from "@/components/app-name";

const SidebarLogo = () => {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <AppLogo size="sm" />
      <div className="flex flex-col">
        <span className="font-semibold text-lg text-gray-900">
          <AppName />
        </span>
        <span className="text-xs text-gray-500">Coffee Shop POS</span>
      </div>
    </div>
  );
};

export default SidebarLogo;
