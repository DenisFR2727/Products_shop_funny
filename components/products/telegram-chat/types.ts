export interface MessageTG {
  id: string;
  text: string;
  timestamp: Date;
  sent: boolean;
  sender?: string; // Ім'я відправника (для повідомлень від користувача)
  isBot?: boolean; // Чи це повідомлення від бота
}
