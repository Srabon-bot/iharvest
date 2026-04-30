/**
 * iHarvest — Firestore helpers
 *
 * Generic CRUD wrappers around the Firestore SDK.
 * Services import these helpers instead of importing Firestore SDK directly.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config.js';

// ─── Re-exports for convenience ─────────────────────────────────────────────
export {
  serverTimestamp,
  query,
  where,
  orderBy,
  firestoreLimit as limit,
  collection,
  doc,
  onSnapshot,
};

/**
 * Wraps a promise in a timeout to prevent infinite hanging 
 * if Firebase is offline or configured incorrectly.
 */
const withTimeout = (promise, ms = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase operation timed out. Please check your connection or database rules.')), ms))
  ]);
};

/**
 * Get a single document by collection name and document ID.
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<{ id: string, [key: string]: any } | null>}
 */
export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await withTimeout(getDoc(docRef));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error(`[getDocument] ${collectionName}/${docId}`, error);
    throw error;
  }
}

/**
 * Get all documents in a collection (optionally with query constraints).
 * @param {string} collectionName
 * @param  {...import('firebase/firestore').QueryConstraint} constraints
 * @returns {Promise<Array<{ id: string, [key: string]: any }>>}
 */
export async function getDocuments(collectionName, ...constraints) {
  try {
    const ref = collection(db, collectionName);
    const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`[getDocuments] ${collectionName}`, error);
    throw error;
  }
}

/**
 * Add a new document with an auto-generated ID.
 * Automatically adds a `createdAt` server timestamp.
 * @param {string} collectionName
 * @param {object} data
 * @returns {Promise<string>} The new document ID
 */
export async function addDocument(collectionName, data) {
  try {
    const ref = collection(db, collectionName);
    const docRef = await withTimeout(addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
    }));
    return docRef.id;
  } catch (error) {
    console.error(`[addDocument] ${collectionName}`, error);
    throw error;
  }
}

/**
 * Create or overwrite a document with a specific ID.
 * Automatically adds a `createdAt` server timestamp.
 * @param {string} collectionName
 * @param {string} docId
 * @param {object} data
 * @param {boolean} [merge=false] — if true, merge instead of overwrite
 * @returns {Promise<void>}
 */
export async function setDocument(collectionName, docId, data, merge = false) {
  try {
    const docRef = doc(db, collectionName, docId);
    await withTimeout(setDoc(
      docRef,
      { ...data, createdAt: serverTimestamp() },
      { merge }
    ));
  } catch (error) {
    console.error(`[setDocument] ${collectionName}/${docId}`, error);
    throw error;
  }
}

/**
 * Update specific fields on an existing document.
 * @param {string} collectionName
 * @param {string} docId
 * @param {object} data — fields to update
 * @returns {Promise<void>}
 */
export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await withTimeout(updateDoc(docRef, { ...data, updatedAt: serverTimestamp() }));
  } catch (error) {
    console.error(`[updateDocument] ${collectionName}/${docId}`, error);
    throw error;
  }
}

/**
 * Delete a document by ID.
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<void>}
 */
export async function removeDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await withTimeout(deleteDoc(docRef));
  } catch (error) {
    console.error(`[removeDocument] ${collectionName}/${docId}`, error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates on a collection (with optional constraints).
 * @param {string} collectionName
 * @param {(docs: Array<{ id: string }>) => void} callback
 * @param  {...import('firebase/firestore').QueryConstraint} constraints
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export function subscribeToCollection(collectionName, callback, ...constraints) {
  const ref = collection(db, collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : ref;

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(docs);
    },
    (error) => {
      console.error(`[subscribeToCollection] ${collectionName}`, error);
    }
  );
}

/**
 * Subscribe to real-time updates on a single document.
 * @param {string} collectionName
 * @param {string} docId
 * @param {(doc: { id: string } | null) => void} callback
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export function subscribeToDocument(collectionName, docId, callback) {
  const docRef = doc(db, collectionName, docId);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`[subscribeToDocument] ${collectionName}/${docId}`, error);
    }
  );
}
