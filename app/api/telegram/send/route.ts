import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;

// Rate limiting store (in-memory, for production consider using Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 5 messages per minute per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIP || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!TELEGRAM_OWNER_CHAT_ID) {
      console.error("TELEGRAM_OWNER_CHAT_ID is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Check rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, userName, sessionId } = body;

    // Validate message
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Validate userName
    if (!userName || typeof userName !== "string") {
      return NextResponse.json(
        { error: "User name is required" },
        { status: 400 }
      );
    }

    // Validate sessionId
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Sanitize and validate message length
    const sanitizedMessage = message.trim();
    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (sanitizedMessage.length > 1000) {
      return NextResponse.json(
        { error: "Message is too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Sanitize userName
    const sanitizedUserName = userName.trim();
    if (sanitizedUserName.length === 0 || sanitizedUserName.length > 50) {
      return NextResponse.json(
        { error: "User name is invalid" },
        { status: 400 }
      );
    }

    // Initialize Telegraf bot
    const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

    // Format message for Telegram with user name and session ID
    const telegramMessage = `📨 Нове повідомлення з сайту:\n\n👤 Ім'я: ${sanitizedUserName}\n💬 Повідомлення: ${sanitizedMessage}\n\n🔗 Session ID: ${sessionId}\n⏰ Час: ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`;

    // Send message to owner's Telegram
    const sentMessage = await bot.telegram.sendMessage(TELEGRAM_OWNER_CHAT_ID, telegramMessage);

    // Store session mapping for reply functionality
    // Save sessionId -> messageId mapping (we'll use this in webhook to route replies back)
    if (typeof global.messageIdToSessionMap === 'undefined') {
      global.messageIdToSessionMap = new Map<number, string>();
    }
    
    // Store mapping between message ID and session ID for reply detection
    if (sentMessage && sentMessage.message_id) {
      global.messageIdToSessionMap.set(sentMessage.message_id, sessionId);
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending Telegram message:", error);

    // Handle specific Telegram API errors
    if (error.response?.error_code === 400) {
      return NextResponse.json(
        { error: "Invalid chat ID. Please check your configuration." },
        { status: 400 }
      );
    }

    if (error.response?.error_code === 401) {
      return NextResponse.json(
        { error: "Invalid bot token. Please check your configuration." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

