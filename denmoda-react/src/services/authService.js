// Authentication Service
// ======================
// Handles Firebase Auth operations

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../config/firebase';

/**
 * Sign in with Google
 * @returns {Promise<Object>} - User object
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user is admin
    if (user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error('Access denied. You do not have admin permission to log in.');
    }
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: true
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current user
 * @returns {Object|null} - Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if current user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const user = auth.currentUser;
  return user && user.email === ADMIN_EMAIL;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function with user object
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && user.email === ADMIN_EMAIL) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: true
      });
    } else {
      callback(null);
    }
  });
};

export { ADMIN_EMAIL };




