import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from './config';

/**
 * SharedListsService - Manages collaborative todo lists
 *
 * Firestore Structure:
 * - /sharedLists/{listId} - The shared list document
 *   - id: string
 *   - name: string
 *   - owner: string (email)
 *   - members: string[] (emails)
 *   - todos: array
 *   - comments: object
 *   - reminders: object
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *
 * - /users/{email}/sharedListRefs/{listId} - Reference to shared lists user has access to
 */

class SharedListsService {
  constructor(userEmail = null, userDisplayName = null) {
    this.userEmail = userEmail;
    this.userDisplayName = userDisplayName;
  }

  setUserEmail(email) {
    this.userEmail = email;
  }

  setUserDisplayName(displayName) {
    this.userDisplayName = displayName;
  }

  // Create a new shared list
  async createList(name) {
    if (!this.userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const listId = uuidv4();
      const listRef = doc(db, 'sharedLists', listId);

      const listData = {
        id: listId,
        name,
        owner: this.userEmail,
        members: [this.userEmail],
        memberDetails: {
          [this.userEmail]: {
            displayName: this.userDisplayName || this.userEmail.split('@')[0],
            addedAt: new Date().toISOString(),
          },
        },
        todos: [],
        comments: {},
        reminders: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(listRef, listData);

      // Add reference to user's shared lists
      await this.addListRefToUser(this.userEmail, listId, name);

      return { success: true, listId, data: listData };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating shared list:', error);
      return { success: false, error: error.message };
    }
  }

  // Add a reference to a shared list in user's document
  // eslint-disable-next-line class-methods-use-this
  async addListRefToUser(email, listId, listName) {
    try {
      const userListRef = doc(db, 'users', email, 'sharedListRefs', listId);
      await setDoc(userListRef, {
        listId,
        listName,
        addedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding list ref to user:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove a reference to a shared list from user's document
  // eslint-disable-next-line class-methods-use-this
  async removeListRefFromUser(email, listId) {
    try {
      const userListRef = doc(db, 'users', email, 'sharedListRefs', listId);
      await deleteDoc(userListRef);
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error removing list ref from user:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all shared lists the user has access to
  async getUserSharedLists() {
    if (!this.userEmail) {
      return { success: false, error: 'User not authenticated', lists: [] };
    }

    try {
      const listsQuery = query(
        collection(db, 'sharedLists'),
        where('members', 'array-contains', this.userEmail),
      );

      const snapshot = await getDocs(listsQuery);
      const lists = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      return { success: true, lists };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting shared lists:', error);
      return { success: false, error: error.message, lists: [] };
    }
  }

  // Get a specific shared list
  async getList(listId) {
    try {
      const listRef = doc(db, 'sharedLists', listId);
      const docSnap = await getDoc(listRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if user has access
        if (data.members.includes(this.userEmail)) {
          return { success: true, data };
        }
        return { success: false, error: 'Access denied' };
      }
      return { success: false, error: 'List not found' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting list:', error);
      return { success: false, error: error.message };
    }
  }

  // Invite a member to a shared list
  async inviteMember(listId, memberEmail, memberDisplayName = null) {
    if (!this.userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const listRef = doc(db, 'sharedLists', listId);
      const docSnap = await getDoc(listRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'List not found' };
      }

      const listData = docSnap.data();

      // Check if current user is owner or member
      if (!listData.members.includes(this.userEmail)) {
        return { success: false, error: 'Access denied' };
      }

      // Check if member is already in the list
      if (listData.members.includes(memberEmail)) {
        return { success: false, error: 'User is already a member' };
      }

      // Build memberDetails update
      const memberDetails = listData.memberDetails || {};
      memberDetails[memberEmail] = {
        displayName: memberDisplayName || memberEmail.split('@')[0],
        addedAt: new Date().toISOString(),
      };

      // Add member to the list
      await setDoc(listRef, {
        members: arrayUnion(memberEmail),
        memberDetails,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Add list reference to the new member's document
      await this.addListRefToUser(memberEmail, listId, listData.name);

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error inviting member:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove a member from a shared list
  async removeMember(listId, memberEmail) {
    if (!this.userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const listRef = doc(db, 'sharedLists', listId);
      const docSnap = await getDoc(listRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'List not found' };
      }

      const listData = docSnap.data();

      // Only owner can remove members (except self)
      if (listData.owner !== this.userEmail && memberEmail !== this.userEmail) {
        return { success: false, error: 'Only owner can remove members' };
      }

      // Owner cannot be removed
      if (memberEmail === listData.owner) {
        return { success: false, error: 'Cannot remove owner from list' };
      }

      // Remove member from the list
      await setDoc(listRef, {
        members: arrayRemove(memberEmail),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Remove list reference from the member's document
      await this.removeListRefFromUser(memberEmail, listId);

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error removing member:', error);
      return { success: false, error: error.message };
    }
  }

  // Update list name
  async updateListName(listId, newName) {
    if (!this.userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const listRef = doc(db, 'sharedLists', listId);
      const docSnap = await getDoc(listRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'List not found' };
      }

      const listData = docSnap.data();

      // Only owner can rename
      if (listData.owner !== this.userEmail) {
        return { success: false, error: 'Only owner can rename the list' };
      }

      await setDoc(listRef, {
        name: newName,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update references for all members
      const updatePromises = listData.members.map(
        (member) => this.addListRefToUser(member, listId, newName),
      );
      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating list name:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a shared list
  async deleteList(listId) {
    if (!this.userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const listRef = doc(db, 'sharedLists', listId);
      const docSnap = await getDoc(listRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'List not found' };
      }

      const listData = docSnap.data();

      // Only owner can delete
      if (listData.owner !== this.userEmail) {
        return { success: false, error: 'Only owner can delete the list' };
      }

      // Remove list references from all members
      const removePromises = listData.members.map(
        (member) => this.removeListRefFromUser(member, listId),
      );
      await Promise.all(removePromises);

      // Delete the list
      await deleteDoc(listRef);

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting list:', error);
      return { success: false, error: error.message };
    }
  }

  // Save todos to a shared list
  // eslint-disable-next-line class-methods-use-this
  async saveListTodos(listId, todos) {
    try {
      const listRef = doc(db, 'sharedLists', listId);
      await setDoc(listRef, {
        todos,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving list todos:', error);
      return { success: false, error: error.message };
    }
  }

  // Save comments to a shared list
  // eslint-disable-next-line class-methods-use-this
  async saveListComments(listId, comments) {
    try {
      const listRef = doc(db, 'sharedLists', listId);
      await setDoc(listRef, {
        comments,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving list comments:', error);
      return { success: false, error: error.message };
    }
  }

  // Save reminders to a shared list
  // eslint-disable-next-line class-methods-use-this
  async saveListReminders(listId, reminders) {
    try {
      const listRef = doc(db, 'sharedLists', listId);
      await setDoc(listRef, {
        reminders,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving list reminders:', error);
      return { success: false, error: error.message };
    }
  }

  // Update current user's display name in a list's memberDetails
  async updateMyDisplayName(listId) {
    if (!this.userEmail || !this.userDisplayName) {
      return { success: false, error: 'User not authenticated or no display name' };
    }

    try {
      const listRef = doc(db, 'sharedLists', listId);
      const docSnap = await getDoc(listRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'List not found' };
      }

      const listData = docSnap.data();

      // Check if user is a member
      if (!listData.members.includes(this.userEmail)) {
        return { success: false, error: 'Access denied' };
      }

      // Update memberDetails with current user's display name
      const memberDetails = listData.memberDetails || {};
      const currentDetails = memberDetails[this.userEmail] || {};

      // Only update if display name is different or missing
      if (currentDetails.displayName !== this.userDisplayName) {
        memberDetails[this.userEmail] = {
          ...currentDetails,
          displayName: this.userDisplayName,
          updatedAt: new Date().toISOString(),
        };

        await setDoc(listRef, {
          memberDetails,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating display name:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to real-time updates for a shared list
  // eslint-disable-next-line class-methods-use-this
  subscribeToList(listId, callback) {
    const listRef = doc(db, 'sharedLists', listId);
    return onSnapshot(listRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ success: true, data: docSnap.data() });
      } else {
        callback({ success: false, error: 'List not found' });
      }
    }, (error) => {
      // eslint-disable-next-line no-console
      console.error('Error subscribing to list:', error);
      callback({ success: false, error: error.message });
    });
  }

  // Subscribe to user's shared lists (for list panel updates)
  subscribeToUserLists(callback) {
    if (!this.userEmail) {
      callback({ success: false, error: 'User not authenticated', lists: [] });
      return () => {};
    }

    const listsQuery = query(
      collection(db, 'sharedLists'),
      where('members', 'array-contains', this.userEmail),
    );

    return onSnapshot(listsQuery, (snapshot) => {
      const lists = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback({ success: true, lists });
    }, (error) => {
      // eslint-disable-next-line no-console
      console.error('Error subscribing to user lists:', error);
      callback({ success: false, error: error.message, lists: [] });
    });
  }
}

export default SharedListsService;
