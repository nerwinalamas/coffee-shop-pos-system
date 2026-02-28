"use client";

import { useState, useEffect } from "react";
import Menu from "./_components/menu";
import OrderDetails from "./_components/order-details";
import POSSignInForm from "@/components/forms/pos-sign-in-form";
import AppLogo from "@/components/app-logo";
import AppName from "@/components/app-name";
import { createClient } from "@/lib/supabase/client";

interface POSUser {
  name: string;
  role: string;
}

const Home = () => {
  const [posUser, setPosUser] = useState<POSUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, role, status")
          .eq("id", user.id)
          .single();

        if (profile && profile.status === "Active") {
          setPosUser({
            name: `${profile.first_name} ${profile.last_name}`,
            role: profile.role,
          });
        }
      }

      setIsChecking(false);
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setPosUser(null);
  };

  if (isChecking) {
    return (
      <div className="container mx-auto grid grid-cols-12 gap-4 h-screen p-4">
        <div className="col-span-full bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!posUser) {
    return (
      <div className="container mx-auto grid grid-cols-12 gap-4 h-screen p-4">
        <div className="col-span-full bg-white rounded-lg shadow-sm h-full p-4 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center">
              <AppLogo />
              <h1 className="text-2xl font-bold text-gray-900">POS Login</h1>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to <AppName /> POS
              </p>
            </div>
            <POSSignInForm onSuccess={setPosUser} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-12 gap-4 h-screen p-4">
      <Menu posUser={posUser} onSignOut={handleSignOut} />
      <OrderDetails />
    </div>
  );
};

export default Home;
