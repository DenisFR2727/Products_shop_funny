import { Dispatch, RefObject, SetStateAction } from "react";
import "./telegram-chat-widget.scss";

interface InputChatTGProps {
  inputRef: RefObject<HTMLInputElement>;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  handleSend: () => void;
}

export default function InputChatTG({
  inputRef,
  inputMessage,
  setInputMessage,
  handleKeyPress,
  isLoading,
  handleSend,
}: InputChatTGProps) {
  return (
    <div className="telegram-chat-input-container">
      <input
        ref={inputRef}
        type="text"
        className="telegram-chat-input"
        placeholder="Напишіть повідомлення..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyPress}
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
  );
}
