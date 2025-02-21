import { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const InputTodo = ({ addTodo }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo(title, dueDate);
      setMessage('');
      setTitle('');
      setDueDate('');
    } else setMessage('Please add an item.');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          className="input-text"
          placeholder="Insert todo here..."
          value={title}
          onChange={handleChange}
        />
        <input
          type="date"
          className="input-date"
          value={dueDate}
          onChange={handleDateChange}
        />
        <button type="submit" className="input-submit">
          <FaPlusCircle
            style={{
              color: 'green',
              fontSize: '20px',
              marginTop: '2px',
            }}
          />
        </button>
      </form>
      <span className="submit-warning">{message}</span>
    </>
  );
};

InputTodo.propTypes = { addTodo: PropTypes.func.isRequired };
export default InputTodo;
