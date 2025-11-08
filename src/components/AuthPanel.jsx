import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaGoogle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from 'styles/AuthPanel.module.css';
import authService from '../firebase/authService';

const AuthPanel = ({ onAuthChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result first, then fall back to current user and subscribe
    let unsub = null;
    const initAuth = async () => {
      setLoading(true);

      // 1) Try to read redirect result (when returning from sign-in redirect)
      const result = await authService.checkRedirectResult();
      if (result.success && result.user) {
        setUser(result.user);
        if (onAuthChange) onAuthChange(result.user);
        toast.success('✅ Signed in successfully!', { autoClose: 2000 });
      } else if (!result.success) {
        // Non-fatal: show error so user knows
        toast.error(`Sign-in failed: ${result.error}`);
      }

      // 2) If redirect didn't return a user, check if auth already has a currentUser
      const existing = authService.getCurrentUser();
      if (existing) {
        setUser(existing);
        if (onAuthChange) onAuthChange(existing);
      }

      // 3) Subscribe to auth state changes (keeps UI in sync)
      unsub = authService.onAuthStateChange((u) => {
        setUser(u);
        if (onAuthChange) onAuthChange(u);
      });

      setLoading(false);
    };

    initAuth();

    return () => {
      if (unsub) unsub();
    };
  }, [onAuthChange]);

  const handleSignIn = async () => {
    setLoading(true);
    const result = await authService.signInWithGoogle();

    // For popup mode (localhost), result will have user immediately
    if (result.user) {
      setUser(result.user);
      if (onAuthChange) onAuthChange(result.user);
      toast.success('✅ Signed in successfully!', { autoClose: 2000 });
      setLoading(false);
    } else if (!result.success) {
      setLoading(false);
      toast.error(`Sign-in failed: ${result.error}`);
    }
    // For redirect mode (production), page will redirect and come back
  };

  const handleSignOut = async () => {
    setLoading(true);
    const result = await authService.signOutUser();
    setLoading(false);

    if (!result.success) {
      toast.error(`Sign-out failed: ${result.error}`);
    } else {
      toast.info('👋 Signed out', { autoClose: 2000 });
    }
  };

  if (user) {
    return (
      <div className={styles.authPanel}>
        <div className={styles.userInfo}>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <FaUser />
            </div>
          )}
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user.displayName || 'User'}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={loading}
          className={styles.signOutButton}
          aria-label="Sign out"
        >
          <FaSignOutAlt />
          {loading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authPanel}>
      <div className={styles.signInPrompt}>
        <FaUser className={styles.icon} />
        <p>Sign in to sync your tasks across all devices</p>
      </div>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className={styles.signInButton}
        aria-label="Sign in with Google"
      >
        <FaGoogle />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
};

AuthPanel.propTypes = {
  onAuthChange: PropTypes.func,
};

AuthPanel.defaultProps = {
  onAuthChange: null,
};

export default AuthPanel;
