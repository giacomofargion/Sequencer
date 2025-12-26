import type { FC } from "react";
import {
  INSTRUMENTS,
  type InstrumentId,
  type InstrumentParamMap,
  type Pattern,
} from "@/types/sequencer";
import { Knob } from "@/components/Knob";

type Props = {
  pattern: Pattern;
  currentStep: number;
  instrumentParams: InstrumentParamMap;
  onToggleStep: (row: number, col: number) => void;
  onInstrumentParamChange: (
    id: InstrumentId,
    field: "pitch" | "decay" | "timbre",
    value: number,
  ) => void;
  onClear?: () => void;
};

export const PatternGrid: FC<Props> = ({
  pattern,
  currentStep,
  instrumentParams,
  onToggleStep,
  onInstrumentParamChange,
  onClear,
}) => {
  const steps = pattern[0] ?? [];

  return (
    <section className="mt-3 flex flex-col gap-3" data-tutorial="pattern-grid">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-semibold">
          Pattern
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 hover:border-slate-500 active:scale-95 backdrop-blur-sm"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-full rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm shadow-xl">
          <div className="flex border-b border-slate-700/50 bg-slate-800/50 text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.18em] text-slate-400">
            <div className="flex w-12 sm:w-16 items-center justify-end px-1 sm:px-2 shrink-0">Row</div>
            <div className="flex flex-1 min-w-0">
              {steps.map((_, col) => {
                const isCurrent = col === currentStep;
                return (
                  <div
                    key={col}
                    className={`flex h-6 sm:h-7 flex-1 min-w-[24px] sm:min-w-0 items-center justify-center border-l border-slate-700/50 ${
                      isCurrent ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    <span className="text-[8px] sm:text-[9px]">{col + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex w-32 sm:w-48 items-center justify-center border-l border-slate-700/50 px-1 sm:px-2 text-[8px] sm:text-[9px] text-slate-400 shrink-0">
              Sound
            </div>
          </div>

          {INSTRUMENTS.map((instrument, row) => (
            <Row
              key={instrument}
              instrument={instrument}
              rowIndex={row}
              rowSteps={pattern[row]}
              currentStep={currentStep}
              params={instrumentParams[instrument]}
              onToggleStep={onToggleStep}
              onParamChange={onInstrumentParamChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

type RowProps = {
  instrument: InstrumentId;
  rowIndex: number;
  rowSteps: Pattern[number];
  currentStep: number;
  params: InstrumentParamMap[InstrumentId];
  onToggleStep: (row: number, col: number) => void;
  onParamChange: (
    id: InstrumentId,
    field: "pitch" | "decay" | "timbre",
    value: number,
  ) => void;
};

const Row: FC<RowProps> = ({
  instrument,
  rowIndex,
  rowSteps,
  currentStep,
  params,
  onToggleStep,
  onParamChange,
}) => {
  return (
    <div className="flex border-t border-slate-700/50">
      <div className="flex w-12 sm:w-16 items-center justify-end bg-slate-800/50 px-1 sm:px-2 text-[9px] sm:text-[11px] capitalize text-slate-300 font-medium shrink-0">
        <span className="truncate">{instrument}</span>
      </div>
      <div className="flex flex-1 min-w-0">
        {rowSteps.map((step, col) => {
          const isCurrent = col === currentStep;
          const isActive = step.active;
          return (
            <button
              key={col}
              type="button"
              onClick={() => onToggleStep(rowIndex, col)}
              className={`h-8 sm:h-9 flex-1 min-w-[24px] sm:min-w-0 border-l border-slate-700/50 transition-all ${
                isActive
                  ? "bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/40"
                  : "bg-slate-900/30 hover:bg-slate-800/50"
              } ${isCurrent ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20" : ""}`}
            >
              {isActive && (
                <span className="block text-[10px] sm:text-xs leading-none text-emerald-300 font-bold">
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex w-32 sm:w-48 items-center justify-center gap-1 sm:gap-2 border-l border-slate-700/50 bg-slate-800/30 px-1 sm:px-3 py-1 sm:py-2 shrink-0" data-tutorial="sound-controls">
        <Knob
          label="Pitch"
          min={-24}
          max={24}
          step={1}
          value={params.pitch}
          onChange={(v) => onParamChange(instrument, "pitch", v)}
        />
        <Knob
          label="Decay"
          min={0.1}
          max={1.5}
          step={0.05}
          value={params.decay}
          onChange={(v) => onParamChange(instrument, "decay", v)}
        />
        <Knob
          label="Timbre"
          min={0}
          max={1}
          step={0.05}
          value={params.timbre}
          onChange={(v) => onParamChange(instrument, "timbre", v)}
        />
      </div>
    </div>
  );
};
