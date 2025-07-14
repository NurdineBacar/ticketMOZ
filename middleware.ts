import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas protegidas
const protectedRoutes = [
  "/dashboard",
  "/events",
  "/tickets",
  "/scanner-invite",
];
// Rotas públicas
const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("authToken")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const { pathname, search } = request.nextUrl;

  // Permitir sempre a home
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Se usuário está logado, verifica isVerify
  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      // Bloqueia tudo (exceto "/") se isVerify for false
      if (user.isVerify === false) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Se for promotor e company.isVerify é null, bloqueia também
      if (
        user.user_type === "promotor" &&
        user.company &&
        user.company.isVerify === null
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      // Se erro ao parsear, força logout
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  // Se não está logado e tenta acessar /scanner-invite
  if (!currentUser && pathname.startsWith("/scanner-invite")) {
    const redirectUrl = `/auth/sign-in?redirect=${encodeURIComponent(
      pathname + search
    )}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Se não está logado e tenta acessar outras rotas protegidas
  if (
    !currentUser &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}
