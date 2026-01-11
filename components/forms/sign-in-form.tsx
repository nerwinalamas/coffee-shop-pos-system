"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignInForm = () => {
  const supabase = createClient();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.log("Sign in error:", error);
        setError(error.message);
        return;
      }

      if (data.user) {
        // Get user profile to check role and status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.log("Profile fetch error:", profileError);
          setError("Unable to fetch user profile");
          return;
        }

        // Check if user is Admin
        if (profile.role !== "Admin") {
          await supabase.auth.signOut();
          setError("Access denied. Admin login only.");
          return;
        }

        // Check if user is active
        if (profile.status !== "Active") {
          await supabase.auth.signOut();
          setError("Your account is inactive. Please contact support.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@coffeeshop.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 mt-6"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </Form>
  );
};

export default SignInForm;
