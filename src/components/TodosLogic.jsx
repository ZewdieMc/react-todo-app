import InputTodo from 'components/InputTodo';
import TodosList from 'components/TodosList';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

const TodosLogic = () => {
   
  const getInitialTodos = () => {
    const temp = localStorage.getItem('todos');
    const savedTodos = JSON.parse(temp);
    return savedTodos || [];
  }
  const [todos, setTodos] = useState(getInitialTodos());

  const handleChange = (id) => {
    setTodos((prevState) =>
      prevState.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos(
      [...todos.filter((todo) => todo.id !== id)]
    );
  }

  const addTodo = (title) => {
    const newTodo = {
      id: uuidv4(),
      title,
      completed: false
    }
    setTodos([...todos, newTodo]);
  }

  const setUpdate = (updatedTitle, id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.title = updatedTitle;
        }
        return todo;
      })
    );
  };
 
  
  useEffect(() => {
    const temp = JSON.stringify(todos);
    localStorage.setItem('todos', temp);
  }, [todos]);

  return (
    <>
      <InputTodo addTodo={addTodo}/>
      <TodosList 
      todosProps={todos} 
      handleChange={handleChange} 
      deleteTodo={deleteTodo} 
      setUpdate={setUpdate}/>
    </>
  )
}
export default TodosLogic;
