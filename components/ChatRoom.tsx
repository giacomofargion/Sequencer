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
    <div className="flex flex-col rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-2xl h-[400px] sm:h-[500px]">
      <div className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 shrink-0">
        <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
          Chat
        </h3>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0"
      >
        {messages.length === 0 ? (
          <p className="text-[10px] sm:text-xs text-slate-500">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 font-semibold">
                  {msg.userName || `User ${getShortUserId(msg.userId)}`}
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-500">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-200 break-words">{msg.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-700/50 p-2 sm:p-3 bg-slate-800/30 shrink-0">
        <div className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-white transition-all hover:from-cyan-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-cyan-500 disabled:hover:to-cyan-600 active:scale-95 shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
