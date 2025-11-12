import { RefObject } from "react";
import type { MessageTG } from "./types";

interface MessageTGProps {
  messages: MessageTG[];
  formatTime: (date: Date) => string;
  error: string | null;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export default function MessageTG({
  messages,
  formatTime,
  error,
  messagesEndRef,
}: MessageTGProps) {
  return (
    <div className="telegram-chat-messages">
      {messages.length === 0 ? (
        <div className="telegram-chat-empty">
          <p>Напишіть нам ваше питання або повідомлення</p>
        </div>
      ) : (
        messages.map((message: MessageTG) => (
          <div
            key={message.id}
            className={`telegram-chat-message ${
              message.isBot ? "telegram-chat-message-bot" : "telegram-chat-message-user"
            }`}
          >
            <div className="telegram-chat-message-content">
              {message.sender && !message.isBot && (
                <div className="telegram-chat-message-sender">{message.sender}</div>
              )}
              {message.isBot && (
                <div className="telegram-chat-message-sender telegram-chat-message-sender-bot">
                  Відповідь
                </div>
              )}
              <p>{message.text}</p>
              <span className="telegram-chat-message-time">
                {formatTime(message.timestamp)}
                {message.sent && !message.isBot && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: "4px" }}
                  >
                    <path
                      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))
      )}
      {error && (
        <div className="telegram-chat-error">
          <p>{error}</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
