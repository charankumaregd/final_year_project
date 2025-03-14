import { NextRequest, NextResponse } from "next/server";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/jwt";
import { getSessionById, refreshSessionExpiresAt } from "@/services/session";
import { setAccessToken, setRefreshToken } from "@/lib/cookies";

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token missing" },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 403 }
      );
    }

    const session = await getSessionById(payload.sessionId);

    if (!session || session.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Session expired" }, { status: 403 });
    }

    const sessionNeedsRefresh =
      session.expiresAt.getTime() - Date.now() <= 24 * 60 * 60 * 1000;

    if (sessionNeedsRefresh) {
      await refreshSessionExpiresAt(payload.sessionId);
    }

    const accessToken = await generateAccessToken(
      payload.userId,
      payload.sessionId
    );

    const newRefreshToken = sessionNeedsRefresh
      ? await generateRefreshToken(payload.userId, payload.sessionId)
      : undefined;

    const response = NextResponse.json({ message: "Access token refreshed" });

    setAccessToken(response, accessToken);

    if (newRefreshToken) {
      setRefreshToken(response, newRefreshToken);
    }

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
