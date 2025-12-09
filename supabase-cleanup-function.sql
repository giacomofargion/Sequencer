-- Automatic room cleanup function for Supabase
-- This runs automatically and deletes rooms inactive for 24+ hours
-- Run this in your Supabase SQL Editor

-- Create a function that deletes old rooms
CREATE OR REPLACE FUNCTION cleanup_inactive_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete rooms that haven't been active for more than 24 hours
  DELETE FROM rooms
  WHERE last_activity < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create a scheduled job (pg_cron) to run this every hour
-- Note: pg_cron might not be enabled on free tier, so we'll also provide a manual trigger option

-- If pg_cron is available, uncomment this:
-- SELECT cron.schedule('cleanup-rooms', '0 * * * *', 'SELECT cleanup_inactive_rooms();');

-- Alternative: Create a trigger that runs on INSERT/UPDATE
-- This won't auto-delete, but you can call the function manually or via API
-- For now, we'll use the API route approach which is simpler
