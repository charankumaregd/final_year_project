import { VerificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { sendVerificationCodeMail } from "@/lib/resend";
import { registerSchema } from "@/lib/zod";
import { createUser, getUserByEmail } from "@/services/user";
import { createVerificationCode } from "@/services/verification-code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const user = await createUser(name, email, password);

    const { code } = await createVerificationCode(
      user.id,
      VerificationType.EMAIL_VERIFICATION
    );

    await sendVerificationCodeMail(email, code);

    return NextResponse.json({
      message: "User registered. Check your email for the verification code.",
    });
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
