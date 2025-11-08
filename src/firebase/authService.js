import {
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

class AuthService {
  constructor() {
    this.provider = new GoogleAuthProvider();
    this.currentUser = null;
  }

  // Sign in with Google - uses popup for localhost, redirect for production
  async signInWithGoogle() {
    try {
      const isLocalhost = window.location.hostname === 'localhost'
        || window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        // Use popup for local development (works better)
        const result = await signInWithPopup(auth, this.provider);
        this.currentUser = result.user;
        return {
          success: true,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          },
        };
      }
      // Use redirect for production (avoids CORS issues)
      await signInWithRedirect(auth, this.provider);
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing in with Google:', error);
      return { success: false, error: error.message };
    }
  }

  // Check for redirect result after returning from Google Sign-In
  async checkRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        this.currentUser = result.user;
        return {
          success: true,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          },
        };
      }
      return { success: true, user: null };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting redirect result:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOutUser() {
    try {
      await signOut(auth);
      this.currentUser = null;
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        callback(null);
      }
    });
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser || auth.currentUser;
  }
}

export default new AuthService();
