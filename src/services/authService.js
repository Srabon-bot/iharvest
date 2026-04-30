/**
 * iHarvest — Auth Service
 *
 * High-level authentication operations used by the UI layer.
 * Combines Firebase Auth with Firestore user-profile management.
 * 
 * Supports Mock Authentication for UI testing. Toggle via VITE_USE_MOCK_AUTH=true in .env
 *
 * @module services/authService
 */

import {
  firebaseRegister,
  firebaseLogin,
  firebaseLogout,
  firebaseResetPassword,
  onAuthChange as firebaseOnAuthChange,
  firebaseAdminRegister,
} from '../firebase/auth.js';
import { getDocument, setDocument } from '../firebase/firestore.js';
import { firebaseConfig } from '../firebase/config.js';
import { COLLECTIONS, ROLES } from '../utils/constants.js';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// ==========================================
// MOCK AUTHENTICATION SYSTEM
// ==========================================
const MOCK_STORAGE_KEY = 'iharvest_mock_auth_user';
let authListeners = [];

const notifyListeners = (user) => {
  authListeners.forEach(listener => listener(user));
};

const getMockUser = () => {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setMockUser = (user) => {
  if (user) {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }
  notifyListeners(user);
};

const generateMockProfile = (email) => {
  const rolePrefix = email.split('@')[0]; // e.g., 'admin', 'farmer'

  // map prefix to actual roles
  const roleMap = {
    'admin': ROLES.ADMIN,
    'farmer': ROLES.FARMER,
    'investor': ROLES.INVESTOR,
    'vet': ROLES.VET,
    'fso': ROLES.FSO,
    'manager': ROLES.CLUSTER_MANAGER
  };

  const role = roleMap[rolePrefix] || ROLES.INVESTOR;

  return {
    uid: `mock-uid-${rolePrefix}`,
    email,
    name: `Mock ${rolePrefix.charAt(0).toUpperCase() + rolePrefix.slice(1)}`,
    role,
    isActive: true,
  };
};
// ==========================================

/**
 * Register a new user account.
 */
export async function registerUser(email, password, name, role = ROLES.INVESTOR, extraData = {}) {
  if (USE_MOCK_AUTH) {
    await new Promise(r => setTimeout(r, 800));
    const uid = `mock-uid-${Date.now()}`;
    const profileData = { uid, name, email, role, isActive: true, ...extraData };
    setMockUser({ uid, email });
    return profileData;
  }

  try {
    const credential = await firebaseRegister(email, password, name);
    const uid = credential.user.uid;

    const profileData = {
      uid,
      name,
      email,
      role,
      isActive: true,
      ...extraData,
    };

    await setDocument(COLLECTIONS.USERS, uid, profileData);

    return { uid, email, role };
  } catch (error) {
    console.error('[authService.registerUser]', error);
    throw error;
  }
}

/**
 * Admin creates a new staff account without logging out.
 */
export async function createStaffAccount(email, password, name, role, extraData = {}) {
  if (USE_MOCK_AUTH) {
    await new Promise(r => setTimeout(r, 800));
    const uid = `mock-uid-${Date.now()}`;
    const profileData = { uid, name, email, role, isActive: true, ...extraData };
    return profileData; // Don't setMockUser because it would switch sessions
  }

  try {
    const uid = await firebaseAdminRegister(email, password, name, firebaseConfig);

    const profileData = {
      uid,
      name,
      email,
      role,
      isActive: true,
      ...extraData,
    };

    await setDocument(COLLECTIONS.USERS, uid, profileData);
    return profileData;
  } catch (error) {
    console.error('[authService.createStaffAccount]', error);
    throw error;
  }
}

/**
 * Log in an existing user with email and password.
 */
export async function loginUser(email, password) {
  if (USE_MOCK_AUTH) {
    await new Promise(r => setTimeout(r, 800));
    const profile = generateMockProfile(email);
    setMockUser({ uid: profile.uid, email: profile.email });
    return profile;
  }

  try {
    const credential = await firebaseLogin(email, password);
    const profile = await getDocument(COLLECTIONS.USERS, credential.user.uid);

    if (!profile) {
      throw new Error('User profile not found in database.');
    }
    if (!profile.isActive) {
      await firebaseLogout();
      throw new Error('Your account has been suspended. Contact the administrator.');
    }

    return profile;
  } catch (error) {
    console.error('[authService.loginUser]', error);
    throw error;
  }
}

/**
 * Log out the currently authenticated user.
 */
export async function logoutUser() {
  if (USE_MOCK_AUTH) {
    await new Promise(r => setTimeout(r, 400));
    setMockUser(null);
    return;
  }

  try {
    await firebaseLogout();
  } catch (error) {
    console.error('[authService.logoutUser]', error);
    throw error;
  }
}

/**
 * Send a password-reset email to the given address.
 */
export async function resetPassword(email) {
  if (USE_MOCK_AUTH) {
    await new Promise(r => setTimeout(r, 500));
    return;
  }

  try {
    await firebaseResetPassword(email);
  } catch (error) {
    console.error('[authService.resetPassword]', error);
    throw error;
  }
}

/**
 * Fetch a user's Firestore profile by UID.
 */
export async function getUserProfile(uid) {
  if (USE_MOCK_AUTH) {
    const prefix = uid.replace('mock-uid-', '');
    return generateMockProfile(`${prefix}@iharvest.com`);
  }

  try {
    return await getDocument(COLLECTIONS.USERS, uid);
  } catch (error) {
    console.error('[authService.getUserProfile]', error);
    throw error;
  }
}

/**
 * Subscribe to Firebase Auth state changes.
 */
export function onAuthChange(callback) {
  if (USE_MOCK_AUTH) {
    authListeners.push(callback);
    setTimeout(() => callback(getMockUser()), 0);
    return () => {
      authListeners = authListeners.filter(l => l !== callback);
    };
  }

  return firebaseOnAuthChange(callback);
}

/**
 * Initialize the first Admin profile in Firestore.
 * This is used for the "Going Live" setup process.
 */
export async function initializeAdminProfile(uid, email, name) {
  if (USE_MOCK_AUTH) {
    await new Promise(r => setTimeout(r, 500));
    return { uid, email, name, role: ROLES.ADMIN, isActive: true };
  }

  try {
    const profileData = {
      uid,
      name,
      email,
      role: ROLES.ADMIN,
      isActive: true,
    };

    await setDocument(COLLECTIONS.USERS, uid, profileData);
    return profileData;
  } catch (error) {
    console.error('[authService.initializeAdminProfile]', error);
    throw error;
  }
}
