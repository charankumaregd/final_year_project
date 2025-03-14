import { prisma } from "@/lib/prisma";
import { VerificationType } from "@prisma/client";

export async function createVerificationCode(
  userId: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET"
) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    return await prisma.verificationCode.create({
      data: {
        userId,
        code,
        type,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Error creating verification code:", error);
    throw new Error("Failed to create verification code");
  }
}

export async function getVerificationCode(
  userId: string,
  type: VerificationType
) {
  return await prisma.verificationCode.findUnique({
    where: {
      userId_type: {
        userId,
        type,
      },
    },
  });
}

export async function deleteVerificationCode(id: string) {
  return await prisma.verificationCode.delete({ where: { id } });
}
