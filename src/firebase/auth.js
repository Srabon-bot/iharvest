/**
 * iHarvest — Firebase Authentication helpers
 *
 * Wraps Firebase Auth SDK methods. All auth operations should go through
 * this module so the rest of the app never imports from 'firebase/auth' directly.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  getAuth
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { auth } from './config.js';

/**
 * Create a new user with email & password and set display name.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function firebaseRegister(email, password, displayName) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return credential;
  } catch (error) {
    console.error('[firebaseRegister]', error);
    throw error;
  }
}

/**
 * Admin creates a new user without logging out the current session.
 * Initializes a temporary secondary Firebase app.
 */
export async function firebaseAdminRegister(email, password, displayName, config) {
  const secondaryApp = initializeApp(config, 'SecondaryApp' + Date.now());
  const secondaryAuth = getAuth(secondaryApp);
  
  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    await signOut(secondaryAuth);
    return credential.user.uid;
  } catch (error) {
    console.error('[firebaseAdminRegister]', error);
    throw error;
  } finally {
    await deleteApp(secondaryApp);
  }
}

/**
 * Sign in an existing user with email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function firebaseLogin(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('[firebaseLogin]', error);
    throw error;
  }
}

/**
 * Sign the current user out.
 * @returns {Promise<void>}
 */
export async function firebaseLogout() {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('[firebaseLogout]', error);
    throw error;
  }
}

/**
 * Send a password-reset email.
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function firebaseResetPassword(email) {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('[firebaseResetPassword]', error);
    throw error;
  }
}

/**
 * Subscribe to auth-state changes (login / logout).
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe} Unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Return the currently signed-in user (or null).
 * @returns {import('firebase/auth').User | null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Update the current user's password.
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function firebaseUpdatePassword(newPassword) {
  try {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    return await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error('[firebaseUpdatePassword]', error);
    throw error;
  }
}
