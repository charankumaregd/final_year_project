import { VerificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { sendVerificationCodeMail } from "@/lib/resend";
import { getEmailSchema } from "@/lib/zod";
import { getUserByEmail } from "@/services/user";
import {
  createVerificationCode,
  deleteVerificationCode,
  getVerificationCode,
} from "@/services/verification-code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email } = getEmailSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingCode = await getVerificationCode(
      user.id,
      VerificationType.PASSWORD_RESET
    );

    if (existingCode) {
      await deleteVerificationCode(existingCode.id);
    }

    const { code } = await createVerificationCode(
      user.id,
      VerificationType.PASSWORD_RESET
    );

    await sendVerificationCodeMail(email, code);

    return NextResponse.json({
      message: "Verification code resent! Please check your email.",
    });
  } catch (error) {
    console.error("Resend error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
