import { AccessRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  createDocumentAccess,
  deleteDocumentAccess,
  getSharedDocumentsForUser,
  updateDocumentAccess,
} from "@/services/document-access";
import { getUserByEmail, getUserById } from "@/services/user";
import {
  createDocumentAccessSchema,
  deleteDocumentAccessSchema,
  updateDocumentAccessSchema,
} from "@/lib/zod";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sharedDocuments = await getSharedDocumentsForUser(userId);

    return NextResponse.json(
      { message: "Shared Documents fetched successfully", sharedDocuments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shared documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, documentId } = createDocumentAccessSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await createDocumentAccess(documentId, user.id, AccessRole.VIEWER);

    return NextResponse.json(
      { message: "Document Access created successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error creating document access:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Failed to create document access" },
        { status: 500 }
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, documentId, role } = updateDocumentAccessSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await updateDocumentAccess(documentId, user.id, role);

    return NextResponse.json(
      { message: "Document Access updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating document access:", error);
    return NextResponse.json(
      { error: "Failed to update document access" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, documentId } = deleteDocumentAccessSchema.parse(body);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await deleteDocumentAccess(documentId, user.id);

    return NextResponse.json(
      { message: "Document Access deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document access:", error);
    return NextResponse.json(
      { error: "Failed to delete document access" },
      { status: 500 }
    );
  }
}
