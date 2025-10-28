import { FaCheckCircle } from 'react-icons/fa';
import styles from 'styles/Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <FaCheckCircle className={styles.icon} />
      <h1 className={styles.title}>My Tasks</h1>
    </div>
    <p className={styles.subtitle}>Stay organized and productive with smart reminders</p>
  </header>
);

export default Header;
