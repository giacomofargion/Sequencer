import type { FC } from "react";

type Props = {
  tempo: number;
  startStep: number;
  endStep: number;
  maxSteps: number;
  isPlaying: boolean;
  onTempoChange: (bpm: number) => void;
  onRangeChange: (start: number, end: number) => void;
  onTogglePlay: () => void;
};

export const TransportControls: FC<Props> = ({
  tempo,
  startStep,
  endStep,
  maxSteps,
  isPlaying,
  onTempoChange,
  onRangeChange,
  onTogglePlay,
}) => {
  const handleStartChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, endStep));
    onRangeChange(clamped, endStep);
  };

  const handleEndChange = (value: number) => {
    const clamped = Math.min(maxSteps - 1, Math.max(value, startStep));
    onRangeChange(startStep, clamped);
  };

  return (
    <section className="flex items-center justify-between border-b border-neutral-200 pb-3 text-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white text-[11px] uppercase tracking-[0.18em] text-neutral-700 shadow-sm transition hover:bg-neutral-100"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Tempo
          </span>
          <input
            type="range"
            min={60}
            max={180}
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            className="h-1 w-40 accent-emerald-600"
          />
          <span className="w-10 text-right font-mono text-[11px] text-neutral-700">
            {tempo}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            Start
          </span>
          <input
            type="number"
            min={1}
            max={maxSteps}
            value={startStep + 1}
            onChange={(e) => handleStartChange(Number(e.target.value) - 1)}
            className="w-14 rounded border border-neutral-300 bg-white px-1 py-0.5 text-right font-mono text-[11px]"
          />
        </label>
        <label className="flex items-center gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            End
          </span>
          <input
            type="number"
            min={1}
            max={maxSteps}
            value={endStep + 1}
            onChange={(e) => handleEndChange(Number(e.target.value) - 1)}
            className="w-14 rounded border border-neutral-300 bg-white px-1 py-0.5 text-right font-mono text-[11px]"
          />
        </label>
      </div>
    </section>
  );
};
