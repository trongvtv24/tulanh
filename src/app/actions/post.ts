"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePostAction(postId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // RLS policies on the database will prevent unauthorized updates,
  // but we can also explictly check ownership here if needed.

  const { error } = await supabase
    .from("posts")
    .update({ content })
    .eq("id", postId);

  if (error) {
    throw new Error(error.message);
  }

  // Revalidate relevant paths to refresh data without full reload
  revalidatePath("/");
  revalidatePath("/feed");
}
