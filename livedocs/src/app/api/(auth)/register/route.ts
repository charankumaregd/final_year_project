import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/resend";
import { randomInt } from "crypto";
import { VerificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const otp = randomInt(100000, 999999).toString();

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: otp,
        type: VerificationType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendMail({
      to: user.email,
      subject: "Verify Your Email - LiveDocs",
      text: `Your OTP code is: ${otp}. It expires in 15 minutes.`,
      html: `<p>Your OTP code is: ${otp}. It expires in 15 minutes</p>`,
    });

    return NextResponse.json({
      message: "User registered. Check email for OTP.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
