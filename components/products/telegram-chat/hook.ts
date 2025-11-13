import { useCallback, useEffect, useRef, useState } from "react";
import { MessageTG } from "./types";

const STORAGE_KEY_NAME = "telegram_chat_user_name";
const STORAGE_KEY_SESSION = "telegram_chat_session_id";
const POLLING_INTERVAL = 3000; // 3 seconds

// Generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(STORAGE_KEY_SESSION, sessionId);
  }
  return sessionId;
}

export default function useTelegramChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageTG[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load user name and session from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const storedName = localStorage.getItem(STORAGE_KEY_NAME);
    const session = getSessionId();
    
    setSessionId(session);
    
    if (storedName) {
      setUserName(storedName);
      setIsNameSet(true);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      if (isNameSet && inputRef.current) {
        inputRef.current.focus();
      } else if (!isNameSet && nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }
  }, [isOpen, isNameSet]);

  // Polling for new messages
  useEffect(() => {
    if (!isOpen || !isNameSet || !sessionId) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(
          `/api/telegram/messages?sessionId=${sessionId}&lastMessageId=${lastMessageId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            const newMessages: MessageTG[] = data.messages.map((msg: any) => ({
              id: `bot_${msg.id}`,
              text: msg.text,
              timestamp: new Date(msg.timestamp),
              sent: true,
              isBot: true,
            }));

            setMessages((prev) => [...prev, ...newMessages]);
            if (data.messages.length > 0) {
              const maxId = Math.max(...data.messages.map((m: any) => m.id));
              setLastMessageId(maxId);
            }
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    // Poll immediately, then set interval
    pollMessages();
    pollingIntervalRef.current = setInterval(pollMessages, POLLING_INTERVAL);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen, isNameSet, sessionId, lastMessageId]);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
    setError(null);
  }, [isOpen]);

  const handleNameSubmit = useCallback(() => {
    const name = userName.trim();
    if (!name || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Save name to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_NAME, name);
    }

    setIsNameSet(true);
    setIsLoading(false);

    // Focus message input after name is set
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [userName, isLoading]);

  const handleSend = useCallback(async () => {
    const messageText = inputMessage.trim();
    if (!messageText || isLoading || !userName || !sessionId) return;

    // Create message object
    const newMessage: MessageTG = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      sent: false,
      sender: userName,
      isBot: false,
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
        body: JSON.stringify({
          message: messageText,
          userName: userName,
          sessionId: sessionId,
        }),
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
  }, [inputMessage, isLoading, userName, sessionId]);

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

  return {
    isOpen,
    messages,
    inputMessage,
    isLoading,
    error,
    userName,
    setUserName,
    isNameSet,
    sessionId,
    handleToggle,
    handleSend,
    handleKeyPress,
    handleNameSubmit,
    formatTime,
    setInputMessage,
    messagesEndRef,
    inputRef,
    nameInputRef,
  };
}
