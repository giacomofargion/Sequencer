"use client";

import { useState } from "react";
import {
  createDefaultInstrumentParams,
  createDefaultTransport,
  createEmptyPattern,
  NUM_STEPS,
  type InstrumentId,
  type InstrumentParamMap,
  type Pattern,
} from "@/types/sequencer";
import { useToneEngine } from "./hooks/useToneEngine";
import { TransportControls } from "@/components/TransportControls";
import { PatternGrid } from "@/components/PatternGrid";

export default function SequencerPage() {
  const [pattern, setPattern] = useState<Pattern>(() => createEmptyPattern());
  const [instrumentParams, setInstrumentParams] =
    useState<InstrumentParamMap>(() => createDefaultInstrumentParams());

  const engine = useToneEngine(
    createDefaultTransport(),
    pattern,
    instrumentParams,
  );

  const handleToggleStep = (row: number, col: number) => {
    setPattern((prev) => {
      const next = prev.map((r) => r.map((s) => ({ ...s })));
      next[row][col].active = !next[row][col].active;
      engine.updatePattern(next);
      return next;
    });
  };

  const handleInstrumentParamsChange = (
    id: InstrumentId,
    field: "pitch" | "decay" | "timbre",
    value: number,
  ) => {
    setInstrumentParams((prev) => {
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
  };

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
        <div className="text-right text-xs text-neutral-500">
          <div>Room Code:</div>
          <div className="font-mono text-[11px] tracking-widest">solo</div>
        </div>
      </header>

      <section className="flex flex-1 flex-col rounded-md border border-neutral-300 bg-white p-4 shadow-sm">
        <TransportControls
          tempo={engine.transport.tempo}
          startStep={engine.transport.startStep}
          endStep={engine.transport.endStep}
          maxSteps={NUM_STEPS}
          isPlaying={engine.transport.isPlaying}
          onTempoChange={engine.setTempo}
          onRangeChange={engine.setRange}
          onTogglePlay={engine.togglePlay}
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
      </section>
    </main>
  );
}
