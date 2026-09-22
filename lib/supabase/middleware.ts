import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedPathnames = [
  "/",
  "/announcements",
  "/documents",
  "/meetings",
  "/my-work",
  "/reports",
  "/risks-and-issues",
  "/settings",
  "/suppliers",
  "/tasks",
  "/team",
  "/timeline",
  "/workstreams",
  "/admin",
];

function isProtectedPath(pathname: string) {
  return (
    pathname === "/" ||
    protectedPathnames.some((entry) => entry !== "/" && pathname.startsWith(entry))
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPendingRoute = pathname === "/pending-approval";

  if (!user) {
    if (isProtectedPath(pathname)) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_admin")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const { data: membership } = profile
    ? await supabase.from("project_memberships").select("status").eq("user_id", profile.id).maybeSingle()
    : { data: null };

  const membershipStatus = membership?.status ?? "pending";
  const isApproved = membershipStatus === "approved";
  const isAdmin = profile?.is_admin ?? false;

  if (pathname === "/login" || pathname === "/register") {
    const destination = isApproved ? "/" : "/pending-approval";
    const redirectUrl = new URL(destination, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPendingRoute && isApproved) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (pathname === "/admin") {
    if (!isAdmin) {
      const destination = isApproved ? "/" : "/pending-approval";
      const redirectUrl = new URL(destination, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
  }

  if (isProtectedPath(pathname) && !isApproved && !isAdmin) {
    const pendingUrl = new URL("/pending-approval", request.url);
    return NextResponse.redirect(pendingUrl);
  }

  return supabaseResponse;
}
