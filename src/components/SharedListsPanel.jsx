import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  FaPlus, FaUsers, FaChevronDown, FaTrash, FaCog, FaUser, FaList,
} from 'react-icons/fa';
import SharedListsService from '../firebase/sharedListsService';
import styles from '../styles/SharedLists.module.css';

const SharedListsPanel = ({
  currentUser,
  activeList,
  onListSelect,
}) => {
  const [lists, setLists] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sharedListsService = useRef(null);

  // Initialize service
  useEffect(() => {
    if (currentUser?.email) {
      sharedListsService.current = new SharedListsService(currentUser.email);

      // Subscribe to user's shared lists
      const unsubscribe = sharedListsService.current.subscribeToUserLists((result) => {
        if (result.success) {
          setLists(result.lists);
        }
      });

      return () => unsubscribe();
    }
    return () => {};
  }, [currentUser]);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    setIsLoading(true);
    const result = await sharedListsService.current.createList(newListName.trim());
    setIsLoading(false);

    if (result.success) {
      toast.success(`Created list "${newListName}"`);
      setNewListName('');
      setShowCreateModal(false);
      // Auto-select the new list
      onListSelect({ id: result.listId, name: newListName, type: 'shared' });
    } else {
      toast.error(`Failed to create list: ${result.error}`);
    }
  };

  const handleInviteMember = async () => {
    if (!newMemberEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!selectedList) return;

    setIsLoading(true);
    const result = await sharedListsService.current.inviteMember(
      selectedList.id,
      newMemberEmail.trim().toLowerCase(),
    );
    setIsLoading(false);

    if (result.success) {
      toast.success(`Invited ${newMemberEmail} to the list`);
      setNewMemberEmail('');
    } else {
      toast.error(`Failed to invite: ${result.error}`);
    }
  };

  const handleRemoveMember = async (memberEmail) => {
    if (!selectedList) return;

    // eslint-disable-next-line no-alert
    const confirmRemove = window.confirm(
      `Remove ${memberEmail} from "${selectedList.name}"?`,
    );
    if (!confirmRemove) return;

    setIsLoading(true);
    const result = await sharedListsService.current.removeMember(
      selectedList.id,
      memberEmail,
    );
    setIsLoading(false);

    if (result.success) {
      toast.success(`Removed ${memberEmail} from the list`);
      // If user removed themselves, close modal and switch to personal
      if (memberEmail === currentUser?.email) {
        setShowManageModal(false);
        onListSelect({ id: 'personal', name: 'My Tasks', type: 'personal' });
      }
    } else {
      toast.error(`Failed to remove member: ${result.error}`);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedList) return;

    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      `Delete "${selectedList.name}"? This will remove all tasks and cannot be undone.`,
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    const result = await sharedListsService.current.deleteList(selectedList.id);
    setIsLoading(false);

    if (result.success) {
      toast.success(`Deleted list "${selectedList.name}"`);
      setShowManageModal(false);
      // Switch to personal list
      onListSelect({ id: 'personal', name: 'My Tasks', type: 'personal' });
    } else {
      toast.error(`Failed to delete list: ${result.error}`);
    }
  };

  const openManageModal = (list, e) => {
    e.stopPropagation();
    setSelectedList(list);
    setShowManageModal(true);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.sharedListsPanel}>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>📋 Lists</span>
        <FaChevronDown className={`${styles.toggleIcon} ${isExpanded ? styles.open : ''}`} />
      </button>

      <div className={`${styles.panelContent} ${!isExpanded ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <h3>Your Lists</h3>
          <button
            type="button"
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus />
            New List
          </button>
        </div>

        <div className={styles.listContainer}>
          {/* Personal List (always shown) */}
          <div
            role="button"
            tabIndex={0}
            className={`${styles.listItem} ${styles.personal} ${activeList?.id === 'personal' ? styles.active : ''}`}
            onClick={() => onListSelect({ id: 'personal', name: 'My Tasks', type: 'personal' })}
            onKeyDown={(e) => e.key === 'Enter' && onListSelect({ id: 'personal', name: 'My Tasks', type: 'personal' })}
          >
            <div className={styles.listInfo}>
              <FaUser className={styles.listIcon} style={{ color: '#2196f3' }} />
              <div className={styles.listDetails}>
                <span className={styles.listName}>My Tasks</span>
                <span className={styles.listMeta}>Personal</span>
              </div>
            </div>
          </div>

          {/* Shared Lists */}
          {lists.map((list) => (
            <div
              key={list.id}
              role="button"
              tabIndex={0}
              className={`${styles.listItem} ${activeList?.id === list.id ? styles.active : ''}`}
              onClick={() => onListSelect({ id: list.id, name: list.name, type: 'shared' })}
              onKeyDown={(e) => e.key === 'Enter' && onListSelect({ id: list.id, name: list.name, type: 'shared' })}
            >
              <div className={styles.listInfo}>
                <FaList className={styles.listIcon} style={{ color: '#dc4c3e' }} />
                <div className={styles.listDetails}>
                  <span className={styles.listName}>{list.name}</span>
                  <span className={styles.listMeta}>
                    <span className={styles.memberCount}>
                      <FaUsers />
                      {list.members?.length || 1}
                    </span>
                    {list.owner === currentUser?.email && (
                      <span className={styles.ownerBadge}>Owner</span>
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.listActions}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={(e) => openManageModal(list, e)}
                  title="Manage list"
                >
                  <FaCog />
                </button>
              </div>
            </div>
          ))}

          {lists.length === 0 && (
            <div className={styles.emptyState}>
              <p>No shared lists yet</p>
              <button
                type="button"
                className={styles.createButton}
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus />
                Create your first list
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowCreateModal(false)}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="createListTitle"
          >
            <h3 id="createListTitle">Create New List</h3>
            <div className={styles.inputGroup}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="newListName">List Name</label>
              <input
                id="newListName"
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Work Projects, Family Tasks"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleCreateList}
                disabled={isLoading || !newListName.trim()}
              >
                {isLoading ? 'Creating...' : 'Create List'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage List Modal */}
      {showManageModal && selectedList && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={styles.modalOverlay}
          onClick={() => setShowManageModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowManageModal(false)}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manageListTitle"
          >
            <h3 id="manageListTitle">
              Manage &quot;
              {selectedList.name}
              &quot;
            </h3>

            {/* Members Section */}
            <div className={styles.inputGroup}>
              <span className={styles.membersLabel}>
                Members (
                {selectedList.members?.length || 0}
                )
              </span>
            </div>
            <div className={styles.membersList}>
              {selectedList.members?.map((member) => (
                <div key={member} className={styles.memberItem}>
                  <span className={styles.memberEmail}>
                    {member}
                    {member === selectedList.owner && ' (Owner)'}
                    {member === currentUser?.email && ' (You)'}
                  </span>
                  {selectedList.owner === currentUser?.email && member !== selectedList.owner && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveMember(member)}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  )}
                  {member === currentUser?.email && member !== selectedList.owner && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveMember(member)}
                      disabled={isLoading}
                    >
                      Leave
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Invite Member */}
            <div className={styles.inputGroup}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="inviteMemberEmail">Invite Member</label>
              <input
                id="inviteMemberEmail"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                onKeyDown={(e) => e.key === 'Enter' && handleInviteMember()}
              />
            </div>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleInviteMember}
              disabled={isLoading || !newMemberEmail.trim()}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {isLoading ? 'Inviting...' : 'Invite'}
            </button>

            {/* Delete List (Owner only) */}
            {selectedList.owner === currentUser?.email && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={handleDeleteList}
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                <FaTrash style={{ marginRight: '8px' }} />
                Delete List
              </button>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowManageModal(false)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SharedListsPanel.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }),
  activeList: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  onListSelect: PropTypes.func.isRequired,
};

SharedListsPanel.defaultProps = {
  currentUser: null,
  activeList: { id: 'personal', name: 'My Tasks', type: 'personal' },
};

export default SharedListsPanel;
