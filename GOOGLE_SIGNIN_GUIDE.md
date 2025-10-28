# Google Sign-In Setup Guide

## What's New? 🎉

Your Todo app now supports **Google Sign-In** for true cross-device synchronization! Sign in once, and your tasks will be available on any device where you're logged in.

## How It Works

### **Before Google Sign-In** ❌
- Each browser had its own separate todo list
- No sync between devices
- Different tasks on phone, laptop, work computer

### **After Google Sign-In** ✅
- Sign in with your Google account
- Same todo list on ALL your devices
- Automatic cloud sync
- Access from anywhere

## Setup Steps

### 1. Enable Google Sign-In in Firebase (Required)

**You must do this before the feature will work:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click the **"Sign-in method"** tab
5. Find **"Google"** in the providers list
6. Click on it and toggle **"Enable"** to ON
7. Fill in:
   - **Project public-facing name**: "Todo App" (or your preferred name)
   - **Project support email**: Your email address
8. Click **"Save"**

### 2. Update Firestore Security Rules

For better security with authentication:

1. In Firebase Console, go to **"Firestore Database"**
2. Click the **"Rules"** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write only their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click **"Publish"**

### 3. Add Environment Variables to Netlify (For Production)

Don't forget to add your Firebase environment variables to Netlify (see NETLIFY_SETUP.md for details).

## Using the App

### Sign In

1. **Open the app** - You'll see the Auth Panel at the top
2. **Click "Sign in with Google"** button
3. **Choose your Google account** in the popup
4. **Grant permissions** when asked
5. **Done!** You're signed in and your tasks will now sync across devices

### What You'll See When Signed In

- Your Google profile picture and name
- Your email address
- A "Sign out" button
- All your tasks synced from the cloud

### Syncing Across Devices

1. **Sign in on Device 1** (e.g., your laptop)
2. **Add/edit todos**
3. **Switch to Cloud Storage** mode
4. **Sign in on Device 2** (e.g., your phone) with the same Google account
5. **Switch to Cloud Storage** mode
6. **See all your todos!** 🎉

### Sign Out

- Click the **"Sign out"** button in the Auth Panel
- You'll be signed out and your local data remains on the device
- Your cloud data is safely stored and will be there when you sign back in

## Important Notes

### Data Privacy & Security

✅ **Your data is secure:**
- Each user can only access their own data
- Firestore security rules enforce user isolation
- Google handles authentication securely

✅ **Your data is private:**
- Todo data is stored under your unique user ID
- No one else can access your tasks
- Not even other users of the app

### Local vs Cloud Storage

**Local Storage Mode (Default):**
- Tasks stored in browser localStorage
- Works offline
- No sync across devices
- No sign-in required

**Cloud Storage Mode (With Sign-In):**
- Tasks stored in Firebase Firestore
- Requires internet connection
- Syncs across all devices
- Requires Google Sign-In for cross-device sync

**Cloud Storage Mode (Without Sign-In):**
- Uses anonymous user ID
- Works but each browser has different anonymous ID
- No cross-device sync

### Best Practice

**For cross-device sync:**
1. Sign in with Google
2. Switch to Cloud Storage mode
3. Do this on all devices you want to sync

**For single-device use:**
- Stay in Local Storage mode
- No sign-in needed
- Faster, works offline

## Troubleshooting

### "Sign-in failed" Error

**Check:**
1. Is Google Sign-In enabled in Firebase Console?
2. Is your Firebase configuration correct in `.env`?
3. Are you using the correct Firebase project?

### "Permission denied" Error

**Check:**
1. Are your Firestore security rules published?
2. Are you signed in before switching to Cloud mode?
3. Is the security rules syntax correct?

### Tasks Not Syncing

**Check:**
1. Are you signed in with the SAME Google account on all devices?
2. Is Cloud Storage mode enabled on all devices?
3. Do you have internet connection?
4. Check browser console for errors

### Can't See Sign-In Button

**Check:**
1. Did you add the `AuthPanel` component to your app?
2. Is the component rendering above StorageSettings?
3. Check browser console for errors

## FAQ

**Q: Do I have to sign in to use the app?**
A: No! You can use Local Storage mode without signing in.

**Q: What happens to my local tasks when I sign in?**
A: They stay in local storage. Switch to Cloud mode to upload them to the cloud.

**Q: Can I use a different email provider?**
A: Currently only Google Sign-In is supported. Email/password can be added in the future.

**Q: Is my data safe?**
A: Yes! Firebase uses industry-standard security, and your data is only accessible to you.

**Q: What if I sign out?**
A: Your cloud data remains safe. Local data stays on the device. Sign back in anytime to access cloud data.

**Q: Can I use this app offline?**
A: Yes, in Local Storage mode. Cloud mode requires internet for sync.

**Q: How much does Firebase cost?**
A: Firebase has a generous free tier. For personal use, it's likely free forever. Check [Firebase Pricing](https://firebase.google.com/pricing).

## Next Steps

1. ✅ Complete Firebase setup (FIREBASE_SETUP.md)
2. ✅ Enable Google Sign-In (Step 1 above)
3. ✅ Update security rules (Step 2 above)
4. ✅ Deploy to Netlify with environment variables (NETLIFY_SETUP.md)
5. 🎉 Enjoy cross-device todo sync!

---

**Need help?** Check the Firebase Console for errors or review the setup guides.
