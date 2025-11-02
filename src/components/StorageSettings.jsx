import { useState, useEffect } from 'react';
import { FaHdd } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from 'styles/StorageSettings.module.css';
// import CloudStorageService from '../firebase/cloudStorage';

const StorageSettings = () => {
  // Props removed - cloud storage disabled
  // todos, comments, reminders, points, onDataLoaded, userId
  const [storageMode, setStorageMode] = useState('local');
  // DISABLED: Cloud storage functionality removed due to crashes
  // const [isSyncing, setIsSyncing] = useState(false);
  // const [cloudService] = useState(new CloudStorageService());
  // const [lastSyncTime, setLastSyncTime] = useState(null);

  // Update cloud service user ID when it changes
  // useEffect(() => {
  //   if (userId) {
  //     cloudService.setUserId(userId);
  //   }
  // }, [userId, cloudService]);

  // Ensure local storage mode on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('storageMode');
    // Force local mode, ignore any saved cloud preference
    if (savedMode !== 'local') {
      localStorage.setItem('storageMode', 'local');
      setStorageMode('local');
    }
  }, []);

  const handleStorageModeChange = (mode) => {
    // Only allow local mode
    if (mode !== 'local') {
      toast.warning('⚠️ Cloud storage is temporarily disabled');
      return;
    }
    setStorageMode('local');
    localStorage.setItem('storageMode', 'local');
    toast.info('💾 Using local storage');
  };

  // Removed: Auto-sync useEffect - cloud storage disabled

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

        {/* DISABLED: Cloud storage causing crashes */}
        {/* <button
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
        )} */}
      </div>
    </div>
  );
};

// No PropTypes needed - cloud storage disabled

export default StorageSettings;
