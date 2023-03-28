import { useState, useEffect, useRef } from 'react';
import styles from 'styles/Navbar.module.css';

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', handler);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
    };
  }, [dropdown]);
  return (
    <nav className={styles.nav}>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li ref={ref}>
          <button type="button" onClick={() => setDropdown(!dropdown)}>
            Services
            {' '}
            <span>&#8595;</span>
          </button>
          {dropdown && (
          <ul>
            <li>Design</li>
            <li>Development</li>
          </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
