"use client";

import Link from "next/link";
import AppLogo from "@/components/app-logo";
import SignUpForm from "@/components/forms/sign-up-form";
import CopyRight from "@/components/copy-right";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <AppLogo />
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">
              Start managing your coffee shop
            </p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="sign-in"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <CopyRight />
      </div>
    </div>
  );
};

export default SignUpPage;
