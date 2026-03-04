"use client";

import dynamic from "next/dynamic";

const TelegramChatWidget = dynamic(
  () => import("./telegram-chat-widget"),
  { ssr: false }
);

export default TelegramChatWidget;
