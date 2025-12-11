// Real-time room synchronization hook using Supabase Realtime.
// Manages room state, broadcasts local changes, and merges remote updates.

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type {
  RoomId,
  RoomState,
  Pattern,
  TransportState,
  InstrumentParamMap,
  InstrumentId,
  Participant,
  SyncMessage,
  ChatMessage,
  SynthPattern,
  SynthParams,
} from "@/types/sequencer";
import {
  createEmptyPattern,
  createDefaultTransport,
  createDefaultInstrumentParams,
  createEmptySynthPattern,
  createDefaultSynthParams,
} from "@/types/sequencer";

type UseRoomSyncReturn = {
  roomState: RoomState | null;
  isConnected: boolean;
  participants: Participant[];
  isLoading: boolean;
  error: string | null;
  updatePattern: (pattern: Pattern) => void;
  updateTransport: (transport: Partial<TransportState>) => void;
  updateInstrumentParam: (
    id: InstrumentId,
    field: "pitch" | "decay" | "timbre",
    value: number,
  ) => void;
  toggleStep: (row: number, col: number) => void;
  clearPattern: () => void;
  // Chat functionality
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  // Synth sequencer functionality
  toggleSynthStep: (row: number, col: number, note: number) => void;
  updateSynthParam: (field: keyof RoomState["synthParams"], value: number) => void;
  clearSynthPattern: () => void;
  // Update presence with new name
  updatePresence: () => void;
};

// Generate a unique user ID for this session (stored in localStorage)
function getUserId(): string {
  const stored = typeof window !== "undefined" ? localStorage.getItem("sequencer_user_id") : null;
  if (stored) return stored;
  const newId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  if (typeof window !== "undefined") {
    localStorage.setItem("sequencer_user_id", newId);
  }
  return newId;
}

// Get or set user name (stored in localStorage)
export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sequencer_user_name");
}

export function setUserName(name: string): void {
  if (typeof window === "undefined") return;
  const trimmed = name.trim();
  if (trimmed.length > 0 && trimmed.length <= 20) {
    localStorage.setItem("sequencer_user_name", trimmed);
  }
}

