import { Coffee } from "lucide-react";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
}

const AppLogo = ({ size = "md" }: AppLogoProps) => {
  const sizeStyles = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div
      className={`bg-amber-600 rounded-2xl flex items-center justify-center ${sizeStyles[size]}`}
    >
      <Coffee className={`text-white ${iconSizes[size]}`} />
    </div>
  );
};

export default AppLogo;
