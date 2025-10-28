import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaCloud, FaHdd, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from 'styles/StorageSettings.module.css';
import CloudStorageService from '../firebase/cloudStorage';

const StorageSettings = ({
  todos,
  comments,
  reminders,
  points,
  onDataLoaded,
  userId,
}) => {
  const [storageMode, setStorageMode] = useState('local');
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudService] = useState(new CloudStorageService());
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Update cloud service user ID when it changes
  useEffect(() => {
    if (userId) {
      cloudService.setUserId(userId);
    }
  }, [userId, cloudService]);

  const loadFromCloud = useCallback(async () => {
    setIsSyncing(true);
    const result = await cloudService.loadData();

    if (result.success && result.data) {
      onDataLoaded(result.data);
      setLastSyncTime(new Date());
      // Silent sync - no toast
    } else if (result.success && !result.data) {
      // No data found - silent
    } else {
      toast.error('❌ Failed to load from cloud');
    }
    setIsSyncing(false);
  }, [cloudService, onDataLoaded]);

  const saveToCloud = useCallback(async () => {
    setIsSyncing(true);
    const result = await cloudService.saveAllData({
      todos,
      comments,
      reminders,
      points,
    });

    if (result.success) {
      setLastSyncTime(new Date());
      // Silent sync - no toast
    } else {
      toast.error('❌ Failed to save to cloud');
    }
    setIsSyncing(false);
  }, [cloudService, todos, comments, reminders, points]);

  useEffect(() => {
    const savedMode = localStorage.getItem('storageMode') || 'local';
    setStorageMode(savedMode);

    if (savedMode === 'cloud') {
      // Load from cloud on mount
      loadFromCloud();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleStorageModeChange = async (mode) => {
    setStorageMode(mode);
    localStorage.setItem('storageMode', mode);

    if (mode === 'cloud') {
      // Save current data to cloud when switching
      if (todos.length > 0 || Object.keys(comments).length > 0) {
        await saveToCloud();
        toast.success('☁️ Cloud sync enabled');
      } else {
        // Try to load existing cloud data
        await loadFromCloud();
      }
    } else {
      toast.info('� Using local storage');
    }
  };

  // Auto-sync when storage mode is cloud - debounced
  useEffect(() => {
    if (storageMode === 'cloud') {
      const timer = setTimeout(() => {
        saveToCloud();
      }, 2000); // Debounce saves by 2 seconds

      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, comments, reminders, points, storageMode]);

  return (
    <div className={styles.storageContainer}>
      <div className={styles.storageOptions}>
        <button
          type="button"
          className={`${styles.storageButton} ${storageMode === 'local' ? styles.active : ''}`}
          onClick={() => handleStorageModeChange('local')}
          title="Store locally in browser"
        >
          <FaHdd />
          <span>Local</span>
        </button>

        <button
          type="button"
          className={`${styles.storageButton} ${storageMode === 'cloud' ? styles.active : ''}`}
          onClick={() => handleStorageModeChange('cloud')}
          title="Store in cloud (access anywhere)"
        >
          <FaCloud />
          <span>Cloud</span>
        </button>

        {storageMode === 'cloud' && (
          <button
            type="button"
            className={styles.syncButton}
            onClick={saveToCloud}
            disabled={isSyncing}
            title="Sync now"
          >
            <FaSync className={isSyncing ? styles.spinning : ''} />
          </button>
        )}
      </div>

      {storageMode === 'cloud' && lastSyncTime && (
        <div className={styles.syncInfo}>
          Last synced:
          {' '}
          {lastSyncTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

StorageSettings.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  comments: PropTypes.shape({}).isRequired,
  reminders: PropTypes.shape({}).isRequired,
  points: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

StorageSettings.defaultProps = {
  userId: 'anonymous',
};

export default StorageSettings;
