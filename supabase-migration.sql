-- Supabase migration for sequencer rooms table
-- Run this in your Supabase SQL editor: https://app.supabase.com/project/_/sql

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  pattern JSONB NOT NULL,
  transport JSONB NOT NULL,
  instruments JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

-- Create index on last_activity for cleanup queries (optional)
CREATE INDEX IF NOT EXISTS idx_rooms_last_activity ON rooms(last_activity);

-- Optional: Add RLS (Row Level Security) policies if you want to restrict access
-- For now, we'll use the anon key with public access
-- ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON rooms FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert" ON rooms FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public update" ON rooms FOR UPDATE USING (true);
