// Core data model for the step sequencer lives here so UI and audio can share it.

export type InstrumentId = "kick" | "snare" | "hihat" | "tom" | "synth";

export const INSTRUMENTS: InstrumentId[] = [
  "kick",
  "snare",
  "hihat",
  "tom",
  "synth",
];

export type StepState = {
  active: boolean;
  // In the future we can add per-step velocity, probability, etc.
};

export type Pattern = StepState[][];

export type TransportState = {
  isPlaying: boolean;
  tempo: number;
  startStep: number;
  endStep: number;
  currentStep: number;
};

export type InstrumentParams = {
  pitch: number;
  decay: number;
  timbre: number;
};

export type InstrumentParamMap = Record<InstrumentId, InstrumentParams>;

export type SequencerState = {
  pattern: Pattern;
  transport: TransportState;
  instruments: InstrumentParamMap;
};

export const NUM_STEPS = 16;

export function createEmptyPattern(steps: number = NUM_STEPS): Pattern {
  return INSTRUMENTS.map(() =>
    Array.from({ length: steps }, () => ({ active: false })),
  );
}

export function createDefaultTransport(): TransportState {
  return {
    isPlaying: false,
    tempo: 100,
    startStep: 0,
    endStep: NUM_STEPS - 1,
    currentStep: 0,
  };
}

export function createDefaultInstrumentParams(): InstrumentParamMap {
  return {
    kick: { pitch: -12, decay: 0.6, timbre: 0.5 },
    snare: { pitch: 0, decay: 0.4, timbre: 0.7 },
    hihat: { pitch: 12, decay: 0.2, timbre: 0.8 },
    tom: { pitch: -5, decay: 0.5, timbre: 0.6 },
    synth: { pitch: 0, decay: 0.8, timbre: 0.5 },
  };
}
