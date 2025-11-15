import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  FaCloud, FaHdd, FaSync,
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

  const syncData = useCallback(async () => {
    if (syncLockRef.current || !cloudServiceRef.current) {
      return;
    }

    syncLockRef.current = true;
    setIsSyncing(true);

    try {
      // Step 1: Load data from cloud first
      const loadResult = await cloudServiceRef.current.loadData();

      const mergedData = {
        todos,
        comments,
        reminders,
        points,
      };

      // Step 2: Merge cloud data with local data if cloud has data
      if (loadResult.success && loadResult.data) {
        const cloudData = loadResult.data;

        // Merge todos: combine both, remove duplicates by id, keep local version if duplicate
        const localTodoIds = new Set(todos.map((t) => t.id));
        const cloudTodos = cloudData.todos || [];
        const newCloudTodos = cloudTodos.filter((t) => !localTodoIds.has(t.id));
        mergedData.todos = [...todos, ...newCloudTodos];

        // Merge comments: combine both objects
        mergedData.comments = { ...(cloudData.comments || {}), ...comments };

        // Merge reminders: combine both objects
        mergedData.reminders = { ...(cloudData.reminders || {}), ...reminders };

        // Keep the higher points value
        mergedData.points = Math.max(points, cloudData.points || 0);
      }

      // Step 3: Save merged data back to cloud
      const saveResult = await cloudServiceRef.current.saveAllData(mergedData);

      if (!saveResult.success) {
        toast.error('❌ Failed to sync to cloud');
        return;
      }

      // Step 4: Update local state with merged data
      onDataLoaded(mergedData);

      toast.success('✅ Synced with cloud', { autoClose: 2000 });
    } catch (error) {
      toast.error(`❌ Sync error: ${error.message}`);
    } finally {
      setIsSyncing(false);
      syncLockRef.current = false;
    }
  }, [todos, comments, reminders, points, onDataLoaded]);

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
            onClick={syncData}
            disabled={isSyncing}
            className={styles.syncButton}
            aria-label="Sync with cloud"
          >
            <FaSync className={isSyncing ? styles.spinning : ''} />
            {' '}
            {isSyncing ? 'Syncing...' : 'Sync'}
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
