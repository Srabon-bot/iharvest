/**
 * iHarvest — User Service
 *
 * Administrative user management operations.
 * Provides CRUD for user profiles in Firestore.
 *
 * @module services/userService
 */

import {
  getDocuments,
  getDocument,
  updateDocument,
  where,
  setDocument,
} from '../firebase/firestore.js';
import { COLLECTIONS } from '../utils/constants.js';

/**
 * Fetch all users in the system.
 *
 * Used by: **Admin** (user management panel).
 *
 * @returns {Promise<Array<{ id: string, uid: string, name: string, email: string, role: string, isActive: boolean }>>}
 */
export async function getAllUsers() {
  try {
    return await getDocuments(COLLECTIONS.USERS);
  } catch (error) {
    console.error('[userService.getAllUsers]', error);
    throw error;
  }
}

/**
 * Fetch all users with a specific role.
 *
 * Used by: **Admin** (filter by role), **Cluster Manager** (list FSOs),
 * **FSO** (list farmers).
 *
 * @param {string} role - One of the ROLES constants
 * @returns {Promise<Array<{ id: string, uid: string, name: string, email: string, role: string, isActive: boolean }>>}
 */
export async function getUsersByRole(role) {
  try {
    return await getDocuments(COLLECTIONS.USERS, where('role', '==', role));
  } catch (error) {
    console.error('[userService.getUsersByRole]', error);
    throw error;
  }
}

/**
 * Fetch a single user by their UID.
 *
 * Used by: **Admin**, **FSO**, **Cluster Manager** (viewing user details).
 *
 * @param {string} uid
 * @returns {Promise<{ id: string, uid: string, name: string, email: string, role: string, isActive: boolean } | null>}
 */
export async function getUserById(uid) {
  try {
    return await getDocument(COLLECTIONS.USERS, uid);
  } catch (error) {
    console.error('[userService.getUserById]', error);
    throw error;
  }
}

/**
 * Update a user's role.
 *
 * Used by: **Admin** (role reassignment).
 *
 * @param {string} uid
 * @param {string} role - New role from ROLES constant
 * @returns {Promise<void>}
 */
export async function updateUserRole(uid, role) {
  try {
    await updateDocument(COLLECTIONS.USERS, uid, { role });
  } catch (error) {
    console.error('[userService.updateUserRole]', error);
    throw error;
  }
}

/**
 * Activate a suspended user account.
 *
 * Used by: **Admin**.
 *
 * @param {string} uid
 * @returns {Promise<void>}
 */
export async function activateUser(uid) {
  try {
    await updateDocument(COLLECTIONS.USERS, uid, { isActive: true });
  } catch (error) {
    console.error('[userService.activateUser]', error);
    throw error;
  }
}

/**
 * Suspend a user account (prevent login).
 *
 * Used by: **Admin**.
 *
 * @param {string} uid
 * @returns {Promise<void>}
 */
export async function suspendUser(uid) {
  try {
    await updateDocument(COLLECTIONS.USERS, uid, { isActive: false });
  } catch (error) {
    console.error('[userService.suspendUser]', error);
    throw error;
  }
}

/**
 * Update a user's profile fields (name, assignedClusterId, assignedFsoId, etc.).
 *
 * Used by: **Admin** (editing user details).
 *
 * @param {string} uid
 * @param {object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, data) {
  try {
    await updateDocument(COLLECTIONS.USERS, uid, data);
  } catch (error) {
    console.error('[userService.updateUserProfile]', error);
    throw error;
  }
}
/**
 * Create a new user profile document in Firestore.
 * This is used by admins to pre-initialize accounts.
 *
 * @param {string} uid
 * @param {object} data - { name, email, role, isActive, ... }
 * @returns {Promise<void>}
 */
export async function createUserProfile(uid, data) {
  try {
    const profileData = {
      uid,
      isActive: true,
      ...data,
    };
    await setDocument(COLLECTIONS.USERS, uid, profileData);
  } catch (error) {
    console.error('[userService.createUserProfile]', error);
    throw error;
  }
}
