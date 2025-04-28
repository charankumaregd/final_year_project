import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/cookies";
import { deleteSession } from "@/services/session";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID not found" },
        { status: 400 }
      );
    }

    await deleteSession(sessionId);

    const response = NextResponse.json({ message: "Logout successful" });
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
