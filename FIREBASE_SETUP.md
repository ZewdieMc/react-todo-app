# Firebase Setup Guide

This guide will help you set up Firebase for cloud storage in your Todo app.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "react-todo-app")
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Enter an app nickname (e.g., "Todo App Web")
6. (Optional) Check "Also set up Firebase Hosting"
7. Click "Register app"

## Step 3: Copy Firebase Configuration

After registering your app, you'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Create Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

3. **Important**: Never commit the `.env` file to version control. It should already be in `.gitignore`.

## Step 5: Set Up Firestore Database

**Finding Firestore Database:**

### Method 1: Using the Left Sidebar (Recommended)
1. In the Firebase Console, look at the **left sidebar menu**
2. Under the "Build" section, you should see:
   - Authentication
   - **Firestore Database** ← Click this one
   - Realtime Database (don't click this one)
   - Storage
   - Hosting
   - Functions
   - Machine Learning

3. Click on **"Firestore Database"** (NOT "Realtime Database")

### Method 2: Using the Console Home
1. From your Firebase project homepage
2. Look for cards/tiles showing different Firebase services
3. Find the card labeled **"Cloud Firestore"** or **"Firestore Database"**
4. Click "Get started" or "Create database"

### Method 3: Direct Navigation
1. Go to: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore`
2. Replace `YOUR_PROJECT_ID` with your actual project ID
3. This will take you directly to the Firestore Database page

**Creating the Database:**

1. Click **"Create database"** button (big blue button)
2. You'll see a setup wizard with two steps:

   **Step 1: Secure rules for Cloud Firestore**
   - Choose **"Start in test mode"** for development (allows read/write for 30 days)
   - Or choose **"Start in production mode"** if you'll set up authentication
   - Click **"Next"**

   **Step 2: Set Cloud Firestore location**
   - Select a location closest to your users (e.g., `us-central`, `europe-west`, `asia-east`)
   - ⚠️ **Important**: You cannot change this location later!
   - Click **"Enable"**

3. Wait a few seconds while Firebase creates your database
4. You'll see an empty database with tabs: Data, Rules, Indexes, Usage

## Step 6: Configure Security Rules (Optional but Recommended)

For production, you should set up proper security rules:

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Set Up Firebase Authentication (Optional)

If you want users to have individual accounts:

1. In the Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable your preferred sign-in providers:
   - Email/Password (simplest)
   - Google
   - GitHub
   - etc.

## Step 8: Test Your Setup

1. Restart your development server:
   ```bash
   npm start
   ```

2. Open the app in your browser
3. Click the "Cloud" button in the Storage Settings
4. Add a todo and check if it syncs
5. Open the app in a different browser or device with the same Firebase project
6. You should see your todos synced!

## Troubleshooting

### Can't Find "Firestore Database" Option

**If you don't see "Firestore Database" in the left sidebar:**

1. **Check if you're in the right project:**
   - Look at the top of the page - you should see your project name
   - Click the project name dropdown to switch projects if needed

2. **Expand the "Build" section:**
   - In the left sidebar, look for a section header called "Build"
   - Click on it to expand if it's collapsed
   - Firestore Database should be listed under this section

3. **Use the search bar:**
   - At the top of the Firebase Console, there's a search bar
   - Type "Firestore" and select "Firestore Database"

4. **Try the direct URL:**
   - Go to `https://console.firebase.google.com/`
   - Select your project
   - Manually add `/firestore` to the URL: 
     `https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore`

5. **Check your Firebase plan:**
   - Firestore is available on the free "Spark" plan
   - If you're on a very old Firebase project, you might need to upgrade
   - Go to Project Settings → Usage and billing to check

**Common Confusion:**
- **Firestore Database** ≠ **Realtime Database**
- They are two different products!
- You want **"Firestore Database"** (also called "Cloud Firestore")
- NOT "Realtime Database"

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env` file is in the root directory
- Restart your development server after creating/modifying `.env`
- Check that all environment variables start with `REACT_APP_`

### "Missing or insufficient permissions"
- Check your Firestore security rules
- If using authentication, make sure users are signed in
- For development, you can temporarily use test mode rules

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- This usually means Firebase is being initialized multiple times
- Check that you're only importing from `src/firebase/config.js`

### Environment Variables Not Loading
- Environment variables must start with `REACT_APP_` in Create React App
- Restart the development server after changing `.env`
- Check that `.env` is in the root directory (same level as `package.json`)

## Free Tier Limits

Firebase offers a generous free tier:
- **Firestore**: 1 GiB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited users
- **Hosting**: 10 GB storage, 10 GB/month transfer

This is more than enough for personal todo apps!

## Security Best Practices

1. **Never expose your `.env` file** - It's in `.gitignore` by default
2. **Use authentication** - Don't allow anonymous access in production
3. **Set up proper security rules** - Restrict access to user-specific data
4. **Monitor usage** - Check Firebase Console for unusual activity
5. **Use environment variables** - Never hardcode API keys in your source code

## Next Steps

- Set up Firebase Hosting for your app
- Add user authentication
- Implement real-time collaboration features
- Add file attachments with Firebase Storage
- Set up Cloud Functions for backend logic

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
