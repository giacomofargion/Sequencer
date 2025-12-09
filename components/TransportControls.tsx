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
    <section className="flex items-center justify-between border-b border-neutral-200 pb-3 text-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white text-[11px] uppercase tracking-[0.18em] text-neutral-700 shadow-sm transition hover:bg-neutral-100"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={handleRecordToggle}
          disabled={isProcessing || !isReady}
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] uppercase tracking-[0.18em] shadow-sm transition ${
            isRecording
              ? "border-red-500 bg-red-50 text-red-700 animate-pulse"
              : "border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
          } ${isProcessing || !isReady ? "opacity-50 cursor-not-allowed" : ""}`}
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
