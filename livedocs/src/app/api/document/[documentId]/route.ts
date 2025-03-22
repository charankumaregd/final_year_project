import {
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "@/services/document";
import { NextRequest, NextResponse } from "next/server";
import { updateDocumentSchema } from "@/lib/zod";

export interface DocumentParams {
  params: Promise<{
    documentId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: DocumentParams) {
  try {
    const { documentId } = await params;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID not provided" },
        { status: 400 }
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
    const { documentId } = await params;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID not provided" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { title, content } = updateDocumentSchema.parse(body);

    const updatedDocument = await updateDocument(
      documentId,
      title || "",
      content || ""
    );

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

    const { documentId } = await params;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID not provided" },
        { status: 400 }
      );
    }

    await deleteDocument(userId, documentId);

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
