import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, verificationCode, newPassword } =
      resetPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const verificationCodeExists = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code: verificationCode,
        type: "PASSWORD_RESET",
      },
    });

    if (!verificationCodeExists) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationCode.delete({
      where: { id: verificationCodeExists.id },
    });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
