import TodoItem from 'components/TodoItem';
import PropTypes from 'prop-types';

const TodosList = ({
  todosProps, handleChange, deleteTodo, setUpdate, moveUp, moveDown,
}) => (
  <ul>
    {todosProps.slice().map((todo, i) => ( // Use slice()
      <TodoItem
        key={todo.id}
        index={i}
        itemProp={todo}
        onChange={handleChange}
        deleteTodo={deleteTodo}
        setUpdate={setUpdate}
        moveUp={moveUp}
        moveDown={moveDown}
        size={todosProps.length}
      />
    ))}
  </ul>
);

TodosList.propTypes = {
  todosProps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  })).isRequired,
  handleChange: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  moveUp: PropTypes.func.isRequired,
  moveDown: PropTypes.func.isRequired,
};
export default TodosList;
