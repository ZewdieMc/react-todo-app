import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AiFillEdit, AiFillSave } from 'react-icons/ai';
import { FaTrash, FaCommentDots } from 'react-icons/fa';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';
import ConfirmModal from 'components/ConfirmModal';
import styles from 'styles/TodoItem.module.css';

const TodoItem = ({
  itemProp, index, onChange, deleteTodo, setUpdate, moveUp,
  moveDown, size, comments, handleCommentChange, activeCommentId, setActiveCommentId,
  currentPage, totalPages,
}) => {
  const [editing, setEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleUpdatedDone = (event) => {
    if (event.key === 'Enter' || event.type === 'blur') {
      setEditing(false);
      const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      setUpdate(htmlContent, itemProp.id);
    }
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

  const globalIndex = (currentPage - 1) * size + index;

  return (
    <li className={styles.item}>
      <div className={styles.content} style={viewMode}>
        <input
          type="checkbox"
          checked={itemProp.completed}
          onChange={() => onChange(itemProp.id)}
          style={{ transform: 'scale(2)', color: 'green', marginRight: '20px' }}
        />
        <button type="button" onClick={handleEditing}>
          <AiFillEdit style={{ color: 'blue', fontSize: '16px' }} />
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles['hide-on-mobile']}`}
          onClick={handleDelete}
        >
          <FaTrash style={{ color: 'gray', fontSize: '16px' }} />
        </button>
        <button type="button" onClick={toggleComment} title={commentTooltip}>
          <FaCommentDots style={{ color: 'orange', fontSize: '16px' }} />
        </button>
        {activeCommentId === itemProp.id && (
          <div className={styles.commentPopup}>
            <textarea
              className={styles.textarea}
              value={comments && comments[itemProp.id] ? comments[itemProp.id] : ''}
              onChange={(e) => handleCommentChange(itemProp.id, e.target.value)}
            />
            <button type="button" onClick={handleCommentSave} title="Save Comment">
              <AiFillSave style={{ color: 'green', fontSize: '24px' }} />
            </button>
          </div>
        )}
        <div>
          {globalIndex > 0 && (
            <button
              type="button"
              onClick={() => moveUp(index)}
              aria-label="Move up"
            >
              <GoChevronUp style={{ color: 'green', fontSize: '26px' }} />
            </button>
          )}
          {globalIndex < size * totalPages - 1 && (
            <button
              type="button"
              onClick={() => moveDown(index)}
              aria-label="Move down"
            >
              <GoChevronDown style={{ color: 'red', fontSize: '26px' }} />
            </button>
          )}
        </div>
        <span style={itemProp.completed ? completedStyle : null}>
          {/* eslint-disable-next-line */}
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(itemProp.title) }} />
        </span>
        {itemProp.completed ? (
          <div className="completion" style={{ display: 'inline', textDecoration: 'none', fontSize: '30px' }}>
            😍
          </div>
        ) : (
          <div className="completion" style={{ display: 'inline', textDecoration: 'none', fontSize: '30px' }}>
            😣
          </div>
        )}
      </div>
      {editing && (
        <Editor
          toolbarStyle={{ background: 'white' }}
          editorState={editorState}
          editorStyle={editMode}
          editorClassName="editor"
          wrapperStyle={{ background: 'white' }}
          wrapperClassName={styles.textInput}
          onEditorStateChange={handleEditorChange}
          onBlur={handleUpdatedDone}
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
          }}
        />
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
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  moveUp: PropTypes.func.isRequired,
  moveDown: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  comments: PropTypes.objectOf(PropTypes.string).isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  activeCommentId: PropTypes.string,
  setActiveCommentId: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};

TodoItem.defaultProps = {
  activeCommentId: null,
};

export default TodoItem;
