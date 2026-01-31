"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileFormData = {
  business_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
};

export async function updateProfile(data: ProfileFormData) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User not authenticated" };
    }

    // Update profile in database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        business_name: data.business_name,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return { error: "Failed to update profile" };
    }

    // If email changed, update auth.users email
    if (data.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (emailError) {
        console.error("Email update error:", emailError);
        return {
          error:
            "Failed to update email. Please check your new email for confirmation.",
        };
      }
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  try {
    const supabase = await createClient();

    // Verify current password by attempting to sign in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User not authenticated" };
    }

    // Re-authenticate with current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return { error: "Current password is incorrect" };
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      return { error: "Failed to update password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "An unexpected error occurred" };
  }
}
