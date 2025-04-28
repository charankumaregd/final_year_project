import { VerificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { setAuthCookies } from "@/lib/cookies";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { verifyEmailSchema } from "@/lib/zod";
import { createSession } from "@/services/session";
import { getUserByEmail, updateUserEmailVerified } from "@/services/user";
import {
  getVerificationCode,
  deleteVerificationCode,
} from "@/services/verification-code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, verificationCode } = verifyEmailSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const codeRecord = await getVerificationCode(
      user.id,
      VerificationType.EMAIL_VERIFICATION
    );

    if (!codeRecord || codeRecord.code !== verificationCode) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    if (codeRecord.expiresAt < new Date()) {
      await deleteVerificationCode(codeRecord.id);
      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 }
      );
    }

    await updateUserEmailVerified(user.id);

    await deleteVerificationCode(codeRecord.id);

    const userAgent = request.headers.get("user-agent") || "Unknown";

    const session = await createSession(user.id, userAgent);

    const accessToken = await generateAccessToken(user.id, session.id);

    const refreshToken = await generateRefreshToken(user.id, session.id);

    const response = NextResponse.json({
      message: "Email verified successfully!",
    });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
