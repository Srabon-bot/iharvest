/**
 * iHarvest — Survey Service
 *
 * Daily farm survey submissions by FSOs.
 *
 * @module services/surveyService
 */

import {
  addDocument,
  getDocuments,
  where,
  orderBy,
  limit,
} from '../firebase/firestore.js';
import { COLLECTIONS } from '../utils/constants.js';

/**
 * Submit a new daily survey for a livestock unit.
 *
 * Used by: **FSO** (daily farm monitoring).
 *
 * @param {{ livestockId: string, fsoId: string, farmerId: string, healthStatus: string, feedUsed: number, mortality: number, note?: string, imageUrl?: string }} data
 * @returns {Promise<string>} The new survey document ID
 */
export async function submitSurvey(data) {
  try {
    const surveyData = {
      livestockId: data.livestockId,
      fsoId: data.fsoId,
      farmerId: data.farmerId,
      healthStatus: data.healthStatus,
      feedUsed: data.feedUsed || 0,
      mortality: data.mortality || 0,
      note: data.note || '',
      imageUrl: data.imageUrl || null,
    };
    return await addDocument(COLLECTIONS.SURVEYS, surveyData);
  } catch (error) {
    console.error('[surveyService.submitSurvey]', error);
    throw error;
  }
}

/**
 * Fetch all surveys submitted by a specific FSO.
 *
 * Used by: **FSO** (their report history), **Cluster Manager** (reviewing FSO work).
 *
 * @param {string} fsoId
 * @returns {Promise<Array<object>>}
 */
export async function getSurveysByFso(fsoId) {
  try {
    return await getDocuments(
      COLLECTIONS.SURVEYS,
      where('fsoId', '==', fsoId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[surveyService.getSurveysByFso]', error);
    throw error;
  }
}

/**
 * Fetch all surveys for a specific livestock unit.
 *
 * Used by: **FSO**, **Investor** (traceability), **Admin**.
 *
 * @param {string} livestockId
 * @returns {Promise<Array<object>>}
 */
export async function getSurveysByLivestock(livestockId) {
  try {
    return await getDocuments(
      COLLECTIONS.SURVEYS,
      where('livestockId', '==', livestockId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[surveyService.getSurveysByLivestock]', error);
    throw error;
  }
}

/**
 * Fetch the most recent surveys across the system.
 *
 * Used by: **Admin** (recent activity), **Cluster Manager**.
 *
 * @param {number} [count=20] - Number of recent surveys to fetch
 * @returns {Promise<Array<object>>}
 */
export async function getRecentSurveys(count = 20) {
  try {
    return await getDocuments(
      COLLECTIONS.SURVEYS,
      orderBy('createdAt', 'desc'),
      limit(count)
    );
  } catch (error) {
    console.error('[surveyService.getRecentSurveys]', error);
    throw error;
  }
}

/**
 * Fetch all surveys for a specific farmer.
 *
 * Used by: **FSO**, **Farmer** (their own records).
 *
 * @param {string} farmerId
 * @returns {Promise<Array<object>>}
 */
export async function getSurveysByFarmer(farmerId) {
  try {
    return await getDocuments(
      COLLECTIONS.SURVEYS,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[surveyService.getSurveysByFarmer]', error);
    throw error;
  }
}
