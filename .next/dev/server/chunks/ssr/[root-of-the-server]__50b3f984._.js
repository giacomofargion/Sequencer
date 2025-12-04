module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/types/sequencer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/app/hooks/useToneEngine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Audio engine hook that wraps Tone.js.
// Keeps Tone-specific details here so UI stays simple and type-safe.
__turbopack_context__.s([
    "useToneEngine",
    ()=>useToneEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useToneEngine(initialTransport, initialPattern, initialParams) {
    const [transport, setTransport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialTransport);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const toneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const patternRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(initialPattern);
    const paramsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(initialParams);
    const synthsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const loopIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentStepRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(initialTransport.startStep);
    // Lazy-load Tone.js on the client and create synths + clock.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        const setup = async ()=>{
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            const tone = undefined;
            const synths = undefined;
            const instrumentsOrder = undefined;
        };
        void setup();
        return ()=>{
            cancelled = true;
            const tone = toneRef.current;
            if (tone && loopIdRef.current != null) {
                tone.Transport.clear(loopIdRef.current);
            }
        };
    // We intentionally run this once; pattern/params are tracked via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
            // These mappings are intentionally simple and easy to tweak later.
            if (id === "kick" || id === "tom") {
                const drum = synth;
                drum.envelope.decay = decay;
                drum.pitchDecay = 0.05 + timbre * 0.1;
            } else if (id === "snare") {
                const noise = synth;
                noise.envelope.decay = decay;
            } else if (id === "hihat") {
                const metal = synth;
                metal.envelope.decay = decay;
                // In modern Tone, many parameters are Signals; update via set/value, not direct assignment.
                metal.set({
                    harmonicity: 5 + timbre * 5
                });
            } else if (id === "synth") {
                const fm = synth;
                fm.envelope.decay = decay;
                fm.set({
                    harmonicity: 1 + timbre * 3
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
function triggerInstrument(id, synth, params, tone, time) {
    const { pitch, decay } = params;
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
}),
"[project]/components/TransportControls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransportControls",
    ()=>TransportControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "flex items-center justify-between border-b border-neutral-200 pb-3 text-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onTogglePlay,
                        className: "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white text-[11px] uppercase tracking-[0.18em] text-neutral-700 shadow-sm transition hover:bg-neutral-100",
                        children: isPlaying ? "❚❚" : "▶"
                    }, void 0, false, {
                        fileName: "[project]/components/TransportControls.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500",
                                children: "Tempo"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500",
                                children: "Start"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500",
                                children: "End"
                            }, void 0, false, {
                                fileName: "[project]/components/TransportControls.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
}),
"[project]/components/PatternGrid.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PatternGrid",
    ()=>PatternGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/sequencer.ts [app-ssr] (ecmascript)");
;
;
const PatternGrid = ({ pattern, currentStep, onToggleStep })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mt-3 flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500",
                children: "Pattern"
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-grid grid-cols-[80px_repeat(16,minmax(24px,1fr))] border border-neutral-300 bg-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-r border-neutral-300 bg-neutral-100"
                        }, void 0, false, {
                            fileName: "[project]/components/PatternGrid.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        pattern[0]?.map((_, col)=>{
                            const isCurrent = col === currentStep;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex h-7 items-center justify-center border-l border-neutral-200 text-[9px] font-mono text-neutral-400 ${isCurrent ? "bg-emerald-50" : ""}`,
                                children: col + 1
                            }, col, false, {
                                fileName: "[project]/components/PatternGrid.tsx",
                                lineNumber: 26,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0));
                        }),
                        __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSTRUMENTS"].map((instrument, row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: instrument,
                                rowIndex: row,
                                rowSteps: pattern[row],
                                currentStep: currentStep,
                                onToggleStep: onToggleStep
                            }, instrument, false, {
                                fileName: "[project]/components/PatternGrid.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PatternGrid.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/PatternGrid.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const Row = ({ label, rowIndex, rowSteps, currentStep, onToggleStep })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-9 items-center justify-end border-t border-r border-neutral-200 bg-neutral-100 px-2 text-[11px] capitalize text-neutral-600",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/PatternGrid.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            rowSteps.map((step, col)=>{
                const isCurrent = col === currentStep;
                const isActive = step.active;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onToggleStep(rowIndex, col),
                    className: `h-9 border-t border-l border-neutral-200 transition ${isActive ? "bg-emerald-500/10 text-emerald-700" : "bg-white hover:bg-neutral-50"} ${isCurrent ? "ring-1 ring-emerald-500/70" : ""}`,
                    children: isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-xs leading-none text-emerald-600",
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/components/PatternGrid.tsx",
                        lineNumber: 88,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, col, false, {
                    fileName: "[project]/components/PatternGrid.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            })
        ]
    }, void 0, true);
};
}),
"[project]/components/InstrumentControls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InstrumentControls",
    ()=>InstrumentControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/sequencer.ts [app-ssr] (ecmascript)");
;
;
const InstrumentControls = ({ params, onChange })=>{
    const handleChange = (id, field, value)=>{
        const next = {
            ...params,
            [id]: {
                ...params[id],
                [field]: value
            }
        };
        onChange(next);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mt-4 flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500",
                children: "Sound"
            }, void 0, false, {
                fileName: "[project]/components/InstrumentControls.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-3 md:grid-cols-5",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSTRUMENTS"].map((id)=>{
                    const p = params[id];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded border border-neutral-200 bg-neutral-50 px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-1 text-[11px] capitalize text-neutral-700",
                                children: id
                            }, void 0, false, {
                                fileName: "[project]/components/InstrumentControls.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlRow, {
                                label: "Pitch",
                                min: -24,
                                max: 24,
                                step: 1,
                                value: p.pitch,
                                onChange: (v)=>handleChange(id, "pitch", v)
                            }, void 0, false, {
                                fileName: "[project]/components/InstrumentControls.tsx",
                                lineNumber: 45,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlRow, {
                                label: "Decay",
                                min: 0.1,
                                max: 1.5,
                                step: 0.05,
                                value: p.decay,
                                onChange: (v)=>handleChange(id, "decay", v)
                            }, void 0, false, {
                                fileName: "[project]/components/InstrumentControls.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlRow, {
                                label: "Timbre",
                                min: 0,
                                max: 1,
                                step: 0.05,
                                value: p.timbre,
                                onChange: (v)=>handleChange(id, "timbre", v)
                            }, void 0, false, {
                                fileName: "[project]/components/InstrumentControls.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, id, true, {
                        fileName: "[project]/components/InstrumentControls.tsx",
                        lineNumber: 38,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/components/InstrumentControls.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/InstrumentControls.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const ControlRow = ({ label, min, max, step, value, onChange })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "mt-1 flex items-center gap-2 text-[11px] text-neutral-600",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-12 font-mono text-[10px] uppercase tracking-[0.18em]",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/InstrumentControls.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "range",
                min: min,
                max: max,
                step: step,
                value: value,
                onChange: (e)=>onChange(Number(e.target.value)),
                className: "h-1 flex-1 accent-emerald-600"
            }, void 0, false, {
                fileName: "[project]/components/InstrumentControls.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-10 text-right font-mono text-[10px] text-neutral-700",
                children: value.toFixed(2)
            }, void 0, false, {
                fileName: "[project]/components/InstrumentControls.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/InstrumentControls.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SequencerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/sequencer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useToneEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useToneEngine.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransportControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TransportControls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PatternGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PatternGrid.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$InstrumentControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/InstrumentControls.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function SequencerPage() {
    const [pattern, setPattern] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEmptyPattern"])());
    const [instrumentParams, setInstrumentParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDefaultInstrumentParams"])());
    const engine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useToneEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToneEngine"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDefaultTransport"])(), pattern, instrumentParams);
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
    const handleInstrumentParamsChange = (next)=>{
        setInstrumentParams(next);
        engine.updateInstrumentParams(next);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex flex-1 flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-baseline justify-between border-b border-neutral-300 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.25em] text-neutral-500",
                                children: "Intersymmetric Works"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-medium tracking-[0.18em] text-neutral-800",
                                children: "Sequencer 01"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right text-xs text-neutral-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "Room Code:"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-mono text-[11px] tracking-widest",
                                children: "solo"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex flex-1 flex-col rounded-md border border-neutral-300 bg-white p-4 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransportControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransportControls"], {
                        tempo: engine.transport.tempo,
                        startStep: engine.transport.startStep,
                        endStep: engine.transport.endStep,
                        maxSteps: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NUM_STEPS"],
                        isPlaying: engine.transport.isPlaying,
                        onTempoChange: engine.setTempo,
                        onRangeChange: engine.setRange,
                        onTogglePlay: engine.togglePlay
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PatternGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PatternGrid"], {
                        pattern: pattern,
                        currentStep: engine.transport.currentStep,
                        onToggleStep: handleToggleStep
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$InstrumentControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InstrumentControls"], {
                        params: instrumentParams,
                        onChange: handleInstrumentParamsChange
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    !engine.ready && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-xs text-neutral-400",
                        children: "Audio engine is loading in the background. You can already draw a pattern; sound will start once it is ready."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50b3f984._.js.map