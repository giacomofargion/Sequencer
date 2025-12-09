# Room Cleanup Setup Guide

This guide explains how to automatically delete inactive rooms from your database.

## Why Clean Up Rooms?

Rooms that haven't been used in a while take up database space. This cleanup automatically removes rooms that haven't been active for 24+ hours.

## Option 1: Manual Cleanup (Simplest)

Just visit this URL whenever you want to clean up:

```
https://your-domain.com/api/rooms/cleanup
```

Or test locally:

```
http://localhost:3000/api/rooms/cleanup
```

This will delete all rooms inactive for 24+ hours.

## Option 2: Automatic Cleanup with Vercel Cron (Recommended)

If you're hosting on Vercel, this is the easiest automatic solution:

1. Create a file called `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/rooms/cleanup",
      "schedule": "0 * * * *"
    }
  ]
}
```

2. Deploy to Vercel - the cron job will run automatically every hour!

That's it! No additional setup needed.

## Option 3: Use a Free Cron Service

If you're not on Vercel, use a free service like [cron-job.org](https://cron-job.org):

1. Sign up for a free account
2. Create a new cron job
3. Set the URL to: `https://your-domain.com/api/rooms/cleanup`
4. Set schedule to: Every hour (`0 * * * *`)
5. Save and activate

## Option 4: Supabase Database Function (Advanced)

If you want cleanup to happen entirely in Supabase:

1. Go to your Supabase project → SQL Editor
2. Run the SQL from `supabase-cleanup-function.sql`
3. This creates a function you can call manually or schedule

## Testing

To test the cleanup:

1. Visit `/api/rooms/cleanup` in your browser
2. You should see a JSON response like:
   ```json
   {
     "success": true,
     "deletedCount": 0,
     "message": "Cleaned up 0 inactive room(s)"
   }
   ```

## How It Works

- Checks `last_activity` timestamp on each room
- Deletes rooms where `last_activity` is older than 24 hours
- Safe to run multiple times (idempotent)

## Customizing the Time Period

To change from 24 hours to something else, edit `app/api/rooms/cleanup/route.ts`:

```typescript
// Change 24 to your desired hours
const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
```

For example:

- 12 hours: `12 * 60 * 60 * 1000`
- 7 days: `7 * 24 * 60 * 60 * 1000`
- 30 days: `30 * 24 * 60 * 60 * 1000`
