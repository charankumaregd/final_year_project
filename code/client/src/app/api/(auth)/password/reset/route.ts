import { NextRequest, NextResponse } from "next/server";

import { resetPasswordSchema } from "@/lib/zod";
import { getUserByEmail, updateUserPassword } from "@/services/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, newPassword } = resetPasswordSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await updateUserPassword(user.id, newPassword);

    return NextResponse.json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
