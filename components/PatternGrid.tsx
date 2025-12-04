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
};

export const PatternGrid: FC<Props> = ({
  pattern,
  currentStep,
  instrumentParams,
  onToggleStep,
  onInstrumentParamChange,
}) => {
  const steps = pattern[0] ?? [];

  return (
    <section className="mt-3 flex flex-col gap-2">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
        Pattern
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px] rounded border border-neutral-300 bg-white">
          <div className="flex border-b border-neutral-200 bg-neutral-50 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">
            <div className="flex w-24 items-center justify-end px-2">Row</div>
            <div className="flex flex-1">
              {steps.map((_, col) => {
                const isCurrent = col === currentStep;
                return (
                  <div
                    key={col}
                    className={`flex h-7 flex-1 items-center justify-center border-l border-neutral-200 ${
                      isCurrent ? "bg-emerald-50" : ""
                    }`}
                  >
                    {col + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex w-40 items-center justify-center border-l border-neutral-200 px-2 text-[9px]">
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
    <div className="flex border-t border-neutral-200">
      <div className="flex w-24 items-center justify-end bg-neutral-100 px-2 text-[11px] capitalize text-neutral-600">
        {instrument}
      </div>
      <div className="flex flex-1">
        {rowSteps.map((step, col) => {
          const isCurrent = col === currentStep;
          const isActive = step.active;
          return (
            <button
              key={col}
              type="button"
              onClick={() => onToggleStep(rowIndex, col)}
              className={`h-9 flex-1 border-l border-neutral-200 transition ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-white hover:bg-neutral-50"
              } ${isCurrent ? "ring-1 ring-emerald-500/70" : ""}`}
            >
              {isActive && (
                <span className="block text-xs leading-none text-emerald-600">
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex w-40 items-center justify-center gap-2 border-l border-neutral-200 bg-neutral-50 px-2">
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
