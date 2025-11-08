# Local Development Setup for Google Sign-In

## Add localhost to Firebase Authorized Domains

For Google Sign-In to work on `localhost:3000`, you need to add it to Firebase authorized domains:

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Enter: `localhost`
6. Click **Add**

### Current Authorized Domains Should Include:
- `localhost` (for local development)
- `react-todo-app-zewdie.netlify.app` (or your Netlify domain)

## How the Auth Works Now

The app automatically detects the environment:

- **Localhost (http://localhost:3000)**: Uses **popup-based** sign-in
  - Opens a Google Sign-In popup
  - Returns immediately with user data
  - No page redirect needed
  
- **Production (Netlify)**: Uses **redirect-based** sign-in
  - Redirects to Google Sign-In page
  - Returns to your app after authentication
  - Better for production, avoids CORS issues

## Testing Locally

1. Make sure `localhost` is added to Firebase authorized domains (see above)
2. Run: `npm start`
3. Click the **Sign in with Google** button
4. A popup will appear - select your Google account
5. You should be signed in immediately without page refresh

## If Sign-In Still Fails

Check the browser console for errors:
- **auth/unauthorized-domain**: `localhost` not added to Firebase
- **popup-blocked**: Enable popups for localhost in your browser
- **CORS errors**: Make sure you're using the correct Firebase config

## Environment Variables

Make sure your `.env` file has the correct Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```
