// Core data model for the step sequencer lives here so UI and audio can share it.

export type InstrumentId = "kick" | "snare" | "hihat" | "tom" | "clap";

export const INSTRUMENTS: InstrumentId[] = [
  "kick",
  "snare",
  "hihat",
  "tom",
  "clap",
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

// Create a default template beat for better UX
// Classic 4/4 pattern: Kick on 1, 5, 9, 13; Hihat on 3, 7, 11, 15; Clap on 5, 13
export function createDefaultPattern(steps: number = NUM_STEPS): Pattern {
  const pattern = createEmptyPattern(steps);

  // Kick: Steps 1, 5, 9, 13 (0-indexed: 0, 4, 8, 12) - classic 4/4 kick pattern
  const kickIndex = INSTRUMENTS.indexOf("kick");
  if (kickIndex !== -1) {
    [0, 4, 8, 12].forEach(step => {
      if (step < steps) pattern[kickIndex][step].active = true;
    });
  }

  // Hihat: Steps 3, 7, 11, 15 (0-indexed: 2, 6, 10, 14) - off-beat hihat pattern
  const hihatIndex = INSTRUMENTS.indexOf("hihat");
  if (hihatIndex !== -1) {
    [2, 6, 10, 14].forEach(step => {
      if (step < steps) pattern[hihatIndex][step].active = true;
    });
  }

  // Clap: Steps 5, 13 (0-indexed: 4, 12) - accent on beats 2 and 4
  const clapIndex = INSTRUMENTS.indexOf("clap");
  if (clapIndex !== -1) {
    [4, 12].forEach(step => {
      if (step < steps) pattern[clapIndex][step].active = true;
    });
  }

  // Snare and Tom remain empty (user can add them)

  return pattern;
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
    clap: { pitch: 0, decay: 0.3, timbre: 0.6 },
  };
}

// Collaboration types for real-time room sync
export type RoomId = string; // Short, URL-friendly code (e.g., "abc123")

export type Participant = {
  id: string; // Client-generated UUID
  name?: string; // Optional display name
  joinedAt: number; // Timestamp
};

// Chat message type for real-time room chat
export type ChatMessage = {
  id: string; // Unique message ID
  userId: string; // Sender's user ID
  userName?: string; // Optional display name
  text: string; // Message content
  timestamp: number; // When message was sent
};

export type RoomState = {
  id: RoomId;
  pattern: Pattern; // Drum sequencer pattern (renamed from pattern for clarity)
  transport: TransportState;
  instruments: InstrumentParamMap;
  participants: Participant[];
  createdAt: number;
  lastActivity: number;
  chatMessages: ChatMessage[]; // Real-time chat messages (not persisted)
  // Multi-instrument support
  drumPattern: Pattern; // Explicit drum sequencer pattern
  synthPattern: SynthPattern; // Synthesizer sequencer pattern
  synthParams: SynthParams; // Global synth parameters
};

// Multi-instrument types
export type InstrumentType = "drum_sequencer" | "synth_sequencer";

export type SynthStepState = {
  active: boolean;
  note: number; // MIDI note (0-127)
};

export type SynthPattern = SynthStepState[][];

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
  | { type: "full_sync"; state: RoomState } // Initial sync on join
  | { type: "chat_message"; message: ChatMessage } // Chat message
  | { type: "clear_pattern"; userId: string; timestamp: number } // Clear drum pattern
  | { type: "clear_synth_pattern"; userId: string; timestamp: number } // Clear synth pattern
  | { type: "synth_step_toggle"; row: number; col: number; note: number; userId: string; timestamp: number } // Synth sequencer step toggle
  | {
      type: "synth_param_change";
      field: keyof SynthParams;
      value: number;
      userId: string;
      timestamp: number;
    }; // Synth parameter change

// Generate a random room ID (6 alphanumeric characters)
export function generateRoomId(): RoomId {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper to create empty synth pattern
// 12 rows for chromatic scale (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
export function createEmptySynthPattern(steps: number = NUM_STEPS, rows: number = 12): SynthPattern {
  return Array.from({ length: rows }, () =>
    Array.from({ length: steps }, () => ({ active: false, note: 60 })), // Note will be calculated from row + octave
  );
}

// Advanced FM synth parameters
export type SynthParams = {
  // Pitch
  pitch: number; // Global pitch offset in semitones
  detune: number; // Fine detune in cents

  // Envelope (ADSR)
  attack: number; // Attack time in seconds
  decay: number; // Decay time in seconds
  sustain: number; // Sustain level (0-1)
  release: number; // Release time in seconds

  // FM Modulation
  harmonicity: number; // Ratio between carrier and modulator (0.1-20)
  modulationIndex: number; // Modulation depth (0-50)

  // Modulation Envelope
  modAttack: number; // Modulation attack time
  modDecay: number; // Modulation decay time
  modSustain: number; // Modulation sustain level
  modRelease: number; // Modulation release time
};

// Helper to create default synth params
export function createDefaultSynthParams(): SynthParams {
  return {
    pitch: 0,
    detune: 0,
    attack: 0.01,
    decay: 0.3,
    sustain: 0.1,
    release: 0.2,
    harmonicity: 3,
    modulationIndex: 10,
    modAttack: 0.01,
    modDecay: 0.3,
    modSustain: 0.5,
    modRelease: 0.2,
  };
}
