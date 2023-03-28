import styles from 'styles/TodoItem.module.css';
import { useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";

const TodoItem = ({ itemProp, onChange, deleteTodo, setUpdate }) => {
  const [editing, setEditing] = useState(false);

  const handleEditing = () => {
    setEditing(true);
  };

  const handleUpdatedDone = (event) => {
    if (event.key === 'Enter') {
      setEditing(false);
    }
  };

  let viewMode = {};
  let editMode = {};
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
          onChange={() => onChange(itemProp.id)} />
        <button onClick={handleEditing}>
          <AiFillEdit style={{ color: "blue", fontSize: "16px" }}/>
        </button>
        <button
          className={styles.button}
          onClick={() => deleteTodo(itemProp.id)}
        ><FaTrash style={{ color: "red", fontSize: "16px" }} />
        </button>
        <span style={itemProp.completed ? completedStyle : null}>
          {itemProp.title}
        </span>
      </div>
      <input style={editMode}
        type="text"
        value={itemProp.title}
        className={styles.textInput}
        onChange={(e) => setUpdate(e.target.value, itemProp.id)}
        onKeyDown={handleUpdatedDone}
      />
    </li>
  );
};
export default TodoItem;
