"use client";

import { useState, useEffect } from "react";
import type { FC } from "react";
import { generateRoomId, type RoomId } from "@/types/sequencer";
import { getUserName, setUserName } from "@/app/hooks/useRoomSync";

type Props = {
  roomId: RoomId | null;
  isConnected: boolean;
  participantCount: number;
  onRoomChange: (roomId: RoomId | null) => void;
  onNameChange?: () => void;
};

export const RoomControls: FC<Props> = ({
  roomId,
  isConnected,
  participantCount,
  onRoomChange,
  onNameChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    setUserNameState(getUserName());
  }, []);

  const handleSetName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0 && trimmed.length <= 20) {
      setUserName(trimmed);
      setUserNameState(trimmed);
      setNameInput("");
      setShowNameInput(false);
      onNameChange?.();
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    onRoomChange(newRoomId);
    setShowInput(false);
  };

  const handleJoinRoom = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed.length === 6) {
      onRoomChange(trimmed);
      setInputValue("");
      setShowInput(false);
    }
  };

  const handleLeaveRoom = () => {
    onRoomChange(null);
    setShowInput(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400">
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <span className="whitespace-nowrap text-[10px] sm:text-xs">Room Code:</span>
        {roomId ? (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-mono text-[10px] sm:text-xs tracking-widest text-emerald-400 font-semibold">
              {roomId}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500">
              ({participantCount} {participantCount === 1 ? "user" : "users"})
            </span>
            <div
              className={`h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full shadow-lg ${
                isConnected ? "bg-emerald-500 shadow-emerald-500/50" : "bg-yellow-500 shadow-yellow-500/50 animate-pulse"
              }`}
              title={isConnected ? "Connected" : "Connecting..."}
            />
          </div>
        ) : (
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-slate-500">solo</span>
        )}
      </div>

      {/* User Name */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {userName ? (
          <div className="flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] text-slate-500">Name:</span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-200">{userName}</span>
            <button
              type="button"
              onClick={() => {
                setShowNameInput(true);
                setNameInput(userName);
              }}
              className="text-[8px] sm:text-[9px] text-slate-500 hover:text-slate-300 transition-colors"
              title="Change name"
            >
              ✎
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNameInput(true)}
            className="text-[9px] sm:text-[10px] text-slate-400 hover:text-slate-200 underline transition-colors"
          >
            Set Name
          </button>
        )}
        {showNameInput && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSetName();
                if (e.key === "Escape") {
                  setShowNameInput(false);
                  setNameInput("");
                }
              }}
              placeholder="Your name"
              maxLength={20}
              className="w-20 sm:w-24 rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSetName}
              className="rounded-lg border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] transition-all hover:bg-slate-700/70 hover:border-slate-500 active:scale-95"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNameInput(false);
                setNameInput("");
              }}
              className="text-[9px] sm:text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {!roomId ? (
          <>
            <button
              type="button"
              onClick={handleCreateRoom}
              className="rounded-lg border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] transition-all hover:bg-slate-700/70 hover:border-slate-500 active:scale-95"
            >
              Create Room
            </button>
            <button
              type="button"
              onClick={() => setShowInput(!showInput)}
              className="rounded-lg border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] transition-all hover:bg-slate-700/70 hover:border-slate-500 active:scale-95"
            >
              Join Room
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLeaveRoom}
            className="rounded-lg border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] transition-all hover:bg-slate-700/70 hover:border-slate-500 active:scale-95"
          >
            Leave
          </button>
        )}

        {showInput && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoinRoom();
                if (e.key === "Escape") {
                  setShowInput(false);
                  setInputValue("");
                }
              }}
              placeholder="abc123"
              maxLength={6}
              className="w-14 sm:w-16 rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest placeholder:text-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              autoFocus
            />
            <button
              type="button"
              onClick={handleJoinRoom}
              className="rounded-lg border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] transition-all hover:bg-slate-700/70 hover:border-slate-500 active:scale-95"
            >
              Go
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
