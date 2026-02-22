"use server";

import { createClient } from "@/lib/supabase/server";
import { Businesses } from "@/types/businesses.types";
import { revalidatePath } from "next/cache";

export type BusinessFormData = Pick<Businesses, "name" | "address" | "phone">;

export async function updateBusiness(data: BusinessFormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User not authenticated" };
    }

    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        name: data.name,
        address: data.address,
        phone: data.phone,
      })
      .eq("owner_id", user.id);

    if (updateError) {
      console.error("Business update error:", updateError);
      return { error: "Failed to update business details" };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update business error:", error);
    return { error: "An unexpected error occurred" };
  }
}
