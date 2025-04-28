import { prisma } from "@/lib/prisma";

export async function createDocument(userId: string, title?: string) {
  try {
    const documentTitle = title?.trim() || (await generateNextTitle(userId));

    return await prisma.document.create({
      data: {
        title: documentTitle,
        content: "",
        ownerId: userId,
      },
    });
  } catch (error: unknown) {
    console.error("Error creating document:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create document");
    }
  }
}

export async function getDocumentsByUserId(userId: string) {
  try {
    return await prisma.document.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching documents:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch documents");
    }
  }
}

export async function getDocumentById(documentId: string) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  } catch (error: unknown) {
    console.error("Error fetching document by ID:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch document");
    }
  }
}

export async function updateDocument(
  documentId: string,
  title?: string,
  content?: string
) {
  try {
    const data: Record<string, string> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data,
    });

    return updatedDocument;
  } catch (error: unknown) {
    console.error("Error updating document:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update document");
    }
  }
}

export async function deleteDocument(userId: string, documentId: string) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.ownerId !== userId) {
      throw new Error("Unauthorized to delete this document");
    }

    const deletedDocument = await prisma.document.delete({
      where: { id: documentId },
    });

    return deletedDocument;
  } catch (error: unknown) {
    console.error("Error deleting document:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete document");
    }
  }
}

export async function generateNextTitle(userId: string): Promise<string> {
  try {
    const untitledDocs = await prisma.document.findMany({
      where: {
        ownerId: userId,
        title: {
          startsWith: "Untitled",
        },
      },
    });

    const maxNumber = untitledDocs
      .map((doc) => {
        const match = doc.title.match(/^Untitled (\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .reduce((max, num) => (num > max ? num : max), 0);

    return `Untitled ${maxNumber + 1}`;
  } catch (error: unknown) {
    console.error("Error generating next title:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to generate document title");
    }
  }
}
