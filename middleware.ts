import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isRestaurantRoute = req.nextUrl.pathname.startsWith("/restaurant-panel");

    // Admin değilse admin sayfalarına erişimi engelle
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Restaurant sahibi değilse restaurant paneline erişimi engelle
    if (isRestaurantRoute && token?.role !== "RESTAURANT_OWNER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/restaurant-panel/:path*"],
}; 