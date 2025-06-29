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
  const { pathname, search } = request.nextUrl;

  // Se não está logado e tenta acessar /scanner-invite
  if (!currentUser && pathname.startsWith("/scanner-invite")) {
    // Redireciona para login com redirect para o convite
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
