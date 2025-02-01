import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';
import styles from 'styles/TodoItem.module.css';

const TodoItem = ({
  itemProp, index, onChange, deleteTodo, setUpdate, moveUp,
  moveDown, size,
}) => {
  const [editing, setEditing] = useState(false);
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

  return (
    <li className={styles.item}>
      <div className={styles.content} style={viewMode}>
        <input
          type="checkbox"
          checked={itemProp.completed}
          onChange={() => onChange(itemProp.id)}
          style={{ transform: 'scale(2)', color: 'green' }}
        />
        <button type="button" onClick={handleEditing}>
          <AiFillEdit style={{ color: 'blue', fontSize: '16px' }} />
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles['hide-on-mobile']}`}
          onClick={() => deleteTodo(itemProp.id)}
        >
          <FaTrash style={{ color: 'gray', fontSize: '16px' }} />
        </button>
        <div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => moveUp(index)}
              aria-label="Move up"
            >
              <GoChevronUp style={{ color: 'green', fontSize: '26px' }} />
            </button>
          )}
          {index < size - 1 && (
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
          <div
          // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(itemProp.title),
            }}
          />
        </span>
      </div>
      {editing && (
      <Editor
        toolbarOnFocus
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
};
export default TodoItem;
