import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "Not authorized",
        },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: "Access Token invalid or expired",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.next();

    response.headers.set("userId", payload.userId);

    response.headers.set("sessionId", payload.sessionId);

    return response;
  } catch (error) {
    console.error("Middleware Error: ", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/api/user/:path*", "/api/session/:path*", "/api/logout"],
};
