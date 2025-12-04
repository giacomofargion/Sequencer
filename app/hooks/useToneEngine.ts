// Audio engine hook that wraps Tone.js.
// Keeps Tone-specific details here so UI stays simple and type-safe.

import { useEffect, useRef, useState } from "react";
import type * as ToneType from "tone";
import type {
  InstrumentId,
  InstrumentParamMap,
  Pattern,
  TransportState,
} from "@/types/sequencer";

export type ToneEngineApi = {
  ready: boolean;
  transport: TransportState;
  setTempo: (bpm: number) => void;
  setRange: (startStep: number, endStep: number) => void;
  togglePlay: () => void;
  updatePattern: (pattern: Pattern) => void;
  updateInstrumentParams: (params: InstrumentParamMap) => void;
};

export function useToneEngine(
  initialTransport: TransportState,
  initialPattern: Pattern,
  initialParams: InstrumentParamMap,
): ToneEngineApi {
  const [transport, setTransport] = useState<TransportState>(initialTransport);
  const [ready, setReady] = useState(false);

  const toneRef = useRef<ToneType | null>(null);
  const patternRef = useRef<Pattern>(initialPattern);
  const paramsRef = useRef<InstrumentParamMap>(initialParams);
  const synthsRef =
    useRef<Partial<Record<InstrumentId, ToneType.ToneAudioNode>>>();
  const loopIdRef = useRef<string | number | null>(null);
  const currentStepRef = useRef<number>(initialTransport.startStep);

  // Lazy-load Tone.js on the client and create synths + clock.
  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      if (typeof window === "undefined") return;
      const tone = await import("tone");
      if (cancelled) return;

      toneRef.current = tone;

      const synths: Partial<Record<InstrumentId, ToneType.ToneAudioNode>> = {
        kick: new tone.MembraneSynth().toDestination(),
        snare: new tone.NoiseSynth({
          envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
        }).toDestination(),
        hihat: new tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        }).toDestination(),
        tom: new tone.MembraneSynth({
          pitchDecay: 0.08,
        }).toDestination(),
        synth: new tone.FMSynth().toDestination(),
      };

      synthsRef.current = synths;
      tone.Transport.bpm.value = initialTransport.tempo;

      const instrumentsOrder: InstrumentId[] = [
        "kick",
        "snare",
        "hihat",
        "tom",
        "synth",
      ];

      loopIdRef.current = tone.Transport.scheduleRepeat((time) => {
        const toneModule = toneRef.current;
        if (!toneModule || !synthsRef.current) return;

        const stepIndex = currentStepRef.current;

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
        tone.Transport.clear(loopIdRef.current);
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
        const drum = synth as unknown as ToneType.MembraneSynth;
        drum.envelope.decay = decay;
        // Wider pitchDecay range (0.01 to 0.2) makes timbre much more noticeable.
        drum.pitchDecay = 0.01 + timbre * 0.19;
        // Also modulate octaves to add more character variation.
        drum.octaves = 1 + timbre * 3;
      } else if (id === "snare") {
        const noise = synth as unknown as ToneType.NoiseSynth;
        noise.envelope.decay = decay;
        // Timbre modulates volume: low = thinner/quieter, high = punchier/louder.
        // Range from -12dB (thin) to +12dB (punchy) makes timbre very noticeable.
        noise.volume.value = (timbre - 0.5) * 24;
      } else if (id === "hihat") {
        const metal = synth as unknown as ToneType.MetalSynth;
        metal.envelope.decay = decay;
        // Much wider harmonicity range (1 to 20) for dramatic timbral shifts.
        metal.set({ harmonicity: 1 + timbre * 19 });
        // Also modulate resonance for more character.
        metal.set({ resonance: 200 + timbre * 800 });
      } else if (id === "synth") {
        const fm = synth as unknown as ToneType.FMSynth;
        fm.envelope.decay = decay;
        // Harmonicity range expanded (0.5 to 8) for more dramatic FM timbres.
        fm.set({ harmonicity: 0.5 + timbre * 7.5 });
        // Modulation index is key to FM character - wide range (0.1 to 20) makes timbre very noticeable.
        fm.set({ modulationIndex: 0.1 + timbre * 19.9 });
        fm.detune.value = pitch * 10;
      }
    });
  };

  return {
    ready,
    transport,
    setTempo,
    setRange,
    togglePlay,
    updatePattern,
    updateInstrumentParams,
  };
}

function triggerInstrument(
  id: InstrumentId,
  synth: ToneType.ToneAudioNode,
  params: InstrumentParamMap[InstrumentId],
  tone: typeof import("tone"),
  time: number,
) {
  const { pitch, decay, timbre } = params;

  if (id === "kick") {
    (synth as ToneType.MembraneSynth).triggerAttackRelease(
      tone.Frequency(50, "hz").transpose(pitch).toFrequency(),
      decay,
      time,
    );
  } else if (id === "tom") {
    (synth as ToneType.MembraneSynth).triggerAttackRelease(
      tone.Frequency(100, "hz").transpose(pitch).toFrequency(),
      decay,
      time,
    );
  } else if (id === "snare") {
    (synth as ToneType.NoiseSynth).triggerAttackRelease(decay, time);
  } else if (id === "hihat") {
    (synth as ToneType.MetalSynth).triggerAttackRelease(decay, time);
  } else if (id === "synth") {
    (synth as ToneType.FMSynth).triggerAttackRelease(
      tone.Frequency("C4").transpose(pitch).toFrequency(),
      decay,
      time,
    );
  }
}
