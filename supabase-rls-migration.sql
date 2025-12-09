-- Enable Row Level Security (RLS) on rooms table
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- This fixes the Security Advisor warning about RLS being disabled

-- Enable RLS on the rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to read rooms (needed to join rooms)
CREATE POLICY "Allow public read access"
ON rooms FOR SELECT
USING (true);

-- Policy 2: Allow anyone to create rooms (needed to create new rooms)
CREATE POLICY "Allow public insert"
ON rooms FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow anyone to update rooms (needed for collaboration)
CREATE POLICY "Allow public update"
ON rooms FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy 4: Allow anyone to delete rooms (needed for cleanup)
-- Note: This allows cleanup to work, but also allows anyone to delete rooms
-- For a collaborative sequencer, this is acceptable since rooms are meant to be public
CREATE POLICY "Allow public delete"
ON rooms FOR DELETE
USING (true);
