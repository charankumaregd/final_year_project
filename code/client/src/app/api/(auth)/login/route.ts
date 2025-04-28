import { NextRequest, NextResponse } from "next/server";

import { comparePassword } from "@/lib/bcrypt";
import { setAuthCookies } from "@/lib/cookies";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/zod";
import { getUserByEmail } from "@/services/user";
import { createSession } from "@/services/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = loginSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";

    const session = await createSession(user.id, userAgent);

    const accessToken = await generateAccessToken(user.id, session.id);

    const refreshToken = await generateRefreshToken(user.id, session.id);

    const response = NextResponse.json(
      {
        message: "Login successful!",
      },
      { status: 200 }
    );

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
