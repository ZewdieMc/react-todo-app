# Fixing "auth/unauthorized-domain" Error

## The Problem

You're seeing: `Firebase: Error (auth/unauthorized-domain)`

This happens because Firebase doesn't recognize your domain (localhost or your deployed URL) as authorized for authentication.

## Solution: Add Authorized Domains

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click the **"Settings"** tab at the top
5. Scroll down to **"Authorized domains"** section

### Step 2: Add Your Domains

You should see a list of authorized domains. By default, Firebase includes:
- `localhost`
- `your-project.firebaseapp.com`
- `your-project.web.app`

**Add these domains if they're not already there:**

#### For Local Development:
- `localhost` (should already be there)
- If using a different port, you don't need to add it separately

#### For Netlify Deployment:
1. Click **"Add domain"** button
2. Add your Netlify domain (e.g., `your-app.netlify.app`)
3. If you have a custom domain, add that too (e.g., `yourdomain.com`)

### Example Authorized Domains List:

```
✅ localhost
✅ your-project.firebaseapp.com
✅ your-project.web.app
✅ your-app.netlify.app          ← Add this for Netlify
✅ www.your-app.netlify.app      ← Add this if using www
✅ yourdomain.com                ← Add your custom domain if any
```

### Step 3: Save and Test

1. After adding domains, click **"Save"** (if there's a save button)
2. Wait a few seconds for changes to propagate
3. **Refresh your app** in the browser
4. Try signing in again

## Common Issues

### Issue: "localhost" is not in the list

**Solution:** Add it manually:
1. Click "Add domain"
2. Type: `localhost`
3. Save

### Issue: Still getting the error after adding domains

**Solution:**
1. Clear your browser cache
2. Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Close all browser tabs with the app
4. Open the app in a new tab
5. Try again

### Issue: Error on Netlify but works locally

**Solution:**
1. Make sure you added your exact Netlify URL
2. Check both with and without `www`
3. Add both if needed:
   - `your-app.netlify.app`
   - `www.your-app.netlify.app`

### Issue: Using a custom domain

**Solution:**
1. Add your custom domain to Firebase authorized domains
2. Add both with and without `www`:
   - `yourdomain.com`
   - `www.yourdomain.com`

## Verification Steps

After adding domains, verify the setup:

1. **Check Firebase Console:**
   - Go to Authentication > Settings > Authorized domains
   - Confirm all your domains are listed

2. **Test Local Development:**
   - Open `http://localhost:3000` (or your dev port)
   - Click "Sign in with Google"
   - Should work without errors

3. **Test Production:**
   - Open your deployed URL (Netlify/custom domain)
   - Click "Sign in with Google"
   - Should work without errors

## Quick Fix Checklist

- [ ] Open Firebase Console
- [ ] Go to Authentication > Settings
- [ ] Find "Authorized domains" section
- [ ] Verify `localhost` is in the list
- [ ] Add your Netlify domain (if deploying)
- [ ] Add your custom domain (if you have one)
- [ ] Save changes
- [ ] Refresh browser
- [ ] Test sign-in again

## Still Having Issues?

### Check These:

1. **Is Google Sign-In enabled?**
   - Authentication > Sign-in method > Google = Enabled

2. **Are environment variables set?**
   - Check `.env` file has correct Firebase config
   - For Netlify, check Site settings > Environment variables

3. **Is the domain spelled correctly?**
   - No typos in domain name
   - No `https://` or `http://` prefix (just the domain)
   - No trailing slashes

4. **Using the right Firebase project?**
   - Check your `.env` file matches the Firebase Console project

## Example Fix

**Before (Error):**
```
Authorized domains:
- your-project.firebaseapp.com
- your-project.web.app
```

**After (Working):**
```
Authorized domains:
- localhost
- your-project.firebaseapp.com
- your-project.web.app
- my-todo-app.netlify.app
```

---

After following these steps, your Google Sign-In should work! 🎉
