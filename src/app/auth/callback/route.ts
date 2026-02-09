import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tulanh.online";

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${siteUrl}${next}`);
      } else {
        console.error("[Auth Callback] Exchange error:", error);
      }
    }

    return NextResponse.redirect(`${siteUrl}/auth?error=auth_code_error`);
  } catch (e) {
    console.error("[Auth Callback] CRITICAL UNCAUGHT ERROR:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
