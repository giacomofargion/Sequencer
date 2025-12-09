import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Simplified room cleanup - deletes rooms inactive for 24+ hours
// You can call this manually or set up a cron job

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Delete rooms inactive for more than 24 hours
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("rooms")
      .delete()
      .lt("last_activity", cutoffTime)
      .select();

    if (error) {
      console.error("Error cleaning up rooms:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const deletedCount = data?.length || 0;

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleaned up ${deletedCount} inactive room(s)`,
      cutoffTime,
    });
  } catch (error) {
    console.error("Error in cleanup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support POST for cron jobs
export async function POST() {
  return GET();
}
