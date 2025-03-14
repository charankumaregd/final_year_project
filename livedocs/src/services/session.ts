import { prisma } from "@/lib/prisma";

export async function createSession(userId: string, userAgent: string) {
  try {
    return await prisma.session.create({
      data: {
        userId,
        userAgent,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
}

export async function getSessionsByUserId(userId: string) {
  try {
    return await prisma.session.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching sessions by user ID:", error);
    throw new Error("Failed to fetch sessions");
  }
}

export async function getSessionById(sessionId: string) {
  try {
    return await prisma.session.findUnique({
      where: { id: sessionId },
    });
  } catch (error) {
    console.error("Error fetching session by ID:", error);
    throw new Error("Failed to fetch session");
  }
}

export async function refreshSessionExpiresAt(sessionId: string) {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt },
    });
  } catch (error) {
    console.error("Error refreshing session expiration:", error);
    throw new Error("Could not refresh session expiration");
  }
}

export async function deleteSession(sessionId: string) {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
    return { message: "Logout successful" };
  } catch (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
}
