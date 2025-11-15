import { useState, useEffect, useRef } from 'react';
import CloudStorageService from '../firebase/cloudStorage';
import { toast } from 'react-toastify';

const useCloudStorage = (userId) => {
  const [todos, setTodos] = useState([]);
  const [comments, setComments] = useState({});
  const [reminders, setReminders] = useState({});
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const cloudServiceRef = useRef(null);
  const savingRef = useRef(false);

  // Initialize cloud service
  useEffect(() => {
    if (!cloudServiceRef.current) {
      cloudServiceRef.current = new CloudStorageService(userId || 'anonymous');
    }
  }, [userId]);

  // Update user ID when it changes
  useEffect(() => {
    if (cloudServiceRef.current && userId) {
      cloudServiceRef.current.setUserId(userId);
    }
  }, [userId]);

  // Load initial data from cloud
  useEffect(() => {
    const loadInitialData = async () => {
      if (!cloudServiceRef.current) return;

      try {
        const result = await cloudServiceRef.current.loadData();

        if (result.success && result.data) {
          setTodos(result.data.todos || []);
          setComments(result.data.comments || {});
          setReminders(result.data.reminders || {});
          setPoints(result.data.points || 0);
          toast.success('✅ Loaded from cloud', { autoClose: 2000 });
        }
      } catch (error) {
        toast.error(`❌ Failed to load: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [userId]);

  // Auto-save to cloud whenever data changes
  useEffect(() => {
    const saveToCloud = async () => {
      if (isLoading || savingRef.current || !cloudServiceRef.current) return;

      savingRef.current = true;

      try {
        await cloudServiceRef.current.saveAllData({
          todos,
          comments,
          reminders,
          points,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auto-save error:', error);
      } finally {
        savingRef.current = false;
      }
    };

    // Debounce auto-save by 1 second
    const timeoutId = setTimeout(saveToCloud, 1000);
    return () => clearTimeout(timeoutId);
  }, [todos, comments, reminders, points, isLoading]);

  return {
    todos,
    setTodos,
    comments,
    setComments,
    reminders,
    setReminders,
    points,
    setPoints,
    isLoading,
  };
};

export default useCloudStorage;
