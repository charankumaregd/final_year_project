import { VerificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { sendVerificationCodeMail } from "@/lib/resend";
import { getEmailSchema } from "@/lib/zod";
import { getUserByEmail } from "@/services/user";
import { createVerificationCode } from "@/services/verification-code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email } = getEmailSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { code } = await createVerificationCode(
      user.id,
      VerificationType.PASSWORD_RESET
    );

    await sendVerificationCodeMail(email, code);

    return NextResponse.json({
      message: "Check your email for the verification code.",
    });
  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
