import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const payload = await verifyToken(token);
    const pathname = request.nextUrl.pathname;
    const restrictedPaths = ["/admin", "/supplier", "/products", "/categories"];

    const isRestricted = restrictedPaths.some((path) =>
      pathname.startsWith(path),
    );

    if (isRestricted && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/supplier/:path*",
    "/products/:path*",
    "/purchases/:path*",
    "/sales/:path*",
    "/category/:path*",
  ],
};
