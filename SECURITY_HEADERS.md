# Security Headers Configuration

## Problem
Your Vercel deployment was blocking OAuth, Google Sign-In, and Supabase authentication due to restrictive security headers:

- `Cross-Origin-Opener-Policy: same-origin` - Blocks OAuth popups
- `Cross-Origin-Embedder-Policy: require-corp` - Blocks third-party resources

## Solution Applied

Updated `vercel.json` with OAuth-compatible headers:

### Critical Changes

#### 1. Cross-Origin-Opener-Policy
**Changed to:** `same-origin-allow-popups`

✅ **Why:** Allows OAuth popup windows (Google Sign-In, Supabase) to communicate with the parent window

#### 2. Cross-Origin-Embedder-Policy  
**Set to:** `unsafe-none`

✅ **Why:** Allows loading third-party resources like Google Fonts, Supabase SDK, and OAuth providers without CORS issues

### Additional Security Headers

We also added these for best practices:

- **X-Frame-Options:** `SAMEORIGIN` - Prevents clickjacking
- **X-Content-Type-Options:** `nosniff` - Prevents MIME sniffing
- **Referrer-Policy:** `strict-origin-when-cross-origin` - Protects referrer information
- **Permissions-Policy:** Restricts geolocation, microphone, camera access

## Next Steps

1. **Commit and push** these changes
2. **Redeploy** on Vercel
3. **Test authentication** - Google Sign-In should now work

## Testing Checklist

- [ ] Google Sign-In popup opens
- [ ] Supabase authentication completes
- [ ] No COOP/COEP errors in console
- [ ] FedCM works without abort errors
