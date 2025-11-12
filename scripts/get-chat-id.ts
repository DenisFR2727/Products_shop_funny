/**
 * Script to get Telegram Chat ID
 *
 * Usage:
 * 1. Send a message to your bot in Telegram
 * 2. Run: ts-node scripts/get-chat-id.ts (or compile and run)
 * 3. Copy the Chat ID and add it to .env.local as TELEGRAM_OWNER_CHAT_ID
 */

import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

// Telegram API response types
interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: TelegramChat;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramApiResponse {
  ok: boolean;
  description?: string;
  result?: TelegramUpdate[];
}

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

// Get updates from Telegram API
const url: string = `https://api.telegram.org/bot${botToken}/getUpdates`;

https
  .get(url, (res: http.IncomingMessage) => {
    let data: string = "";

    res.on("data", (chunk: Buffer) => {
      data += chunk.toString("utf8");
    });

    res.on("end", () => {
      try {
        const response: TelegramApiResponse = JSON.parse(data) as TelegramApiResponse;

        if (!response.ok) {
          console.error(
            "Error from Telegram API:",
            response.description || "Unknown error"
          );
          process.exit(1);
        }

        if (response.result && response.result.length > 0) {
          // Get the most recent message
          const latestUpdate: TelegramUpdate =
            response.result[response.result.length - 1];
          const chatId: number | undefined = latestUpdate.message?.chat?.id;
          const username: string | undefined =
            latestUpdate.message?.from?.username ||
            latestUpdate.message?.from?.first_name;
          const messageText: string | undefined = latestUpdate.message?.text;

          if (chatId) {
            console.log("\n✅ Chat ID found!");
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
          console.log(
            `\nYour bot username should be visible at: https://api.telegram.org/bot${botToken}/getMe`
          );
        }
      } catch (error) {
        const parseError = error as NodeError;
        console.error("Error parsing response:", parseError.message);
        console.error("Response:", data);
      }
    });
  })
  .on("error", (error: NodeError) => {
    console.error("Error making request:", error.message);
    process.exit(1);
  });
