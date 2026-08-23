import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/settings",
  "/billing",
  "/chat",
  "/flows",
  "/agents",
  "/voice",
  "/apps",
  "/backend",
  "/database",
  "/storage",
  "/integrations",
  "/help",
];

const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("access_token")?.value);

  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isAuthPage = authPages.includes(pathname);

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/chat/:path*",
    "/flows/:path*",
    "/agents/:path*",
    "/voice/:path*",
    "/apps/:path*",
    "/backend/:path*",
    "/database/:path*",
    "/storage/:path*",
    "/integrations/:path*",
    "/help/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
