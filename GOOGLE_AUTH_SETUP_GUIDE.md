# Google OAuth Setup Guide for GeoSynth

## 🎯 Overview
This guide will walk you through setting up Google Sign-In/SSO for your GeoSynth application using Supabase authentication.

---

## 📋 Prerequisites
- Supabase project (you have: `qnszxgoxfqctcjpglvmd`)
- Google Cloud Platform account
- Your application URL (for development: `http://localhost:8080`)

---

## Part 1: Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - **Project Name**: `GeoSynth` (or your preferred name)
   - Click "Create"
   - Wait for the project to be created and select it

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"
   
2. **Enable Required APIs**
   - Search for "Google+ API"
   - Click on it and click "Enable"
   - Also search for "Google Identity Toolkit API" and enable it

### Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - In the left sidebar: "APIs & Services" → "OAuth consent screen"

2. **Choose User Type**
   - Select **"External"** (unless you have a Google Workspace)
   - Click "Create"

3. **Fill in App Information**
   ```
   App name: GeoSynth
   User support email: [YOUR_EMAIL]
   Application home page: http://localhost:8080 (for dev)
   Application privacy policy link: [YOUR_PRIVACY_POLICY_URL] (optional for testing)
   Application terms of service link: [YOUR_TOS_URL] (optional for testing)
   Authorized domains: 
     - localhost (for development)
     - [YOUR_PRODUCTION_DOMAIN] (when ready)
   Developer contact information: [YOUR_EMAIL]
   ```

4. **Scopes**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click "Update" then "Save and Continue"

5. **Test Users** (for External app in testing mode)
   - Add your email and any test user emails
   - Click "Save and Continue"

6. **Review and Confirm**
   - Review your settings
   - Click "Back to Dashboard"

### Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - In the left sidebar: "APIs & Services" → "Credentials"

2. **Create OAuth Client ID**
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "OAuth client ID"

3. **Configure OAuth Client**
   ```
   Application type: Web application
   Name: GeoSynth Web Client
   ```

4. **Add Authorized JavaScript Origins**
   ```
   http://localhost:8080
   https://qnszxgoxfqctcjpglvmd.supabase.co
   [YOUR_PRODUCTION_URL] (when ready)
   ```

5. **Add Authorized Redirect URIs**
   ```
   https://qnszxgoxfqctcjpglvmd.supabase.co/auth/v1/callback
   http://localhost:8080/auth/callback (optional for local testing)
   ```

6. **Create**
   - Click "Create"
   - **IMPORTANT**: Copy the Client ID and Client Secret
   - Keep these safe - you'll need them for Supabase

---

## Part 2: Supabase Configuration

### Step 1: Access Supabase Dashboard

1. **Go to Supabase**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account

2. **Select Your Project**
   - Click on your project: `qnszxgoxfqctcjpglvmd`

### Step 2: Enable Google Provider

1. **Navigate to Authentication Settings**
   - In the left sidebar, click "Authentication"
   - Click on "Providers" tab

2. **Find Google Provider**
   - Scroll down to find "Google" in the list
   - Click on it to expand

3. **Enable and Configure**
   ```
   Enable Google provider: Toggle ON
   
   Client ID (for OAuth): [PASTE YOUR GOOGLE CLIENT ID]
   Client Secret (for OAuth): [PASTE YOUR GOOGLE CLIENT SECRET]
   
   Redirect URL: (This is auto-generated, should be)
   https://qnszxgoxfqctcjpglvmd.supabase.co/auth/v1/callback
   ```

4. **Additional Settings** (Optional but Recommended)
   ```
   Skip nonce check: Leave unchecked
   ```

5. **Save**
   - Click "Save" at the bottom

### Step 3: Configure Site URL and Redirect URLs

1. **Go to URL Configuration**
   - Still in "Authentication" section
   - Click on "URL Configuration" tab

2. **Set Site URL**
   ```
   Site URL: http://localhost:8080
   ```
   (Change this to your production URL when deploying)

3. **Add Redirect URLs**
   ```
   Redirect URLs (one per line):
   http://localhost:8080
   http://localhost:8080/
   http://localhost:8080/**
   ```

4. **Save Configuration**

---

## Part 3: Update Your Application

