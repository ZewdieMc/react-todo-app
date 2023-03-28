import TodoItem from 'components/TodoItem';

const TodosList = ({todosProps, handleChange, deleteTodo}) => {
  
  return (
    <ul>
      {todosProps.map((todo) => (
        <TodoItem key={todo.id} itemProp={todo} onChange={handleChange} deleteTodo={deleteTodo}/>
      ))}
    </ul>
  );
};
export default TodosList;
