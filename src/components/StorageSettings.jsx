import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  FaCloud, FaHdd, FaDownload, FaUpload,
} from 'react-icons/fa';
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
  const cloudServiceRef = useRef(null);
  const syncLockRef = useRef(false);

  // Initialize cloud service ONCE on mount
  useEffect(() => {
    if (!cloudServiceRef.current) {
      cloudServiceRef.current = new CloudStorageService('anonymous');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once

  // Update user ID when it changes (don't recreate service)
  useEffect(() => {
    if (cloudServiceRef.current && userId) {
      cloudServiceRef.current.setUserId(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Only userId in deps

  // Auto-load from cloud when switching to cloud mode or on mount
  useEffect(() => {
    const autoLoadFromCloud = async () => {
      if (storageMode === 'cloud' && cloudServiceRef.current && !syncLockRef.current) {
        syncLockRef.current = true;
        setIsSyncing(true);

        try {
          const result = await cloudServiceRef.current.loadData();

          if (result.success && result.data) {
            onDataLoaded(result.data);
            toast.success('✅ Loaded from cloud', { autoClose: 2000 });
          } else if (result.success && !result.data) {
            toast.info('ℹ️ No cloud data found', { autoClose: 2000 });
          }
        } catch (error) {
          toast.error(`❌ Auto-load error: ${error.message}`);
        } finally {
          setIsSyncing(false);
          syncLockRef.current = false;
        }
      }
    };

    autoLoadFromCloud();
  }, [storageMode, onDataLoaded]);

  const loadFromCloud = useCallback(async () => {
    if (syncLockRef.current || !cloudServiceRef.current) {
      return;
    }

    syncLockRef.current = true;
    setIsSyncing(true);

    try {
      const result = await cloudServiceRef.current.loadData();

      if (result.success && result.data) {
        onDataLoaded(result.data);
        toast.success('✅ Loaded from cloud', { autoClose: 2000 });
      } else if (result.success && !result.data) {
        toast.info('ℹ️ No cloud data found', { autoClose: 2000 });
      } else {
        toast.error('❌ Failed to load from cloud');
      }
    } catch (error) {
      toast.error(`❌ Load error: ${error.message}`);
    } finally {
      setIsSyncing(false);
      syncLockRef.current = false;
    }
  }, [onDataLoaded]);

  const saveToCloud = useCallback(async () => {
    if (syncLockRef.current || !cloudServiceRef.current) {
      return;
    }

    syncLockRef.current = true;
    setIsSyncing(true);

    try {
      const result = await cloudServiceRef.current.saveAllData({
        todos,
        comments,
        reminders,
        points,
      });

      if (result.success) {
        toast.success('✅ Saved to cloud', { autoClose: 2000 });
      } else {
        toast.error('❌ Failed to save to cloud');
      }
    } catch (error) {
      toast.error(`❌ Save error: ${error.message}`);
    } finally {
      setIsSyncing(false);
      syncLockRef.current = false;
    }
  }, [todos, comments, reminders, points]);

  return (
    <div className={styles.storageSettings}>
      <div className={styles.modeButtons}>
        <button
          type="button"
          onClick={() => {
            setStorageMode('local');
            toast.info('💾 Using local storage', { autoClose: 2000 });
          }}
          className={storageMode === 'local' ? styles.active : ''}
          aria-label="Use local storage"
        >
          <FaHdd />
          {' '}
          Local
        </button>
        <button
          type="button"
          onClick={() => {
            setStorageMode('cloud');
            toast.info('☁️ Cloud mode - Use buttons to sync', { autoClose: 2000 });
          }}
          className={storageMode === 'cloud' ? styles.active : ''}
          aria-label="Use cloud storage"
        >
          <FaCloud />
          {' '}
          Cloud
        </button>
      </div>

      {storageMode === 'cloud' && (
        <div className={styles.syncButtons}>
          <button
            type="button"
            onClick={loadFromCloud}
            disabled={isSyncing}
            className={styles.loadButton}
            aria-label="Load from cloud"
          >
            <FaDownload />
            {' '}
            {isSyncing ? 'Loading...' : 'Load'}
          </button>
          <button
            type="button"
            onClick={saveToCloud}
            disabled={isSyncing}
            className={styles.saveButton}
            aria-label="Save to cloud"
          >
            <FaUpload />
            {' '}
            {isSyncing ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

StorageSettings.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.objectOf(PropTypes.array).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  reminders: PropTypes.objectOf(PropTypes.object).isRequired,
  points: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default StorageSettings;
