import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not set" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const webhookUrl = body.webhookUrl || `${SITE_URL}/api/telegram/webhook`;

    const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

    // Set webhook
    try {
      const result = await bot.telegram.setWebhook(webhookUrl);
      
      // Get webhook info to verify
      const webhookInfo = await bot.telegram.getWebhookInfo();
      
      return NextResponse.json({
        success: true,
        message: "Webhook configured successfully",
        webhookUrl: webhookInfo.url,
        pendingUpdateCount: webhookInfo.pending_update_count,
        lastErrorDate: webhookInfo.last_error_date,
        lastErrorMessage: webhookInfo.last_error_message,
      });
    } catch (error: any) {
      console.error("Error setting webhook:", error);
      return NextResponse.json(
        { 
          error: "Failed to set webhook",
          details: error.message 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in setup-webhook:", error);
    return NextResponse.json(
      { error: "Failed to setup webhook", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not set" },
        { status: 500 }
      );
    }

    const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
    
    // Get webhook info
    const webhookInfo = await bot.telegram.getWebhookInfo();
    
    // Try to detect the actual URL from request headers
    const host = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 
                     (host.includes('localhost') ? 'http' : 'https');
    
    // Check if it's ngrok
    const isNgrok = host.includes('ngrok') || host.includes('ngrok-free.app') || host.includes('ngrok.io');
    
    // Build the actual URL
    const actualUrl = `${protocol}://${host}`;
    const suggestedUrl = `${actualUrl}/api/telegram/webhook`;
    
    return NextResponse.json({
      currentWebhook: {
        url: webhookInfo.url || "Not set",
        pendingUpdateCount: webhookInfo.pending_update_count || 0,
        lastErrorDate: webhookInfo.last_error_date,
        lastErrorMessage: webhookInfo.last_error_message,
      },
      detectedUrl: actualUrl,
      suggestedUrl: suggestedUrl,
      isNgrok: isNgrok,
      instructions: [
        "📋 Ваш Webhook URL має бути:",
        `   ${suggestedUrl}`,
        "",
        "🔧 Як налаштувати:",
        "1. Відкрийте http://localhost:3000/telegram-webhook-setup.html",
        "2. Або використайте curl команду нижче",
        "",
        "💻 Curl команда:",
        `curl -X POST ${actualUrl}/api/telegram/setup-webhook -H "Content-Type: application/json" -d '{"webhookUrl":"${suggestedUrl}"}'`,
        "",
        isNgrok ? "✅ Використовується ngrok - це правильно для локальної розробки!" : "⚠️ Для локальної розробки рекомендується використовувати ngrok",
      ],
    });
  } catch (error: any) {
    console.error("Error getting webhook info:", error);
    return NextResponse.json(
      { error: "Failed to get webhook info", details: error.message },
      { status: 500 }
    );
  }
}

