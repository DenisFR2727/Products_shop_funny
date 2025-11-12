// Type declaration for node-telegram-bot-api
// This ensures TypeScript can find the module types during build
declare module 'node-telegram-bot-api' {
  export interface TelegramBotOptions {
    polling?: boolean | {
      interval?: number;
      autoStart?: boolean;
      params?: {
        timeout?: number;
        limit?: number;
        allowed_updates?: string[];
      };
    };
    webHook?: boolean | {
      port?: number;
      host?: string;
      hookPath?: string;
    };
  }

  export interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }

  export interface Chat {
    id: number;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  }

  export interface Message {
    message_id: number;
    from?: User;
    date: number;
    chat: Chat;
    text?: string;
  }

  export interface Update {
    update_id: number;
    message?: Message;
  }

  export interface BotInfo {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
    can_join_groups?: boolean;
    can_read_all_group_messages?: boolean;
    supports_inline_queries?: boolean;
  }

  export interface SendMessageOptions {
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disable_web_page_preview?: boolean;
    disable_notification?: boolean;
    reply_to_message_id?: number;
  }

  export default class TelegramBot {
    constructor(token: string, options?: TelegramBotOptions);
    
    getMe(): Promise<BotInfo>;
    getUpdates(options?: { offset?: number; limit?: number; timeout?: number }): Promise<Update[]>;
    sendMessage(chatId: number | string, text: string, options?: SendMessageOptions): Promise<Message>;
    deleteMessage(chatId: number | string, messageId: number): Promise<boolean>;
    on(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    stopPolling(): Promise<void>;
    close(): Promise<void>;
  }
}
