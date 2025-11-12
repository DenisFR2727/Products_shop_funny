# Telegram Chat Widget Setup Instructions

## Prerequisites

1. A Telegram account
2. A Telegram bot token (obtained from @BotFather)

## Setup Steps

### 1. Create Telegram Bot (if not already done)

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the instructions to create a new bot
4. Copy the bot token provided by BotFather

### 2. Get Your Chat ID

**Method 1: Using the bot**
1. Send any message to your bot in Telegram
2. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in your browser
3. Look for `"chat":{"id": YOUR_CHAT_ID}` in the response
4. Copy the chat ID (it's a number, can be negative for groups)

**Method 2: Using a helper bot**
1. Search for `@userinfobot` in Telegram
2. Start a conversation with it
3. It will show your chat ID

**Method 3: Using the API endpoint**
1. After setting up the bot token, visit `/api/telegram/chat-id` endpoint
2. Follow the instructions provided

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Telegram Owner Chat ID
TELEGRAM_OWNER_CHAT_ID=your_chat_id_here

# Site URL (optional, for production webhooks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** 
- Never commit `.env.local` to version control
- Replace `your_bot_token_here` with your actual bot token
- Replace `your_chat_id_here` with your actual chat ID

### 4. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the products page
3. Click on the chat widget (bottom-right corner)
4. Send a test message
5. Check your Telegram - you should receive the message

## Troubleshooting

### Messages not being received

1. **Check environment variables:**
   - Verify `TELEGRAM_BOT_TOKEN` is correct
   - Verify `TELEGRAM_OWNER_CHAT_ID` is correct
   - Make sure you've sent at least one message to the bot first

2. **Check bot permissions:**
   - Make sure the bot can send messages
   - If you blocked the bot, unblock it

3. **Check server logs:**
   - Look for error messages in the console
   - Check the network tab for API errors

### Rate Limiting

The chat widget has rate limiting enabled (5 messages per minute per IP). If you see "Too many requests" error, wait a minute before sending another message.

### Chat ID Issues

If you're having trouble getting your chat ID:
- Make sure you've sent at least one message to the bot
- Try using Method 1 (getUpdates API) as it's the most reliable
- For group chats, the chat ID will be negative

## Security Notes

- Never expose your bot token in client-side code
- Keep your `.env.local` file secure
- The bot token allows sending messages on behalf of your bot
- Rate limiting helps prevent spam and abuse

## Production Deployment

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Update `NEXT_PUBLIC_SITE_URL` to your production URL
3. Test the chat widget in production
4. Monitor for any errors or issues

## Features

- ✅ Real-time message forwarding to Telegram
- ✅ Rate limiting (5 messages/minute)
- ✅ Theme-aware (light/dark mode)
- ✅ Mobile responsive
- ✅ Error handling and validation
- ✅ Message status indicators
- ✅ Secure (token never exposed to client)

## Support

If you encounter any issues, check:
1. Server logs for error messages
2. Network tab for API request failures
3. Telegram bot status
4. Environment variable configuration

