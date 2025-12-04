"use client";

import { useState, useEffect } from "react";
import {
  createDefaultInstrumentParams,
  createDefaultTransport,
  createEmptyPattern,
  NUM_STEPS,
  type InstrumentId,
  type InstrumentParamMap,
  type Pattern,
  type RoomId,
} from "@/types/sequencer";
import { useToneEngine } from "./hooks/useToneEngine";
import { useRoomSync } from "./hooks/useRoomSync";
import { TransportControls } from "@/components/TransportControls";
import { PatternGrid } from "@/components/PatternGrid";
import { RoomControls } from "@/components/RoomControls";

export default function SequencerPage() {
  // Room management: null = solo mode, string = room ID
  const [roomId, setRoomId] = useState<RoomId | null>(null);

  // Local state for solo mode (when roomId is null)
  const [localPattern, setLocalPattern] = useState<Pattern>(() => createEmptyPattern());
  const [localInstrumentParams, setLocalInstrumentParams] =
    useState<InstrumentParamMap>(() => createDefaultInstrumentParams());

  // Room sync hook (only active when roomId is set)
  const roomSync = useRoomSync(roomId);

  // Determine which state to use: room sync or local
  const pattern = roomId && roomSync.roomState ? roomSync.roomState.pattern : localPattern;
  const instrumentParams =
    roomId && roomSync.roomState ? roomSync.roomState.instruments : localInstrumentParams;
  const transport =
    roomId && roomSync.roomState
      ? roomSync.roomState.transport
      : createDefaultTransport();

  // Tone engine uses current pattern/params
  const engine = useToneEngine(transport, pattern, instrumentParams);

  // Sync room state changes to Tone engine
  useEffect(() => {
    if (roomId && roomSync.roomState) {
      engine.updatePattern(roomSync.roomState.pattern);
      engine.updateInstrumentParams(roomSync.roomState.instruments);
    }
  }, [roomId, roomSync.roomState, engine]);

  // Sync transport changes from room
  useEffect(() => {
    if (roomId && roomSync.roomState) {
      const roomTransport = roomSync.roomState.transport;
      if (roomTransport.tempo !== engine.transport.tempo) {
        engine.setTempo(roomTransport.tempo);
      }
      if (
        roomTransport.startStep !== engine.transport.startStep ||
        roomTransport.endStep !== engine.transport.endStep
      ) {
        engine.setRange(roomTransport.startStep, roomTransport.endStep);
      }
      if (roomTransport.isPlaying !== engine.transport.isPlaying) {
        if (roomTransport.isPlaying && !engine.transport.isPlaying) {
          engine.togglePlay();
        } else if (!roomTransport.isPlaying && engine.transport.isPlaying) {
          engine.togglePlay();
        }
      }
    }
  }, [roomId, roomSync.roomState, engine]);

  const handleToggleStep = (row: number, col: number) => {
    if (roomId) {
      // Use room sync
      roomSync.toggleStep(row, col);
    } else {
      // Local solo mode
      setLocalPattern((prev) => {
        const next = prev.map((r) => r.map((s) => ({ ...s })));
        next[row][col].active = !next[row][col].active;
        engine.updatePattern(next);
        return next;
      });
    }
  };

  const handleInstrumentParamsChange = (
    id: InstrumentId,
    field: "pitch" | "decay" | "timbre",
    value: number,
  ) => {
    if (roomId) {
      // Use room sync
      roomSync.updateInstrumentParam(id, field, value);
    } else {
      // Local solo mode
      setLocalInstrumentParams((prev) => {
        const next: InstrumentParamMap = {
          ...prev,
          [id]: {
            ...prev[id],
            [field]: value,
          },
        };
        engine.updateInstrumentParams(next);
        return next;
      });
    }
  };

  const handleTransportChange = {
    tempo: (tempo: number) => {
      if (roomId) {
        roomSync.updateTransport({ tempo });
      } else {
        engine.setTempo(tempo);
      }
    },
    range: (startStep: number, endStep: number) => {
      if (roomId) {
        roomSync.updateTransport({ startStep, endStep });
      } else {
        engine.setRange(startStep, endStep);
      }
    },
    togglePlay: async () => {
      if (roomId) {
        const currentPlaying = engine.transport.isPlaying;
        roomSync.updateTransport({ isPlaying: !currentPlaying });
      } else {
        await engine.togglePlay();
      }
    },
  };;

  return (
    <main className="flex flex-1 flex-col gap-4">
      <header className="flex items-baseline justify-between border-b border-neutral-300 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Intersymmetric Works
          </p>
          <h1 className="text-sm font-medium tracking-[0.18em] text-neutral-800">
            Sequencer 01
          </h1>
        </div>
        <RoomControls
          roomId={roomId}
          isConnected={roomSync.isConnected}
          participantCount={roomSync.participants.length + (roomId ? 1 : 0)}
          onRoomChange={setRoomId}
        />
      </header>

      <section className="flex flex-1 flex-col rounded-md border border-neutral-300 bg-white p-4 shadow-sm">
        {roomSync.error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            {roomSync.error}
          </div>
        )}

        <TransportControls
          tempo={engine.transport.tempo}
          startStep={engine.transport.startStep}
          endStep={engine.transport.endStep}
          maxSteps={NUM_STEPS}
          isPlaying={engine.transport.isPlaying}
          onTempoChange={handleTransportChange.tempo}
          onRangeChange={handleTransportChange.range}
          onTogglePlay={handleTransportChange.togglePlay}
        />

        <PatternGrid
          pattern={pattern}
          currentStep={engine.transport.currentStep}
          instrumentParams={instrumentParams}
          onToggleStep={handleToggleStep}
          onInstrumentParamChange={handleInstrumentParamsChange}
        />

        {!engine.ready && (
          <p className="mt-4 text-xs text-neutral-400">
            Audio engine is loading in the background. You can already draw a
            pattern; sound will start once it is ready.
          </p>
        )}

        {roomId && roomSync.isLoading && (
          <p className="mt-4 text-xs text-neutral-400">Connecting to room...</p>
        )}
      </section>
    </main>
  );
}
