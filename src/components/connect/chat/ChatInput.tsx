import React, { useState } from "react";

type ChatInputProps = {
  userId?: string;
  sendMessage: (text: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="message-input"
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
};
export default ChatInput;
