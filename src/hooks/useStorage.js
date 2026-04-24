/**
 * iHarvest — useStorage Hook
 *
 * React hook for uploading files to Firebase Storage with progress tracking.
 *
 * @module hooks/useStorage
 */

import { useState } from 'react';
import { uploadFile, deleteFile } from '../firebase/storage.js';

/**
 * Upload files to Firebase Storage with progress and error state.
 *
 * Used by: **FSO** (survey photo/video uploads), **Farmer**.
 *
 * @returns {{ uploadFileWithProgress: Function, progress: number, uploading: boolean, error: Error|null, downloadURL: string|null, reset: Function }}
 */
export function useStorage() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  /**
   * Upload a file and track progress.
   * @param {File} file - The file to upload
   * @param {string} path - Storage path
   * @returns {Promise<string>} The download URL
   */
  const uploadFileWithProgress = async (file, path) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      setDownloadURL(null);

      const url = await uploadFile(file, path, (pct) => {
        setProgress(pct);
      });

      setDownloadURL(url);
      return url;
    } catch (err) {
      console.error('[useStorage.uploadFileWithProgress]', err);
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Delete a file from storage.
   * @param {string} path - Storage path
   * @returns {Promise<void>}
   */
  const removeFile = async (path) => {
    try {
      await deleteFile(path);
    } catch (err) {
      console.error('[useStorage.removeFile]', err);
      setError(err);
      throw err;
    }
  };

  /**
   * Reset all state (progress, URL, error).
   */
  const reset = () => {
    setProgress(0);
    setUploading(false);
    setError(null);
    setDownloadURL(null);
  };

  return {
    uploadFileWithProgress,
    removeFile,
    progress,
    uploading,
    error,
    downloadURL,
    reset,
  };
}

export default useStorage;
