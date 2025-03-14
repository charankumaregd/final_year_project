import { getEmailSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/services/user";
import { createVerificationCode } from "@/services/verificationCode";
import { sendVerificationCodeMail } from "@/lib/resend";

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
      "EMAIL_VERIFICATION"
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
