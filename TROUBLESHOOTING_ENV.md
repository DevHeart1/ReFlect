# Fix: Still Getting Connection Errors After Adding Credentials

## Quick Checklist

### ✅ Step 1: Verify .env file has the actual key
Your `.env` should look like this (with your actual anon key, not placeholder):
```bash
VITE_SUPABASE_URL=https://hklaoglodjcdhvzdtyqu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ✅ Step 2: RESTART Dev Server (IMPORTANT!)
Vite doesn't hot-reload `.env` changes. You MUST:
```powershellGet
# In your terminal running npm run dev:
# 1. Press Ctrl+C to stop
# 2. Run again:
npm run dev
```

### ✅ Step 3: Clear Browser Cache
**Hard refresh won't work** - you need to clear cache:
1. Open DevTools (F12)
2. **Application** tab → **Storage** (left sidebar)
3. Click **Clear site data**
4. Close DevTools and refresh (Ctrl+Shift+R)

### ✅ Step 4: Check WHERE You're Testing
Are you testing:
- ❌ Production: `https://reflect-amber-nu.vercel.app` → Needs redeploy
- ✅ Local: `http://localhost:3000` → Should work after restart

**If testing on Vercel production:**
- Environment variables added? ✓
- But you need to **redeploy** (push new commit or manual redeploy)

## Diagnostic Commands

Run these in your terminal to verify env is loaded:

```powershell
# Check if .env has the key
-Content .env | Select-String "VITE_SUPABASE"

# Verify dev server sees it (after restart)
# Look in the browser console for:
# "Missing Supabase credentials" warning
```

## Still Not Working?

### Check Browser Console on page load:
Look for: `Missing Supabase credentials in .env file`
- If you see this → env vars not loaded (server not restarted)
- If you don't see this → credentials are loaded

### Network Tab:
Open DevTools → **Network** tab → Filter by `supabase`
- Look at the request headers
- Should include `apikey: your-anon-key`
- If header is missing → env var issue
