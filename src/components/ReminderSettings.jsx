import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import styles from 'styles/ReminderSettings.module.css';

const ReminderSettings = ({ todoId, reminder, onSaveReminder }) => {
  const [reminderTime, setReminderTime] = useState(reminder || 'none');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const reminderOptions = [
    { value: 'none', label: 'No reminder', icon: '🔕' },
    { value: '5-min', label: '5 minutes before', icon: '⏰' },
    { value: '15-min', label: '15 minutes before', icon: '⏰' },
    { value: '30-min', label: '30 minutes before', icon: '⏰' },
    { value: '1-hour', label: '1 hour before', icon: '⏰' },
    { value: '2-hour', label: '2 hours before', icon: '⏰' },
    { value: '1-day', label: '1 day before', icon: '📅' },
    { value: '2-day', label: '2 days before', icon: '📅' },
    { value: '1-week', label: '1 week before', icon: '📅' },
  ];

  const handleOptionClick = (value) => {
    setReminderTime(value);
    onSaveReminder(todoId, value);
    setIsOpen(false);
  };

  const currentLabel = reminderOptions.find((opt) => opt.value === reminderTime)?.label || 'No reminder';
  const hasReminder = reminderTime !== 'none';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.reminderContainer} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.reminderButton} ${hasReminder ? styles.active : ''}`}
        title={currentLabel}
      >
        {hasReminder ? <FaBell /> : <FaBellSlash />}
      </button>
      {isOpen && (
        <div className={styles.reminderDropdown}>
          <div className={styles.dropdownHeader}>
            <span>Set Reminder</span>
          </div>
          <div className={styles.reminderOptions}>
            {reminderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={`${styles.reminderOption} ${
                  reminderTime === option.value ? styles.selected : ''
                }`}
              >
                <span className={styles.optionIcon}>{option.icon}</span>
                <span className={styles.optionLabel}>{option.label}</span>
                {reminderTime === option.value && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ReminderSettings.propTypes = {
  todoId: PropTypes.string.isRequired,
  reminder: PropTypes.string,
  onSaveReminder: PropTypes.func.isRequired,
};

ReminderSettings.defaultProps = {
  reminder: '1-hour',
};

export default ReminderSettings;
