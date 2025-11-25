import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from 'components/TodoItem';

const TodosList = ({
  todosProps, handleChange, deleteTodo, setUpdate, moveUp, moveDown, comments,
  handleCommentChange, activeCommentId, setActiveCommentId, currentPage, totalPages, onDragEnd,
  reminders, handleSaveReminder,
}) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="todos">
      {(provided) => (
        <ul
          ref={provided.innerRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.droppableProps}
        >
          {todosProps.map((todo, index) => (
            <Draggable key={todo.id} draggableId={todo.id} index={index}>
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...provided.draggableProps}
                >
                  <TodoItem
                    index={index}
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
                    reminder={reminders[todo.id]}
                    onSaveReminder={handleSaveReminder}
                    dragHandleProps={provided.dragHandleProps}
                  />
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  </DragDropContext>
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
  onDragEnd: PropTypes.func.isRequired,
  reminders: PropTypes.objectOf(PropTypes.string),
  handleSaveReminder: PropTypes.func.isRequired,
};

TodosList.defaultProps = {
  activeCommentId: null,
  reminders: {},
};

export default TodosList;
