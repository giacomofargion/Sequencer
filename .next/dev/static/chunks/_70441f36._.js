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
    ()=>createEmptyPattern,
    "generateRoomId",
    ()=>generateRoomId
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
function generateRoomId() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for(let i = 0; i < 6; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Supabase client setup for real-time collaboration.
// In production, these should be environment variables.
__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-client] (ecmascript)");
;
const supabaseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found. Collaboration features will not work. " + "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/hooks/useRoomSync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Real-time room synchronization hook using Supabase Realtime.
// Manages room state, broadcasts local changes, and merges remote updates.
__turbopack_context__.s([
    "useRoomSync",
    ()=>useRoomSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/sequencer.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Generate a unique user ID for this session (stored in localStorage)
function getUserId() {
    const stored = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("sequencer_user_id") : "TURBOPACK unreachable";
    if (stored) return stored;
    const newId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem("sequencer_user_id", newId);
    }
    return newId;
}
function useRoomSync(roomId) {
    _s();
    const [roomState, setRoomState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const channelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const userIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(getUserId());
    const isLocalChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false); // Flag to prevent feedback loops
    // Initialize room connection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRoomSync.useEffect": ()=>{
            if (!roomId) {
                // Solo mode: no room sync
                setRoomState(null);
                setIsConnected(false);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel(`room:${roomId}`, {
                config: {
                    presence: {
                        key: userIdRef.current
                    }
                }
            });
            // Subscribe to sync messages
            channel.on("broadcast", {
                event: "sync"
            }, {
                "useRoomSync.useEffect": (payload)=>{
                    const message = payload.payload;
                    // Ignore our own messages (prevent feedback loops)
                    if (message.userId === userIdRef.current && isLocalChangeRef.current) {
                        isLocalChangeRef.current = false;
                        return;
                    }
                    handleRemoteMessage(message);
                }
            }["useRoomSync.useEffect"]).on("presence", {
                event: "sync"
            }, {
                "useRoomSync.useEffect": ()=>{
                    // Update participants list from presence
                    const presence = channel.presenceState();
                    const participants = Object.values(presence).flat().map({
                        "useRoomSync.useEffect.participants": (p)=>p
                    }["useRoomSync.useEffect.participants"]);
                    setRoomState({
                        "useRoomSync.useEffect": (prev)=>prev ? {
                                ...prev,
                                participants
                            } : null
                    }["useRoomSync.useEffect"]);
                }
            }["useRoomSync.useEffect"]).on("presence", {
                event: "join"
            }, {
                "useRoomSync.useEffect": ({ key, newPresences })=>{
                    // New participant joined
                    const newParticipant = newPresences[0];
                    if (newParticipant && newParticipant.id !== userIdRef.current) {
                        // Send full sync to new participant
                        if (roomState) {
                            broadcastMessage({
                                type: "full_sync",
                                state: roomState
                            });
                        }
                    }
                }
            }["useRoomSync.useEffect"]).subscribe({
                "useRoomSync.useEffect": (status)=>{
                    setIsConnected(status === "SUBSCRIBED");
                    setIsLoading(false);
                    if (status === "SUBSCRIBED") {
                        // Join presence
                        const participant = {
                            id: userIdRef.current,
                            joinedAt: Date.now()
                        };
                        channel.track(participant);
                        // Fetch or create room state
                        fetchOrCreateRoom(roomId).then({
                            "useRoomSync.useEffect": (state)=>{
                                if (state) {
                                    setRoomState(state);
                                    // Broadcast full sync to other participants
                                    broadcastMessage({
                                        type: "full_sync",
                                        state
                                    });
                                }
                            }
                        }["useRoomSync.useEffect"]);
                    }
                }
            }["useRoomSync.useEffect"]);
            channelRef.current = channel;
            return ({
                "useRoomSync.useEffect": ()=>{
                    channel.unsubscribe();
                    channelRef.current = null;
                }
            })["useRoomSync.useEffect"];
        }
    }["useRoomSync.useEffect"], [
        roomId
    ]);
    // Fetch room from Supabase or create default
    const fetchOrCreateRoom = async (id)=>{
        try {
            const { data, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("rooms").select("*").eq("id", id).single();
            if (fetchError && fetchError.code !== "PGRST116") {
                // PGRST116 = not found, which is fine (we'll create)
                console.error("Error fetching room:", fetchError);
                setError("Failed to load room");
                return null;
            }
            if (data) {
                // Room exists, return it
                return {
                    id: data.id,
                    pattern: data.pattern,
                    transport: data.transport,
                    instruments: data.instruments,
                    participants: [],
                    createdAt: new Date(data.created_at).getTime(),
                    lastActivity: new Date(data.last_activity).getTime()
                };
            }
            // Room doesn't exist, create default
            const newState = {
                id,
                pattern: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyPattern"])(),
                transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultTransport"])(),
                instruments: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultInstrumentParams"])(),
                participants: [],
                createdAt: Date.now(),
                lastActivity: Date.now()
            };
            // Save to Supabase
            const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("rooms").insert({
                id: newState.id,
                pattern: newState.pattern,
                transport: newState.transport,
                instruments: newState.instruments,
                created_at: new Date(newState.createdAt).toISOString(),
                last_activity: new Date(newState.lastActivity).toISOString()
            });
            if (insertError) {
                console.error("Error creating room:", insertError);
                setError("Failed to create room");
                return null;
            }
            return newState;
        } catch (err) {
            console.error("Unexpected error in fetchOrCreateRoom:", err);
            setError("Unexpected error");
            return null;
        }
    };
    // Broadcast a sync message to the room
    const broadcastMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRoomSync.useCallback[broadcastMessage]": (message)=>{
            const channel = channelRef.current;
            if (!channel) return;
            channel.send({
                type: "broadcast",
                event: "sync",
                payload: message
            });
        }
    }["useRoomSync.useCallback[broadcastMessage]"], []);
    // Handle incoming remote sync messages
    const handleRemoteMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRoomSync.useCallback[handleRemoteMessage]": (message)=>{
            setRoomState({
                "useRoomSync.useCallback[handleRemoteMessage]": (prev)=>{
                    if (!prev) return prev;
                    switch(message.type){
                        case "step_toggle":
                            {
                                const nextPattern = prev.pattern.map({
                                    "useRoomSync.useCallback[handleRemoteMessage].nextPattern": (r)=>r.map({
                                            "useRoomSync.useCallback[handleRemoteMessage].nextPattern": (s)=>({
                                                    ...s
                                                })
                                        }["useRoomSync.useCallback[handleRemoteMessage].nextPattern"])
                                }["useRoomSync.useCallback[handleRemoteMessage].nextPattern"]);
                                const step = nextPattern[message.row]?.[message.col];
                                if (step) {
                                    step.active = !step.active;
                                }
                                return {
                                    ...prev,
                                    pattern: nextPattern,
                                    lastActivity: message.timestamp
                                };
                            }
                        case "transport_play":
                            return {
                                ...prev,
                                transport: {
                                    ...prev.transport,
                                    isPlaying: true
                                },
                                lastActivity: message.timestamp
                            };
                        case "transport_pause":
                            return {
                                ...prev,
                                transport: {
                                    ...prev.transport,
                                    isPlaying: false,
                                    currentStep: prev.transport.startStep
                                },
                                lastActivity: message.timestamp
                            };
                        case "tempo_change":
                            return {
                                ...prev,
                                transport: {
                                    ...prev.transport,
                                    tempo: message.tempo
                                },
                                lastActivity: message.timestamp
                            };
                        case "range_change":
                            return {
                                ...prev,
                                transport: {
                                    ...prev.transport,
                                    startStep: message.startStep,
                                    endStep: message.endStep
                                },
                                lastActivity: message.timestamp
                            };
                        case "instrument_param":
                            {
                                const nextInstruments = {
                                    ...prev.instruments,
                                    [message.id]: {
                                        ...prev.instruments[message.id],
                                        [message.field]: message.value
                                    }
                                };
                                return {
                                    ...prev,
                                    instruments: nextInstruments,
                                    lastActivity: message.timestamp
                                };
                            }
                        case "full_sync":
                            return message.state;
                        default:
                            return prev;
                    }
                }
            }["useRoomSync.useCallback[handleRemoteMessage]"]);
        }
    }["useRoomSync.useCallback[handleRemoteMessage]"], []);
    // Update pattern (optimistic update + broadcast)
    const updatePattern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRoomSync.useCallback[updatePattern]": (pattern)=>{
            setRoomState({
                "useRoomSync.useCallback[updatePattern]": (prev)=>{
                    if (!prev) return prev;
                    return {
                        ...prev,
                        pattern,
                        lastActivity: Date.now()
                    };
                }
            }["useRoomSync.useCallback[updatePattern]"]);
            if (roomId) {
                isLocalChangeRef.current = true;
            // Note: We broadcast individual step toggles, not full pattern
            // This is handled by toggleStep below
            }
        }
    }["useRoomSync.useCallback[updatePattern]"], [
        roomId
    ]);
    // Toggle a single step (optimistic + broadcast)
    const toggleStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRoomSync.useCallback[toggleStep]": (row, col)=>{
            setRoomState({
                "useRoomSync.useCallback[toggleStep]": (prev)=>{
                    if (!prev) return prev;
                    const nextPattern = prev.pattern.map({
                        "useRoomSync.useCallback[toggleStep].nextPattern": (r)=>r.map({
                                "useRoomSync.useCallback[toggleStep].nextPattern": (s)=>({
                                        ...s
                                    })
                            }["useRoomSync.useCallback[toggleStep].nextPattern"])
                    }["useRoomSync.useCallback[toggleStep].nextPattern"]);
                    const step = nextPattern[row]?.[col];
                    if (step) {
                        step.active = !step.active;
                    }
                    return {
                        ...prev,
                        pattern: nextPattern,
                        lastActivity: Date.now()
                    };
                }
            }["useRoomSync.useCallback[toggleStep]"]);
            if (roomId) {
                isLocalChangeRef.current = true;
                broadcastMessage({
                    type: "step_toggle",
                    row,
                    col,
                    userId: userIdRef.current,
                    timestamp: Date.now()
                });
            }
        }
    }["useRoomSync.useCallback[toggleStep]"], [
        roomId,
        broadcastMessage
    ]);
    // Update transport (optimistic + broadcast)
    const updateTransport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRoomSync.useCallback[updateTransport]": (transport)=>{
            setRoomState({
                "useRoomSync.useCallback[updateTransport]": (prev)=>{
                    if (!prev) return prev;
                    return {
                        ...prev,
                        transport: {
                            ...prev.transport,
                            ...transport
                        },
                        lastActivity: Date.now()
                    };
                }
            }["useRoomSync.useCallback[updateTransport]"]);
            if (roomId) {
                isLocalChangeRef.current = true;
                if (transport.isPlaying !== undefined) {
                    broadcastMessage({
                        type: transport.isPlaying ? "transport_play" : "transport_pause",
                        userId: userIdRef.current,
                        timestamp: Date.now()
                    });
                }
                if (transport.tempo !== undefined) {
                    broadcastMessage({
                        type: "tempo_change",
                        tempo: transport.tempo,
                        userId: userIdRef.current,
                        timestamp: Date.now()
                    });
                }
                if (transport.startStep !== undefined || transport.endStep !== undefined) {
                    const currentState = roomState || {
                        transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultTransport"])()
                    };
                    broadcastMessage({
                        type: "range_change",
                        startStep: transport.startStep ?? currentState.transport.startStep,
                        endStep: transport.endStep ?? currentState.transport.endStep,
                        userId: userIdRef.current,
                        timestamp: Date.now()
                    });
                }
            }
        }
    }["useRoomSync.useCallback[updateTransport]"], [
        roomId,
        broadcastMessage,
        roomState
    ]);
    // Update instrument parameter (optimistic + broadcast)
    const updateInstrumentParam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRoomSync.useCallback[updateInstrumentParam]": (id, field, value)=>{
            setRoomState({
                "useRoomSync.useCallback[updateInstrumentParam]": (prev)=>{
                    if (!prev) return prev;
                    const nextInstruments = {
                        ...prev.instruments,
                        [id]: {
                            ...prev.instruments[id],
                            [field]: value
                        }
                    };
                    return {
                        ...prev,
                        instruments: nextInstruments,
                        lastActivity: Date.now()
                    };
                }
            }["useRoomSync.useCallback[updateInstrumentParam]"]);
            if (roomId) {
                isLocalChangeRef.current = true;
                broadcastMessage({
                    type: "instrument_param",
                    id,
                    field,
                    value,
                    userId: userIdRef.current,
                    timestamp: Date.now()
                });
            }
        }
    }["useRoomSync.useCallback[updateInstrumentParam]"], [
        roomId,
        broadcastMessage
    ]);
    return {
        roomState,
        isConnected,
        participants: roomState?.participants || [],
        isLoading,
        error,
        updatePattern,
        updateTransport,
        updateInstrumentParam,
        toggleStep
    };
}
_s(useRoomSync, "vyI6EAH5BfmPj/Rmi2iwi/S6xKU=");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useRoomSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useRoomSync.ts [app-client] (ecmascript)");
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
;
function SequencerPage() {
    _s();
    // Room management: null = solo mode, string = room ID
    const [roomId, setRoomId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Local state for solo mode (when roomId is null)
    const [localPattern, setLocalPattern] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SequencerPage.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyPattern"])()
    }["SequencerPage.useState"]);
    const [localInstrumentParams, setLocalInstrumentParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SequencerPage.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultInstrumentParams"])()
    }["SequencerPage.useState"]);
    // Room sync hook (only active when roomId is set)
    const roomSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useRoomSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRoomSync"])(roomId);
    // Determine which state to use: room sync or local
    const pattern = roomId && roomSync.roomState ? roomSync.roomState.pattern : localPattern;
    const instrumentParams = roomId && roomSync.roomState ? roomSync.roomState.instruments : localInstrumentParams;
    const transport = roomId && roomSync.roomState ? roomSync.roomState.transport : (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$sequencer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultTransport"])();
    // Tone engine uses current pattern/params
    const engine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useToneEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToneEngine"])(transport, pattern, instrumentParams);
    // Sync room state changes to Tone engine
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SequencerPage.useEffect": ()=>{
            if (roomId && roomSync.roomState) {
                engine.updatePattern(roomSync.roomState.pattern);
                engine.updateInstrumentParams(roomSync.roomState.instruments);
            }
        }
    }["SequencerPage.useEffect"], [
        roomId,
        roomSync.roomState,
        engine
    ]);
    // Sync transport changes from room
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SequencerPage.useEffect": ()=>{
            if (roomId && roomSync.roomState) {
                const roomTransport = roomSync.roomState.transport;
                if (roomTransport.tempo !== engine.transport.tempo) {
                    engine.setTempo(roomTransport.tempo);
                }
                if (roomTransport.startStep !== engine.transport.startStep || roomTransport.endStep !== engine.transport.endStep) {
                    engine.setRange(roomTransport.startStep, roomTransport.endStep);
                }
                if (roomTransport.isPlaying !== engine.transport.isPlaying) {
                    if (roomTransport.isPlaying && !engine.transport.isPlaying) {
                        engine.togglePlay();
                    } else if (!roomTransport.isPlaying && engine.transport.isPlaying) {
                        engine.togglePlay();
                    }
                }
            }
        }
    }["SequencerPage.useEffect"], [
        roomId,
        roomSync.roomState,
        engine
    ]);
    const handleToggleStep = (row, col)=>{
        if (roomId) {
            // Use room sync
            roomSync.toggleStep(row, col);
        } else {
            // Local solo mode
            setLocalPattern((prev)=>{
                const next = prev.map((r)=>r.map((s)=>({
                            ...s
                        })));
                next[row][col].active = !next[row][col].active;
                engine.updatePattern(next);
                return next;
            });
        }
    };
    const handleInstrumentParamsChange = (id, field, value)=>{
        if (roomId) {
            // Use room sync
            roomSync.updateInstrumentParam(id, field, value);
        } else {
            // Local solo mode
            setLocalInstrumentParams((prev)=>{
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
        }
    };
    const handleTransportChange = {
        tempo: (tempo)=>{
            if (roomId) {
                roomSync.updateTransport({
                    tempo
                });
            } else {
                engine.setTempo(tempo);
            }
        },
        range: (startStep, endStep)=>{
            if (roomId) {
                roomSync.updateTransport({
                    startStep,
                    endStep
                });
            } else {
                engine.setRange(startStep, endStep);
            }
        },
        togglePlay: async ()=>{
            if (roomId) {
                const currentPlaying = engine.transport.isPlaying;
                roomSync.updateTransport({
                    isPlaying: !currentPlaying
                });
            } else {
                await engine.togglePlay();
            }
        }
    };
    ;
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
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-medium tracking-[0.18em] text-neutral-800",
                                children: "Sequencer 01"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right text-xs text-neutral-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "Room Code:"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-mono text-[11px] tracking-widest",
                                children: "solo"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 141,
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
                        lineNumber: 157,
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
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    !engine.ready && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-xs text-neutral-400",
                        children: "Audio engine is loading in the background. You can already draw a pattern; sound will start once it is ready."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(SequencerPage, "wNIJUqISDaxMhs6s1w2khkBnz2s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useRoomSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRoomSync"],
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
]);

//# sourceMappingURL=_70441f36._.js.map