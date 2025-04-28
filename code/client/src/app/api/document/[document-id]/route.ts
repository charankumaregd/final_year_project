import { NextRequest, NextResponse } from "next/server";

import { updateDocumentSchema } from "@/lib/zod";
import {
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "@/services/document";
import {
  deleteDocumentAccess,
  getDocumentAccessByUser,
  hasPermission,
} from "@/services/document-access";
import { AccessRole } from "@prisma/client";

type DocumentParams = {
  params: Promise<{
    "document-id": string;
  }>;
};

export async function GET(request: NextRequest, { params }: DocumentParams) {
  try {
    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const resolvedParams = await params;

    const documentId = resolvedParams["document-id"];

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID not provided" },
        { status: 400 }
      );
    }

    const documentAccess = await hasPermission(documentId, userId);

    if (!documentAccess) {
      return NextResponse.json(
        { error: "User does not have access to this document" },
        { status: 403 }
      );
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: DocumentParams) {
  try {
    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const resolvedParams = await params;

    const documentId = resolvedParams["document-id"];

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID not provided" },
        { status: 400 }
      );
    }

    const documentAccess = await hasPermission(
      documentId,
      userId,
      AccessRole.EDITOR
    );

    if (!documentAccess) {
      return NextResponse.json(
        { error: "User does not have access to this document" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { title, content } = updateDocumentSchema.parse(body);

    const updatedDocument = await updateDocument(documentId, title, content);

    return NextResponse.json(
      { message: "Document updated successfully", updatedDocument },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: DocumentParams) {
  try {
    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const resolvedParams = await params;

    const documentId = resolvedParams["document-id"];

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID not provided" },
        { status: 400 }
      );
    }

    const documentAccess = await hasPermission(documentId, userId);

    if (!documentAccess) {
      return NextResponse.json(
        { error: "User does not have access to this document" },
        { status: 403 }
      );
    }

    const role = await getDocumentAccessByUser(documentId, userId);

    if (role === AccessRole.OWNER) {
      await deleteDocument(userId, documentId);
    } else {
      await deleteDocumentAccess(documentId, userId);
    }

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "Error deleting document:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
