"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth-actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const result = await signOut();

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/auth/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      disabled={isLoading}
      className="text-red-600 focus:text-red-600 focus:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isLoading ? "Signing out..." : "Sign out"}</span>
    </DropdownMenuItem>
  );
};

export default SignOutButton;
