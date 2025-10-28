import {
  signInWithPopup,
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

  // Sign in with Google
  async signInWithGoogle() {
    try {
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing in with Google:', error);
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
