# Netlify Deployment Setup for Firebase Integration

## Issue
Firebase only works on localhost because environment variables are not available in Netlify.

## Solution

### Step 1: Add Environment Variables to Netlify

1. **Log in to Netlify**: https://app.netlify.com/
2. **Select your project**: `react-todo-app`
3. **Navigate to Environment Variables**:
   - Go to **Site configuration** → **Environment variables**
   - OR **Build & deploy** → **Environment**

4. **Add the following variables** (one by one):

   Click **"Add a variable"** for each:

   ```
   Key: REACT_APP_FIREBASE_API_KEY
   Value: <paste your Firebase API key>
   
   Key: REACT_APP_FIREBASE_AUTH_DOMAIN
   Value: <paste your Firebase auth domain>
   
   Key: REACT_APP_FIREBASE_PROJECT_ID
   Value: <paste your Firebase project ID>
   
   Key: REACT_APP_FIREBASE_STORAGE_BUCKET
   Value: <paste your Firebase storage bucket>
   
   Key: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   Value: <paste your Firebase sender ID>
   
   Key: REACT_APP_FIREBASE_APP_ID
   Value: <paste your Firebase app ID>
   ```

5. **Save** all variables

### Step 2: Find Your Firebase Credentials

You can find these values in your local `.env` file:

```bash
cat .env
```

**OR** get them from Firebase Console:
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click the **gear icon** → **Project Settings**
4. Scroll to **"Your apps"** section
5. Find your web app and copy the config values

### Step 3: Trigger a New Deploy

After adding environment variables:

**Option A - Via Netlify Dashboard:**
- Go to **Deploys** tab
- Click **"Trigger deploy"** → **"Deploy site"**

**Option B - Via Git Push:**
```bash
git add netlify.toml
git commit -m "📦 chore: Add Netlify configuration for deployment"
git push origin feature/todoist-enhancements
```

The push will automatically trigger a new deployment with the environment variables.

### Step 4: Verify Deployment

1. Wait for the deploy to complete (usually 2-3 minutes)
2. Visit your deployed site
3. Open browser DevTools → Console
4. Try switching to **Cloud Storage** mode
5. Add/edit/delete a todo item
6. Check that Firebase sync works without errors

## Security Notes

✅ **Environment variables in Netlify are secure** - they're:
- Encrypted at rest
- Only available during build time
- Not exposed in the browser (injected at build time)
- Not visible in public Git repository

✅ **Firebase API keys are safe to expose** in the browser because:
- They identify your Firebase project
- Security is enforced by Firestore Security Rules
- You've already set up security rules in Firebase Console

## Troubleshooting

### If Firebase still doesn't work after deployment:

1. **Check build logs** in Netlify:
   - Go to **Deploys** → Click on latest deploy
   - Check for any errors or warnings about missing env variables

2. **Verify environment variables are set**:
   - Go to **Site configuration** → **Environment variables**
   - Confirm all 6 Firebase variables are present

3. **Check browser console** on deployed site:
   - Open DevTools → Console
   - Look for Firebase errors (authentication, configuration, etc.)

4. **Verify Firebase Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

5. **Check Firebase Console** → **Authentication**:
   - Ensure **Anonymous** authentication is enabled

## Additional Configuration

The `netlify.toml` file has been added with:
- ✅ Build command and publish directory
- ✅ Node.js version (24.11.0)
- ✅ SPA routing redirects
- ✅ Security headers

No further Netlify configuration needed!
