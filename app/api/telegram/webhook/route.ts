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

if (typeof global.sessionToLastMessageIdMap === 'undefined') {
  global.sessionToLastMessageIdMap = new Map<string, number>();
}

if (typeof global.messageCounter === 'undefined') {
  global.messageCounter = 0;
}

// GET endpoint for webhook verification (Telegram may use this)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    ok: true, 
    message: "Webhook endpoint is active",
    timestamp: new Date().toISOString()
  });
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
    
    // Handle potential JSON parsing errors
    let body;
    try {
      body = await request.json();
    } catch (error: any) {
      console.error(`[Webhook] Error parsing JSON:`, error);
      return NextResponse.json({ ok: true, error: "Invalid JSON" });
    }

    console.log(`[Webhook] Received webhook request:`, JSON.stringify(body, null, 2));
    console.log(`[Webhook] Request method: ${request.method}`);
    console.log(`[Webhook] Request URL: ${request.url}`);

    // Handle incoming message from Telegram
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id.toString();
      let messageText = message.text;

      // Only process text messages from owner's chat
      if (!TELEGRAM_OWNER_CHAT_ID) {
        console.error(`[Webhook] TELEGRAM_OWNER_CHAT_ID is not set`);
        return NextResponse.json({ ok: true, error: "TELEGRAM_OWNER_CHAT_ID not configured" });
      }

      console.log(`[Webhook] Message from chatId: ${chatId}, ownerChatId: ${TELEGRAM_OWNER_CHAT_ID}, match: ${chatId === TELEGRAM_OWNER_CHAT_ID}`);

      if (chatId === TELEGRAM_OWNER_CHAT_ID && messageText) {
        let sessionId: string | undefined;
        let extractedMessageText = messageText.trim();
        
        console.log(`[Webhook] Received message from owner: "${messageText}"`);
        
        // Method 1: Check if message is a reply to a previous message (most reliable)
        if (message.reply_to_message && message.reply_to_message.message_id) {
          const repliedMessageId = message.reply_to_message.message_id;
          console.log(`[Webhook] Message is a reply to messageId: ${repliedMessageId}`);
          
          // Find sessionId from messageId mapping
          if (global.messageIdToSessionMap && global.messageIdToSessionMap.has(repliedMessageId)) {
            sessionId = global.messageIdToSessionMap.get(repliedMessageId);
            console.log(`[Webhook] Found sessionId from reply: ${sessionId}`);
          } else {
            console.log(`[Webhook] No sessionId found for messageId: ${repliedMessageId}`);
          }
        }
        
        // Method 2: Try to extract sessionId from message text (command format)
        // Format: /reply <sessionId> <message> or just /reply <sessionId>
        if (!sessionId) {
          // Try full format: /reply <sessionId> <message>
          const replyMatch = messageText.match(/^\/reply\s+(\S+)(?:\s+(.+))?$/s);
          if (replyMatch) {
            sessionId = replyMatch[1].trim();
            const messagePart = replyMatch[2] ? replyMatch[2].trim() : '';
            
            // Don't accept placeholder text like "<ваше повідомлення>"
            if (messagePart && messagePart.includes('<') && messagePart.includes('>')) {
              console.log(`[Webhook] Detected placeholder text, using direct message instead`);
              // If only sessionId provided without message, use the original message text
              extractedMessageText = messageText.replace(/^\/reply\s+\S+\s*/, '').trim() || messageText.trim();
              // If extractedMessageText is empty or just the command, don't process
              if (!extractedMessageText || extractedMessageText === '/reply' || extractedMessageText.startsWith('/reply ')) {
                console.log(`[Webhook] No message text provided in command`);
                if (TELEGRAM_OWNER_CHAT_ID) {
                  try {
                    await bot.telegram.sendMessage(
                      TELEGRAM_OWNER_CHAT_ID,
                      `❌ Помилка: Після /reply <sessionId> потрібно вказати повідомлення.\n\nПриклад: /reply ${sessionId} Привіт!`
                    );
                  } catch (error: any) {
                    console.error(`[Webhook] Error sending error message:`, error);
                  }
                }
                return NextResponse.json({ ok: true, error: "No message text in command" });
              }
            } else if (messagePart) {
              extractedMessageText = messagePart;
              console.log(`[Webhook] Extracted sessionId from command: ${sessionId}`);
            } else {
              // Only sessionId provided, no message - ask for message
              console.log(`[Webhook] Only sessionId provided, no message text`);
              if (TELEGRAM_OWNER_CHAT_ID) {
                try {
                  await bot.telegram.sendMessage(
                    TELEGRAM_OWNER_CHAT_ID,
                    `❌ Помилка: Після /reply ${sessionId} потрібно вказати повідомлення.\n\nПриклад: /reply ${sessionId} Привіт!`
                  );
                } catch (error: any) {
                  console.error(`[Webhook] Error sending error message:`, error);
                }
              }
              return NextResponse.json({ ok: true, error: "No message text in command" });
            }
          }
        }
        
        // Method 3: Extract sessionId from message text if it contains "Session ID:"
        if (!sessionId) {
          const sessionMatch = messageText.match(/Session ID:\s*([^\s\n]+)/i);
          if (sessionMatch) {
            sessionId = sessionMatch[1].trim();
            console.log(`[Webhook] Extracted sessionId from text: ${sessionId}`);
          }
        }
        
        // Method 4: Automatic detection - use the most recent sessionId from sessionToLastMessageIdMap
        // This works if the owner sends a direct message (not a reply) - use the last active session
        if (!sessionId) {
          console.log(`[Webhook] Attempting automatic sessionId detection from last active session...`);
          
          // Get the most recent sessionId from the mapping
          // This assumes the owner is replying to the most recent message
          if (global.sessionToLastMessageIdMap && global.sessionToLastMessageIdMap.size > 0) {
            // Get the most recent session (last one added to the map)
            // Note: Maps in JavaScript maintain insertion order
            const sessions = Array.from(global.sessionToLastMessageIdMap.keys());
            if (sessions.length > 0) {
              // Use the last session in the map (most recent)
              sessionId = sessions[sessions.length - 1];
              console.log(`[Webhook] Using most recent sessionId: ${sessionId}`);
              
              // Send a helpful message to confirm
              if (TELEGRAM_OWNER_CHAT_ID) {
                try {
                  await bot.telegram.sendMessage(
                    TELEGRAM_OWNER_CHAT_ID,
                    `ℹ️ Використовую останній активний Session: ${sessionId}\n\nПовідомлення: ${extractedMessageText}`
                  );
                } catch (error: any) {
                  console.error(`[Webhook] Error sending info message:`, error);
                }
              }
            }
          }
        }
        
        // Validate sessionId format (should start with "session_")
        if (sessionId && !sessionId.startsWith('session_')) {
          console.log(`[Webhook] Invalid sessionId format: ${sessionId}`);
          // Still try to use it, but log a warning
        }
        
        // If we found a sessionId, store the reply message
        if (sessionId) {
          // Validate that sessionId is not empty
          if (sessionId.trim().length === 0) {
            console.error(`[Webhook] Empty sessionId, skipping message`);
            return NextResponse.json({ ok: true, error: "Empty sessionId" });
          }
          
          // Validate message text is not empty
          if (extractedMessageText.length === 0) {
            console.error(`[Webhook] Empty message text, skipping`);
            if (TELEGRAM_OWNER_CHAT_ID) {
              await bot.telegram.sendMessage(
                TELEGRAM_OWNER_CHAT_ID,
                `❌ Помилка: Повідомлення не може бути порожнім`
              );
            }
            return NextResponse.json({ ok: true, error: "Empty message text" });
          }
          
          // Ensure session messages map exists
          if (!global.sessionMessages) {
            global.sessionMessages = new Map<string, any[]>();
          }
          if (!global.sessionMessages.has(sessionId)) {
            global.sessionMessages.set(sessionId, []);
            console.log(`[Webhook] Created new session entry: ${sessionId}`);
          }
          
          // Ensure message counter exists
          if (typeof global.messageCounter === 'undefined') {
            global.messageCounter = 0;
          }

          global.messageCounter = (global.messageCounter || 0) + 1;
          const newMessage = {
            id: global.messageCounter,
            text: extractedMessageText,
            timestamp: new Date().toISOString(),
            sessionId: sessionId,
          };

          global.sessionMessages.get(sessionId)!.push(newMessage);
          console.log(`[Webhook] Stored reply message for sessionId: ${sessionId}, messageId: ${global.messageCounter}`);

          // Send confirmation to owner
          if (TELEGRAM_OWNER_CHAT_ID) {
            try {
              await bot.telegram.sendMessage(
                TELEGRAM_OWNER_CHAT_ID,
                `✅ Відповідь відправлена користувачу\n\nSession: ${sessionId}\nПовідомлення: ${extractedMessageText}`
              );
            } catch (error: any) {
              console.error(`[Webhook] Error sending confirmation:`, error);
            }
          }

          return NextResponse.json({ ok: true, sessionId, messageId: global.messageCounter });
        } else {
          // No sessionId found - inform the owner
          console.log(`[Webhook] No sessionId found for message: "${messageText}"`);
          if (TELEGRAM_OWNER_CHAT_ID) {
            try {
              await bot.telegram.sendMessage(
                TELEGRAM_OWNER_CHAT_ID,
                `❌ Не вдалося визначити Session ID.\n\nВикористайте один з методів:\n1. Reply на повідомлення користувача\n2. Формат: /reply <sessionId> <ваше повідомлення>\n3. Скопіюйте Session ID з повідомлення`
              );
            } catch (error: any) {
              console.error(`[Webhook] Error sending error message:`, error);
            }
          }
        }
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

