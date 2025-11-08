import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

class CloudStorageService {
  constructor(userId = 'anonymous') {
    this.userId = userId;
    this.userDocRef = doc(db, 'users', this.userId);
  }

  // Set user ID for authenticated users
  setUserId(userId) {
    this.userId = userId;
    this.userDocRef = doc(db, 'users', this.userId);
  }

  // Save todos to cloud
  async saveTodos(todos) {
    try {
      await setDoc(this.userDocRef, {
        todos,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving todos:', error);
      return { success: false, error: error.message };
    }
  }

  // Save comments to cloud
  async saveComments(comments) {
    try {
      await setDoc(this.userDocRef, {
        comments,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving comments:', error);
      return { success: false, error: error.message };
    }
  }

  // Save reminders to cloud
  async saveReminders(reminders) {
    try {
      await setDoc(this.userDocRef, {
        reminders,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving reminders:', error);
      return { success: false, error: error.message };
    }
  }

  // Save points to cloud
  async savePoints(points) {
    try {
      await setDoc(this.userDocRef, {
        points,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving points:', error);
      return { success: false, error: error.message };
    }
  }

  // Save all data to cloud
  async saveAllData(data) {
    try {
      const dataToSave = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      // eslint-disable-next-line no-console
      console.log('Saving to Firestore:', {
        userId: this.userId,
        todosCount: data.todos?.length || 0,
        commentsCount: Object.keys(data.comments || {}).length,
        remindersCount: Object.keys(data.reminders || {}).length,
        points: data.points,
      });

      await setDoc(this.userDocRef, dataToSave, { merge: true });

      // eslint-disable-next-line no-console
      console.log('✅ Successfully saved to Firestore');
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error saving data:', error);
      // eslint-disable-next-line no-console
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        userId: this.userId,
      });
      return { success: false, error: error.message };
    }
  }

  // Load data from cloud
  async loadData() {
    try {
      // eslint-disable-next-line no-console
      console.log('Loading from Firestore for user:', this.userId);
      const docSnap = await getDoc(this.userDocRef);
      if (docSnap.exists()) {
        // eslint-disable-next-line no-console
        console.log('✅ Data loaded successfully');
        return { success: true, data: docSnap.data() };
      }
      // eslint-disable-next-line no-console
      console.log('ℹ️ No data found in Firestore');
      return { success: true, data: null };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error loading data:', error);
      // eslint-disable-next-line no-console
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        userId: this.userId,
      });
      return { success: false, error: error.message };
    }
  }

  // Subscribe to real-time updates
  subscribeToUpdates(callback) {
    return onSnapshot(this.userDocRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    }, (error) => {
      // eslint-disable-next-line no-console
      console.error('Error subscribing to updates:', error);
    });
  }

  // Delete all user data
  async deleteAllData() {
    try {
      await deleteDoc(this.userDocRef);
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default CloudStorageService;
