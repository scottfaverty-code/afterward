import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/setup-account";

  if (code) {
    const redirectUrl = `${origin}${next}`;

    // Build the redirect response first — Supabase will set session cookies
    // directly on it via setAll, preserving Supabase's own options (httpOnly: false)
    // so the browser client can read them via document.cookie.
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // Read from the incoming request (needed for PKCE code verifier)
          getAll() {
            return request.cookies.getAll();
          },
          // Write directly onto the redirect response, using Supabase's options
          // (not overriding them). Never force httpOnly here — the browser client
          // reads session cookies via document.cookie and requires httpOnly: false.
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/setup-account?error=invalid_link`);
}
