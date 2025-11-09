import InputTodo from 'components/InputTodo';
import TodosList from 'components/TodosList';
import TodoTabs from 'components/TodoTabs';
import Pagination from 'components/Pagination';
import SearchBar from 'components/SearchBar';
import StorageSettings from 'components/StorageSettings';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify';
import notificationSound from 'utils/notificationSound';
import 'react-toastify/dist/ReactToastify.css';

const TodosLogic = ({
  currentPage, todosPerPage, onPageChange, currentUser,
}) => {
  const getInitialTodos = () => {
    const temp = localStorage.getItem('todos');
    const savedTodos = JSON.parse(temp);
    return savedTodos || [];
  };

  const getInitialComments = (todos) => {
    const temp = localStorage.getItem('comments');
    const savedComments = JSON.parse(temp);
    if (savedComments) {
      return savedComments;
    }
    const initialComments = {};
    todos.forEach((todo) => {
      initialComments[todo.id] = '';
    });
    return initialComments;
  };

  const getInitialPoints = () => {
    const temp = localStorage.getItem('points');
    const savedPoints = JSON.parse(temp);
    return savedPoints || 0;
  };

  const [todos, setTodos] = useState(getInitialTodos());
  const [comments, setComments] = useState(getInitialComments(getInitialTodos()));
  const [points, setPoints] = useState(getInitialPoints());
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const getInitialReminders = () => {
    const temp = localStorage.getItem('reminders');
    const savedReminders = JSON.parse(temp);
    return savedReminders || {};
  };

  const [reminders, setReminders] = useState(getInitialReminders());
  const [notifiedReminders, setNotifiedReminders] = useState(new Set());

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
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

  const showBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
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
    }
  };

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

  const setUpdate = (updatedTitle, id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return ({ ...todo, title: updatedTitle });
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
    const temp = JSON.stringify(todos);
    localStorage.setItem('todos', temp);
    const tempComments = JSON.stringify(comments);
    localStorage.setItem('comments', tempComments);
    const tempPoints = JSON.stringify(points);
    localStorage.setItem('points', tempPoints);
    const tempReminders = JSON.stringify(reminders);
    localStorage.setItem('reminders', tempReminders);
  }, [todos, comments, points, reminders]);

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
  }, [todos, reminders, notifiedReminders]);

  // Filter todos based on active tab
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const filteredByTab = activeTab === 'active' ? activeTodos : completedTodos;

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

  // Handle data loaded from cloud storage
  const handleDataLoaded = useCallback((data) => {
    if (data.todos) setTodos(data.todos);
    if (data.comments) setComments(data.comments);
    if (data.reminders) setReminders(data.reminders);
    if (data.points !== undefined) setPoints(data.points);
  }, []); // No dependencies - setters are stable

  // Get user ID for cloud storage (email or anonymous)
  const userId = currentUser ? currentUser.email : 'anonymous';

  return (
    <>
      <ToastContainer />
      {/* Compact header row: Storage and Search */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}
      >
        <StorageSettings
          todos={todos}
          comments={comments}
          reminders={reminders}
          points={points}
          onDataLoaded={handleDataLoaded}
          userId={userId}
        />
        <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <InputTodo addTodo={addTodo} />
      <TodoTabs
        activeCount={activeTodos.length}
        completedCount={completedTodos.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
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
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
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
