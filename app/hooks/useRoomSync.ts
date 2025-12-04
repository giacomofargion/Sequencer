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
} from "@/types/sequencer";
import {
  createEmptyPattern,
  createDefaultTransport,
  createDefaultInstrumentParams,
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

export function useRoomSync(roomId: RoomId | null): UseRoomSyncReturn {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const userIdRef = useRef<string>(getUserId());
  const isLocalChangeRef = useRef(false); // Flag to prevent feedback loops

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
        if (message.userId === userIdRef.current && isLocalChangeRef.current) {
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
          .map((p) => p as Participant);
        setRoomState((prev) =>
          prev ? { ...prev, participants } : null,
        );
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // New participant joined
        const newParticipant = newPresences[0] as Participant;
        if (newParticipant && newParticipant.id !== userIdRef.current) {
          // Send full sync to new participant
          if (roomState) {
            broadcastMessage({
              type: "full_sync",
              state: roomState,
            });
          }
        }
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
        setIsLoading(false);
        if (status === "SUBSCRIBED") {
          // Join presence
          const participant: Participant = {
            id: userIdRef.current,
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
        // Room exists, return it
        return {
          id: data.id,
          pattern: data.pattern,
          transport: data.transport,
          instruments: data.instruments,
          participants: [],
          createdAt: new Date(data.created_at).getTime(),
          lastActivity: new Date(data.last_activity).getTime(),
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
      };

      // Save to Supabase
      const { error: insertError } = await supabase.from("rooms").insert({
        id: newState.id,
        pattern: newState.pattern,
        transport: newState.transport,
        instruments: newState.instruments,
        created_at: new Date(newState.createdAt).toISOString(),
        last_activity: new Date(newState.lastActivity).toISOString(),
      });

      if (insertError) {
        console.error("Error creating room:", insertError);
        setError("Failed to create room");
        return null;
      }

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
          const nextPattern = prev.pattern.map((r) => r.map((s) => ({ ...s })));
          const step = nextPattern[message.row]?.[message.col];
          if (step) {
            step.active = !step.active;
          }
          return {
            ...prev,
            pattern: nextPattern,
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
        return { ...prev, pattern, lastActivity: Date.now() };
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
        const nextPattern = prev.pattern.map((r) => r.map((s) => ({ ...s })));
        const step = nextPattern[row]?.[col];
        if (step) {
          step.active = !step.active;
        }
        return {
          ...prev,
          pattern: nextPattern,
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
  };
}
