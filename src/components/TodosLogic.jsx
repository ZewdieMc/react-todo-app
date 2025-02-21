import InputTodo from 'components/InputTodo';
import TodosList from 'components/TodosList';
import PointsDisplay from 'components/PointsDisplay';
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

  const getInitialComments = (todos) => {
    const temp = localStorage.getItem('comments');
    const savedComments = JSON.parse(temp);
    if (savedComments) {
      return savedComments;
    }
    const initialComments = {};
    todos.forEach((todo) => {
      initialComments[todo.id] = '';
    });
    return initialComments;
  };

  const getInitialPoints = () => {
    const temp = localStorage.getItem('points');
    const savedPoints = JSON.parse(temp);
    return savedPoints || 0;
  };

  const [todos, setTodos] = useState(getInitialTodos());
  const [comments, setComments] = useState(getInitialComments(getInitialTodos()));
  const [points, setPoints] = useState(getInitialPoints());
  const [activeCommentId, setActiveCommentId] = useState(null);

  const handleChange = (id) => {
    setTodos((prevState) => prevState.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };
        if (updatedTodo.completed) {
          setPoints((prevPoints) => prevPoints + 10); // Add points for completing a task
        } else {
          setPoints((prevPoints) => prevPoints - 10); // Remove points for uncompleting a task
        }
        return updatedTodo;
      }
      return todo;
    }));
  };

  const handleCommentChange = (id, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [id]: comment,
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
    setComments((prevComments) => ({
      ...prevComments,
      [newTodo.id]: '',
    }));
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
    const tempComments = JSON.stringify(comments);
    localStorage.setItem('comments', tempComments);
    const tempPoints = JSON.stringify(points);
    localStorage.setItem('points', tempPoints);
  }, [todos, comments, points]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(todos.length / todosPerPage);

  const moveUp = (index) => {
    const globalIndex = (currentPage - 1) * todosPerPage + index;
    if (globalIndex > 0) {
      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        [newTodos[globalIndex - 1], newTodos[globalIndex]] = [
          newTodos[globalIndex], newTodos[globalIndex - 1],
        ];
        return newTodos;
      });
      if (index === 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  };

  const moveDown = (index) => {
    const globalIndex = (currentPage - 1) * todosPerPage + index;
    if (globalIndex < todos.length - 1) {
      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        [newTodos[globalIndex + 1], newTodos[globalIndex]] = [
          newTodos[globalIndex], newTodos[globalIndex + 1],
        ];
        return newTodos;
      });
      if (index === todosPerPage - 1 && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }
  };

  // Calculate the current todos to display
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  return (
    <>
      <PointsDisplay points={points} />
      <InputTodo addTodo={addTodo} />
      <TodosList
        todosProps={currentTodos}
        handleChange={handleChange}
        deleteTodo={deleteTodo}
        setUpdate={setUpdate}
        moveUp={moveUp}
        moveDown={moveDown}
        comments={comments}
        handleCommentChange={handleCommentChange}
        activeCommentId={activeCommentId}
        setActiveCommentId={setActiveCommentId}
        currentPage={currentPage}
        totalPages={totalPages}
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
