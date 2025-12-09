// API route for room CRUD operations.
// Used by useRoomSync to fetch and persist room state.

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { RoomState } from "@/types/sequencer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;

  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
      console.error("Error fetching room:", error);
      return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
    }

    const roomState: RoomState = {
      id: data.id,
      pattern: data.pattern || data.drum_pattern || [],
      transport: data.transport,
      instruments: data.instruments,
      participants: [], // Participants managed via presence, not DB
      createdAt: new Date(data.created_at).getTime(),
      lastActivity: new Date(data.last_activity).getTime(),
      chatMessages: [], // Chat messages are real-time only, not persisted
      drumPattern: data.drum_pattern || data.pattern || [],
      synthPattern: data.synth_pattern || [],
      synthParams: data.synth_params || {
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
    };

    return NextResponse.json(roomState);
  } catch (err) {
    console.error("Unexpected error in GET /api/rooms/[roomId]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;

  try {
    const body = await request.json();
    const { pattern, transport, instruments, drumPattern, synthPattern, synthParams } = body;

    const { error } = await supabase
      .from("rooms")
      .update({
        pattern: pattern || drumPattern, // Support both for backward compatibility
        drum_pattern: drumPattern || pattern,
        transport,
        instruments,
        synth_pattern: synthPattern,
        synth_params: synthParams,
        last_activity: new Date().toISOString(),
      })
      .eq("id", roomId);

    if (error) {
      console.error("Error updating room:", error);
      return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error in PUT /api/rooms/[roomId]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
