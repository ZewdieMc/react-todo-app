import InputTodo from 'components/InputTodo';
import TodosList from 'components/TodosList';
import TodoTabs from 'components/TodoTabs';
import Pagination from 'components/Pagination';
import SearchBar from 'components/SearchBar';
import CalendarView from 'components/CalendarView';
import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify';
import notificationSound from 'utils/notificationSound';
import CloudStorageService from '../firebase/cloudStorage';
import SharedListsService from '../firebase/sharedListsService';
import SharedListsPanel from './SharedListsPanel';
import 'react-toastify/dist/ReactToastify.css';

const TodosLogic = ({
  currentPage, todosPerPage, onPageChange, currentUser,
}) => {
  const [todos, setTodos] = useState([]);
  const [comments, setComments] = useState({});
  const [points, setPoints] = useState(0);
  const [reminders, setReminders] = useState({});
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifiedReminders, setNotifiedReminders] = useState(new Set());
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(true);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // Shared lists state
  const [activeList, setActiveList] = useState({ id: 'personal', name: 'My Tasks', type: 'personal' });
  const [listMembers, setListMembers] = useState([]);

  const cloudServiceRef = useRef(null);
  const sharedListsServiceRef = useRef(null);
  const savingToCloudRef = useRef(false);
  const sharedListUnsubscribeRef = useRef(null);
  const pendingLocalChangesRef = useRef(false);

  // State for member details (email -> displayName mapping)
  const [memberDetails, setMemberDetails] = useState({});

  // Initialize cloud service
  useEffect(() => {
    if (!cloudServiceRef.current) {
      cloudServiceRef.current = new CloudStorageService('anonymous');
    }
    if (!sharedListsServiceRef.current && currentUser?.email) {
      sharedListsServiceRef.current = new SharedListsService(
        currentUser.email,
        currentUser.displayName,
      );
    } else if (sharedListsServiceRef.current && currentUser?.displayName) {
      sharedListsServiceRef.current.setUserDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  // Load initial data from cloud - runs on mount and when user or active list changes
  useEffect(() => {
    const loadData = async () => {
      // Cleanup previous shared list subscription
      if (sharedListUnsubscribeRef.current) {
        sharedListUnsubscribeRef.current();
        sharedListUnsubscribeRef.current = null;
      }

      setIsLoadingFromCloud(true);
      setHasLoadedInitialData(false);

      // If it's a shared list, subscribe to it
      if (activeList.type === 'shared' && sharedListsServiceRef.current) {
        // Update current user's display name in the list
        sharedListsServiceRef.current.updateMyDisplayName(activeList.id);

        // Track if we've received initial data for this list
        let receivedInitialData = false;

        sharedListUnsubscribeRef.current = sharedListsServiceRef.current.subscribeToList(
          activeList.id,
          (result) => {
            // On first load, always accept the data
            // Only skip if we have pending local changes AND already received initial data
            if (pendingLocalChangesRef.current && receivedInitialData) {
              // eslint-disable-next-line no-console
              console.log('Skipping subscription update: pending local changes');
              return;
            }
            if (result.success && result.data) {
              setTodos(result.data.todos || []);
              setComments(result.data.comments || {});
              setReminders(result.data.reminders || {});
              setListMembers(result.data.members || []);
              setMemberDetails(result.data.memberDetails || {});
              // Points are personal, not shared
              receivedInitialData = true;
            }
            setHasLoadedInitialData(true);
            setIsLoadingFromCloud(false);
          },
        );
        return;
      }

      // Personal list - clear members
      setListMembers([]);
      setMemberDetails({});

      // Personal list - use cloud storage service
      if (!cloudServiceRef.current) {
        setIsLoadingFromCloud(false);
        return;
      }

      // Update user ID in cloud service
      const userId = currentUser?.email || 'anonymous';
      cloudServiceRef.current.setUserId(userId);

      try {
        const result = await cloudServiceRef.current.loadData();

        if (result.success && result.data) {
          setTodos(result.data.todos || []);
          setComments(result.data.comments || {});
          setReminders(result.data.reminders || {});
          setPoints(result.data.points || 0);
        }
        // Mark that we have successfully loaded initial data
        setHasLoadedInitialData(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load from cloud:', error);
        // Don't allow saving if we failed to load - this prevents data loss
      } finally {
        setIsLoadingFromCloud(false);
      }
    };

    loadData();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (sharedListUnsubscribeRef.current) {
        sharedListUnsubscribeRef.current();
      }
    };
  }, [currentUser, activeList]);

  // Request notification permission on mount (with error handling for mobile)
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch((error) => {
        // Silently fail on mobile browsers that don't support this
        // eslint-disable-next-line no-console
        console.log('Notification permission request not supported:', error);
      });
    }
  }, []);

  const handleSaveReminder = (todoId, reminderTime) => {
    setReminders((prev) => ({
      ...prev,
      [todoId]: reminderTime,
    }));
  };

  const getReminderMilliseconds = (reminderType) => {
    const timeMap = {
      '5-min': 5 * 60 * 1000,
      '15-min': 15 * 60 * 1000,
      '30-min': 30 * 60 * 1000,
      '1-hour': 60 * 60 * 1000,
      '2-hour': 2 * 60 * 60 * 1000,
      '1-day': 24 * 60 * 60 * 1000,
      '2-day': 2 * 24 * 60 * 60 * 1000,
      '1-week': 7 * 24 * 60 * 60 * 1000,
    };
    return timeMap[reminderType] || 0;
  };

  const showBrowserNotification = useCallback((title, body) => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      // Fallback: show toast notification instead
      toast.info(`🔔 ${title}: ${body}`, { autoClose: 5000 });
      return;
    }

    try {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'todo-reminder',
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } else if (Notification.permission !== 'denied') {
        // Request permission if not denied
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            showBrowserNotification(title, body);
          } else {
            // Fallback to toast if permission denied
            toast.info(`🔔 ${title}: ${body}`, { autoClose: 5000 });
          }
        }).catch(() => {
          // If request fails (mobile browsers), use toast
          toast.info(`🔔 ${title}: ${body}`, { autoClose: 5000 });
        });
      } else {
        // Permission denied - use toast
        toast.info(`🔔 ${title}: ${body}`, { autoClose: 5000 });
      }
    } catch (error) {
      // Any error - fallback to toast
      // eslint-disable-next-line no-console
      console.error('Notification error:', error);
      toast.info(`🔔 ${title}: ${body}`, { autoClose: 5000 });
    }
  }, []);

  const handleChange = (id) => {
    setTodos((prevState) => prevState.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };
        if (updatedTodo.completed) {
          setPoints((prevPoints) => prevPoints + 10); // Add points for completing a task
          notificationSound.playSuccess(); // Play success sound
        } else {
          setPoints((prevPoints) => prevPoints - 10); // Remove points for uncompleting a task
        }
        return updatedTodo;
      }
      return todo;
    }));
  };

  const handleCommentChange = (id, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [id]: comment,
    }));
  };

  const deleteTodo = (id) => {
    setTodos(
      [...todos.filter((todo) => todo.id !== id)],
    );
    setReminders((prev) => {
      const newReminders = { ...prev };
      delete newReminders[id];
      return newReminders;
    });
  };

  const addTodo = (title, dueDate) => {
    const newTodo = {
      id: uuidv4(),
      title,
      dueDate,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setComments((prevComments) => ({
      ...prevComments,
      [newTodo.id]: '',
    }));
  };

  const setUpdate = (updatedTitle, id, updatedDueDate) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const updates = { ...todo, title: updatedTitle };
          if (updatedDueDate !== undefined) {
            updates.dueDate = updatedDueDate;
          }
          return updates;
        }
        return todo;
      }),
    );
  };

  const handleAssign = (todoId, assignee) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, assignedTo: assignee };
        }
        return todo;
      }),
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTodos = Array.from(todos);
    const [removed] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, removed);

    setTodos(reorderedTodos);
  };

  useEffect(() => {
    // Mark that we have pending local changes as soon as state changes
    if (hasLoadedInitialData && activeList.type === 'shared') {
      pendingLocalChangesRef.current = true;
    }

    const saveToCloud = async () => {
      // CRITICAL: Don't save until we have successfully loaded initial data
      // This prevents overwriting cloud data with empty state during initialization
      if (!hasLoadedInitialData) {
        // eslint-disable-next-line no-console
        console.log('Skipping save: initial data not loaded yet');
        return;
      }

      if (isLoadingFromCloud || savingToCloudRef.current) return;

      savingToCloudRef.current = true;

      try {
        // Save to shared list or personal list based on active list
        if (activeList.type === 'shared' && sharedListsServiceRef.current) {
          await sharedListsServiceRef.current.saveListTodos(activeList.id, todos);
          await sharedListsServiceRef.current.saveListComments(activeList.id, comments);
          await sharedListsServiceRef.current.saveListReminders(activeList.id, reminders);
        } else if (cloudServiceRef.current) {
          await cloudServiceRef.current.saveAllData({
            todos,
            comments,
            reminders,
            points,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auto-save error:', error);
      } finally {
        savingToCloudRef.current = false;
        // Clear the pending changes flag after save completes
        // Use a small delay to allow Firestore to propagate the update
        setTimeout(() => {
          pendingLocalChangesRef.current = false;
        }, 500);
      }
    };

    // Debounce auto-save by 1 second
    const timeoutId = setTimeout(saveToCloud, 1000);
    return () => clearTimeout(timeoutId);
  }, [todos, comments, points, reminders, isLoadingFromCloud, hasLoadedInitialData, activeList]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      todos.forEach((todo) => {
        if (!todo.dueDate || todo.completed) return;

        const dueDate = new Date(todo.dueDate);
        const reminderSetting = reminders[todo.id] || 'none';

        if (reminderSetting === 'none') return;

        const reminderMs = getReminderMilliseconds(reminderSetting);
        const reminderTime = new Date(dueDate.getTime() - reminderMs);
        const notificationKey = `${todo.id}-${reminderSetting}`;

        // Check if reminder time has passed and we haven't notified yet
        if (now >= reminderTime && !notifiedReminders.has(notificationKey)) {
          const plainTextTitle = DOMPurify.sanitize(todo.title, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
          });

          const timeUntilDue = Math.ceil((dueDate - now) / (1000 * 60)); // minutes

          let message;
          if (timeUntilDue > 0) {
            const hours = Math.floor(timeUntilDue / 60);
            const minutes = timeUntilDue % 60;
            const timeString = hours > 0
              ? `${hours}h ${minutes}m`
              : `${minutes}m`;

            message = `⏰ Reminder: "${plainTextTitle}" is due in ${timeString}!`;
            toast.info(message, {
              autoClose: 8000,
            });
          } else {
            message = `⚠️ Task "${plainTextTitle}" is overdue!`;
            toast.warn(message, {
              autoClose: 8000,
            });
          }

          // Play notification sound
          notificationSound.playNotification();

          // Show browser notification
          showBrowserNotification('Todo Reminder', message);

          setNotifiedReminders((prev) => new Set([...prev, notificationKey]));
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately on mount

    return () => clearInterval(intervalId);
  }, [todos, reminders, notifiedReminders, showBrowserNotification]);

  // Filter todos based on active tab
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const calendarTodos = todos.filter((todo) => todo.dueDate);

  let filteredByTab;
  if (activeTab === 'active') {
    filteredByTab = activeTodos;
  } else if (activeTab === 'completed') {
    filteredByTab = completedTodos;
  } else {
    filteredByTab = calendarTodos;
  }

  // Further filter by search term
  const displayedTodos = filteredByTab.filter((todo) => {
    if (!searchTerm) return true;

    const plainTextTitle = DOMPurify.sanitize(todo.title, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).toLowerCase();

    const comment = comments[todo.id] || '';
    const plainTextComment = DOMPurify.sanitize(comment, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).toLowerCase();

    return plainTextTitle.includes(searchTerm.toLowerCase())
      || plainTextComment.includes(searchTerm.toLowerCase());
  });

  // Calculate the total number of pages based on filtered todos
  const totalPages = Math.ceil(displayedTodos.length / todosPerPage);

  const moveUp = (index) => {
    const globalIndex = (currentPage - 1) * todosPerPage + index;
    if (globalIndex > 0) {
      const currentTodo = displayedTodos[globalIndex];
      const previousTodo = displayedTodos[globalIndex - 1];

      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        const currentIdx = newTodos.findIndex((t) => t.id === currentTodo.id);
        const previousIdx = newTodos.findIndex((t) => t.id === previousTodo.id);
        [newTodos[previousIdx], newTodos[currentIdx]] = [
          newTodos[currentIdx], newTodos[previousIdx],
        ];
        return newTodos;
      });
      if (index === 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  };

  const moveDown = (index) => {
    const globalIndex = (currentPage - 1) * todosPerPage + index;
    if (globalIndex < displayedTodos.length - 1) {
      const currentTodo = displayedTodos[globalIndex];
      const nextTodo = displayedTodos[globalIndex + 1];

      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        const currentIdx = newTodos.findIndex((t) => t.id === currentTodo.id);
        const nextIdx = newTodos.findIndex((t) => t.id === nextTodo.id);
        [newTodos[nextIdx], newTodos[currentIdx]] = [
          newTodos[currentIdx], newTodos[nextIdx],
        ];
        return newTodos;
      });
      if (index === todosPerPage - 1 && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }
  };

  // Calculate the current todos to display
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = displayedTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onPageChange(1); // Reset to first page when switching tabs
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    onPageChange(1); // Reset to first page when searching
  };

  // Handle list selection
  const handleListSelect = (list) => {
    setActiveList(list);
    onPageChange(1); // Reset to first page when switching lists
    setActiveTab('active'); // Reset to active tab
  };

  return (
    <>
      <ToastContainer />

      {/* Shared Lists Panel - only show when logged in */}
      {currentUser && (
        <SharedListsPanel
          currentUser={currentUser}
          activeList={activeList}
          onListSelect={handleListSelect}
        />
      )}

      {/* Current List Indicator */}
      {activeList.type === 'shared' && (
        <div style={{
          padding: '8px 16px',
          background: '#fff5f5',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#dc4c3e',
          fontWeight: 500,
        }}
        >
          📋 Viewing:
          {' '}
          <strong>{activeList.name}</strong>
          {' '}
          (Shared List)
        </div>
      )}

      {/* Search Bar */}
      <div style={{
        marginBottom: '1rem',
      }}
      >
        <SearchBar onSearch={handleSearch} />
      </div>
      <InputTodo addTodo={addTodo} />
      <TodoTabs
        activeCount={activeTodos.length}
        completedCount={completedTodos.length}
        calendarCount={calendarTodos.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {activeTab === 'calendar' ? (
        <CalendarView
          todos={todos}
          comments={comments}
        />
      ) : (
        <>
          <TodosList
            todosProps={currentTodos}
            handleChange={handleChange}
            deleteTodo={deleteTodo}
            setUpdate={setUpdate}
            moveUp={moveUp}
            moveDown={moveDown}
            comments={comments}
            handleCommentChange={handleCommentChange}
            activeCommentId={activeCommentId}
            setActiveCommentId={setActiveCommentId}
            currentPage={currentPage}
            totalPages={totalPages}
            onDragEnd={onDragEnd}
            reminders={reminders}
            handleSaveReminder={handleSaveReminder}
            listMembers={listMembers}
            memberDetails={memberDetails}
            onAssign={handleAssign}
            isSharedList={activeList.type === 'shared'}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </>
  );
};

TodosLogic.propTypes = {
  currentPage: PropTypes.number.isRequired,
  todosPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

TodosLogic.defaultProps = {
  currentUser: null,
};

export default TodosLogic;
