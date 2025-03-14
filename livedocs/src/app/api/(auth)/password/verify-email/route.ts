import { verifyEmailSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUserEmailVerified } from "@/services/user";
import {
  getVerificationCode,
  deleteVerificationCode,
} from "@/services/verificationCode";
import { VerificationType } from "@prisma/client";

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
      VerificationType.PASSWORD_RESET
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

    return NextResponse.json({
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
