# Collaboration Setup Guide

This guide walks you through setting up the real-time collaboration features for the sequencer.

## Prerequisites

- A Supabase account (free tier works fine)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details (name, database password, region)
4. Wait for project to be created (~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Open the file `supabase-migration.sql` from this project
3. Copy and paste the SQL into the editor
4. Click "Run" to execute the migration
5. Verify the `rooms` table was created in **Table Editor**

## Step 3: Get API Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 4: Configure Environment Variables

**⚠️ SECURITY WARNING: Never commit `.env.local` to git!** This file contains sensitive credentials and is already in `.gitignore`.

1. Create a new file named `.env.local` in the project root directory:

   - In your editor: Right-click in the file explorer → "New File" → name it `.env.local`
   - Or use terminal: `touch .env.local`

2. Open `.env.local` and add your Supabase credentials (one per line, no spaces around `=`):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. Replace the placeholder values with your actual credentials from Step 3.

4. **Important:** Restart your dev server after creating/editing this file.

## Step 5: Test the Setup

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Click "Create" to generate a room code

4. Open another browser tab/window and join the same room code

5. Toggle steps in one window - they should appear in the other window in real-time!

## Troubleshooting

### "Supabase credentials not found" warning

- Make sure `.env.local` exists and has the correct variable names
- Restart the dev server after adding environment variables
- Check that variable names start with `NEXT_PUBLIC_` (required for client-side access)

### "Failed to load room" error

- Verify the `rooms` table exists in Supabase
- Check that Realtime is enabled for the `rooms` table
- Ensure your anon key has the correct permissions

### Changes not syncing between users

- Check browser console for errors
- Verify both users are connected (green dot in room controls)
- Make sure both users are in the same room (same room code)

## Security Notes

**If you accidentally committed `.env.local` to git:**

1. The file has been removed from git tracking (but your local file is safe)
2. **IMPORTANT:** Regenerate your Supabase API keys immediately:
   - Go to Supabase Dashboard → Settings → API
   - Click "Reset" next to your anon key
   - Update `.env.local` with the new key
3. The old keys are now exposed in git history - anyone with repo access could use them
4. Consider using Supabase Row Level Security (RLS) policies to limit database access

## How It Works

- **Solo Mode**: When no room is joined, the sequencer works locally (no sync)
- **Room Mode**: When a room code is entered, all users in that room share:

  - Pattern grid (step toggles)
  - Transport state (play/pause, tempo, range)
  - Instrument parameters (pitch, decay, timbre)

- **Real-time Sync**: Uses Supabase Realtime channels to broadcast changes instantly
- **Persistence**: Room state is saved to Supabase database for durability

## Next Steps

See `COLLABORATION_PLAN.md` for the full architecture and future enhancements.
