/**
 * iHarvest — Livestock Service
 *
 * CRUD operations for livestock — the core traceable entity.
 * Every livestock unit links to an investor, package, farmer, FSO, and cluster.
 *
 * @module services/livestockService
 */

import {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  where,
  orderBy,
} from '../firebase/firestore.js';
import { COLLECTIONS, LIVESTOCK_STATUS } from '../utils/constants.js';

/**
 * Create a new livestock record.
 * Called when Admin allocates livestock to an FSO, or FSO assigns to a farmer.
 *
 * Used by: **Admin**, **FSO**.
 *
 * @param {{ type: string, quantity: number, farmerId?: string, fsoId: string, clusterId?: string, investorId?: string, packageId?: string }} data
 * @returns {Promise<string>} The new livestock document ID
 */
export async function createLivestock(data) {
  try {
    const livestockData = {
      type: data.type,
      quantity: data.quantity,
      status: LIVESTOCK_STATUS.ACTIVE,
      farmerId: data.farmerId || null,
      fsoId: data.fsoId,
      clusterId: data.clusterId || null,
      investorId: data.investorId || null,
      packageId: data.packageId || null,
    };
    return await addDocument(COLLECTIONS.LIVESTOCK, livestockData);
  } catch (error) {
    console.error('[livestockService.createLivestock]', error);
    throw error;
  }
}

/**
 * Fetch a single livestock record by ID.
 *
 * Used by: **Admin**, **FSO**, **Investor** (traceability view).
 *
 * @param {string} livestockId
 * @returns {Promise<{ id: string, type: string, quantity: number, status: string, farmerId: string, fsoId: string, clusterId: string, investorId: string, packageId: string } | null>}
 */
export async function getLivestockById(livestockId) {
  try {
    return await getDocument(COLLECTIONS.LIVESTOCK, livestockId);
  } catch (error) {
    console.error('[livestockService.getLivestockById]', error);
    throw error;
  }
}

/**
 * Fetch all livestock assigned to a specific FSO.
 *
 * Used by: **FSO** (their livestock dashboard).
 *
 * @param {string} fsoId
 * @returns {Promise<Array<{ id: string, type: string, quantity: number, status: string, farmerId: string }>>}
 */
export async function getLivestockByFso(fsoId) {
  try {
    return await getDocuments(
      COLLECTIONS.LIVESTOCK,
      where('fsoId', '==', fsoId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[livestockService.getLivestockByFso]', error);
    throw error;
  }
}

/**
 * Fetch all livestock assigned to a specific farmer.
 *
 * Used by: **Farmer** (their livestock view), **FSO** (reviewing a farmer's animals).
 *
 * @param {string} farmerId
 * @returns {Promise<Array<{ id: string, type: string, quantity: number, status: string, fsoId: string }>>}
 */
export async function getLivestockByFarmer(farmerId) {
  try {
    return await getDocuments(
      COLLECTIONS.LIVESTOCK,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[livestockService.getLivestockByFarmer]', error);
    throw error;
  }
}

/**
 * Fetch all livestock funded by a specific investor.
 *
 * Used by: **Investor** (transparency tracker).
 *
 * @param {string} investorId
 * @returns {Promise<Array<{ id: string, type: string, quantity: number, status: string, farmerId: string, fsoId: string }>>}
 */
export async function getLivestockByInvestor(investorId) {
  try {
    return await getDocuments(
      COLLECTIONS.LIVESTOCK,
      where('investorId', '==', investorId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[livestockService.getLivestockByInvestor]', error);
    throw error;
  }
}

/**
 * Fetch all livestock in a cluster.
 *
 * Used by: **Cluster Manager** (area overview).
 *
 * @param {string} clusterId
 * @returns {Promise<Array<{ id: string, type: string, quantity: number, status: string, farmerId: string, fsoId: string }>>}
 */
export async function getLivestockByCluster(clusterId) {
  try {
    return await getDocuments(
      COLLECTIONS.LIVESTOCK,
      where('clusterId', '==', clusterId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[livestockService.getLivestockByCluster]', error);
    throw error;
  }
}

/**
 * Fetch all livestock records in the system.
 *
 * Used by: **Admin** (system-wide view).
 *
 * @returns {Promise<Array<{ id: string, type: string, quantity: number, status: string }>>}
 */
export async function getAllLivestock() {
  try {
    return await getDocuments(COLLECTIONS.LIVESTOCK, orderBy('createdAt', 'desc'));
  } catch (error) {
    console.error('[livestockService.getAllLivestock]', error);
    throw error;
  }
}

/**
 * Update a livestock record's status (e.g. active → sold, active → dead).
 *
 * Used by: **Admin**, **FSO** (when livestock is sold or dies).
 *
 * @param {string} livestockId
 * @param {string} status - One of LIVESTOCK_STATUS values
 * @returns {Promise<void>}
 */
export async function updateLivestockStatus(livestockId, status) {
  try {
    await updateDocument(COLLECTIONS.LIVESTOCK, livestockId, { status });
  } catch (error) {
    console.error('[livestockService.updateLivestockStatus]', error);
    throw error;
  }
}

/**
 * Update any fields on a livestock record (e.g. assign farmerId, clusterId).
 *
 * Used by: **Admin**, **FSO**.
 *
 * @param {string} livestockId
 * @param {object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateLivestock(livestockId, data) {
  try {
    await updateDocument(COLLECTIONS.LIVESTOCK, livestockId, data);
  } catch (error) {
    console.error('[livestockService.updateLivestock]', error);
    throw error;
  }
}
