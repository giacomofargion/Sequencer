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

// Collaboration types for real-time room sync
export type RoomId = string; // Short, URL-friendly code (e.g., "abc123")

export type Participant = {
  id: string; // Client-generated UUID
  name?: string; // Optional display name
  joinedAt: number; // Timestamp
};

export type RoomState = {
  id: RoomId;
  pattern: Pattern;
  transport: TransportState;
  instruments: InstrumentParamMap;
  participants: Participant[];
  createdAt: number;
  lastActivity: number;
};

export type SyncMessage =
  | { type: "step_toggle"; row: number; col: number; userId: string; timestamp: number }
  | { type: "transport_play"; userId: string; timestamp: number }
  | { type: "transport_pause"; userId: string; timestamp: number }
  | { type: "tempo_change"; tempo: number; userId: string; timestamp: number }
  | { type: "range_change"; startStep: number; endStep: number; userId: string; timestamp: number }
  | {
      type: "instrument_param";
      id: InstrumentId;
      field: "pitch" | "decay" | "timbre";
      value: number;
      userId: string;
      timestamp: number;
    }
  | { type: "participant_join"; participant: Participant }
  | { type: "participant_leave"; participantId: string }
  | { type: "full_sync"; state: RoomState }; // Initial sync on join

// Generate a random room ID (6 alphanumeric characters)
export function generateRoomId(): RoomId {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
