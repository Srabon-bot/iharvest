/**
 * iHarvest — Firebase Storage helpers
 *
 * Wraps Firebase Storage SDK for file uploads (farm photos/videos).
 * All storage operations should go through this module.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './config.js';

/**
 * Upload a file to Firebase Storage and return its download URL.
 * @param {File} file - The file to upload
 * @param {string} path - Storage path, e.g. "surveys/abc123/photo.jpg"
 * @param {(progress: number) => void} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<string>} The public download URL
 */
export async function uploadFile(file, path, onProgress) {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('[uploadFile]', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('[uploadFile]', error);
    throw error;
  }
}

/**
 * Upload a file and return the download URL (simple version without progress).
 * @param {File} file
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function uploadFileSimple(file, path) {
  return uploadFile(file, path);
}

/**
 * Get the download URL for an existing file in Storage.
 * @param {string} path - Storage path
 * @returns {Promise<string>}
 */
export async function getFileURL(path) {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('[getFileURL]', error);
    throw error;
  }
}

/**
 * Delete a file from Storage by path.
 * @param {string} path - Storage path
 * @returns {Promise<void>}
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('[deleteFile]', error);
    throw error;
  }
}

/**
 * List all files in a storage directory.
 * @param {string} path - Directory path in storage
 * @returns {Promise<Array<{ name: string, fullPath: string }>>}
 */
export async function listFiles(path) {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result.items.map((item) => ({
      name: item.name,
      fullPath: item.fullPath,
    }));
  } catch (error) {
    console.error('[listFiles]', error);
    throw error;
  }
}

/**
 * Generate a unique storage path for a survey media upload.
 * @param {string} surveyId
 * @param {string} fileName
 * @returns {string} Storage path
 */
export function getSurveyMediaPath(surveyId, fileName) {
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `surveys/${surveyId}/${timestamp}_${safeName}`;
}
