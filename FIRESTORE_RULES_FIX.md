# Fix Firestore Permission Error

## The Problem
You're getting **"Missing or insufficient permissions"** because Firestore security rules are blocking access.

## Solution: Update Firestore Rules in Firebase Console

### Option 1: Via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab at the top
5. **Replace the rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
    }
  }
}
```

6. Click **Publish**
7. Wait a few seconds for rules to propagate

### Option 2: Open Rules for Testing (NOT for production!)

If you just want to test quickly, use this (but NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

This allows ANYONE to read/write your database - only use for testing!

### After Updating Rules

1. Wait ~10 seconds for rules to propagate
2. Refresh your app at http://localhost:3000
3. Sign in with Google
4. Click **Cloud** button
5. Click **Save** - should work now!

## Why This Happens

Firestore has default deny-all rules. The `firestore.rules` file in your project is just for reference - you must deploy it to Firebase Console manually or use Firebase CLI.

## Current Issue

Your current rules use `request.auth.token.email == userId`, which means:
- The userId in the path must match the user's email
- But we're using email as userId, so this should work

Let me know if you still get errors after updating the rules!
