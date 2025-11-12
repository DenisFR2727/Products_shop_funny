import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function GET(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not set" },
        { status: 500 }
      );
    }

    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

    // Get bot info to verify token
    try {
      const botInfo = await bot.getMe();
      
      // Try to get updates to find chat ID
      try {
        const updates = await bot.getUpdates();
        
        if (updates && updates.length > 0) {
          // Get the most recent update
          const latestUpdate = updates[updates.length - 1];
          const chatId = latestUpdate.message?.chat?.id;
          const username = latestUpdate.message?.from?.username || latestUpdate.message?.from?.first_name;
          const messageText = latestUpdate.message?.text;
          
          if (chatId) {
            return NextResponse.json({
              message: "Chat ID found!",
              chatId: chatId.toString(),
              username: username || "Unknown",
              lastMessage: messageText || "N/A",
              botUsername: botInfo.username,
              botName: botInfo.first_name,
              instructions: [
                `✅ Found Chat ID: ${chatId}`,
                "Add this to your .env.local file:",
                `TELEGRAM_OWNER_CHAT_ID=${chatId}`,
                "",
                "Then restart your dev server."
              ],
            });
          }
        }
      } catch (updateError: any) {
        // If getUpdates fails, continue with instructions
        console.log("Could not get updates:", updateError.message);
      }
      
      // If no chat ID found, return instructions
      return NextResponse.json({
        message: "Telegram bot is configured correctly.",
        botUsername: botInfo.username,
        botName: botInfo.first_name,
        instructions: [
          "1. Open Telegram and search for your bot: @" + botInfo.username,
          "2. Send any message to the bot (e.g., 'Hello')",
          "3. Refresh this page or visit /api/telegram/chat-id again",
          "4. The Chat ID will be displayed automatically",
          "",
          "Alternatively:",
          "- Run: node scripts/get-chat-id.js",
          "- Or visit: https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/getUpdates",
          "- Look for 'chat':{'id': YOUR_CHAT_ID} in the response"
        ],
      });
    } catch (error: any) {
      return NextResponse.json(
        { 
          error: "Failed to connect to Telegram bot",
          message: error.message || "Please check your TELEGRAM_BOT_TOKEN"
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error getting chat ID:", error);
    return NextResponse.json(
      { error: "Failed to get chat ID", message: error.message },
      { status: 500 }
    );
  }
}

