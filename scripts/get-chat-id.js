/**
 * Script to get Telegram Chat ID
 * 
 * Usage:
 * 1. Send a message to your bot in Telegram
 * 2. Run: node scripts/get-chat-id.js
 * 3. Copy the Chat ID and add it to .env.local as TELEGRAM_OWNER_CHAT_ID
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read bot token from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let botToken = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  // Remove BOM if present
  const cleanContent = envContent.replace(/^\uFEFF/, '');
  // Match token (handle both with and without quotes)
  const tokenMatch = cleanContent.match(/TELEGRAM_BOT_TOKEN=["']?([^"'\n\r]+)["']?/);
  if (tokenMatch) {
    botToken = tokenMatch[1].trim();
  }
} catch (error) {
  console.error('Error reading .env.local file:', error.message);
  console.error('Make sure .env.local file exists in the project root.');
  process.exit(1);
}

if (!botToken) {
  console.error('TELEGRAM_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

// Get updates from Telegram API
const url = `https://api.telegram.org/bot${botToken}/getUpdates`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (!response.ok) {
        console.error('Error from Telegram API:', response.description);
        process.exit(1);
      }

      if (response.result && response.result.length > 0) {
        // Get the most recent message
        const latestUpdate = response.result[response.result.length - 1];
        const chatId = latestUpdate.message?.chat?.id;
        const username = latestUpdate.message?.from?.username || latestUpdate.message?.from?.first_name;
        const messageText = latestUpdate.message?.text;

        if (chatId) {
          console.log('\n✅ Chat ID found!');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`Chat ID: ${chatId}`);
          console.log(`From: ${username || 'Unknown'}`);
          console.log(`Last message: ${messageText || 'N/A'}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('\n📝 Add this to your .env.local file:');
          console.log(`TELEGRAM_OWNER_CHAT_ID=${chatId}\n`);
          
          // Try to update .env.local file
          try {
            let envContent = fs.readFileSync(envPath, 'utf8');
            if (envContent.includes('TELEGRAM_OWNER_CHAT_ID=')) {
              envContent = envContent.replace(
                /TELEGRAM_OWNER_CHAT_ID=.*/,
                `TELEGRAM_OWNER_CHAT_ID=${chatId}`
              );
            } else {
              envContent += `\nTELEGRAM_OWNER_CHAT_ID=${chatId}`;
            }
            fs.writeFileSync(envPath, envContent, 'utf8');
            console.log('✅ Updated .env.local file automatically!');
            console.log('🔄 Please restart your dev server for changes to take effect.\n');
          } catch (error) {
            console.log('⚠️  Could not update .env.local automatically. Please add it manually.\n');
          }
        } else {
          console.log('❌ No chat ID found in the response.');
          console.log('Make sure you sent a message to your bot first.');
        }
      } else {
        console.log('❌ No messages found.');
        console.log('Please send a message to your bot in Telegram first, then run this script again.');
        console.log(`\nYour bot username should be visible at: https://api.telegram.org/bot${botToken}/getMe`);
      }
    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.error('Response:', data);
    }
  });
}).on('error', (error) => {
  console.error('Error making request:', error.message);
  process.exit(1);
});

