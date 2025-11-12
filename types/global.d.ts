// Global type declarations for Telegram chat functionality

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sessionId: string;
}

declare global {
  var sessionToChatIdMap: Map<string, string> | undefined;
  var chatIdToSessionMap: Map<string, string> | undefined;
  var sessionToMessageIdMap: Map<string, number> | undefined;
  var messageIdToSessionMap: Map<number, string> | undefined;
  var sessionMessages: Map<string, Message[]> | undefined;
  var messageCounter: number | undefined;
}

export {};
