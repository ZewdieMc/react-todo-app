import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import EventDetailModal from 'components/EventDetailModal';
import CalendarImport from 'components/CalendarImport';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from 'styles/CalendarView.module.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({
  todos, comments, onImportEvents,
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const truncateText = (text, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const events = todos
    .filter((todo) => todo.dueDate)
    .map((todo) => {
      const plainTextTitle = DOMPurify.sanitize(todo.title, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });

      return {
        id: todo.id,
        title: truncateText(plainTextTitle),
        fullTitle: plainTextTitle,
        start: new Date(todo.dueDate),
        end: new Date(todo.dueDate),
        resource: todo,
        completed: todo.completed,
      };
    });

  const eventStyleGetter = (event) => {
    const now = new Date();
    const isOverdue = event.start < now && !event.completed;

    let backgroundColor;

    if (event.completed) {
      backgroundColor = '#25b84c'; // Green for completed
    } else if (isOverdue) {
      backgroundColor = '#e74c3c'; // Red for overdue
    } else {
      backgroundColor = '#f39c12'; // Yellow/Orange for active (not overdue)
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: event.completed ? 0.6 : 1,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <CalendarImport onImport={onImportEvents} />
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        popup
        tooltipAccessor={(event) => `${event.fullTitle}${event.completed ? ' ✓' : ''}`}
      />
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.active}`} />
          <span>Active</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.overdue}`} />
          <span>Overdue</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.completed}`} />
          <span>Completed</span>
        </div>
      </div>
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          comments={comments}
        />
      )}
    </div>
  );
};

CalendarView.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      completed: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  comments: PropTypes.objectOf(PropTypes.string).isRequired,
  onImportEvents: PropTypes.func.isRequired,
};

CalendarView.defaultProps = {};

export default CalendarView;
