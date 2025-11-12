import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;

// Initialize in-memory stores (these are initialized at module level)
// They will be shared across all requests in the same server instance
if (typeof global.sessionMessages === 'undefined') {
  global.sessionMessages = new Map<string, any[]>();
}

if (typeof global.messageIdToSessionMap === 'undefined') {
  global.messageIdToSessionMap = new Map<number, string>();
}

if (typeof global.messageCounter === 'undefined') {
  global.messageCounter = 0;
}

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not set" },
        { status: 500 }
      );
    }

    const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
    const body = await request.json();

    // Handle incoming message from Telegram
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id.toString();
      let messageText = message.text;

      // Check if this is a reply to a user message
      // We need to find which session this chatId belongs to
      // For now, we'll check if the message is a reply and extract sessionId from context
      // Or we can store the mapping when sending messages

      // If message is from owner's chat
      if (chatId === TELEGRAM_OWNER_CHAT_ID && messageText) {
        let sessionId: string | undefined;
        
        // Method 1: Check if message is a reply to a previous message
        if (message.reply_to_message && message.reply_to_message.message_id) {
          const repliedMessageId = message.reply_to_message.message_id;
          
          // Find sessionId from messageId mapping
          if (global.messageIdToSessionMap && global.messageIdToSessionMap.has(repliedMessageId)) {
            sessionId = global.messageIdToSessionMap.get(repliedMessageId);
          }
        }
        
        // Method 2: Try to extract sessionId from message text (command format)
        // Format: /reply <sessionId> <message>
        if (!sessionId) {
          const replyMatch = messageText.match(/^\/reply\s+(\S+)\s+(.+)$/);
          if (replyMatch) {
            sessionId = replyMatch[1];
            messageText = replyMatch[2]; // Use only the message part
          }
        }
        
        // Method 3: Extract sessionId from message text if it contains "Session ID:"
        if (!sessionId) {
          const sessionMatch = messageText.match(/Session ID:\s*(\S+)/);
          if (sessionMatch) {
            sessionId = sessionMatch[1];
          }
        }
        
        // If we found a sessionId, store the reply message
        if (sessionId) {
          // Ensure session messages map exists
          if (!global.sessionMessages) {
            global.sessionMessages = new Map<string, any[]>();
          }
          if (!global.sessionMessages.has(sessionId)) {
            global.sessionMessages.set(sessionId, []);
          }
          
          // Ensure message counter exists
          if (typeof global.messageCounter === 'undefined') {
            global.messageCounter = 0;
          }

          global.messageCounter = (global.messageCounter || 0) + 1;
          const newMessage = {
            id: global.messageCounter,
            text: messageText,
            timestamp: new Date().toISOString(),
            sessionId: sessionId,
          };

          global.sessionMessages.get(sessionId)!.push(newMessage);

          // Send confirmation to owner
          if (TELEGRAM_OWNER_CHAT_ID) {
            await bot.telegram.sendMessage(
              TELEGRAM_OWNER_CHAT_ID,
              `✅ Відповідь відправлена користувачу\n\nSession: ${sessionId}\nПовідомлення: ${messageText}`
            );
          }

          return NextResponse.json({ ok: true });
        }
      }

      // Store the mapping if it's a new message from owner
      // This allows us to reply to specific users
      if (chatId === TELEGRAM_OWNER_CHAT_ID) {
        // Check if message contains sessionId reference
        // This is a simple implementation - you can enhance it
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Failed to handle webhook" },
      { status: 500 }
    );
  }
}

