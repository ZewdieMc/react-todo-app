import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import styles from 'styles/EventDetailModal.module.css';

const EventDetailModal = ({ event, onClose, comments }) => {
  if (!event) return null;

  const { resource } = event;
  const plainTextTitle = DOMPurify.sanitize(resource.title, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  const comment = comments[resource.id] || '';
  const plainTextComment = DOMPurify.sanitize(comment, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  const formatDate = (date) => {
    if (!date) return 'No due date';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isOverdue = () => {
    if (!resource.dueDate || resource.completed) return false;
    return new Date(resource.dueDate) < new Date();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} role="presentation">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Task Details</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.section}>
            <div className={styles.statusBadge}>
              {resource.completed && (
                <span className={styles.completedBadge}>✓ Completed</span>
              )}
              {!resource.completed && isOverdue() && (
                <span className={styles.overdueBadge}>⚠ Overdue</span>
              )}
              {!resource.completed && !isOverdue() && (
                <span className={styles.activeBadge}>● Active</span>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Title</div>
            <div className={styles.taskTitle}>{plainTextTitle}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Due Date</div>
            <div className={styles.dueDate}>
              {formatDate(resource.dueDate)}
            </div>
          </div>

          {plainTextComment && (
            <div className={styles.section}>
              <div className={styles.label}>Comments</div>
              <div className={styles.comment}>{plainTextComment}</div>
            </div>
          )}

          {!plainTextComment && (
            <div className={styles.section}>
              <div className={styles.label}>Comments</div>
              <div className={styles.noComment}>No comments yet</div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.closeButtonBottom}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

EventDetailModal.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    resource: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      completed: PropTypes.bool.isRequired,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  comments: PropTypes.objectOf(PropTypes.string).isRequired,
};

EventDetailModal.defaultProps = {
  event: null,
};

export default EventDetailModal;
