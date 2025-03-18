import { NextRequest, NextResponse } from "next/server";
import { getSessionById, deleteSession } from "@/services/session";

interface SessionParams {
  params: {
    sessionId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: SessionParams) {
  try {
    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const sessionId = params.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID missing" },
        { status: 400 }
      );
    }

    const session = await getSessionById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this session" },
        { status: 403 }
      );
    }

    await deleteSession(sessionId);

    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
