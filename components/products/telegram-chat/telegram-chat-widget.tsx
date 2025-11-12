"use client";

import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";
import useTelegramChat from "./hook";
import ChatButton from "./chat-button";
import HeaderTGChat from "./header";
import MessageTG from "./message";

import "./telegram-chat-widget.scss";
import InputChatTG from "./input-chat";

export default function TelegramChatWidget() {
  const chat = useTelegramChat();
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`telegram-chat-widget ${theme}`}>
      <ChatButton {...chat} />
      {/* Chat Window */}
      {chat.isOpen && (
        <div className="telegram-chat-window">
          <HeaderTGChat handleToggle={chat.handleToggle} />
          <MessageTG {...chat} />
          <InputChatTG {...chat} />
        </div>
      )}
    </div>
  );
}
