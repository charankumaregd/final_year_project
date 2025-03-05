import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmailSchema } from "@/lib/zod";
import { VerificationType } from "@prisma/client";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, verificationCode } = verifyEmailSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const verificationCodeExists = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code: verificationCode,
        type: VerificationType.EMAIL_VERIFICATION,
        expiresAt: { gte: new Date() },
      },
    });

    if (!verificationCodeExists) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    await prisma.verificationCode.delete({
      where: { id: verificationCodeExists.id },
    });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const response = NextResponse.json({
      message: "Email verified successfully!",
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("OTP Verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
