import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import AppErrorCode from "@/constants/AppErrorCode";

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "Not authorized",
          code: AppErrorCode.InvalidAccessToken,
        },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: "Access Token invalid or expired",
          code: AppErrorCode.InvalidAccessToken,
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

// import { NextRequest, NextResponse } from "next/server";
// import { verifyAccessToken } from "@/lib/jwt";

// export async function middleware(request: NextRequest) {
//   const protectedRoutes = ["/user", "/profile", "/document"];
//   const path = request.nextUrl.pathname;

//   if (protectedRoutes.some((route) => path.startsWith(route))) {
//     const accessToken = request.cookies.get("accessToken")?.value;

//     if (accessToken) {
//       const payload = await verifyAccessToken(accessToken);
//       if (payload) {
//         return NextResponse.next();
//       }
//     }

//     const refreshResponse = await fetch(
//       `${request.nextUrl.origin}/api/refresh`,
//       {
//         method: "GET",
//         headers: {
//           Cookie: request.headers.get("cookie") || "",
//         },
//       }
//     );

//     if (refreshResponse.ok) {
//       return NextResponse.next();
//     }

//     return NextResponse.json(
//       { error: "Unauthorized or session expired" },
//       { status: 401 }
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/user/:path*", "/profile/:path*", "/document/:path*"],
// };
