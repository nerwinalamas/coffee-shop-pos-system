import Link from "next/link";
import AppLogo from "@/components/app-logo";
import SignInForm from "@/components/forms/sign-in-form";
import CopyRight from "@/components/copy-right";
import AppName from "@/components/app-name";

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) => {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <AppLogo />
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to <AppName /> Portal
            </p>
          </div>

          {params.error === "admin_only" && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4 text-sm">
              Access denied. Admin login only.
            </div>
          )}

          {params.error === "account_inactive" && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4 text-sm">
              Your account is inactive. Please contact support.
            </div>
          )}

          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="sign-up"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <CopyRight />
      </div>
    </div>
  );
};

export default SignInPage;
