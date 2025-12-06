import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AiFillEdit, AiFillSave } from 'react-icons/ai';
import {
  FaTrash, FaCommentDots, FaCalendarAlt, FaGripVertical, FaEllipsisV, FaUserCircle,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmModal from 'components/ConfirmModal';
import styles from 'styles/TodoItem.module.css';
import ReminderSettings from './ReminderSettings';
import CodeBlockRenderer from './CodeBlockRenderer';
import useOnClickOutside from '../useOnClickOutside';

const TodoItem = ({
  itemProp, onChange, deleteTodo, setUpdate,
  comments, handleCommentChange, activeCommentId, setActiveCommentId,
  reminder, onSaveReminder, dragHandleProps,
  listMembers, memberDetails, onAssign, isSharedList,
}) => {
  const [editing, setEditing] = useState(false);

  // Helper to get display name for an email
  const getDisplayName = (email) => {
    if (memberDetails && memberDetails[email]?.displayName) {
      return memberDetails[email].displayName;
    }
    // Fallback to email prefix
    return email ? email.split('@')[0] : 'Unknown';
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [tempDueDate, setTempDueDate] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const actionsMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  // Determine mobile viewport once per render (client-side only)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;
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

  // Close actions menu when clicking outside
  useOnClickOutside(actionsMenuRef, showActionsMenu, () => setShowActionsMenu(false));

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

  const handleToggleActionsMenu = () => {
    if (!showActionsMenu && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      const dropdownWidth = 180;
      const dropdownHeight = 280; // Approximate height of the dropdown
      let leftPosition = rect.right - dropdownWidth;
      let topPosition = rect.bottom + 4;

      // Ensure dropdown doesn't go off-screen on the left
      if (leftPosition < 8) {
        leftPosition = 8;
      }

      // Ensure dropdown doesn't go off-screen on the right
      if (leftPosition + dropdownWidth > window.innerWidth - 8) {
        leftPosition = window.innerWidth - dropdownWidth - 8;
      }

      // Ensure dropdown doesn't go off-screen on the bottom
      if (topPosition + dropdownHeight > window.innerHeight - 8) {
        // Position above the button instead
        topPosition = rect.top - dropdownHeight - 4;
        // If still off-screen at top, just position at top of viewport
        if (topPosition < 8) {
          topPosition = 8;
        }
      }

      setMenuPosition({
        top: topPosition,
        left: leftPosition,
      });
    }
    setShowActionsMenu(!showActionsMenu);
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
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...dragHandleProps}
          className={styles.dragHandle}
          title="Drag to reorder"
          style={{
            cursor: 'grab',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '0',
            order: 0,
            flexShrink: 0,
          }}
        >
          <FaGripVertical
            style={{
              color: '#999',
              fontSize: '14px',
            }}
          />
        </div>
        <input
          type="checkbox"
          checked={itemProp.completed}
          onChange={() => onChange(itemProp.id)}
        />
        <div className={styles.actionsContainer} ref={actionsMenuRef}>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={handleToggleActionsMenu}
            title="More actions"
            className={styles.actionsMenuButton}
          >
            <FaEllipsisV style={{ color: '#666', fontSize: '16px' }} />
          </button>
          {showActionsMenu && (
            <div
              className={styles.actionsDropdown}
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleEditing();
                  setShowActionsMenu(false);
                }}
                title="Edit task"
              >
                <AiFillEdit style={{ color: '#666', fontSize: '16px' }} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleComment();
                  setShowActionsMenu(false);
                }}
                title={commentTooltip}
              >
                <FaCommentDots style={{ color: '#666', fontSize: '16px' }} />
                <span>Comment</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEditDueDate();
                  setShowActionsMenu(false);
                }}
                title="Set due date"
              >
                <FaCalendarAlt style={{ color: '#666', fontSize: '16px' }} />
                <span>Due Date</span>
              </button>
              {isSharedList && listMembers && listMembers.length > 0 && (
                <div className={styles.assignMenuWrapper}>
                  <button
                    type="button"
                    onClick={() => setShowAssignMenu(!showAssignMenu)}
                    title="Assign task"
                  >
                    <FaUserCircle style={{ color: '#666', fontSize: '16px' }} />
                    <span>Assign</span>
                  </button>
                  {showAssignMenu && (
                    <div className={styles.assignSubmenu}>
                      <div className={styles.assignHeader}>
                        <span>Assign to:</span>
                        {itemProp.assignedTo?.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              onAssign(itemProp.id, []);
                            }}
                            className={styles.clearAssignees}
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      {listMembers.map((member) => {
                        const isAssigned = Array.isArray(itemProp.assignedTo)
                          ? itemProp.assignedTo.includes(member)
                          : itemProp.assignedTo === member;
                        return (
                          <label
                            key={member}
                            className={`${styles.assigneeCheckbox} ${isAssigned ? styles.activeAssignee : ''}`}
                            title={member}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => {
                                const currentAssignees = Array.isArray(itemProp.assignedTo)
                                  ? [...itemProp.assignedTo]
                                  : itemProp.assignedTo ? [itemProp.assignedTo] : [];
                                if (isAssigned) {
                                  // Remove from assignees
                                  const newAssignees = currentAssignees.filter((a) => a !== member);
                                  onAssign(itemProp.id, newAssignees);
                                } else {
                                  // Add to assignees
                                  onAssign(itemProp.id, [...currentAssignees, member]);
                                }
                              }}
                            />
                            <span>{getDisplayName(member)}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {itemProp.dueDate && (
                <div className={styles.reminderInMenu}>
                  <ReminderSettings
                    todoId={itemProp.id}
                    reminder={reminder}
                    onSaveReminder={onSaveReminder}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  handleDelete();
                  setShowActionsMenu(false);
                }}
                title="Delete task"
                className={styles.deleteButton}
              >
                <FaTrash style={{ color: '#dc4c3e', fontSize: '16px' }} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
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
          <CodeBlockRenderer htmlContent={itemProp.title} />
          {isSharedList && itemProp.assignedTo && (
            Array.isArray(itemProp.assignedTo) ? (
              itemProp.assignedTo.length > 0 && (
                <span className={styles.assignedBadges}>
                  {itemProp.assignedTo.map((assignee) => {
                    // Get color index based on member position
                    const colorIndex = listMembers.indexOf(assignee) % 8;
                    return (
                      <span
                        key={assignee}
                        className={`${styles.assignedBadge} ${styles[`badgeColor${colorIndex}`]}`}
                        title={assignee}
                      >
                        <FaUserCircle />
                        {getDisplayName(assignee)}
                      </span>
                    );
                  })}
                </span>
              )
            ) : (
              <span
                className={`${styles.assignedBadge} ${styles[`badgeColor${listMembers.indexOf(itemProp.assignedTo) % 8}`]}`}
                title={itemProp.assignedTo}
              >
                <FaUserCircle />
                {getDisplayName(itemProp.assignedTo)}
              </span>
            )
          )}
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
                injectTimes={[]}
                withPortal={isMobile}
                portalId="root"
                popperClassName="datepicker-popper"
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
    assignedTo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
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
  dragHandleProps: PropTypes.shape({}),
  listMembers: PropTypes.arrayOf(PropTypes.string),
  memberDetails: PropTypes.objectOf(PropTypes.shape({
    displayName: PropTypes.string,
  })),
  onAssign: PropTypes.func,
  isSharedList: PropTypes.bool,
};

TodoItem.defaultProps = {
  activeCommentId: null,
  reminder: null,
  dragHandleProps: {},
  listMembers: [],
  memberDetails: {},
  onAssign: () => {},
  isSharedList: false,
};

export default TodoItem;
