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
      pattern: data.pattern,
      transport: data.transport,
      instruments: data.instruments,
      participants: [], // Participants managed via presence, not DB
      createdAt: new Date(data.created_at).getTime(),
      lastActivity: new Date(data.last_activity).getTime(),
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
    const { pattern, transport, instruments } = body;

    const { error } = await supabase
      .from("rooms")
      .update({
        pattern,
        transport,
        instruments,
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