### Step 1: Verify Environment Variables

Your `.env` file should already have:
```env
VITE_SUPABASE_PROJECT_ID="wrdvfaomghaheumvzxpd"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://wrdvfaomghaheumvzxpd.supabase.co"
```

✅ **No changes needed** - your environment is already configured!

### Step 2: Test the Implementation

The Auth component has been updated with Google Sign-In. No additional code changes needed!

---

## Part 4: Testing

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Test Google Sign-In

1. **Navigate to Auth Page**
   - Open: http://localhost:8080/auth

2. **Click "Continue with Google"**
   - You should be redirected to Google's sign-in page
   - Select your Google account
   - Grant permissions

3. **Verify Redirect**
   - After successful authentication, you should be redirected back to your app
   - You should see a success toast notification
   - You should be logged in and redirected to the home page

### Step 3: Verify in Supabase Dashboard

1. **Check Users**
   - Go to Supabase Dashboard → Authentication → Users
   - You should see your Google account listed
   - Provider should show "google"

---

## 🔧 Troubleshooting

### Issue: "Redirect URI mismatch" Error

**Solution:**
- Double-check that the redirect URI in Google Cloud Console exactly matches:
  ```
  https://wrdvfaomghaheumvzxpd.supabase.co/auth/v1/callback
  ```
- No trailing slashes, exact match required

### Issue: "Access blocked: This app's request is invalid"

**Solution:**
- Make sure you've added your email as a test user in Google Cloud Console
- Verify OAuth consent screen is properly configured
- Check that all required scopes are added

### Issue: Google button doesn't work

**Solution:**
- Check browser console for errors
- Verify Supabase credentials in `.env` file
- Ensure Google provider is enabled in Supabase dashboard
- Clear browser cache and cookies

### Issue: User redirected but not logged in

**Solution:**
- Check Supabase Site URL matches your app URL
- Verify redirect URLs are properly configured in Supabase
- Check browser console for auth errors

---

## 📝 Data You Need to Provide

When you're ready to set this up, I'll need:

1. **From Google Cloud Console** (after Step 4 of Part 1):
   - ✅ Google OAuth Client ID
   - ✅ Google OAuth Client Secret

2. **Confirmation** that you've:
   - ✅ Created the Google Cloud project
   - ✅ Enabled required APIs
   - ✅ Configured OAuth consent screen
   - ✅ Added authorized origins and redirect URIs

3. **From Supabase** (after Part 2):
   - ✅ Confirmation that Google provider is enabled
   - ✅ Screenshot of provider settings (optional, for verification)

---

## 🚀 Production Deployment Checklist

When deploying to production:

- [ ] Update Google Cloud Console:
  - [ ] Add production domain to authorized JavaScript origins
  - [ ] Add production redirect URI
  - [ ] Publish OAuth consent screen (if using External)

- [ ] Update Supabase:
  - [ ] Change Site URL to production URL
  - [ ] Add production redirect URLs

- [ ] Update Application:
  - [ ] Update environment variables for production
  - [ ] Test OAuth flow in production environment

---

## 🔐 Security Best Practices

1. **Never commit credentials**
   - Keep `.env` file in `.gitignore`
   - Use environment variables for all secrets

2. **Use HTTPS in production**
   - Google OAuth requires HTTPS for production
   - Supabase handles this automatically

3. **Limit OAuth scopes**
   - Only request necessary permissions
   - Current setup requests: email, profile, openid (minimal)

4. **Monitor authentication logs**
   - Check Supabase logs regularly
   - Monitor for suspicious activity

---

## 📞 Need Help?

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs → Auth Logs
2. Check browser console for JavaScript errors
3. Verify all URLs match exactly (no typos)
4. Ensure you're using the correct Supabase project

---

## ✅ Quick Reference

**Your Supabase Project:**
- Project ID: `wrdvfaomghaheumvzxpd`
- URL: `https://wrdvfaomghaheumvzxpd.supabase.co`

**Required Redirect URI for Google:**
```
https://wrdvfaomghaheumvzxpd.supabase.co/auth/v1/callback
```

**Local Development URL:**
```
http://localhost:8080
```

---

**Ready to proceed?** Follow the steps above and provide the Google OAuth credentials when you have them!
