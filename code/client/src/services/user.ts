import { hashPassword } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { getRandomColor } from "@/lib/utils";

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const hashedPassword = await hashPassword(password);
    const color = getRandomColor();

    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        color,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function getUserById(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to retrieve user by ID");
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to retrieve user by email");
  }
}

export async function updateUserEmailVerified(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return true;
  } catch (error) {
    console.error("Error updating user password:", error);
    return false;
  }
}

export function withoutPassword<T extends { password?: string }>(
  user: T
): Omit<T, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
