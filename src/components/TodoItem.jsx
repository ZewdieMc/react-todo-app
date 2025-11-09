import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AiFillEdit, AiFillSave } from 'react-icons/ai';
import { FaTrash, FaCommentDots, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmModal from 'components/ConfirmModal';
import styles from 'styles/TodoItem.module.css';
import ReminderSettings from './ReminderSettings';

const TodoItem = ({
  itemProp, onChange, deleteTodo, setUpdate,
  comments, handleCommentChange, activeCommentId, setActiveCommentId,
  reminder, onSaveReminder,
}) => {
  const [editing, setEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [tempDueDate, setTempDueDate] = useState(null);
  const [editorState, setEditorState] = useState(() => {
    let contentState;
    try {
      const blocksFromHTML = htmlToDraft(itemProp.title);
      contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
    } catch (error) {
      contentState = ContentState.createFromText(itemProp.title);
    }
    return EditorState.createWithContent(contentState);
  });

  useEffect(() => {
    if (editing) {
      const blocksFromHTML = htmlToDraft(itemProp.title);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [editing, itemProp.title]);

  const handleEditing = () => {
    setEditing(true);
  };

  const handleUpdatedDone = () => {
    setEditing(false);
    const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setUpdate(htmlContent, itemProp.id);
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const toggleComment = () => {
    setActiveCommentId(activeCommentId === itemProp.id ? null : itemProp.id);
  };

  const handleCommentSave = () => {
    setActiveCommentId(null);
  };

  const handleEditDueDate = () => {
    // Prepare current due date as a Date object for react-datepicker
    if (itemProp.dueDate) {
      setTempDueDate(new Date(itemProp.dueDate));
    } else {
      setTempDueDate(null);
    }
    setEditingDueDate(true);
  };

  const handleSaveDueDate = () => {
    if (tempDueDate) {
      const updatedTodo = { ...itemProp, dueDate: new Date(tempDueDate).toISOString() };
      setUpdate(updatedTodo.title, itemProp.id, updatedTodo.dueDate);
    } else {
      // clear due date
      setUpdate(itemProp.title, itemProp.id, null);
    }
    setEditingDueDate(false);
    setTempDueDate(null);
  };

  const handleCancelDueDate = () => {
    setEditingDueDate(false);
    setTempDueDate(null);
  };

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    deleteTodo(itemProp.id);
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const uploadImageCallBack = (file) => new Promise(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ data: { link: e.target.result } });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    },
  );

  const viewMode = {};
  const editMode = { padding: '14px' };
  if (editing) {
    viewMode.display = 'none';
  } else {
    editMode.display = 'block';
  }

  const completedStyle = {
    fontStyle: 'italic',
    color: 'green',
    opacity: 0.5,
    textDecoration: 'line-through',
  };

  const commentTooltip = comments[itemProp.id] ? comments[itemProp.id] : 'Add comment on this item';

  return (
    <li className={styles.item}>
      <div className={styles.content} style={viewMode}>
        <input
          type="checkbox"
          checked={itemProp.completed}
          onChange={() => onChange(itemProp.id)}
        />
        <button type="button" onClick={handleEditing} title="Edit task">
          <AiFillEdit style={{ color: '#666', fontSize: '16px' }} />
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles['hide-on-mobile']}`}
          onClick={handleDelete}
          title="Delete task"
        >
          <FaTrash style={{ color: '#666', fontSize: '16px' }} />
        </button>
        <button type="button" onClick={toggleComment} title={commentTooltip}>
          <FaCommentDots style={{ color: '#666', fontSize: '16px' }} />
        </button>
        {itemProp.dueDate && (
          <ReminderSettings
            todoId={itemProp.id}
            reminder={reminder}
            onSaveReminder={onSaveReminder}
          />
        )}
        {activeCommentId === itemProp.id && (
          <div className={styles.commentPopup}>
            <textarea
              className={styles.textarea}
              value={comments && comments[itemProp.id] ? comments[itemProp.id] : ''}
              onChange={(e) => handleCommentChange(itemProp.id, e.target.value)}
              placeholder="Add a comment..."
            />
            <button type="button" onClick={handleCommentSave} title="Save Comment">
              <AiFillSave style={{ color: '#dc4c3e', fontSize: '24px' }} />
            </button>
          </div>
        )}
        <span style={itemProp.completed ? completedStyle : null}>
          {/* eslint-disable-next-line */}
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(itemProp.title) }} />
          {!editingDueDate && itemProp.dueDate && (
            <span className={styles.dueDate}>
              {' '}
              Due:
              {' '}
              {new Date(itemProp.dueDate).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
              <button
                type="button"
                onClick={handleEditDueDate}
                className={styles.editDueDateBtn}
                title="Edit due date"
                aria-label="Edit due date"
              >
                <FaCalendarAlt />
              </button>
            </span>
          )}
          {!editingDueDate && !itemProp.dueDate && (
            <button
              type="button"
              onClick={handleEditDueDate}
              className={styles.addDueDateBtn}
              title="Add due date"
              aria-label="Add due date"
            >
              <FaCalendarAlt />
              {' '}
              Add due date
            </button>
          )}
          {editingDueDate && (
            <span className={styles.dueDateEditor}>
              <DatePicker
                selected={tempDueDate}
                onChange={(date) => setTempDueDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText="Set due date & time"
                className={styles.dueDateInput}
                minDate={new Date()}
                isClearable
              />
              <button
                type="button"
                onClick={handleSaveDueDate}
                className={styles.saveDueDateBtn}
                title="Save due date"
                aria-label="Save due date"
              >
                <AiFillSave />
              </button>
              <button
                type="button"
                onClick={handleCancelDueDate}
                className={styles.cancelDueDateBtn}
                title="Cancel"
                aria-label="Cancel editing due date"
              >
                ✕
              </button>
            </span>
          )}
        </span>
        {itemProp.completed && (
          <div className="completion" style={{ display: 'inline', textDecoration: 'none', fontSize: '20px' }}>
            ✓
          </div>
        )}
      </div>
      {editing && (
        <div>
          <Editor
            toolbarStyle={{ background: 'white' }}
            editorState={editorState}
            editorStyle={editMode}
            editorClassName="editor"
            wrapperStyle={{ background: 'white' }}
            wrapperClassName={styles.textInput}
            onEditorStateChange={handleEditorChange}
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'embedded',
                'emoji',
                'image',
                'remove',
                'history',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: {
                inDropdown: false,
                showOpenOptionOnHover: true, // Ensure the link editor pops up
                defaultTargetOption: '_blank', // Open in new tab
                options: ['link', 'unlink'],
              },
              history: { inDropdown: false },
              emoji: {
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                emojis: [
                  '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                  '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                  '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                  '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                  '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                  '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                  '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                  '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                  '✅', '❎', '💯',
                ],
              },
              image: {
                uploadCallback: uploadImageCallBack,
                alt: { present: true, mandatory: false },
                previewImage: true,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              },
            }}
          />
          <button type="button" onClick={handleUpdatedDone} className={styles.saveButton}>
            Save
          </button>
        </div>
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this todo?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </li>
  );
};

TodoItem.propTypes = {
  itemProp: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    completed: PropTypes.bool,
    dueDate: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  comments: PropTypes.objectOf(PropTypes.string).isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  activeCommentId: PropTypes.string,
  setActiveCommentId: PropTypes.func.isRequired,
  reminder: PropTypes.string,
  onSaveReminder: PropTypes.func.isRequired,
};

TodoItem.defaultProps = {
  activeCommentId: null,
  reminder: null,
};

export default TodoItem;
