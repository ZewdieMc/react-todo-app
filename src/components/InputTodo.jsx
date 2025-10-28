import { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const InputTodo = ({ addTodo }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo(title, dueDate ? dueDate.toISOString() : null);
      setMessage('');
      setTitle('');
      setDueDate(null);
    } else setMessage('Please add an item.');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          className="input-text"
          placeholder="Add a task... (e.g., 'Buy groceries')"
          value={title}
          onChange={handleChange}
        />
        <DatePicker
          selected={dueDate}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMM d, yyyy h:mm aa"
          placeholderText="Set due date & time"
          className="input-date"
          minDate={new Date()}
          isClearable
        />
        <button type="submit" className="input-submit">
          <FaPlusCircle
            style={{
              color: '#dc4c3e',
              fontSize: '24px',
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
