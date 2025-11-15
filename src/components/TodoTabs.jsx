import PropTypes from 'prop-types';
import styles from 'styles/TodoTabs.module.css';

const TodoTabs = ({
  activeCount, completedCount, calendarCount, activeTab, onTabChange,
}) => (
  <div className={styles.tabsContainer}>
    <button
      type="button"
      className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
      onClick={() => onTabChange('active')}
    >
      <span className={styles.tabLabel}>Active</span>
      <span className={styles.tabCount}>{activeCount}</span>
    </button>
    <button
      type="button"
      className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
      onClick={() => onTabChange('completed')}
    >
      <span className={styles.tabLabel}>Completed</span>
      <span className={styles.tabCount}>{completedCount}</span>
    </button>
    <button
      type="button"
      className={`${styles.tab} ${activeTab === 'calendar' ? styles.active : ''}`}
      onClick={() => onTabChange('calendar')}
    >
      <span className={styles.tabLabel}>Calendar</span>
      <span className={styles.tabCount}>{calendarCount}</span>
    </button>
  </div>
);

TodoTabs.propTypes = {
  activeCount: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
  calendarCount: PropTypes.number.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default TodoTabs;
