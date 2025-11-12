/**
 * Script to get Telegram Chat ID using Telegraf
 *
 * Usage:
 * 1. Send a message to your bot in Telegram
 * 2. Run: ts-node scripts/get-chat-id.ts (or compile and run)
 * 3. Copy the Chat ID and add it to .env.local as TELEGRAM_OWNER_CHAT_ID
 */

import { Telegraf } from "telegraf";
import * as fs from "fs";
import * as path from "path";

interface NodeError extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
  hostname?: string;
}

// Read bot token from .env.local
// Use process.cwd() to get project root directory
const envPath: string = path.resolve(process.cwd(), ".env.local");
let botToken: string = "";

try {
  const envContent: string = fs.readFileSync(envPath, "utf8");
  // Remove BOM if present
  const cleanContent: string = envContent.replace(/^\uFEFF/, "");
  // Match token (handle both with and without quotes)
  const tokenMatch: RegExpMatchArray | null = cleanContent.match(
    /TELEGRAM_BOT_TOKEN=["']?([^"'\n\r]+)["']?/
  );
  if (tokenMatch && tokenMatch[1]) {
    botToken = tokenMatch[1].trim();
  }
} catch (error) {
  const envError = error as NodeError;
  console.error("Error reading .env.local file:", envError.message);
  console.error("Make sure .env.local file exists in the project root.");
  process.exit(1);
}

if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN not found in .env.local");
  process.exit(1);
}

// Initialize Telegraf bot
const bot = new Telegraf(botToken);

// Get updates from Telegram API using Telegraf
(async () => {
  try {
    // Get bot info
    const botInfo = await bot.telegram.getMe();
    console.log(`\n🤖 Bot: @${botInfo.username} (${botInfo.first_name})\n`);

    // Get updates (timeout: 0, limit: 100, offset: 0, allowedUpdates: undefined)
    // timeout: 0 = no timeout, limit: 100 = max 100 updates, offset: 0 = get all pending
    const updates = await bot.telegram.getUpdates(0, 100, 0, undefined);

    if (updates && updates.length > 0) {
      // Find the most recent message update
      const messageUpdates = updates.filter((update) => "message" in update);

      if (messageUpdates.length === 0) {
        console.log("❌ No message updates found.");
        console.log("Make sure you sent a message to your bot first.");
        process.exit(0);
      }

      // Get the most recent message update
      const latestUpdate = messageUpdates[messageUpdates.length - 1];

      // Type guard: check if update has message
      if (!("message" in latestUpdate)) {
        console.log("❌ Latest update is not a message update.");
        process.exit(0);
      }

      const message = latestUpdate.message;
      const chatId = message.chat.id;
      const username = message.from?.username || message.from?.first_name;
      const messageText = "text" in message ? message.text : undefined;

      if (chatId) {
        console.log("✅ Chat ID found!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Chat ID: ${chatId}`);
        console.log(`From: ${username || "Unknown"}`);
        console.log(`Last message: ${messageText || "N/A"}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n📝 Add this to your .env.local file:");
        console.log(`TELEGRAM_OWNER_CHAT_ID=${chatId}\n`);

        // Try to update .env.local file
        try {
          let envContent: string = fs.readFileSync(envPath, "utf8");
          if (envContent.includes("TELEGRAM_OWNER_CHAT_ID=")) {
            envContent = envContent.replace(
              /TELEGRAM_OWNER_CHAT_ID=.*/,
              `TELEGRAM_OWNER_CHAT_ID=${chatId}`
            );
          } else {
            envContent += `\nTELEGRAM_OWNER_CHAT_ID=${chatId}`;
          }
          fs.writeFileSync(envPath, envContent, "utf8");
          console.log("✅ Updated .env.local file automatically!");
          console.log(
            "🔄 Please restart your dev server for changes to take effect.\n"
          );
        } catch (error) {
          const writeError = error as NodeError;
          console.log(
            "⚠️  Could not update .env.local automatically. Please add it manually.\n"
          );
          if (writeError.message) {
            console.error("Error:", writeError.message);
          }
        }
      } else {
        console.log("❌ No chat ID found in the response.");
        console.log("Make sure you sent a message to your bot first.");
      }
    } else {
      console.log("❌ No messages found.");
      console.log(
        "Please send a message to your bot in Telegram first, then run this script again."
      );
      console.log(`\nYour bot: @${botInfo.username}`);
    }
  } catch (error) {
    const apiError = error as NodeError;
    console.error("Error getting updates:", apiError.message);
    if (apiError.message.includes("Unauthorized")) {
      console.error("Invalid bot token. Please check your TELEGRAM_BOT_TOKEN.");
    }
    process.exit(1);
  }
})();
