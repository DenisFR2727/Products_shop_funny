import { RefObject } from "react";
import "./telegram-chat-widget.scss";

interface NameInputProps {
  name: string;
  setName: (name: string) => void;
  nameInputRef: RefObject<HTMLInputElement>;
  handleNameSubmit: () => void;
  isLoading: boolean;
}

export default function NameInput({
  name,
  setName,
  nameInputRef,
  handleNameSubmit,
  isLoading,
}: NameInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  return (
    <div className="telegram-chat-name-input">
      <div className="telegram-chat-name-input-content">
        <h3>Введіть ваше ім'я</h3>
        <p>Щоб почати спілкування, введіть ваше ім'я</p>
        <input
          ref={nameInputRef}
          type="text"
          className="telegram-chat-name-input-field"
          placeholder="Ваше ім'я..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          maxLength={50}
          autoFocus
        />
        <button
          className="telegram-chat-name-input-button"
          onClick={handleNameSubmit}
          disabled={isLoading || !name.trim()}
        >
          Почати чат
        </button>
      </div>
    </div>
  );
}

