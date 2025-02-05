import InputTodo from 'components/InputTodo';
import TodosList from 'components/TodosList';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import styles from '../styles/App.module.css';

const TodosLogic = ({ currentPage, todosPerPage, onPageChange }) => {
  const getInitialTodos = () => {
    const temp = localStorage.getItem('todos');
    const savedTodos = JSON.parse(temp);
    return savedTodos || [];
  };
  const [todos, setTodos] = useState(getInitialTodos());

  const handleChange = (id) => {
    setTodos((prevState) => prevState.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    }));
  };

  const deleteTodo = (id) => {
    setTodos(
      [...todos.filter((todo) => todo.id !== id)],
    );
  };

  const addTodo = (title) => {
    const newTodo = {
      id: uuidv4(),
      title,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const setUpdate = (updatedTitle, id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return ({ ...todo, title: updatedTitle });
        }
        return todo;
      }),
    );
  };

  useEffect(() => {
    const temp = JSON.stringify(todos);
    localStorage.setItem('todos', temp);
  }, [todos]);

  const moveUp = (index) => {
    if (index > 0) {
      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        [newTodos[index - 1], newTodos[index]] = [newTodos[index], newTodos[index - 1]];
        return newTodos;
      });
    }
  };

  const moveDown = (index) => {
    if (index < todos.length - 1) {
      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        [newTodos[index + 1], newTodos[index]] = [newTodos[index], newTodos[index + 1]];
        return newTodos;
      });
    }
  };

  // Calculate the current todos to display
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Calculate the total number of pages
  const totalPages = Math.ceil(todos.length / todosPerPage);

  return (
    <>
      <InputTodo addTodo={addTodo} />
      <TodosList
        todosProps={currentTodos}
        handleChange={handleChange}
        deleteTodo={deleteTodo}
        setUpdate={setUpdate}
        moveUp={moveUp}
        moveDown={moveDown}
      />
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            type="button"
            onClick={() => onPageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

TodosLogic.propTypes = {
  currentPage: PropTypes.number.isRequired,
  todosPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default TodosLogic;
