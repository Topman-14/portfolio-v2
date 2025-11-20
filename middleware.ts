import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith(routes.signIn)) {
    const sessionToken = request.cookies.get('authjs.session-token')?.value || 
                        request.cookies.get('__Secure-authjs.session-token')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL(routes.signIn, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|img).*)",
  ],
};