export function useRoomSync(roomId: RoomId | null): UseRoomSyncReturn {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const userIdRef = useRef<string>(getUserId());
  const isLocalChangeRef = useRef(false); // Flag to prevent feedback loops
  const chatMessagesRef = useRef<ChatMessage[]>([]); // Chat messages state (max 100)

  // Initialize room connection
  useEffect(() => {
    if (!roomId) {
      // Solo mode: no room sync
      setRoomState(null);
      setIsConnected(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: userIdRef.current,
        },
      },
    });

    // Subscribe to sync messages
    channel
      .on("broadcast", { event: "sync" }, (payload) => {
        const message = payload.payload as SyncMessage;

        // Ignore our own messages (prevent feedback loops)
        // Only check userId for messages that have it
        if (
          "userId" in message &&
          message.userId === userIdRef.current &&
          isLocalChangeRef.current
        ) {
          isLocalChangeRef.current = false;
          return;
        }

        handleRemoteMessage(message);
      })
      .on("presence", { event: "sync" }, () => {
        // Update participants list from presence
        const presence = channel.presenceState();
        const participants: Participant[] = Object.values(presence)
          .flat()
          .map((p) => {
            // Extract participant data, excluding Supabase metadata
            const { presence_ref, ...participantData } = p as any;
            return participantData as Participant;
          })
          .filter((p): p is Participant => p.id !== undefined);
        setRoomState((prev) =>
          prev ? { ...prev, participants } : null,
        );
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // New participant joined
        const presenceEntry = newPresences[0];
        if (presenceEntry) {
          const { presence_ref, ...participantData } = presenceEntry as any;
          const newParticipant = participantData as Participant;
          if (newParticipant && newParticipant.id !== userIdRef.current) {
            // Send full sync to new participant
            if (roomState) {
              broadcastMessage({
                type: "full_sync",
                state: roomState,
              });
            }
          }
        }
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
        setIsLoading(false);
        if (status === "SUBSCRIBED") {
          // Join presence
          const userName = getUserName();
          const participant: Participant = {
            id: userIdRef.current,
            name: userName || undefined,
            joinedAt: Date.now(),
          };
          channel.track(participant);

          // Fetch or create room state
          fetchOrCreateRoom(roomId).then((state) => {
            if (state) {
              setRoomState(state);
              // Broadcast full sync to other participants
              broadcastMessage({
                type: "full_sync",
                state,
              });
            }
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId]);

  // Fetch room from Supabase or create default
  const fetchOrCreateRoom = async (id: RoomId): Promise<RoomState | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = not found, which is fine (we'll create)
        console.error("Error fetching room:", fetchError);
        setError("Failed to load room");
        return null;
      }

      if (data) {
        // Room exists, return it with defaults for new fields
        const drumPattern = data.drum_pattern || data.pattern || createEmptyPattern();
        return {
          id: data.id,
          pattern: drumPattern, // Keep pattern for backward compatibility
          transport: data.transport,
          instruments: data.instruments,
          participants: [],
          createdAt: new Date(data.created_at).getTime(),
          lastActivity: new Date(data.last_activity).getTime(),
          chatMessages: [], // Chat messages are real-time only
          drumPattern,
          synthPattern: data.synth_pattern || createEmptySynthPattern(),
          synthParams: data.synth_params || createDefaultSynthParams(),
        };
      }

      // Room doesn't exist, create default
      const newState: RoomState = {
        id,
        pattern: createEmptyPattern(),
        transport: createDefaultTransport(),
        instruments: createDefaultInstrumentParams(),
        participants: [],
        createdAt: Date.now(),
        lastActivity: Date.now(),
        chatMessages: [],
        drumPattern: createEmptyPattern(),
        synthPattern: createEmptySynthPattern(),
        synthParams: createDefaultSynthParams(),
      };

      // Save to Supabase
      // Insert with base columns first (backward compatible)
      // New columns (drum_pattern, synth_pattern, synth_params) will be added by migration
      const { error: insertError } = await supabase.from("rooms").insert({
        id: newState.id,
        pattern: newState.pattern, // This will serve as drum_pattern until migration runs
        transport: newState.transport,
        instruments: newState.instruments,
        created_at: new Date(newState.createdAt).toISOString(),
        last_activity: new Date(newState.lastActivity).toISOString(),
      });

      if (insertError) {
        // Log full error details for debugging
        console.error("Error creating room:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });
        setError(`Failed to create room: ${insertError.message || "Unknown error"}`);
        return null;
      }

      // After successful insert, try to update with new columns if they exist
      // This is a best-effort update - if columns don't exist, it will fail silently
      // and the migration can be run later
      await supabase
        .from("rooms")
        .update({
          drum_pattern: newState.drumPattern,
          synth_pattern: newState.synthPattern,
          synth_params: newState.synthParams,
        })
        .eq("id", newState.id)
        .then(({ error: updateError }) => {
          // Silently ignore update errors - columns may not exist yet
          if (updateError && updateError.code !== "42703") {
            // 42703 = column doesn't exist, which is expected if migration hasn't run
            console.warn("Could not update room with new columns (migration may not have run):", updateError.message);
          }
        });

      return newState;
    } catch (err) {
      console.error("Unexpected error in fetchOrCreateRoom:", err);
      setError("Unexpected error");
      return null;
    }
  };

  // Broadcast a sync message to the room
  const broadcastMessage = useCallback(
    (message: SyncMessage) => {
      const channel = channelRef.current;
      if (!channel) return;

      channel.send({
        type: "broadcast",
        event: "sync",
        payload: message,
      });
    },
    [],
  );

  // Handle incoming remote sync messages
  const handleRemoteMessage = useCallback((message: SyncMessage) => {
    setRoomState((prev) => {
      if (!prev) return prev;

      switch (message.type) {
        case "step_toggle": {
          const nextPattern = prev.drumPattern.map((r) => r.map((s) => ({ ...s })));
          const step = nextPattern[message.row]?.[message.col];
          if (step) {
            step.active = !step.active;
          }
          return {
            ...prev,
            pattern: nextPattern, // Keep for backward compatibility
            drumPattern: nextPattern,
            lastActivity: message.timestamp,
          };
        }

        case "transport_play":
          return {
            ...prev,
            transport: { ...prev.transport, isPlaying: true },
            lastActivity: message.timestamp,
          };

        case "transport_pause":
          return {
            ...prev,
            transport: { ...prev.transport, isPlaying: false, currentStep: prev.transport.startStep },
            lastActivity: message.timestamp,
          };

        case "tempo_change":
          return {
            ...prev,
            transport: { ...prev.transport, tempo: message.tempo },
            lastActivity: message.timestamp,
          };

        case "range_change":
          return {
            ...prev,
            transport: {
              ...prev.transport,
              startStep: message.startStep,
              endStep: message.endStep,
            },
            lastActivity: message.timestamp,
          };


        case "instrument_param": {
          const nextInstruments = {
            ...prev.instruments,
            [message.id]: {
              ...prev.instruments[message.id],
              [message.field]: message.value,
            },
          };
          return {
            ...prev,
            instruments: nextInstruments,
            lastActivity: message.timestamp,
          };
        }

        case "full_sync":
          return message.state;

        case "chat_message": {
          // Add chat message to state (limit to 100 messages)
          const currentMessages = prev.chatMessages || [];
          const newMessages = [...currentMessages, message.message];
          // Keep only last 100 messages
          const limitedMessages = newMessages.slice(-100);
          return {
            ...prev,
            chatMessages: limitedMessages,
            lastActivity: message.message.timestamp,
          };
        }

        case "synth_step_toggle": {
          const nextSynthPattern = prev.synthPattern.map((r) => r.map((s) => ({ ...s })));
          const step = nextSynthPattern[message.row]?.[message.col];
          if (step) {
            if (step.active && step.note === message.note) {
              // Toggle off if same note
              step.active = false;
            } else {
              // Set note and activate
              step.active = true;
              step.note = message.note;
            }
          }
          return {
            ...prev,
            synthPattern: nextSynthPattern,
            lastActivity: message.timestamp,
          };
        }

        case "synth_param_change": {
          return {
            ...prev,
            synthParams: {
              ...prev.synthParams,
              [message.field]: message.value,
            },
            lastActivity: message.timestamp,
          };
        }

        default:
          return prev;
      }
    });
  }, []);

  // Update pattern (optimistic update + broadcast)
  const updatePattern = useCallback(
    (pattern: Pattern) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pattern, // Keep for backward compatibility
          drumPattern: pattern,
          lastActivity: Date.now(),
        };
      });

      if (roomId) {
        isLocalChangeRef.current = true;
        // Note: We broadcast individual step toggles, not full pattern
        // This is handled by toggleStep below
      }
    },
    [roomId],
  );

  // Toggle a single step (optimistic + broadcast)
  const toggleStep = useCallback(
    (row: number, col: number) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        const nextPattern = prev.drumPattern.map((r) => r.map((s) => ({ ...s })));
        const step = nextPattern[row]?.[col];
        if (step) {
          step.active = !step.active;
        }
        return {
          ...prev,
          pattern: nextPattern, // Keep for backward compatibility
          drumPattern: nextPattern,
          lastActivity: Date.now(),
        };
      });

      if (roomId) {
        isLocalChangeRef.current = true;
        broadcastMessage({
          type: "step_toggle",
          row,
          col,
          userId: userIdRef.current,
          timestamp: Date.now(),
        });
      }
    },
    [roomId, broadcastMessage],
  );

  // Clear all steps in drum pattern
  const clearPattern = useCallback(() => {
    const emptyPattern = createEmptyPattern();
    let currentPattern: Pattern = emptyPattern;

    setRoomState((prev) => {
      if (!prev) return prev;
      currentPattern = prev.drumPattern;
      return {
        ...prev,
        pattern: emptyPattern, // Keep for backward compatibility
        drumPattern: emptyPattern,
        lastActivity: Date.now(),
      };
    });

    if (roomId) {
      isLocalChangeRef.current = true;
      // Broadcast clear by toggling all active steps off
      currentPattern.forEach((row, rowIndex) => {
        row.forEach((step, colIndex) => {
          if (step.active) {
            broadcastMessage({
              type: "step_toggle",
              row: rowIndex,
              col: colIndex,
              userId: userIdRef.current,
              timestamp: Date.now(),
            });
          }
        });
      });
    }
  }, [roomId, broadcastMessage]);

  // Update transport (optimistic + broadcast)
  const updateTransport = useCallback(
    (transport: Partial<TransportState>) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          transport: { ...prev.transport, ...transport },
          lastActivity: Date.now(),
        };
      });

      if (roomId) {
        isLocalChangeRef.current = true;

        if (transport.isPlaying !== undefined) {
          broadcastMessage({
            type: transport.isPlaying ? "transport_play" : "transport_pause",
            userId: userIdRef.current,
            timestamp: Date.now(),
          });
        }

        if (transport.tempo !== undefined) {
          broadcastMessage({
            type: "tempo_change",
            tempo: transport.tempo,
            userId: userIdRef.current,
            timestamp: Date.now(),
          });
        }

        if (transport.startStep !== undefined || transport.endStep !== undefined) {
          const currentState = roomState || {
            transport: createDefaultTransport(),
          } as RoomState;
          broadcastMessage({
            type: "range_change",
            startStep: transport.startStep ?? currentState.transport.startStep,
            endStep: transport.endStep ?? currentState.transport.endStep,
            userId: userIdRef.current,
            timestamp: Date.now(),
          });
        }
      }
    },
    [roomId, broadcastMessage, roomState],
  );

  // Update instrument parameter (optimistic + broadcast)
  const updateInstrumentParam = useCallback(
    (id: InstrumentId, field: "pitch" | "decay" | "timbre", value: number) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        const nextInstruments = {
          ...prev.instruments,
          [id]: {
            ...prev.instruments[id],
            [field]: value,
          },
        };
        return {
          ...prev,
          instruments: nextInstruments,
          lastActivity: Date.now(),
        };
      });

      if (roomId) {
        isLocalChangeRef.current = true;
        broadcastMessage({
          type: "instrument_param",
          id,
          field,
          value,
          userId: userIdRef.current,
          timestamp: Date.now(),
        });
      }
    },
    [roomId, broadcastMessage],
  );

  // Send chat message
  const sendChatMessage = useCallback(
    (text: string) => {
      if (!roomId || !text.trim()) return;

      const userName = getUserName();
      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: userIdRef.current,
        userName: userName || undefined,
        text: text.trim(),
        timestamp: Date.now(),
      };

      // Optimistically add to local state
      setRoomState((prev) => {
        if (!prev) return prev;
        const currentMessages = prev.chatMessages || [];
        const newMessages = [...currentMessages, message].slice(-100);
        return {
          ...prev,
          chatMessages: newMessages,
        };
      });

      // Broadcast to room
      broadcastMessage({
        type: "chat_message",
        message,
      });
    },
    [roomId, broadcastMessage],
  );

  // Toggle synth sequencer step
  const toggleSynthStep = useCallback(
    (row: number, col: number, note: number) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        const nextSynthPattern = prev.synthPattern.map((r) => r.map((s) => ({ ...s })));
        const step = nextSynthPattern[row]?.[col];
        if (step) {
          if (step.active && step.note === note) {
            // Toggle off if same note
            step.active = false;
          } else {
            // Set note and activate
            step.active = true;
            step.note = note;
          }
        }
        return {
          ...prev,
          synthPattern: nextSynthPattern,
          lastActivity: Date.now(),
        };
      });

      if (roomId) {
        isLocalChangeRef.current = true;
        broadcastMessage({
          type: "synth_step_toggle",
          row,
          col,
          note,
          userId: userIdRef.current,
          timestamp: Date.now(),
        });
      }
    },
    [roomId, broadcastMessage],
  );

  // Clear all steps in synth pattern
  const clearSynthPattern = useCallback(() => {
    const emptySynthPattern = createEmptySynthPattern();
    let currentPattern: SynthPattern = emptySynthPattern;

    setRoomState((prev) => {
      if (!prev) return prev;
      currentPattern = prev.synthPattern;
      return {
        ...prev,
        synthPattern: emptySynthPattern,
        lastActivity: Date.now(),
      };
    });

    if (roomId) {
      isLocalChangeRef.current = true;
      // Broadcast clear by toggling all active steps off
      currentPattern.forEach((row, rowIndex) => {
        row.forEach((step, colIndex) => {
          if (step.active) {
            broadcastMessage({
              type: "synth_step_toggle",
              row: rowIndex,
              col: colIndex,
              note: step.note,
              userId: userIdRef.current,
              timestamp: Date.now(),
            });
          }
        });
      });
    }
  }, [roomId, broadcastMessage]);

  // Update synth parameter
  const updateSynthParam = useCallback(
    (field: keyof RoomState["synthParams"], value: number) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          synthParams: {
            ...prev.synthParams,
            [field]: value,
          },
          lastActivity: Date.now(),
        };
      });

      if (roomId) {
        isLocalChangeRef.current = true;
        broadcastMessage({
          type: "synth_param_change",
          field,
          value,
          userId: userIdRef.current,
          timestamp: Date.now(),
        });
      }
    },
    [roomId, broadcastMessage],
  );

  // Update presence with current name
  const updatePresence = useCallback(() => {
    const channel = channelRef.current;
    if (!channel || !roomId) return;

    const userName = getUserName();
    const participant: Participant = {
      id: userIdRef.current,
      name: userName || undefined,
      joinedAt: Date.now(),
    };
    channel.track(participant);
  }, [roomId]);

  return {
    roomState,
    isConnected,
    participants: roomState?.participants || [],
    isLoading,
    error,
    updatePattern,
    updateTransport,
    updateInstrumentParam,
    toggleStep,
    clearPattern,
    chatMessages: roomState?.chatMessages || [],
    sendChatMessage,
    toggleSynthStep,
    updateSynthParam,
    clearSynthPattern,
    updatePresence,
  };
}
