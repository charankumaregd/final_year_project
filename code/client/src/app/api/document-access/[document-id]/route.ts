import {
  getDocumentAccessByUser,
  getUsersByDocumentId,
} from "@/services/document-access";
import { NextRequest, NextResponse } from "next/server";

type DocumentAccessParams = {
  params: Promise<{
    "document-id": string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: DocumentAccessParams
) {
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

    const sharedUsers = await getUsersByDocumentId(documentId);

    const currentUserRole = await getDocumentAccessByUser(documentId, userId);

    return NextResponse.json(
      {
        message: "Shared users fetched sucessfully",
        sharedUsers,
        currentUserRole,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shared users:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared users" },
      { status: 500 }
    );
  }
}
