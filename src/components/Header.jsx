import { useState, useRef } from 'react';
import { FaCheckCircle, FaUser, FaCog } from 'react-icons/fa';
import PropTypes from 'prop-types';
import AuthPanel from 'components/AuthPanel';
import NotificationSettings from 'components/NotificationSettings';
import styles from 'styles/Header.module.css';
import useOnClickOutside from '../useOnClickOutside';

const Header = ({ user, onAuthChange }) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null);

  useOnClickOutside(settingsMenuRef, showSettingsMenu, () => setShowSettingsMenu(false));

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {user && user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className={styles.userPhoto}
              title={user.displayName || user.email}
            />
          )}
          {user && !user.photoURL && (
            <div className={styles.userIcon} title={user.displayName || user.email}>
              <FaUser />
            </div>
          )}
          <FaCheckCircle className={styles.icon} />
          <h1 className={styles.title}>My Tasks</h1>
        </div>
        <div className={styles.headerActions}>
          <AuthPanel onAuthChange={onAuthChange} />
          <div ref={settingsMenuRef}>
            <button
              type="button"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={styles.settingsButton}
              title="Notification Settings"
            >
              <FaCog className={styles.settingsIcon} />
            </button>
            {showSettingsMenu && (
              <div className={styles.settingsDropdown}>
                <div className={styles.settingsSection}>
                  <NotificationSettings />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className={styles.subtitle}>Stay organized and productive with smart reminders</p>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  onAuthChange: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default Header;
