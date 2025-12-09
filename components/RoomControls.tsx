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
    <div className="flex items-center gap-3 text-xs text-neutral-500">
      <div className="flex items-center gap-2">
        <span>Room Code:</span>
        {roomId ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-widest text-neutral-700">
              {roomId}
            </span>
            <span className="text-[10px] text-neutral-400">
              ({participantCount} {participantCount === 1 ? "user" : "users"})
            </span>
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-500" : "bg-yellow-500"
              }`}
              title={isConnected ? "Connected" : "Connecting..."}
            />
          </div>
        ) : (
          <span className="font-mono text-[11px] tracking-widest text-neutral-400">solo</span>
        )}
      </div>

      {/* User Name */}
      <div className="flex items-center gap-2">
        {userName ? (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-600">Name:</span>
            <span className="text-[11px] font-medium text-neutral-700">{userName}</span>
            <button
              type="button"
              onClick={() => {
                setShowNameInput(true);
                setNameInput(userName);
              }}
              className="text-[9px] text-neutral-400 hover:text-neutral-600"
              title="Change name"
            >
              ✎
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNameInput(true)}
            className="text-[10px] text-neutral-500 hover:text-neutral-700 underline"
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
              className="w-24 rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSetName}
              className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition hover:bg-neutral-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNameInput(false);
                setNameInput("");
              }}
              className="text-[10px] text-neutral-400 hover:text-neutral-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!roomId ? (
          <>
            <button
              type="button"
              onClick={handleCreateRoom}
              className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition hover:bg-neutral-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowInput(!showInput)}
              className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition hover:bg-neutral-50"
            >
              Join
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLeaveRoom}
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition hover:bg-neutral-50"
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
              className="w-16 rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-mono uppercase tracking-widest placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleJoinRoom}
              className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition hover:bg-neutral-50"
            >
              Go
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
