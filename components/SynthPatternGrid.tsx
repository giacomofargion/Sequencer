"use client";

import { useState } from "react";
import type { FC } from "react";
import type { SynthPattern, SynthParams } from "@/types/sequencer";
import { Knob } from "@/components/Knob";

type Props = {
  pattern: SynthPattern;
  currentStep: number;
  synthParams: SynthParams;
  onToggleStep: (row: number, col: number, note: number) => void;
  onParamChange: (field: keyof SynthParams, value: number) => void;
};

// MIDI note to note name mapping
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Calculate MIDI note from row (0-11) and octave (0-8)
function rowToMidiNote(row: number, octave: number): number {
  // MIDI note = 12 * (octave + 1) + row
  // Octave 0 = C0 (MIDI 12), Octave 3 = C3 (MIDI 48), Octave 4 = C4 (MIDI 60)
  return 12 * (octave + 1) + row;
}

function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const note = midi % 12;
  return `${NOTE_NAMES[note]}${octave}`;
}

export const SynthPatternGrid: FC<Props> = ({
  pattern,
  currentStep,
  synthParams,
  onToggleStep,
  onParamChange,
}) => {
  const [octave, setOctave] = useState(3); // Default to octave 3 (C3-C4 range)
  const steps = pattern[0] ?? [];

  const handleStepClick = (row: number, col: number) => {
    const step = pattern[row]?.[col];
    const midiNote = rowToMidiNote(row, octave);

    if (step?.active) {
      // Toggle off - use the current row's note
      onToggleStep(row, col, midiNote);
    } else {
      // Toggle on with note calculated from row + octave
      onToggleStep(row, col, midiNote);
    }
  };

  return (
    <section className="mt-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          FM Synthesizer Sequencer
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-600">Octave:</label>
            <Knob
              label=""
              min={0}
              max={8}
              step={1}
              value={octave}
              onChange={setOctave}
            />
            <span className="text-xs font-mono text-neutral-600 w-8">{octave}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px] rounded border border-blue-200 bg-white">
          <div className="flex border-b border-blue-200 bg-blue-50 text-[9px] font-mono uppercase tracking-[0.18em] text-blue-700">
            <div className="flex w-24 items-center justify-end px-2">Note</div>
            <div className="flex flex-1">
              {steps.map((_, col) => {
                const isCurrent = col === currentStep;
                return (
                  <div
                    key={col}
                    className={`flex h-7 flex-1 items-center justify-center border-l border-blue-200 ${
                      isCurrent ? "bg-blue-100" : ""
                    }`}
                  >
                    {col + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {pattern.map((row, rowIndex) => {
            const noteName = NOTE_NAMES[rowIndex];
            const midiNote = rowToMidiNote(rowIndex, octave);
            const noteLabel = `${noteName}${octave}`;

            return (
              <SynthRow
                key={rowIndex}
                rowIndex={rowIndex}
                rowSteps={row}
                currentStep={currentStep}
                noteLabel={noteLabel}
                midiNote={midiNote}
                octave={octave}
                onStepClick={handleStepClick}
              />
            );
          })}
        </div>
      </div>

      {/* All Parameters in One Section */}
      <div className="mt-4 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50/50 to-blue-100/30 p-4 shadow-sm">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-blue-700">
          FM Synthesis Parameters
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {/* Pitch Section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
              Pitch
            </div>
            <Knob
              label="Pitch Offset"
              min={-24}
              max={24}
              step={1}
              value={synthParams.pitch}
              onChange={(v) => onParamChange("pitch", v)}
            />
            <Knob
              label="Detune"
              min={-50}
              max={50}
              step={1}
              value={synthParams.detune}
              onChange={(v) => onParamChange("detune", v)}
            />
          </div>

          {/* Envelope Section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
              Envelope
            </div>
            <Knob
              label="Attack"
              min={0.001}
              max={2}
              step={0.01}
              value={synthParams.attack}
              onChange={(v) => onParamChange("attack", v)}
            />
            <Knob
              label="Decay"
              min={0.01}
              max={2}
              step={0.01}
              value={synthParams.decay}
              onChange={(v) => onParamChange("decay", v)}
            />
            <Knob
              label="Sustain"
              min={0}
              max={1}
              step={0.01}
              value={synthParams.sustain}
              onChange={(v) => onParamChange("sustain", v)}
            />
            <Knob
              label="Release"
              min={0.01}
              max={2}
              step={0.01}
              value={synthParams.release}
              onChange={(v) => onParamChange("release", v)}
            />
          </div>

          {/* FM Modulation Section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
              FM Modulation
            </div>
            <Knob
              label="Harmonicity"
              min={0.1}
              max={20}
              step={0.1}
              value={synthParams.harmonicity}
              onChange={(v) => onParamChange("harmonicity", v)}
            />
            <Knob
              label="Mod Index"
              min={0}
              max={50}
              step={0.5}
              value={synthParams.modulationIndex}
              onChange={(v) => onParamChange("modulationIndex", v)}
            />
          </div>

          {/* Mod Envelope Section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
              Mod Envelope
            </div>
            <Knob
              label="Mod Attack"
              min={0.001}
              max={2}
              step={0.01}
              value={synthParams.modAttack}
              onChange={(v) => onParamChange("modAttack", v)}
            />
            <Knob
              label="Mod Decay"
              min={0.01}
              max={2}
              step={0.01}
              value={synthParams.modDecay}
              onChange={(v) => onParamChange("modDecay", v)}
            />
            <Knob
              label="Mod Sustain"
              min={0}
              max={1}
              step={0.01}
              value={synthParams.modSustain}
              onChange={(v) => onParamChange("modSustain", v)}
            />
            <Knob
              label="Mod Release"
              min={0.01}
              max={2}
              step={0.01}
              value={synthParams.modRelease}
              onChange={(v) => onParamChange("modRelease", v)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

type SynthRowProps = {
  rowIndex: number;
  rowSteps: SynthPattern[number];
  currentStep: number;
  noteLabel: string;
  midiNote: number;
  octave: number;
  onStepClick: (row: number, col: number) => void;
};

const SynthRow: FC<SynthRowProps> = ({
  rowIndex,
  rowSteps,
  currentStep,
  noteLabel,
  midiNote,
  octave,
  onStepClick,
}) => {
  // Determine if this is a black key (C#, D#, F#, G#, A#)
  const isBlackKey = [1, 3, 6, 8, 10].includes(rowIndex);

  return (
    <div className={`flex border-t border-blue-200 ${isBlackKey ? "bg-blue-50/30" : ""}`}>
      <div className={`flex w-24 items-center justify-end px-2 text-[11px] font-medium ${
        isBlackKey ? "bg-blue-100/50 text-blue-600" : "bg-blue-100/30 text-blue-700"
      }`}>
        {noteLabel}
      </div>
      <div className="flex flex-1">
        {rowSteps.map((step, col) => {
          const isCurrent = col === currentStep;
          const isActive = step.active;
          // Check if the step's note matches the current row's note (same note name, any octave)
          // We match by note name (modulo 12) rather than exact MIDI note
          const stepNoteName = step.note % 12;
          const rowNoteName = rowIndex;
          const noteMatches = stepNoteName === rowNoteName;

          return (
            <button
              key={col}
              type="button"
              onClick={() => onStepClick(rowIndex, col)}
              className={`h-8 flex-1 border-l border-blue-200 transition ${
                isActive && noteMatches
                  ? isBlackKey
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-white hover:bg-blue-50"
              } ${isCurrent ? "ring-1 ring-blue-500" : ""}`}
            >
              {isActive && noteMatches ? (
                <span className="text-xs">●</span>
              ) : (
                <span className="text-[10px] text-neutral-300">·</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
