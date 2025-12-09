"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/sequencer";

type Props = {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

export const ChatRoom: React.FC<Props> = ({ messages, onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get short user ID for display
  const getShortUserId = (userId: string) => {
    return userId.split("_")[1]?.substring(0, 6) || userId.substring(0, 6);
  };

  return (
    <div className="flex flex-col rounded-md border border-neutral-300 bg-white shadow-sm" style={{ height: "500px" }}>
      <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 flex-shrink-0">
        <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-700">
          Chat
        </h3>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
      >
        {messages.length === 0 ? (
          <p className="text-xs text-neutral-400">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-mono text-neutral-500">
                  {msg.userName || `User ${getShortUserId(msg.userId)}`}
                </span>
                <span className="text-[9px] text-neutral-400">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-xs text-neutral-700">{msg.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-neutral-200 p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded border border-neutral-300 px-2 py-1.5 text-xs focus:border-neutral-400 focus:outline-none"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="rounded bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
