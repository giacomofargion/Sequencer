"use client";

import { useState } from "react";
import type { FC } from "react";

type Props = {
  tempo: number;
  startStep: number;
  endStep: number;
  maxSteps: number;
  isPlaying: boolean;
  isRecording: boolean;
  isReady?: boolean;
  onTempoChange: (bpm: number) => void;
  onRangeChange: (start: number, end: number) => void;
  onTogglePlay: () => void;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<Blob | null>;
};

export const TransportControls: FC<Props> = ({
  tempo,
  startStep,
  endStep,
  maxSteps,
  isPlaying,
  isRecording,
  isReady = true,
  onTempoChange,
  onRangeChange,
  onTogglePlay,
  onStartRecording,
  onStopRecording,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, endStep));
    onRangeChange(clamped, endStep);
  };

  const handleEndChange = (value: number) => {
    const clamped = Math.min(maxSteps - 1, Math.max(value, startStep));
    onRangeChange(startStep, clamped);
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      setIsProcessing(true);
      try {
        const blob = await onStopRecording();
        if (blob && blob.size > 0) {
          // Now it's always WAV (converted from WebM)
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sequencer-recording-${new Date().toISOString().replace(/[:.]/g, "-")}.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          console.error("Recording failed: empty or invalid blob");
          alert("Recording failed: No audio was captured. Make sure audio is playing while recording.");
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        alert("Error saving recording. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        await onStartRecording();
      } catch (error) {
        console.error("Error starting recording:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        alert(`Error starting recording: ${errorMessage}`);
      }
    }
  };

  return (
    <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-700/50 pb-3 sm:pb-4 text-xs">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm text-xs sm:text-sm font-bold text-emerald-400 shadow-lg transition-all hover:bg-slate-700/70 hover:border-emerald-500/50 hover:shadow-emerald-500/20 active:scale-95"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={handleRecordToggle}
          disabled={isProcessing || !isReady}
          className={`flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full border text-xs sm:text-sm font-bold shadow-lg transition-all ${
            isRecording
              ? "border-red-500/70 bg-red-900/40 text-red-400 animate-pulse shadow-red-500/30"
              : "border-slate-600/50 bg-slate-700/50 text-slate-400 hover:bg-slate-700/70 hover:border-slate-500 hover:text-slate-300"
          } ${isProcessing || !isReady ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
          title={
            !isReady
              ? "Audio engine is loading..."
              : isRecording
                ? "Stop recording"
                : "Start recording"
          }
        >
          {isRecording ? "●" : "○"}
        </button>
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[140px]">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
            Tempo
          </span>
          <input
            type="range"
            min={60}
            max={180}
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            className="h-1.5 flex-1 sm:w-40 accent-emerald-500"
          />
          <span className="w-10 sm:w-12 text-right font-mono text-xs sm:text-sm font-semibold text-emerald-400 whitespace-nowrap">
            {tempo}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <label className="flex flex-col gap-1.5 flex-1 sm:flex-none">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
            Start
          </span>
          <input
            type="number"
            min={1}
            max={maxSteps}
            value={startStep + 1}
            onChange={(e) => handleStartChange(Number(e.target.value) - 1)}
            className="w-full sm:w-20 rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 text-center font-mono text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:border-slate-500/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 flex-1 sm:flex-none">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
            End
          </span>
          <input
            type="number"
            min={1}
            max={maxSteps}
            value={endStep + 1}
            onChange={(e) => handleEndChange(Number(e.target.value) - 1)}
            className="w-full sm:w-20 rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 text-center font-mono text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:border-slate-500/50"
          />
        </label>
      </div>
    </section>
  );
};
