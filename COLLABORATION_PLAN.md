# Collaboration System Plan

## Overview
Transform the single-user sequencer into a real-time collaborative tool where multiple users can join rooms and make music together. This plan outlines the architecture, data model, and implementation approach.

---

## 1. Data Model Extensions

### Room & Participant Types
Add to `types/sequencer.ts`:

```typescript
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
  | { type: "step_toggle"; row: number; col: number; userId: string }
  | { type: "transport_play"; userId: string }
  | { type: "transport_pause"; userId: string }
  | { type: "tempo_change"; tempo: number; userId: string }
  | { type: "range_change"; startStep: number; endStep: number; userId: string }
  | { type: "instrument_param"; id: InstrumentId; field: "pitch" | "decay" | "timbre"; value: number; userId: string }
  | { type: "participant_join"; participant: Participant }
  | { type: "participant_leave"; participantId: string }
  | { type: "full_sync"; state: RoomState }; // Initial sync on join
```

---

## 2. Backend Architecture Options

### Option A: Supabase Realtime (Recommended for MVP)
**Pros:**
- Managed service, minimal server code
- Built-in presence/rooms
- Free tier sufficient for small-scale testing
- PostgreSQL for room persistence

**Cons:**
- Vendor lock-in
- Requires Supabase account setup

**Implementation:**
- Store `RoomState` in Supabase `rooms` table
- Use Supabase Realtime channels for sync messages
- Presence API for participant tracking

### Option B: Next.js API Routes + WebSocket Server
**Pros:**
- Full control, no vendor dependency
- Can use existing Next.js deployment

**Cons:**
- Need to manage WebSocket server (e.g., `ws` package)
- Handle reconnection, scaling, persistence yourself
- More complex deployment

**Implementation:**
- `/app/api/rooms/route.ts` for room CRUD
- Separate WebSocket server or upgrade HTTP to WS in API route
- In-memory room store (or add Redis/DB later)

### Option C: Ably (Alternative Managed Service)
**Pros:**
- Similar to Supabase but focused on messaging
- Good free tier
- Strong presence features

**Cons:**
- Another vendor dependency
- Need separate DB for room persistence

---

## 3. Recommended Approach: Supabase Realtime

### Why Supabase?
- Fastest to implement for MVP
- Handles presence, channels, and persistence out of the box
- Can migrate to custom solution later if needed

### Database Schema (Supabase)
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  pattern JSONB NOT NULL,
  transport JSONB NOT NULL,
  instruments JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime enabled on rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
