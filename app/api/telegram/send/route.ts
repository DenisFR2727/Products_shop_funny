import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

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
    const { message } = body;

    // Validate message
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
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

    // Initialize Telegram bot
    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

    // Format message for Telegram
    const telegramMessage = `📨 Нове повідомлення з сайту:\n\n${sanitizedMessage}\n\n---\nЧас: ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`;

    // Send message to owner's Telegram
    await bot.sendMessage(TELEGRAM_OWNER_CHAT_ID, telegramMessage);

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending Telegram message:", error);

    // Handle specific Telegram API errors
    if (error.response?.body?.error_code === 400) {
      return NextResponse.json(
        { error: "Invalid chat ID. Please check your configuration." },
        { status: 400 }
      );
    }

    if (error.response?.body?.error_code === 401) {
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

