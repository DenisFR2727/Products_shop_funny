import { NextRequest, NextResponse } from "next/server";
// import { Telegraf } from "telegraf";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not set" },
        { status: 500 }
      );
    }

    // This endpoint can be used for two-way communication
    // Currently, we're only using it for receiving webhook updates
    // For now, we'll just acknowledge the webhook

    // If needed, you can process webhook updates here using Telegraf
    // const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
    // const body = await request.json();
    // await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Failed to handle webhook" },
      { status: 500 }
    );
  }
}
