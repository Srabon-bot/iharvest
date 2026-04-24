/**
 * iHarvest — useFirestore Hook
 *
 * React hook for fetching Firestore data with loading/error states.
 * Supports both one-time fetches and real-time subscriptions.
 *
 * @module hooks/useFirestore
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getDocuments,
  getDocument,
  subscribeToCollection,
  subscribeToDocument,
} from '../firebase/firestore.js';

/**
 * Fetch a collection (one-time) with optional query constraints.
 *
 * Used by: **All roles** — wraps any getDocuments call with React state.
 *
 * @param {string} collectionName
 * @param  {...import('firebase/firestore').QueryConstraint} constraints
 * @returns {{ data: Array<object>, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useCollection(collectionName, ...constraints) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await getDocuments(collectionName, ...constraints);
      setData(docs);
    } catch (err) {
      console.error('[useCollection]', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch a single document (one-time).
 *
 * Used by: **All roles** — wraps getDocument with React state.
 *
 * @param {string} collectionName
 * @param {string} docId
 * @returns {{ data: object|null, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const doc = await getDocument(collectionName, docId);
      setData(doc);
    } catch (err) {
      console.error('[useDocument]', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, docId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Subscribe to a collection in real-time.
 *
 * Used by: **Dashboards** that need live data (mortality, surveys, etc.).
 *
 * @param {string} collectionName
 * @param  {...import('firebase/firestore').QueryConstraint} constraints
 * @returns {{ data: Array<object>, loading: boolean, error: Error|null }}
 */
export function useRealtimeCollection(collectionName, ...constraints) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection(
      collectionName,
      (docs) => {
        setData(docs);
        setLoading(false);
      },
      ...constraints
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}

/**
 * Subscribe to a single document in real-time.
 *
 * Used by: **Investment detail**, **Livestock detail** views.
 *
 * @param {string} collectionName
 * @param {string} docId
 * @returns {{ data: object|null, loading: boolean, error: Error|null }}
 */
export function useRealtimeDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToDocument(collectionName, docId, (doc) => {
      setData(doc);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}
