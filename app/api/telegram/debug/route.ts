import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    const debugInfo = {
      timestamp: new Date().toISOString(),
      sessionMessages: {
        size: global.sessionMessages?.size || 0,
        sessions: global.sessionMessages ? Array.from(global.sessionMessages.keys()) : [],
        messagesForSession: sessionId 
          ? (global.sessionMessages?.get(sessionId) || [])
          : null,
      },
      messageIdToSessionMap: {
        size: global.messageIdToSessionMap?.size || 0,
        entries: global.messageIdToSessionMap 
          ? Array.from(global.messageIdToSessionMap.entries()).slice(-10) // Last 10 entries
          : [],
      },
      sessionToLastMessageIdMap: {
        size: global.sessionToLastMessageIdMap?.size || 0,
        entries: global.sessionToLastMessageIdMap
          ? Array.from(global.sessionToLastMessageIdMap.entries())
          : [],
      },
      messageCounter: global.messageCounter || 0,
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error: any) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Failed to get debug info", details: error.message },
      { status: 500 }
    );
  }
}

