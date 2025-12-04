(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/types/sequencer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Core data model for the step sequencer lives here so UI and audio can share it.
__turbopack_context__.s([
    "INSTRUMENTS",
    ()=>INSTRUMENTS,
    "NUM_STEPS",
    ()=>NUM_STEPS,
    "createDefaultInstrumentParams",
    ()=>createDefaultInstrumentParams,
    "createDefaultTransport",
    ()=>createDefaultTransport,
    "createEmptyPattern",
    ()=>createEmptyPattern
]);
const INSTRUMENTS = [
    "kick",
    "snare",
    "hihat",
    "tom",
    "synth"
];
const NUM_STEPS = 16;
function createEmptyPattern(steps = NUM_STEPS) {
    return INSTRUMENTS.map(()=>Array.from({
            length: steps
        }, ()=>({
                active: false
            })));
}
function createDefaultTransport() {
    return {
        isPlaying: false,
        tempo: 100,
        startStep: 0,
        endStep: NUM_STEPS - 1,
        currentStep: 0
    };
}
function createDefaultInstrumentParams() {
    return {
        kick: {
            pitch: -12,
            decay: 0.6,
            timbre: 0.5
        },
        snare: {
            pitch: 0,
            decay: 0.4,
            timbre: 0.7
        },
        hihat: {
            pitch: 12,
            decay: 0.2,
            timbre: 0.8
        },
        tom: {
            pitch: -5,
            decay: 0.5,
            timbre: 0.6
        },
        synth: {
            pitch: 0,
            decay: 0.8,
            timbre: 0.5
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/hooks/useToneEngine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Audio engine hook that wraps Tone.js.
// Keeps Tone-specific details here so UI stays simple and type-safe.
__turbopack_context__.s([
    "useToneEngine",
    ()=>useToneEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useToneEngine(initialTransport, initialPattern, initialParams) {
    _s();
    const [transport, setTransport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialTransport);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const patternRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(initialPattern);
    const paramsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(initialParams);
    const synthsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const loopIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentStepRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(initialTransport.startStep);
    // Lazy-load Tone.js on the client and create synths + clock.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useToneEngine.useEffect": ()=>{
            let cancelled = false;
            const setup = {
                "useToneEngine.useEffect.setup": async ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const tone = await __turbopack_context__.A("[project]/node_modules/tone/build/esm/index.js [app-client] (ecmascript, async loader)");
                    if (cancelled) return;
                    toneRef.current = tone;
                    const synths = {
                        kick: new tone.MembraneSynth().toDestination(),
                        snare: new tone.NoiseSynth({
                            envelope: {
                                attack: 0.001,
                                decay: 0.2,
                                sustain: 0
                            }
                        }).toDestination(),
                        hihat: new tone.MetalSynth({
                            envelope: {
                                attack: 0.001,
                                decay: 0.1,
                                release: 0.01
                            }
                        }).toDestination(),
                        tom: new tone.MembraneSynth({
                            pitchDecay: 0.08
                        }).toDestination(),
                        synth: new tone.FMSynth().toDestination()
                    };
                    synthsRef.current = synths;
                    tone.Transport.bpm.value = initialTransport.tempo;
                    const instrumentsOrder = [
                        "kick",
                        "snare",
                        "hihat",
                        "tom",
                        "synth"
                    ];
                    loopIdRef.current = tone.Transport.scheduleRepeat({
                        "useToneEngine.useEffect.setup": (time)=>{
                            const toneModule = toneRef.current;
                            if (!toneModule || !synthsRef.current) return;
                            const stepIndex = currentStepRef.current;
                            patternRef.current.forEach({
                                "useToneEngine.useEffect.setup": (row, rowIndex)=>{
                                    const step = row[stepIndex];
                                    if (!step?.active) return;
                                    const instrument = instrumentsOrder[rowIndex];
                                    const synth = synthsRef.current?.[instrument];
                                    const params = paramsRef.current[instrument];
                                    if (!synth || !params) return;
                                    triggerInstrument(instrument, synth, params, toneModule, time);
                                }
                            }["useToneEngine.useEffect.setup"]);
                            setTransport({
                                "useToneEngine.useEffect.setup": (prev)=>{
                                    const nextIndex = prev.currentStep >= prev.endStep ? prev.startStep : prev.currentStep + 1;
                                    currentStepRef.current = nextIndex;
                                    return {
                                        ...prev,
                                        currentStep: nextIndex
                                    };
                                }
                            }["useToneEngine.useEffect.setup"]);
                        }
                    }["useToneEngine.useEffect.setup"], "16n");
                    setReady(true);
                }
            }["useToneEngine.useEffect.setup"];
            void setup();
            return ({
                "useToneEngine.useEffect": ()=>{
                    cancelled = true;
                    const tone = toneRef.current;
                    if (tone && loopIdRef.current != null) {
                        tone.Transport.clear(loopIdRef.current);
                    }
                }
            })["useToneEngine.useEffect"];
        // We intentionally run this once; pattern/params are tracked via refs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useToneEngine.useEffect"], []);
    const ensureStarted = async ()=>{
        const tone = toneRef.current;
        if (!tone) return;
        if (tone.context.state !== "running") {
            await tone.start();
        }
    };
    const setTempo = (bpm)=>{
        setTransport((prev)=>({
                ...prev,
                tempo: bpm
            }));
        const tone = toneRef.current;
        if (tone) {
            tone.Transport.bpm.value = bpm;
        }
    };
    const setRange = (startStep, endStep)=>{
        setTransport((prev)=>{
            const clampedCurrent = Math.min(Math.max(prev.currentStep, startStep), endStep);
            currentStepRef.current = clampedCurrent;
            return {
                ...prev,
                startStep,
                endStep,
                currentStep: clampedCurrent
            };
        });
    };
    const togglePlay = async ()=>{
        const tone = toneRef.current;
        if (!tone) return;
        await ensureStarted();
        setTransport((prev)=>{
            const nextPlaying = !prev.isPlaying;
            if (nextPlaying) {
                tone.Transport.start();
            } else {
                tone.Transport.stop();
                currentStepRef.current = prev.startStep;
                return {
                    ...prev,
                    isPlaying: nextPlaying,
                    currentStep: prev.startStep
                };
            }
            return {
                ...prev,
                isPlaying: nextPlaying
            };
        });
    };
    const updatePattern = (pattern)=>{
        patternRef.current = pattern;
    };
    const updateInstrumentParams = (params)=>{
        paramsRef.current = params;
        const tone = toneRef.current;
        const synths = synthsRef.current;
        if (!tone || !synths) return;
        Object.keys(params).forEach((id)=>{
            const synth = synths[id];
            const { pitch, decay, timbre } = params[id];
            if (!synth) return;
            // Timbre now controls multiple parameters per instrument for more dramatic sound changes.
            if (id === "kick" || id === "tom") {
                const drum = synth;
                drum.envelope.decay = decay;
                // Wider pitchDecay range (0.01 to 0.2) makes timbre much more noticeable.
                drum.pitchDecay = 0.01 + timbre * 0.19;
                // Also modulate octaves to add more character variation.
                drum.octaves = 1 + timbre * 3;
            } else if (id === "snare") {
                const noise = synth;
                noise.envelope.decay = decay;
                // Timbre modulates volume: low = thinner/quieter, high = punchier/louder.
                // Range from -12dB (thin) to +12dB (punchy) makes timbre very noticeable.
                noise.volume.value = (timbre - 0.5) * 24;
            } else if (id === "hihat") {
                const metal = synth;
                metal.envelope.decay = decay;
                // Much wider harmonicity range (1 to 20) for dramatic timbral shifts.
                metal.set({
                    harmonicity: 1 + timbre * 19
                });
                // Also modulate resonance for more character.
                metal.set({
                    resonance: 200 + timbre * 800
                });
            } else if (id === "synth") {
                const fm = synth;
                fm.envelope.decay = decay;
                // Harmonicity range expanded (0.5 to 8) for more dramatic FM timbres.
                fm.set({
                    harmonicity: 0.5 + timbre * 7.5
                });
                // Modulation index is key to FM character - wide range (0.1 to 20) makes timbre very noticeable.
                fm.set({
                    modulationIndex: 0.1 + timbre * 19.9
                });
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
        updateInstrumentParams
    };
}
_s(useToneEngine, "8Cw4mJ/Wf5+2UW0UCpIfH2qw55k=");
function triggerInstrument(id, synth, params, tone, time) {
    const { pitch, decay, timbre } = params;
    if (id === "kick") {
        synth.triggerAttackRelease(tone.Frequency(50, "hz").transpose(pitch).toFrequency(), decay, time);
    } else if (id === "tom") {
        synth.triggerAttackRelease(tone.Frequency(100, "hz").transpose(pitch).toFrequency(), decay, time);
    } else if (id === "snare") {
        synth.triggerAttackRelease(decay, time);
    } else if (id === "hihat") {
        synth.triggerAttackRelease(decay, time);
    } else if (id === "synth") {
        synth.triggerAttackRelease(tone.Frequency("C4").transpose(pitch).toFrequency(), decay, time);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/TransportControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransportControls",
    ()=>TransportControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const TransportControls = ({ tempo, startStep, endStep, maxSteps, isPlaying, onTempoChange, onRangeChange, onTogglePlay })=>{
    const handleStartChange = (value)=>{
        const clamped = Math.max(0, Math.min(value, endStep));
        onRangeChange(clamped, endStep);
    };
    const handleEndChange = (value)=>{
        const clamped = Math.min(maxSteps - 1, Math.max(value, startStep));
        onRangeChange(startStep, clamped);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "flex items-center justify-between border-b border-neutral-200 pb-3 text-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onTogglePlay,
                        className: "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white text-[11px] uppercase tracking-[0.18em] text-neutral-700 shadow-sm transition hover:bg-neutral-100",
                        children: isPlaying ? "❚❚" : "▶"
                    }, void 0, false, {
                        fileName: "[project]/components/TransportControls.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500",
                                children: "Tempo"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: 60,
                                max: 180,
                                value: tempo,
                                onChange: (e)=>onTempoChange(Number(e.target.value)),
                                className: "h-1 w-40 accent-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-10 text-right font-mono text-[11px] text-neutral-700",
                                children: tempo
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransportControls.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/TransportControls.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500",
                                children: "Start"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 1,
                                max: maxSteps,
                                value: startStep + 1,
                                onChange: (e)=>handleStartChange(Number(e.target.value) - 1),
                                className: "w-14 rounded border border-neutral-300 bg-white px-1 py-0.5 text-right font-mono text-[11px]"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransportControls.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500",
                                children: "End"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 1,
                                max: maxSteps,
                                value: endStep + 1,
                                onChange: (e)=>handleEndChange(Number(e.target.value) - 1),
                                className: "w-14 rounded border border-neutral-300 bg-white px-1 py-0.5 text-right font-mono text-[11px]"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransportControls.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/TransportControls.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/TransportControls.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = TransportControls;
var _c;
__turbopack_context__.k.register(_c, "TransportControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Knob.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Knob",
    ()=>Knob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const Knob = ({ label, value, min, max, step, onChange })=>{
    _s();
    const knobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const valueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(value);
    const activeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    valueRef.current = value;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Knob.useEffect": ()=>{
            const handleMove = {
                "Knob.useEffect.handleMove": (event)=>{
                    if (!activeRef.current) return;
                    event.preventDefault();
                    const delta = -event.movementY;
                    const range = max - min;
                    const sensitivity = range / 200; // 200px drag to sweep full range.
                    const nextRaw = valueRef.current + delta * sensitivity;
                    const clamped = Math.min(max, Math.max(min, nextRaw));
                    const snapped = Math.round(clamped / step) * step;
                    valueRef.current = snapped;
                    onChange(snapped);
                }
            }["Knob.useEffect.handleMove"];
            const handleUp = {
                "Knob.useEffect.handleUp": ()=>{
                    activeRef.current = false;
                    window.removeEventListener("pointermove", handleMove);
                    window.removeEventListener("pointerup", handleUp);
                }
            }["Knob.useEffect.handleUp"];
            if (activeRef.current) {
                window.addEventListener("pointermove", handleMove);
                window.addEventListener("pointerup", handleUp);
            }
            return ({
                "Knob.useEffect": ()=>{
                    window.removeEventListener("pointermove", handleMove);
                    window.removeEventListener("pointerup", handleUp);
                }
            })["Knob.useEffect"];
        }
    }["Knob.useEffect"], [
        max,
        min,
        onChange,
        step
    ]);
    const handlePointerDown = (event)=>{
        event.preventDefault();
        activeRef.current = true;
        event.target.setPointerCapture(event.pointerId);
    };
    const normalized = max === min ? 0 : (value - min) / (max - min); // 0..1
    const angle = -135 + normalized * 270; // map to -135..135
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: knobRef,
                onPointerDown: handlePointerDown,
                className: "relative h-9 w-9 cursor-pointer rounded-full border border-neutral-300 bg-neutral-50 shadow-sm",
                "aria-label": label,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-[18%] rounded-full bg-neutral-100"
                    }, void 0, false, {
                        fileName: "[project]/components/Knob.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-1/2 top-1/2 h-3 w-[1px] origin-bottom bg-emerald-600",
                        style: {
                            transform: `rotate(${angle}deg) translateY(-60%)`
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/Knob.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/Knob.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/Knob.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/Knob.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Knob, "I7yuqZug0vGSV75/Xs9x8s3hsKA=");
_c = Knob;
var _c;
__turbopack_context__.k.register(_c, "Knob");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PatternGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PatternGrid",
    ()=>PatternGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/sequencer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Knob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Knob.tsx [app-client] (ecmascript)");
;
;
;
const PatternGrid = ({ pattern, currentStep, instrumentParams, onToggleStep, onInstrumentParamChange })=>{
    const steps = pattern[0] ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mt-3 flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500",
                children: "Pattern"
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-[720px] rounded border border-neutral-300 bg-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex border-b border-neutral-200 bg-neutral-50 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex w-24 items-center justify-end px-2",
                                    children: "Row"
                                }, void 0, false, {
                                    fileName: "[project]/components/PatternGrid.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-1",
                                    children: steps.map((_, col)=>{
                                        const isCurrent = col === currentStep;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex h-7 flex-1 items-center justify-center border-l border-neutral-200 ${isCurrent ? "bg-emerald-50" : ""}`,
                                            children: col + 1
                                        }, col, false, {
                                            fileName: "[project]/components/PatternGrid.tsx",
                                            lineNumber: 44,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/PatternGrid.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex w-40 items-center justify-center border-l border-neutral-200 px-2 text-[9px]",
                                    children: "Sound"
                                }, void 0, false, {
                                    fileName: "[project]/components/PatternGrid.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/PatternGrid.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].map((instrument, row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                instrument: instrument,
                                rowIndex: row,
                                rowSteps: pattern[row],
                                currentStep: currentStep,
                                params: instrumentParams[instrument],
                                onToggleStep: onToggleStep,
                                onParamChange: onInstrumentParamChange
                            }, instrument, false, {
                                fileName: "[project]/components/PatternGrid.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PatternGrid.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/PatternGrid.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PatternGrid;
const Row = ({ instrument, rowIndex, rowSteps, currentStep, params, onToggleStep, onParamChange })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex border-t border-neutral-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-24 items-center justify-end bg-neutral-100 px-2 text-[11px] capitalize text-neutral-600",
                children: instrument
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1",
                children: rowSteps.map((step, col)=>{
                    const isCurrent = col === currentStep;
                    const isActive = step.active;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onToggleStep(rowIndex, col),
                        className: `h-9 flex-1 border-l border-neutral-200 transition ${isActive ? "bg-emerald-500/10 text-emerald-700" : "bg-white hover:bg-neutral-50"} ${isCurrent ? "ring-1 ring-emerald-500/70" : ""}`,
                        children: isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "block text-xs leading-none text-emerald-600",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/PatternGrid.tsx",
                            lineNumber: 122,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, col, false, {
                        fileName: "[project]/components/PatternGrid.tsx",
                        lineNumber: 111,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-40 items-center justify-center gap-2 border-l border-neutral-200 bg-neutral-50 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Knob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Knob"], {
                        label: "Pitch",
                        min: -24,
                        max: 24,
                        step: 1,
                        value: params.pitch,
                        onChange: (v)=>onParamChange(instrument, "pitch", v)
                    }, void 0, false, {
                        fileName: "[project]/components/PatternGrid.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Knob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Knob"], {
                        label: "Decay",
                        min: 0.1,
                        max: 1.5,
                        step: 0.05,
                        value: params.decay,
                        onChange: (v)=>onParamChange(instrument, "decay", v)
                    }, void 0, false, {
                        fileName: "[project]/components/PatternGrid.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Knob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Knob"], {
                        label: "Timbre",
                        min: 0,
                        max: 1,
                        step: 0.05,
                        value: params.timbre,
                        onChange: (v)=>onParamChange(instrument, "timbre", v)
                    }, void 0, false, {
                        fileName: "[project]/components/PatternGrid.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/PatternGrid.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = Row;
var _c, _c1;
__turbopack_context__.k.register(_c, "PatternGrid");
__turbopack_context__.k.register(_c1, "Row");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SequencerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/sequencer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useToneEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useToneEngine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransportControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TransportControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PatternGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PatternGrid.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function SequencerPage() {
    _s();
    const [pattern, setPattern] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SequencerPage.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyPattern"])()
    }["SequencerPage.useState"]);
    const [instrumentParams, setInstrumentParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SequencerPage.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultInstrumentParams"])()
    }["SequencerPage.useState"]);
    const engine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useToneEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToneEngine"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultTransport"])(), pattern, instrumentParams);
    const handleToggleStep = (row, col)=>{
        setPattern((prev)=>{
            const next = prev.map((r)=>r.map((s)=>({
                        ...s
                    })));
            next[row][col].active = !next[row][col].active;
            engine.updatePattern(next);
            return next;
        });
    };
    const handleInstrumentParamsChange = (id, field, value)=>{
        setInstrumentParams((prev)=>{
            const next = {
                ...prev,
                [id]: {
                    ...prev[id],
                    [field]: value
                }
            };
            engine.updateInstrumentParams(next);
            return next;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex flex-1 flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-baseline justify-between border-b border-neutral-300 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.25em] text-neutral-500",
                                children: "Intersymmetric Works"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-medium tracking-[0.18em] text-neutral-800",
                                children: "Sequencer 01"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right text-xs text-neutral-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "Room Code:"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-mono text-[11px] tracking-widest",
                                children: "solo"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex flex-1 flex-col rounded-md border border-neutral-300 bg-white p-4 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransportControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransportControls"], {
                        tempo: engine.transport.tempo,
                        startStep: engine.transport.startStep,
                        endStep: engine.transport.endStep,
                        maxSteps: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NUM_STEPS"],
                        isPlaying: engine.transport.isPlaying,
                        onTempoChange: engine.setTempo,
                        onRangeChange: engine.setRange,
                        onTogglePlay: engine.togglePlay
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PatternGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternGrid"], {
                        pattern: pattern,
                        currentStep: engine.transport.currentStep,
                        instrumentParams: instrumentParams,
                        onToggleStep: handleToggleStep,
                        onInstrumentParamChange: handleInstrumentParamsChange
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    !engine.ready && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-xs text-neutral-400",
                        children: "Audio engine is loading in the background. You can already draw a pattern; sound will start once it is ready."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(SequencerPage, "kL1XUiBZqSGFzKbye/DG7fTd/lw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useToneEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToneEngine"]
    ];
});
_c = SequencerPage;
var _c;
__turbopack_context__.k.register(_c, "SequencerPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_cc8a1085._.js.map