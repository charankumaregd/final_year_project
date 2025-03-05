import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 400 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const session = await prisma.session.findFirst({
      where: { userId, refreshToken },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAccessToken = generateAccessToken(user.id, user.email);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const response = NextResponse.json({
      message: "Token refreshed sucessfully",
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
