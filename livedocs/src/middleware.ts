import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/user", "/profile", "/document"];
  const authRoute = req.nextUrl.pathname;

  if (protectedRoutes.includes(authRoute)) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/profile/:path*", "/document/:path*"],
};
