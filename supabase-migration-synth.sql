-- Migration to add synth sequencer support to rooms table
-- Run this in your Supabase SQL editor: https://app.supabase.com/project/_/sql

-- Add synth_pattern and synth_params columns
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS drum_pattern JSONB,
ADD COLUMN IF NOT EXISTS synth_pattern JSONB,
ADD COLUMN IF NOT EXISTS synth_params JSONB;

-- Migrate existing pattern data to drum_pattern for backward compatibility
UPDATE rooms
SET drum_pattern = pattern
WHERE drum_pattern IS NULL AND pattern IS NOT NULL;

-- Set default values for new columns if they're null
-- Create 12-row pattern (one per note: C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
-- Each row has 16 steps, all inactive with default note 60
DO $$
DECLARE
  default_pattern JSONB;
  row_array JSONB;
  step_array JSONB;
BEGIN
  -- Build step array (16 steps)
  SELECT jsonb_agg(jsonb_build_object('active', false, 'note', 60))
  INTO step_array
  FROM generate_series(1, 16);

  -- Build row array (12 rows, each with the step array)
  SELECT jsonb_agg(step_array)
  INTO row_array
  FROM generate_series(1, 12);

  -- Update rooms with null synth_pattern
  UPDATE rooms
  SET synth_pattern = row_array
  WHERE synth_pattern IS NULL;
END $$;

UPDATE rooms
SET synth_params = '{"pitch":0,"detune":0,"attack":0.01,"decay":0.3,"sustain":0.1,"release":0.2,"harmonicity":3,"modulationIndex":10,"modAttack":0.01,"modDecay":0.3,"modSustain":0.5,"modRelease":0.2}'::jsonb
WHERE synth_params IS NULL;
