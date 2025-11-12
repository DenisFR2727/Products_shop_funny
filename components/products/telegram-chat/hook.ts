import { useCallback, useEffect, useRef, useState } from "react";
import { MessageTG } from "./types";

export default function useTelegramChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageTG[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
    setError(null);
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const messageText = inputMessage.trim();
    if (!messageText || isLoading) return;

    // Create message object
    const newMessage: MessageTG = {
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
  }, [inputMessage, isLoading]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  ``;
  return {
    isOpen,
    messages,
    inputMessage,
    isLoading,
    error,
    handleToggle,
    handleSend,
    handleKeyPress,
    formatTime,
    setInputMessage,
    messagesEndRef,
    inputRef,
  };
}
