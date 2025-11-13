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
    const lastMessageIdParam = searchParams.get("lastMessageId");
    const lastMessageId = lastMessageIdParam ? parseInt(lastMessageIdParam, 10) : 0;

    // Validate sessionId
    if (!sessionId || sessionId.trim().length === 0) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Validate lastMessageId is a valid number
    if (isNaN(lastMessageId) || lastMessageId < 0) {
      return NextResponse.json(
        { error: "Invalid lastMessageId parameter" },
        { status: 400 }
      );
    }

    // Ensure sessionMessages map exists
    if (typeof global.sessionMessages === 'undefined') {
      global.sessionMessages = new Map<string, Message[]>();
    }

    // Get messages for this session (replies from bot/owner are stored here)
    const messages = global.sessionMessages.get(sessionId) || [];

    // Filter messages newer than lastMessageId
    // This ensures we only return new replies that the client hasn't seen yet
    const newMessages = messages.filter((msg) => msg.id > lastMessageId);

    // Sort messages by id to ensure correct order (should already be sorted, but just in case)
    newMessages.sort((a, b) => a.id - b.id);

    // Calculate the new lastMessageId
    const newLastMessageId = newMessages.length > 0
      ? Math.max(...newMessages.map((m) => m.id))
      : lastMessageId;

    console.log(`[Messages API] Session: ${sessionId}, lastMessageId: ${lastMessageId}, newMessages: ${newMessages.length}, newLastMessageId: ${newLastMessageId}`);

    return NextResponse.json({
      messages: newMessages,
      lastMessageId: newLastMessageId,
    });
  } catch (error: any) {
    console.error("Error getting messages:", error);
    return NextResponse.json(
      { error: "Failed to get messages", details: error.message },
      { status: 500 }
    );
  }
}