```

### Sync Strategy
1. **On Join:**
   - Fetch room state from DB (or create if new)
   - Subscribe to Realtime channel `room:{roomId}`
   - Broadcast `participant_join` message
   - Send `full_sync` to new participant

2. **On Local Change:**
   - Update local React state immediately (optimistic UI)
   - Broadcast sync message to channel
   - Update Supabase `rooms` table (debounced for performance)

3. **On Remote Change:**
   - Receive sync message from channel
   - Merge into local state (conflict resolution below)
   - Update Tone engine if needed

---

## 4. Conflict Resolution

### Step Toggle Conflicts
- **Strategy:** Last-write-wins (LWW) with timestamp
- If two users toggle the same step simultaneously, the later message wins
- This is acceptable for music creation (users can toggle again)

### Transport Conflicts
- **Play/Pause:** Only one user should control transport
- **Solution:** First user to play "owns" transport control
- Other users see transport state but can't override (or show warning)
- Alternatively: democratic voting (majority wins)

### Parameter Conflicts
- **Strategy:** Smooth interpolation to new value
- If user A sets pitch to 5 and user B sets to 10, smoothly transition
- Or: last-write-wins (simpler, but can feel jumpy)

### Recommended: Hybrid Approach
- **Transport:** Single "conductor" (first to play, or explicit handoff)
- **Pattern/Params:** Last-write-wins with visual feedback (show who changed what)

---

## 5. Client-Side Implementation

### New Hook: `useRoomSync`
Location: `app/hooks/useRoomSync.ts`

**Responsibilities:**
- Connect to Supabase Realtime channel
- Manage local room state (pattern, transport, instruments)
- Broadcast local changes
- Merge remote changes
- Handle reconnection

**API:**
```typescript
export function useRoomSync(roomId: RoomId | null) {
  return {
    roomState: RoomState | null,
    isConnected: boolean,
    participants: Participant[],
    updatePattern: (pattern: Pattern) => void,
    updateTransport: (transport: Partial<TransportState>) => void,
    updateInstrumentParam: (id, field, value) => void,
  };
}
```

### Updated `app/page.tsx`
- Replace local `useState` with `useRoomSync(roomId)`
- Add room code input/display UI
- Show connection status and participant list
- Handle "solo" mode (roomId = null) for local-only use

---

## 6. UI Changes

### Room Management UI
**Location:** New component `components/RoomControls.tsx`

**Features:**
- Input field to enter/join room code
- "Create Room" button (generates random code)
- Display current room code (replace "solo" placeholder)
- Show participant count/names
- Connection status indicator (green/yellow/red)

**Layout:**
- Replace static "Room Code: solo" in header with interactive room controls
- Maybe a small modal/dropdown for room management

### Visual Feedback for Remote Changes
- Subtle animation when a step is toggled by another user
- Show user name/color indicator on recently changed cells
- Optional: "ghost cursor" showing where other users are editing

---

## 7. Implementation Phases

### Phase 1: Foundation (MVP)
1. Set up Supabase project + database schema
2. Create `useRoomSync` hook with basic channel subscription
3. Implement room creation/joining UI
4. Sync pattern toggles (step_toggle messages)
5. Test with 2-3 users

### Phase 2: Full State Sync
1. Sync transport (play/pause, tempo, range)
2. Sync instrument parameters
3. Add conflict resolution for transport (conductor model)
4. Persist room state to DB

### Phase 3: Polish
1. Participant presence (who's online)
2. Visual feedback for remote changes
3. Room expiration/cleanup (inactive rooms)
4. Error handling and reconnection logic

### Phase 4: Advanced (Future)
1. Per-user cursors/indicators
2. Chat or emoji reactions
3. Room history/undo
4. Export/import patterns

---

## 8. Technical Decisions

### Room ID Generation
- **Format:** 6-character alphanumeric (e.g., "abc123")
- **Generation:** Client-side using `crypto.randomBytes` or similar
- **Collision:** Check Supabase for existing room, retry if needed

### Message Batching
- **Pattern changes:** Batch multiple step toggles into single message (debounce 100ms)
- **Parameter changes:** Throttle to 10 updates/second per instrument
- **Transport:** Immediate (no batching)

### Reconnection Strategy
- Auto-reconnect on disconnect (exponential backoff)
- Show connection status in UI
- On reconnect, fetch full state from DB to catch up

### Security (Future)
- Optional: Room passwords
- Optional: Rate limiting per user
- Optional: Room size limits

---

## 9. File Structure

```
app/
  api/
    rooms/
      [roomId]/
        route.ts          # GET/PUT room state
  hooks/
    useRoomSync.ts        # Main collaboration hook
    useToneEngine.ts      # (existing, no changes)
  page.tsx                # Updated to use useRoomSync
components/
  RoomControls.tsx        # Room join/create UI
  PatternGrid.tsx         # (existing, add remote change indicators)
  TransportControls.tsx   # (existing, maybe disable if not conductor)
types/
  sequencer.ts            # Add RoomState, SyncMessage types
lib/
  supabase.ts             # Supabase client setup
```

---

## 10. Next Steps

1. **Choose backend:** Confirm Supabase or alternative
2. **Set up Supabase:** Create project, run migrations
3. **Implement Phase 1:** Basic room sync for pattern toggles
4. **Test:** Multi-user session to validate approach
5. **Iterate:** Add transport sync, then polish

---

## Questions to Resolve

1. **Transport control:** Single conductor or democratic?
2. **Room persistence:** How long should inactive rooms live?
3. **User identity:** Anonymous or require names?
4. **Room discovery:** Public room list or invite-only?
