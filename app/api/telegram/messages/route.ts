import { NextRequest, NextResponse } from "next/server";

// In-memory store for messages (in production, use Redis or database)
// Structure: sessionId -> messages[]
interface Message {
  id: number;
  text: string;
  timestamp: string;
  sessionId: string;
}

if (!global.sessionMessages) {
  global.sessionMessages = new Map<string, Message[]>();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");
    const lastMessageId = parseInt(searchParams.get("lastMessageId") || "0");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Ensure sessionMessages map exists
    if (typeof global.sessionMessages === 'undefined') {
      global.sessionMessages = new Map<string, Message[]>();
    }

    // Get messages for this session
    const messages = global.sessionMessages.get(sessionId) || [];

    // Filter messages newer than lastMessageId
    const newMessages = messages.filter((msg) => msg.id > lastMessageId);

    return NextResponse.json({
      messages: newMessages,
      lastMessageId: newMessages.length > 0
        ? Math.max(...newMessages.map((m) => m.id))
        : lastMessageId,
    });
  } catch (error: any) {
    console.error("Error getting messages:", error);
    return NextResponse.json(
      { error: "Failed to get messages" },
      { status: 500 }
    );
  }
}

