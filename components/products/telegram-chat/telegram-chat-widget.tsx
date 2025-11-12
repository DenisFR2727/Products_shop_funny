"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { ThemeContext } from "@/context/themeContext";
import "./telegram-chat-widget.scss";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sent: boolean;
}

export default function TelegramChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useContext(ThemeContext);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  const handleSend = async () => {
    const messageText = inputMessage.trim();
    if (!messageText || isLoading) return;

    // Create message object
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      sent: false,
    };

    // Add message to UI immediately (optimistic update)
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/telegram/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Update message status to sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, sent: true } : msg
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
      // Remove failed message or mark it as failed
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`telegram-chat-widget ${theme}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="telegram-chat-button"
          onClick={handleToggle}
          aria-label="Open chat"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
              fill="currentColor"
            />
            <path
              d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="telegram-chat-window">
          {/* Header */}
          <div className="telegram-chat-header">
            <div className="telegram-chat-header-info">
              <div className="telegram-chat-avatar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="telegram-chat-header-text">
                <h3>Напишіть нам</h3>
                <p>Ми відповімо найближчим часом</p>
              </div>
            </div>
            <button
              className="telegram-chat-close"
              onClick={handleToggle}
              aria-label="Close chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="telegram-chat-messages">
            {messages.length === 0 ? (
              <div className="telegram-chat-empty">
                <p>Напишіть нам ваше питання або повідомлення</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="telegram-chat-message">
                  <div className="telegram-chat-message-content">
                    <p>{message.text}</p>
                    <span className="telegram-chat-message-time">
                      {formatTime(message.timestamp)}
                      {message.sent && (
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

          {/* Input */}
          <div className="telegram-chat-input-container">
            <input
              ref={inputRef}
              type="text"
              className="telegram-chat-input"
              placeholder="Напишіть повідомлення..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              maxLength={1000}
            />
            <button
              className="telegram-chat-send"
              onClick={handleSend}
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="telegram-chat-spinner"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="31.416"
                    strokeDashoffset="31.416"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      dur="2s"
                      values="0 31.416;15.708 15.708;0 31.416;0 31.416"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      dur="2s"
                      values="0;-15.708;-31.416;-31.416"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

