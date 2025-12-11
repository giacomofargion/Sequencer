// Audio engine hook that wraps Tone.js.
// Keeps Tone-specific details here so UI stays simple and type-safe.

import { useEffect, useRef, useState } from "react";
import type {
  InstrumentId,
  InstrumentParamMap,
  Pattern,
  TransportState,
  SynthPattern,
  SynthParams,
} from "@/types/sequencer";

export type ToneEngineApi = {
  ready: boolean;
  transport: TransportState;
  setTempo: (bpm: number) => void;
  setRange: (startStep: number, endStep: number) => void;
  togglePlay: () => void;
  updatePattern: (pattern: Pattern) => void;
  updateInstrumentParams: (params: InstrumentParamMap) => void;
  updateSynthPattern: (synthPattern: SynthPattern) => void;
  updateSynthParams: (params: SynthParams) => void;
  // Recording functionality
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
};

export function useToneEngine(
  initialTransport: TransportState,
  initialPattern: Pattern,
  initialParams: InstrumentParamMap,
  initialSynthPattern?: SynthPattern,
  initialSynthParams?: SynthParams,
): ToneEngineApi {
  const [transport, setTransport] = useState<TransportState>(initialTransport);
  const [ready, setReady] = useState(false);

  const toneRef = useRef<typeof import("tone") | null>(null);
  const patternRef = useRef<Pattern>(initialPattern);
  const paramsRef = useRef<InstrumentParamMap>(initialParams);
  const synthPatternRef = useRef<SynthPattern>(
    initialSynthPattern || Array.from({ length: 12 }, () => Array.from({ length: 16 }, () => ({ active: false, note: 60 }))),
  );
  const synthParamsRef = useRef<SynthParams>(
    initialSynthParams || {
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
    },
  );
  const synthsRef =
    useRef<Partial<Record<InstrumentId, any>>>({});
  const synthSequencerRef = useRef<any | null>(null);
  const loopIdRef = useRef<string | number | null>(null);
  const currentStepRef = useRef<number>(initialTransport.startStep);
  const masterGainRef = useRef<any | null>(null);
  const recorderRef = useRef<any | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Lazy-load Tone.js on the client and create synths + clock.
  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      if (typeof window === "undefined") return;
      const tone = await import("tone");
      if (cancelled) return;

      toneRef.current = tone;

      // Create master gain node - all audio routes through this for recording
      const masterGain = new tone.Gain(1);
      masterGainRef.current = masterGain;

      // Connect master gain to destination for monitoring (always active)
      masterGain.toDestination();

      // Create recorder - it's a destination node that records audio
      // Note: MediaRecorder API (used by Tone.js Recorder) only supports WebM/Opus format
      // WAV is not supported by MediaRecorder, so we'll use WebM and convert if needed
      const recorder = new tone.Recorder();
      recorderRef.current = recorder;

      // Connect master gain to recorder (for recording)
      // This creates a parallel connection: masterGain -> destination (monitoring)
      //                                    masterGain -> recorder (recording)
      // The recorder will only capture audio when start() is called
      masterGain.connect(recorder);

      const synths: Partial<Record<InstrumentId, any>> = {
        kick: new tone.MembraneSynth().connect(masterGain),
        snare: new tone.NoiseSynth({
          envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
        }).connect(masterGain),
        hihat: new tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        }).connect(masterGain),
        tom: new tone.MembraneSynth({
          pitchDecay: 0.08,
        }).connect(masterGain),
        clap: new tone.NoiseSynth({
          envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
        }).connect(masterGain),
      };

      // Separate FMSynth for synth sequencer (different from drum "synth" instrument)
      const synthSequencer = new tone.FMSynth({
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.2 },
        modulationEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.2 },
        harmonicity: 3,
        modulationIndex: 10,
      }).connect(masterGain);

      synthsRef.current = synths;
      synthSequencerRef.current = synthSequencer;
      tone.Transport.bpm.value = initialTransport.tempo;

      const instrumentsOrder: InstrumentId[] = [
        "kick",
        "snare",
        "hihat",
        "tom",
        "clap",
      ];

      loopIdRef.current = tone.Transport.scheduleRepeat((time) => {
        const toneModule = toneRef.current;
        if (!toneModule || !synthsRef.current) return;

        const stepIndex = currentStepRef.current;

        // Trigger drum sequencer instruments
        patternRef.current.forEach((row, rowIndex) => {
          const step = row[stepIndex];
          if (!step?.active) return;

          const instrument = instrumentsOrder[rowIndex];
          const synth = synthsRef.current?.[instrument];
          const params = paramsRef.current[instrument];

          if (!synth || !params) return;

          triggerInstrument(
            instrument,
            synth,
            params,
            toneModule,
            time as unknown as number,
          );
        });

        // Trigger synth sequencer
        const synthPattern = synthPatternRef.current;
        const synthParams = synthParamsRef.current;
        const synthSequencer = synthSequencerRef.current;
        if (synthSequencer && synthPattern) {
          synthPattern.forEach((row) => {
            const step = row[stepIndex];
            if (step?.active) {
              // Convert MIDI note to frequency
              const midiNote = step.note;
              const frequency = toneModule.Frequency(midiNote, "midi").toFrequency();
              // Apply global pitch offset and detune
              const pitchOffset = synthParams.pitch;
              const detuneCents = synthParams.detune;
              let finalFreq = toneModule.Frequency(frequency).transpose(pitchOffset).toFrequency();
              // Apply detune (cents)
              if (detuneCents !== 0) {
                finalFreq = finalFreq * Math.pow(2, detuneCents / 1200);
              }
              // Calculate note duration from envelope
              const noteDuration = synthParams.attack + synthParams.decay + synthParams.release;
              // Trigger with full envelope
              synthSequencer.triggerAttackRelease(finalFreq, noteDuration, time as unknown as number);
            }
          });
        }

        setTransport((prev) => {
          const nextIndex =
            prev.currentStep >= prev.endStep ? prev.startStep : prev.currentStep + 1;
          currentStepRef.current = nextIndex;
          return { ...prev, currentStep: nextIndex };
        });
      }, "16n");

      setReady(true);
    };

    void setup();

    return () => {
      cancelled = true;
      const tone = toneRef.current;
      if (tone && loopIdRef.current != null) {
        const loopId = loopIdRef.current;
        // Transport.clear expects a number, but scheduleRepeat can return string | number
        if (typeof loopId === "number") {
          tone.Transport.clear(loopId);
        }
      }
    };
    // We intentionally run this once; pattern/params are tracked via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureStarted = async () => {
    const tone = toneRef.current;
    if (!tone) return;
    if (tone.context.state !== "running") {
      await tone.start();
    }
  };

  const setTempo = (bpm: number) => {
    setTransport((prev) => ({ ...prev, tempo: bpm }));
    const tone = toneRef.current;
    if (tone) {
      tone.Transport.bpm.value = bpm;
    }
  };

  const setRange = (startStep: number, endStep: number) => {
    setTransport((prev) => {
      const clampedCurrent = Math.min(Math.max(prev.currentStep, startStep), endStep);
      currentStepRef.current = clampedCurrent;
      return {
        ...prev,
        startStep,
        endStep,
        currentStep: clampedCurrent,
      };
    });
  };

  const togglePlay = async () => {
    const tone = toneRef.current;
    if (!tone) return;

    await ensureStarted();

    setTransport((prev) => {
      const nextPlaying = !prev.isPlaying;
      if (nextPlaying) {
        tone.Transport.start();
      } else {
        tone.Transport.stop();
        currentStepRef.current = prev.startStep;
        return { ...prev, isPlaying: nextPlaying, currentStep: prev.startStep };
      }
      return { ...prev, isPlaying: nextPlaying };
    });
  };

  const updatePattern = (pattern: Pattern) => {
    patternRef.current = pattern;
  };

  const updateInstrumentParams = (params: InstrumentParamMap) => {
    paramsRef.current = params;

    const tone = toneRef.current;
    const synths = synthsRef.current;
    if (!tone || !synths) return;

    (Object.keys(params) as InstrumentId[]).forEach((id) => {
      const synth = synths[id];
      const { pitch, decay, timbre } = params[id];
      if (!synth) return;

      // Timbre now controls multiple parameters per instrument for more dramatic sound changes.
      if (id === "kick" || id === "tom") {
        const drum = synth as any;
        drum.envelope.decay = decay;
        // Wider pitchDecay range (0.01 to 0.2) makes timbre much more noticeable.
        drum.pitchDecay = 0.01 + timbre * 0.19;
        // Also modulate octaves to add more character variation.
        drum.octaves = 1 + timbre * 3;
      } else if (id === "snare") {
        const noise = synth as any;
        noise.envelope.decay = decay;
        // Timbre modulates volume: low = thinner/quieter, high = punchier/louder.
        // Range from -12dB (thin) to +12dB (punchy) makes timbre very noticeable.
        noise.volume.value = (timbre - 0.5) * 24;
      } else if (id === "hihat") {
        const metal = synth as any;
        metal.envelope.decay = decay;
        // Much wider harmonicity range (1 to 20) for dramatic timbral shifts.
        metal.set({ harmonicity: 1 + timbre * 19 });
        // Also modulate resonance for more character.
        metal.set({ resonance: 200 + timbre * 800 });
      } else if (id === "clap") {
        const noise = synth as any;
        noise.envelope.decay = decay;
        // Timbre modulates volume for clap: low = thinner, high = punchier
        noise.volume.value = (timbre - 0.5) * 20;
      }
    });
  };

  const updateSynthPattern = (synthPattern: SynthPattern) => {
    synthPatternRef.current = synthPattern;
  };

  const updateSynthParams = (params: SynthParams) => {
    synthParamsRef.current = params;

    const synthSequencer = synthSequencerRef.current;
    if (!synthSequencer) return;

    // Apply envelope parameters
    synthSequencer.envelope.attack = params.attack;
    synthSequencer.envelope.decay = params.decay;
    synthSequencer.envelope.sustain = params.sustain;
    synthSequencer.envelope.release = params.release;

    // Apply modulation envelope
    synthSequencer.modulationEnvelope.attack = params.modAttack;
    synthSequencer.modulationEnvelope.decay = params.modDecay;
    synthSequencer.modulationEnvelope.sustain = params.modSustain;
    synthSequencer.modulationEnvelope.release = params.modRelease;

    // Apply FM parameters
    synthSequencer.set({ harmonicity: params.harmonicity });
    synthSequencer.set({ modulationIndex: params.modulationIndex });

    // Detune is applied per-note in the transport loop
    // Pitch offset is also applied per-note in the transport loop
  };

  // Start recording
  const startRecording = async () => {
    // Check if Tone.js is ready
    if (!ready) {
      console.error("Cannot start recording: Tone.js is not ready yet");
      throw new Error("Audio engine is not ready. Please wait a moment and try again.");
    }

    const tone = toneRef.current;
    const recorder = recorderRef.current;
    const masterGain = masterGainRef.current;

    if (!tone || !recorder || !masterGain) {
      console.error("Cannot start recording: missing components", {
        tone: !!tone,
        recorder: !!recorder,
        masterGain: !!masterGain,
      });
      throw new Error("Recording components not initialized. Please refresh the page.");
    }

    try {
      // Ensure audio context is started and running
      await ensureStarted();

      // Start the recorder - this begins capturing audio from masterGain
      // The recorder must be connected to masterGain before calling start()
      await recorder.start();
      setIsRecording(true);
      console.log("Recording started - make sure to play audio for it to be captured");
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  };

  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (1 = PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  // Helper function to convert WebM blob to WAV
  const convertWebMToWAV = async (webmBlob: Blob): Promise<Blob> => {
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert AudioBuffer to WAV
    const wav = audioBufferToWav(audioBuffer);
    return new Blob([wav], { type: "audio/wav" });
  };

  // Stop recording and return audio blob
  const stopRecording = async (): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder || !isRecording) {
      console.warn("Cannot stop recording: not currently recording");
      return null;
    }

    try {
      // Stop the recorder and get the blob
      const recording = await recorder.stop();
      setIsRecording(false);

      // Verify we got a valid blob
      if (!recording) {
        console.error("Recording is null");
        return null;
      }

      if (recording.size === 0) {
        console.error("Recording is empty (0 bytes)");
        return null;
      }

      console.log(`Recording stopped: ${recording.size} bytes, type: ${recording.type}`);

      // Convert WebM to WAV
      if (recording.type.includes("webm")) {
        console.log("Converting WebM to WAV...");
        const wavBlob = await convertWebMToWAV(recording);
        console.log(`Converted to WAV: ${wavBlob.size} bytes`);
        return wavBlob;
      }

      return recording;
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsRecording(false);
      return null;
    }
  };

  return {
    ready,
    transport,
    setTempo,
    setRange,
    togglePlay,
    updatePattern,
    updateInstrumentParams,
    updateSynthPattern,
    updateSynthParams,
    isRecording,
    startRecording,
    stopRecording,
  };
}

function triggerInstrument(
  id: InstrumentId,
  synth: any,
  params: InstrumentParamMap[InstrumentId],
  tone: typeof import("tone"),
  time: number,
) {
  const { pitch, decay, timbre } = params;

  if (id === "kick") {
    (synth as any).triggerAttackRelease(
      tone.Frequency(50, "hz").transpose(pitch).toFrequency(),
      decay,
      time,
    );
  } else if (id === "tom") {
    (synth as any).triggerAttackRelease(
      tone.Frequency(100, "hz").transpose(pitch).toFrequency(),
      decay,
      time,
    );
  } else if (id === "snare") {
    (synth as any).triggerAttackRelease(decay, time);
  } else if (id === "hihat") {
    (synth as any).triggerAttackRelease(decay, time);
  } else if (id === "clap") {
    (synth as any).triggerAttackRelease(decay, time);
  }
}
