# Supabase Connection Error - Troubleshooting Guide

## Current Error
`ERR_CONNECTION_CLOSED` / `Failed to fetch` when connecting to:
- `https://hklaoglodjcdhvzdtyqu.supabase.co`

## Possible Causes & Solutions

### 1. **Missing Supabase Environment Variables**
Your `.env.example` is missing Supabase credentials.

**Action Required:**
Add these to your `.env` file:
```bash
VITE_SUPABASE_URL=https://hklaoglodjcdhvzdtyqu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**For Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add both variables above
4. Redeploy

### 2. **Supabase Project Paused**
Free-tier Supabase projects pause after 7 days of inactivity.

**Solution:**
1. Log into [Supabase Dashboard](https://app.supabase.com)
2. Check if your project is marked as "Paused"
3. Click "Resume" if needed

### 3. **Network/Firewall Issues**
Your network or firewall might be blocking Supabase.

**Test:**
```bash
curl https://hklaoglodjcdhvzdtyqu.supabase.co/rest/v1/
```

If this fails, check:
- VPN/proxy settings
- Corporate firewall
- ISP restrictions

### 4. **CORS Configuration**
Less likely, but check your Supabase CORS settings if needed.

## What I've Done
Added better error handling in `App.tsx` so the app won't crash when Supabase is unreachable. It will now:
- Show the login page gracefully
- Log errors to console without breaking the UI
- Allow the app to continue functioning (in limited capacity)

## Next Steps
1. **Verify your `.env` file has Supabase credentials**
2. **Check Supabase project status** in the dashboard
3. **Test network connectivity** to Supabase URL
4. If deploying to Vercel, ensure environment variables are set there too
