"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createUser(formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "Owner" | "Admin" | "Manager" | "Staff";
  status?: "Active" | "Inactive";
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return { error: "Unauthorized" };
    }

    // Check if user has admin/owner role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, business_name")
      .eq("id", currentUser.id)
      .single();

    if (!profile || !["Owner", "Admin"].includes(profile.role)) {
      return { error: "Forbidden: Admin access required" };
    }

    const adminSupabase = createAdminClient();

    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          business_name: profile.business_name,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          role: formData.role,
        },
      });

    if (authError) {
      return { error: authError.message };
    }

    // Update profile with correct role and status
    if (authData.user) {
      const { error: updateError } = await adminSupabase
        .from("profiles")
        .update({
          role: formData.role,
          status: formData.status || "Active",
        })
        .eq("id", authData.user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
      }
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Create user error:", error);
    return { error: "Failed to create user" };
  }
}

export async function updateUser(
  userId: string,
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
  },
) {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return { error: "Unauthorized" };
    }

    // Check permissions
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || !["Owner", "Admin"].includes(profile.role)) {
      return { error: "Forbidden: Admin access required" };
    }

    // Use admin client to update profile (bypasses RLS)
    const adminSupabase = createAdminClient();

    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      })
      .eq("id", userId);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "Failed to update user" };
  }
}

export async function updateUserRole(
  userId: string,
  formData: {
    role: "Owner" | "Admin" | "Manager" | "Staff";
  },
) {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return { error: "Unauthorized" };
    }

    // Check permissions - only Owner/Admin can change roles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || !["Owner", "Admin"].includes(profile.role)) {
      return { error: "Forbidden: Admin access required" };
    }

    // Prevent users from changing their own role
    if (currentUser.id === userId) {
      return { error: "You cannot change your own role" };
    }

    // Use admin client to update role (bypasses RLS)
    const adminSupabase = createAdminClient();

    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({
        role: formData.role,
      })
      .eq("id", userId);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Update user role error:", error);
    return { error: "Failed to update user role" };
  }
}

export async function updateUserStatus(
  userId: string,
  formData: {
    status: "Active" | "Inactive";
  },
) {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return { error: "Unauthorized" };
    }

    // Check permissions
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || !["Owner", "Admin"].includes(profile.role)) {
      return { error: "Forbidden: Admin access required" };
    }

    // Prevent users from deactivating themselves
    if (currentUser.id === userId) {
      return { error: "You cannot change your own status" };
    }

    // Use admin client
    const adminSupabase = createAdminClient();

    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({
        status: formData.status,
      })
      .eq("id", userId);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Update user status error:", error);
    return { error: "Failed to update user status" };
  }
}

export async function resetUserPassword(
  userId: string,
  formData: {
    newPassword: string;
  },
) {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return { error: "Unauthorized" };
    }

    // Check permissions - only Owner/Admin can reset passwords
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || !["Owner", "Admin"].includes(profile.role)) {
      return { error: "Forbidden: Admin access required" };
    }

    // Use admin client to update password
    const adminSupabase = createAdminClient();

    const { error: updateError } =
      await adminSupabase.auth.admin.updateUserById(userId, {
        password: formData.newPassword,
      });

    if (updateError) {
      return { error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Failed to reset password" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return { error: "Unauthorized" };
    }

    // Check permissions
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || !["Owner", "Admin"].includes(profile.role)) {
      return { error: "Forbidden: Admin access required" };
    }

    // Prevent users from deleting themselves
    if (currentUser.id === userId) {
      return { error: "You cannot delete your own account" };
    }

    // Use admin client to delete user from auth
    const adminSupabase = createAdminClient();

    const { error: deleteError } =
      await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // Revalidate the users page
    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}
