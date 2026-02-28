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
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

interface POSSignInFormProps {
  onSuccess: (user: { name: string; role: string }) => void;
}

const POSSignInForm = ({ onSuccess }: POSSignInFormProps) => {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
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
        setError("Invalid email or password.");
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, role, status")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          setError("Unable to fetch user profile.");
          return;
        }

        if (profile.status !== "Active") {
          await supabase.auth.signOut();
          setError("Your account is inactive. Please contact your admin.");
          return;
        }

        onSuccess({
          name: `${profile.first_name} ${profile.last_name}`,
          role: profile.role,
        });
      }
    } catch {
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
                  placeholder="staff@coffeeshop.com"
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
          className="w-full bg-amber-600 hover:bg-amber-700 mt-2"
        >
          {isSubmitting ? "Signing In..." : "Sign In to POS"}
        </Button>
      </div>
    </Form>
  );
};

export default POSSignInForm;
