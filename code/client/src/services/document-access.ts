import { AccessRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getSharedDocumentsForUser(userId: string) {
  try {
    const accesses = await prisma.documentAccess.findMany({
      where: {
        userId,
        role: {
          not: AccessRole.OWNER,
        },
      },
      include: {
        document: true,
      },
      orderBy: {
        document: {
          updatedAt: "desc",
        },
      },
    });

    return accesses.map((access) => access.document);
  } catch (error: unknown) {
    console.error("Error fetching shared documents for user:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch shared documents");
    }
  }
}

export async function getUsersByDocumentId(documentId: string) {
  try {
    return await prisma.documentAccess.findMany({
      where: {
        documentId,
      },
      include: {
        user: true,
      },
      orderBy: {
        role: "desc",
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching users of document:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get users of document");
    }
  }
}

export async function getDocumentAccessByUser(
  documentId: string,
  userId: string
) {
  try {
    const documentAccess = await prisma.documentAccess.findUnique({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
    });

    return documentAccess?.role ?? null;
  } catch (error: unknown) {
    console.error("Error getting user role:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get user role for document");
    }
  }
}

export async function createDocumentAccess(
  documentId: string,
  userId: string,
  role: AccessRole
) {
  try {
    const existingAccess = await prisma.documentAccess.findUnique({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
    });

    if (existingAccess) {
      throw new Error("User already has access to this document.");
    }

    return await prisma.documentAccess.create({
      data: {
        documentId,
        userId,
        role,
      },
    });
  } catch (error: unknown) {
    console.error("Error creating document access:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create document access");
    }
  }
}

export async function updateDocumentAccess(
  documentId: string,
  userId: string,
  role: AccessRole
) {
  try {
    return await prisma.documentAccess.update({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  } catch (error: unknown) {
    console.error("Error updating document access:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update document access");
    }
  }
}

export async function deleteDocumentAccess(documentId: string, userId: string) {
  try {
    return await prisma.documentAccess.delete({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error deleting document access:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete document access");
    }
  }
}

export async function hasPermission(
  documentId: string,
  userId: string,
  minimumRole: AccessRole = AccessRole.VIEWER
) {
  try {
    const role = await getDocumentAccessByUser(documentId, userId);

    if (role === null || role === undefined) return false;

    const roleHierarchy = {
      VIEWER: 0,
      EDITOR: 1,
      OWNER: 2,
    };

    const roleValue = roleHierarchy[role as keyof typeof roleHierarchy];
    const minRoleValue =
      roleHierarchy[minimumRole as keyof typeof roleHierarchy];

    return roleValue >= minRoleValue;
  } catch (error: unknown) {
    console.error("Error checking permission:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to check permission");
    }
  }
}
