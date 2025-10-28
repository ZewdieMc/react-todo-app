import { useState, useEffect } from 'react';
import {
  FaCog, FaVolumeUp, FaVolumeMute, FaBell, FaBellSlash,
} from 'react-icons/fa';
import notificationSound from 'utils/notificationSound';
import styles from 'styles/NotificationSettings.module.css';

const NotificationSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(notificationSound.isNotificationEnabled());
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(
    Notification.permission === 'granted',
  );

  useEffect(() => {
    if ('Notification' in window) {
      setBrowserNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    notificationSound.setEnabled(newValue);
    if (newValue) {
      notificationSound.playNotification();
    }
  };

  const handleBrowserNotificationToggle = async () => {
    if (!('Notification' in window)) {
      // eslint-disable-next-line no-alert
      alert('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      // Cannot revoke permission programmatically, inform user
      // eslint-disable-next-line no-alert
      alert('To disable browser notifications, please change it in your browser settings.');
    } else {
      const permission = await Notification.requestPermission();
      setBrowserNotificationsEnabled(permission === 'granted');
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.settingsButton}
        title="Notification Settings"
      >
        <FaCog />
      </button>

      {isOpen && (
        <div className={styles.settingsPanel}>
          <div className={styles.panelHeader}>
            <h3>Notification Settings</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              ×
            </button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              <span>Sound Notifications</span>
            </div>
            <button
              type="button"
              onClick={handleSoundToggle}
              className={`${styles.toggle} ${soundEnabled ? styles.active : ''}`}
              aria-label="Toggle sound notifications"
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              {browserNotificationsEnabled ? <FaBell /> : <FaBellSlash />}
              <span>Browser Notifications</span>
            </div>
            <button
              type="button"
              onClick={handleBrowserNotificationToggle}
              className={`${styles.toggle} ${browserNotificationsEnabled ? styles.active : ''}`}
              aria-label="Toggle browser notifications"
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>

          <div className={styles.settingInfo}>
            <p>
              Enable sound and browser notifications to get reminded
              about your tasks at the right time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
