"use client";

import { useState, useEffect } from "react";
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
  const [mobileStepRange, setMobileStepRange] = useState<"1-8" | "9-16">("1-8");
  const [isMobile, setIsMobile] = useState(false);
  const [soundControlsOpen, setSoundControlsOpen] = useState(false);

  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mobile, determine which steps to show based on selected range
  const getVisibleSteps = () => {
    if (mobileStepRange === "1-8") {
      return Array.from({ length: 8 }, (_, i) => i);
    } else {
      return Array.from({ length: 8 }, (_, i) => i + 8);
    }
  };
  const visibleSteps = getVisibleSteps();

  return (
    <section className="mt-3 flex flex-col gap-3" data-tutorial="pattern-grid">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-semibold">
          Pattern
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile step range toggle - only visible on mobile */}
          <div className="sm:hidden flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-800/50 p-0.5">
            <button
              type="button"
              onClick={() => setMobileStepRange("1-8")}
              className={`px-2.5 py-1 text-[10px] font-medium rounded transition-all ${
                mobileStepRange === "1-8"
                  ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              1-8
            </button>
            <button
              type="button"
              onClick={() => setMobileStepRange("9-16")}
              className={`px-2.5 py-1 text-[10px] font-medium rounded transition-all ${
                mobileStepRange === "9-16"
                  ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              9-16
            </button>
          </div>
          {/* Mobile sound controls toggle - only visible on mobile */}
          <button
            type="button"
            onClick={() => setSoundControlsOpen(!soundControlsOpen)}
            className={`sm:hidden flex items-center justify-center px-3 py-1.5 rounded-lg transition-all border ${
              soundControlsOpen
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/30"
                : "bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 hover:text-white"
            }`}
            aria-label={soundControlsOpen ? "Close sound controls" : "Open sound controls"}
          >
            <svg
              className={`w-4 h-4 mr-1.5 transition-transform duration-300 ${soundControlsOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-medium">Params</span>
          </button>
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
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-full rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm shadow-xl">
          <div className="flex border-b border-slate-700/50 bg-slate-800/50 text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.18em] text-slate-400">
            <div className="flex w-12 sm:w-16 items-center justify-end px-1 sm:px-2 shrink-0">Row</div>
            <div className="flex flex-1 min-w-0">
              {(isMobile ? visibleSteps : steps.map((_, i) => i)).map((col) => {
                const isCurrent = col === currentStep;
                return (
                  <div
                    key={col}
                    className={`flex h-6 sm:h-7 flex-1 ${isMobile ? "min-w-[32px]" : "min-w-[24px]"} sm:min-w-0 items-center justify-center border-l border-slate-700/50 ${
                      isCurrent ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    <span className="text-[8px] sm:text-[9px]">{col + 1}</span>
                  </div>
                );
              })}
            </div>
            <div
              className={`overflow-hidden border-l border-slate-700/50 bg-slate-800/50 transition-all duration-300 ease-in-out shrink-0 ${
                soundControlsOpen ? "w-44 sm:w-48" : "w-0 sm:w-44"
              }`}
            >
              <div className={`flex items-center justify-center px-2 sm:px-2 h-6 sm:h-7 transition-opacity duration-300 ${
                soundControlsOpen ? "opacity-100" : "opacity-0 sm:opacity-100"
              }`}>
                <span className="text-[8px] sm:text-[9px]">Sound</span>
              </div>
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
              visibleSteps={isMobile ? visibleSteps : []}
              isMobile={isMobile}
              soundControlsOpen={soundControlsOpen}
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
  visibleSteps: number[];
  isMobile: boolean;
  soundControlsOpen: boolean;
};

const Row: FC<RowProps> = ({
  instrument,
  rowIndex,
  rowSteps,
  currentStep,
  params,
  onToggleStep,
  onParamChange,
  visibleSteps,
  isMobile,
  soundControlsOpen,
}) => {
  return (
    <div className="flex border-t border-slate-700/50">
      <div className="flex w-12 sm:w-16 items-center justify-end bg-slate-800/50 px-1 sm:px-2 text-[9px] sm:text-[11px] capitalize text-slate-300 font-medium shrink-0">
        <span className="truncate">{instrument}</span>
      </div>
      <div className="flex flex-1 min-w-0">
        {(isMobile && visibleSteps.length > 0 ? visibleSteps : rowSteps.map((_, i) => i)).map((col) => {
          const step = rowSteps[col];
          const isCurrent = col === currentStep;
          const isActive = step.active;
          return (
            <button
              key={col}
              type="button"
              onClick={() => onToggleStep(rowIndex, col)}
              className={`h-8 sm:h-9 flex-1 ${isMobile ? "min-w-[32px]" : "min-w-[24px]"} sm:min-w-0 border-l border-slate-700/50 transition-all ${
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
      <div
        className={`overflow-hidden border-l border-slate-700/50 bg-slate-800/30 transition-all duration-300 ease-in-out shrink-0 ${
          soundControlsOpen ? "w-44 sm:w-48" : "w-0 sm:w-44 sm:opacity-100"
        }`}
        data-tutorial="sound-controls"
      >
        <div className={`flex items-center justify-center gap-2.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap transition-opacity duration-300 ${
          soundControlsOpen ? "opacity-100" : "opacity-0 sm:opacity-100"
        }`}>
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
    </div>
  );
};
