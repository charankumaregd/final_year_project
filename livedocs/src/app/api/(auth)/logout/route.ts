import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";
import cookie from "cookie";

export async function POST(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 400 }
      );
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const session = await prisma.session.findFirst({
      where: { userId },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    await prisma.session.delete({ where: { id: session.id } });

    const response = NextResponse.json({ message: "Logout successful" });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
