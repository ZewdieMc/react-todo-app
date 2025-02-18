import React from 'react';
import TodoItem from 'components/TodoItem';
import PropTypes from 'prop-types';

const TodosList = ({
  todosProps, handleChange, deleteTodo, setUpdate, moveUp, moveDown, comments,
  handleCommentChange, activeCommentId, setActiveCommentId, currentPage, totalPages,
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
        comments={comments}
        handleCommentChange={handleCommentChange}
        activeCommentId={activeCommentId}
        setActiveCommentId={setActiveCommentId}
        currentPage={currentPage}
        totalPages={totalPages}
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
  comments: PropTypes.objectOf(PropTypes.string).isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  activeCommentId: PropTypes.string,
  setActiveCommentId: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};

TodosList.defaultProps = {
  activeCommentId: null,
};

export default TodosList;
