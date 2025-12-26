"use client";

import { useState, useEffect, useRef } from "react";
import {
  createDefaultInstrumentParams,
  createDefaultTransport,
  createEmptyPattern,
  createDefaultPattern,
  createEmptySynthPattern,
  createDefaultSynthParams,
  NUM_STEPS,
  type InstrumentId,
  type InstrumentParamMap,
  type Pattern,
  type RoomId,
  type SynthPattern,
  type SynthParams,
} from "@/types/sequencer";
import { useToneEngine } from "./hooks/useToneEngine";
import { useRoomSync } from "./hooks/useRoomSync";
import { TransportControls } from "@/components/TransportControls";
import { PatternGrid } from "@/components/PatternGrid";
import { SynthPatternGrid } from "@/components/SynthPatternGrid";
import { RoomControls } from "@/components/RoomControls";
import { ChatRoom } from "@/components/ChatRoom";
import { Tutorial } from "@/components/Tutorial";

type InstrumentView = "drums" | "synth";

export default function SequencerPage() {
  // Room management: null = solo mode, string = room ID
  const [roomId, setRoomId] = useState<RoomId | null>(null);

  // Instrument view selector
  const [instrumentView, setInstrumentView] = useState<InstrumentView>("drums");

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);

  // Local state for solo mode (when roomId is null)
  const [localPattern, setLocalPattern] = useState<Pattern>(() => createDefaultPattern());
  const [localInstrumentParams, setLocalInstrumentParams] =
    useState<InstrumentParamMap>(() => createDefaultInstrumentParams());
  const [localSynthPattern, setLocalSynthPattern] = useState<SynthPattern>(() =>
    createEmptySynthPattern(),
  );
  const [localSynthParams, setLocalSynthParams] = useState(() => createDefaultSynthParams());

  // Room sync hook (only active when roomId is set)
  const roomSync = useRoomSync(roomId);

  // Determine which state to use: room sync or local
  const pattern = roomId && roomSync.roomState ? roomSync.roomState.drumPattern : localPattern;
  const instrumentParams =
    roomId && roomSync.roomState ? roomSync.roomState.instruments : localInstrumentParams;
  const synthPattern =
    roomId && roomSync.roomState ? roomSync.roomState.synthPattern : localSynthPattern;
  const synthParams =
    roomId && roomSync.roomState ? roomSync.roomState.synthParams : localSynthParams;
  const transport =
    roomId && roomSync.roomState
      ? roomSync.roomState.transport
      : createDefaultTransport();

  // Tone engine uses current pattern/params
  const engine = useToneEngine(transport, pattern, instrumentParams, synthPattern, synthParams);

  // Check if user has completed tutorial (stored in localStorage)
  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem("sequencer_tutorial_completed");
    if (!hasCompletedTutorial) {
      // Show tutorial on first visit after a short delay
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem("sequencer_tutorial_completed", "true");
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    localStorage.setItem("sequencer_tutorial_completed", "true");
    setShowTutorial(false);
  };

  // Sync room state changes to Tone engine
  useEffect(() => {
    if (roomId && roomSync.roomState) {
      engine.updatePattern(roomSync.roomState.drumPattern);
      engine.updateInstrumentParams(roomSync.roomState.instruments);
      engine.updateSynthPattern(roomSync.roomState.synthPattern);
      engine.updateSynthParams(roomSync.roomState.synthParams);
    } else {
      // Solo mode: sync local state to engine
      engine.updatePattern(localPattern);
      engine.updateInstrumentParams(localInstrumentParams);
      engine.updateSynthPattern(localSynthPattern);
      engine.updateSynthParams(localSynthParams);
    }
  }, [
    roomId,
    roomSync.roomState,
    engine,
    localPattern,
    localInstrumentParams,
    localSynthPattern,
    localSynthParams,
  ]);

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

  const handleSynthStepToggle = (row: number, col: number, note: number) => {
    if (roomId) {
      // Use room sync
      roomSync.toggleSynthStep(row, col, note);
    } else {
      // Local solo mode
      setLocalSynthPattern((prev) => {
        const next = prev.map((r) => r.map((s) => ({ ...s })));
        const step = next[row]?.[col];
        if (step) {
          if (step.active && step.note === note) {
            step.active = false;
          } else {
            step.active = true;
            step.note = note;
          }
        }
        engine.updateSynthPattern(next);
        return next;
      });
    }
  };

  const handleSynthParamChange = (field: keyof typeof localSynthParams, value: number) => {
    if (roomId) {
      // Use room sync
      roomSync.updateSynthParam(field, value);
    } else {
      // Local solo mode
      setLocalSynthParams((prev) => {
        const next = { ...prev, [field]: value };
        engine.updateSynthParams(next);
        return next;
      });
    }
  };

  const handleOctaveChange = (newOctave: number, oldOctave: number) => {
    // Shift all active notes by the octave difference
    const octaveDiff = newOctave - oldOctave;
    if (octaveDiff === 0) return; // No change

    // Calculate semitone shift (12 semitones per octave)
    const semitoneShift = octaveDiff * 12;

    const shiftNotes = (pattern: SynthPattern): SynthPattern => {
      return pattern.map((row) =>
        row.map((step) => {
          if (step.active) {
            // Shift the MIDI note by the semitone difference
            const newNote = step.note + semitoneShift;
            // Clamp to valid MIDI range (0-127)
            const clampedNote = Math.max(0, Math.min(127, newNote));
            return { ...step, note: clampedNote };
          }
          return { ...step };
        }),
      );
    };

    if (roomId) {
      // Use room sync
      if (roomSync.roomState) {
        const updatedPattern = shiftNotes(roomSync.roomState.synthPattern);
        roomSync.updateSynthPattern(updatedPattern);
      }
    } else {
      // Local solo mode
      setLocalSynthPattern((prev) => {
        const updated = shiftNotes(prev);
        engine.updateSynthPattern(updated);
        return updated;
      });
    }
  };

  const handleClearDrums = () => {
    const emptyPattern = createEmptyPattern();
    if (roomId) {
      roomSync.clearPattern();
    } else {
      setLocalPattern(emptyPattern);
      engine.updatePattern(emptyPattern);
    }
  };

  const handleClearSynth = () => {
    const emptySynthPattern = createEmptySynthPattern();
    if (roomId) {
      roomSync.clearSynthPattern();
    } else {
      setLocalSynthPattern(emptySynthPattern);
      engine.updateSynthPattern(emptySynthPattern);
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
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-3 sm:gap-4 border-b border-slate-700/50 pb-3 sm:pb-4 backdrop-blur-sm">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-emerald-400/70 font-semibold mb-1">
            Fargion
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Sequencer
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("sequencer_tutorial_completed");
              setShowTutorial(true);
            }}
            className="text-[9px] sm:text-[10px] text-slate-400 hover:text-slate-200 underline transition-colors"
            title="Start tutorial"
          >
            Tutorial
          </button>
          <div data-tutorial="room-controls">
            <RoomControls
              roomId={roomId}
              isConnected={roomSync.isConnected}
              participantCount={roomSync.participants.length + (roomId ? 1 : 0)}
              onRoomChange={setRoomId}
              onNameChange={() => {
                // Update presence when name changes
                if (roomId) {
                  roomSync.updatePresence();
                }
              }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-4">
        <section className="relative flex flex-1 flex-col rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
          {roomSync.error && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-900/20 backdrop-blur-sm p-3 text-xs text-red-300">
              {roomSync.error}
            </div>
          )}

          <div data-tutorial="transport-controls">
            <TransportControls
              tempo={engine.transport.tempo}
              startStep={engine.transport.startStep}
              endStep={engine.transport.endStep}
              maxSteps={NUM_STEPS}
              isPlaying={engine.transport.isPlaying}
              isRecording={engine.isRecording}
              isReady={engine.ready}
              onTempoChange={handleTransportChange.tempo}
              onRangeChange={handleTransportChange.range}
              onTogglePlay={handleTransportChange.togglePlay}
              onStartRecording={engine.startRecording}
              onStopRecording={engine.stopRecording}
            />
          </div>

          {/* Instrument view selector */}
          <div className="mt-4 flex gap-2 border-b border-slate-700/50 pb-2" data-tutorial="instrument-tabs">
            <button
              type="button"
              onClick={() => setInstrumentView("drums")}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all rounded-t-lg ${
                instrumentView === "drums"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-700/30 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              Drums
            </button>
            <button
              type="button"
              onClick={() => setInstrumentView("synth")}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all rounded-t-lg ${
                instrumentView === "synth"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-slate-700/30 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              Synth
            </button>
          </div>

          {/* Instrument grids */}
          {instrumentView === "drums" && (
            <PatternGrid
              pattern={pattern}
              currentStep={engine.transport.currentStep}
              instrumentParams={instrumentParams}
              onToggleStep={handleToggleStep}
              onInstrumentParamChange={handleInstrumentParamsChange}
              onClear={handleClearDrums}
            />
          )}

          {instrumentView === "synth" && (
            <SynthPatternGrid
              pattern={synthPattern}
              currentStep={engine.transport.currentStep}
              synthParams={synthParams}
              onToggleStep={handleSynthStepToggle}
              onParamChange={handleSynthParamChange}
              onClear={handleClearSynth}
              onOctaveChange={handleOctaveChange}
            />
          )}

          {!engine.ready && (
            <p className="mt-4 text-xs text-slate-400">
              Audio engine is loading in the background. You can already draw a
              pattern; sound will start once it is ready.
            </p>
          )}

          {roomId && roomSync.isLoading && (
            <p className="mt-4 text-xs text-slate-400">Connecting to room...</p>
          )}
        </section>

        {roomId && (
          <aside className="w-full lg:w-80 shrink-0">
            <ChatRoom
              messages={roomSync.chatMessages}
              onSendMessage={roomSync.sendChatMessage}
            />
          </aside>
        )}
      </div>

      <Tutorial
        isActive={showTutorial}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    </main>
  );
}
