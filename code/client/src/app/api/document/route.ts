import { AccessRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { createDocumentSchema } from "@/lib/zod";
import { createDocument, getDocumentsByUserId } from "@/services/document";
import { createDocumentAccess } from "@/services/document-access";
import { getUserById } from "@/services/user";

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

    const documents = await getDocumentsByUserId(userId);

    return NextResponse.json(
      { message: "Documents fetched successfully", documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    let body = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { title } = createDocumentSchema.parse(body);

    const document = await createDocument(userId, title);

    await createDocumentAccess(document.id, userId, AccessRole.OWNER);

    return NextResponse.json(
      { message: "Document created successfully", document },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
