import styles from 'styles/TodoItem.module.css';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';

const TodoItem = ({
  itemProp, index, onChange, deleteTodo, setUpdate, moveUp,
  moveDown, size,
}) => {
  const [editing, setEditing] = useState(false);

  const handleEditing = () => {
    setEditing(true);
  };

  const handleUpdatedDone = (event) => {
    if (event.key === 'Enter') {
      setEditing(false);
    }
  };

  const viewMode = {};
  const editMode = {};
  if (editing) {
    viewMode.display = 'none';
  } else {
    editMode.display = 'none';
  }

  const completedStyle = {
    fontStyle: 'italic',
    color: '#595959',
    opacity: 0.4,
    textDecoration: 'line-through',
  };

  return (
    <li className={styles.item}>
      <div className={styles.content} style={viewMode}>
        <input
          type="checkbox"
          checked={itemProp.completed}
          onChange={() => onChange(itemProp.id)}
          style={{ transform: 'scale(2)', color: 'green' }}
        />
        <button type="button" onClick={handleEditing}>
          <AiFillEdit style={{ color: 'blue', fontSize: '16px' }} />
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles['hide-on-mobile']}`}
          onClick={() => deleteTodo(itemProp.id)}
        >
          <FaTrash style={{ color: 'gray', fontSize: '16px' }} />
        </button>
        <div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => moveUp(index)}
              aria-label="Move up"
            >
              <GoChevronUp style={{ color: 'green', fontSize: '26px' }} />
            </button>
          )}
          {index < size - 1 && (
            <button
              type="button"
              onClick={() => moveDown(index)}
              aria-label="Move down"
            >
              <GoChevronDown style={{ color: 'red', fontSize: '26px' }} />
            </button>
          )}
        </div>
        <span style={itemProp.completed ? completedStyle : null}>
          {itemProp.title}
        </span>
      </div>
      <input
        style={editMode}
        type="text"
        value={itemProp.title}
        className={styles.textInput}
        onChange={(e) => setUpdate(e.target.value, itemProp.id)}
        onKeyDown={handleUpdatedDone}
      />
    </li>
  );
};

TodoItem.propTypes = {
  itemProp: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    completed: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  moveUp: PropTypes.func.isRequired,
  moveDown: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};
export default TodoItem;
