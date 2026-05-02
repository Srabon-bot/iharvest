/**
 * iHarvest — Vet Service
 *
 * Manages veterinary service requests and prescriptions.
 *
 * @module services/vetService
 */

import {
  addDocument,
  getDocuments,
  updateDocument,
  where,
  orderBy,
} from '../firebase/firestore.js';
import { COLLECTIONS, VET_REQUEST_STATUS } from '../utils/constants.js';

/**
 * Create a new vet service request.
 *
 * Used by: **FSO**, **Farmer** (reporting health issues).
 *
 * @param {{ farmerId: string, fsoId: string, livestockId?: string, issue: string }} data
 * @returns {Promise<string>} The new request document ID
 */
export async function createVetRequest(data) {
  try {
    const requestData = {
      farmerId: data.farmerId,
      fsoId: data.fsoId,
      livestockId: data.livestockId || null,
      issue: data.issue,
      status: VET_REQUEST_STATUS.PENDING,
      vetId: null,
      prescription: null,
    };
    return await addDocument(COLLECTIONS.VET_REQUESTS, requestData);
  } catch (error) {
    console.error('[vetService.createVetRequest]', error);
    throw error;
  }
}

/**
 * Fetch all vet requests assigned to a specific vet.
 *
 * Used by: **Veterinarian** (their inbox).
 *
 * @param {string} vetId
 * @returns {Promise<Array<object>>}
 */
export async function getVetRequests(vetId) {
  try {
    const requests = await getDocuments(COLLECTIONS.VET_REQUESTS);
    return requests
      .filter(r => r.vetId === vetId)
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  } catch (error) {
    console.error('[vetService.getVetRequests]', error);
    throw error;
  }
}

/**
 * Fetch all pending (unassigned) vet requests.
 *
 * Used by: **Veterinarian**, **Admin** (triage queue).
 *
 * @returns {Promise<Array<object>>}
 */
export async function getPendingRequests() {
  try {
    const requests = await getDocuments(COLLECTIONS.VET_REQUESTS);
    return requests
      .filter(r => r.status === VET_REQUEST_STATUS.PENDING)
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  } catch (error) {
    console.error('[vetService.getPendingRequests]', error);
    throw error;
  }
}

/**
 * Update a vet request's status and optionally add prescription.
 *
 * Used by: **Veterinarian** (diagnosing and prescribing).
 *
 * @param {string} requestId
 * @param {string} status - One of VET_REQUEST_STATUS values
 * @param {string} [prescription] - Medicine/treatment prescribed
 * @returns {Promise<void>}
 */
export async function updateRequestStatus(requestId, status, prescription) {
  try {
    const updateData = { status };
    if (prescription !== undefined) {
      updateData.prescription = prescription;
    }
    await updateDocument(COLLECTIONS.VET_REQUESTS, requestId, updateData);
  } catch (error) {
    console.error('[vetService.updateRequestStatus]', error);
    throw error;
  }
}

/**
 * Assign a vet to a pending request.
 *
 * Used by: **Admin**, **Veterinarian** (self-assign).
 *
 * @param {string} requestId
 * @param {string} vetId
 * @returns {Promise<void>}
 */
export async function assignVetToRequest(requestId, vetId) {
  try {
    await updateDocument(COLLECTIONS.VET_REQUESTS, requestId, {
      vetId,
      status: VET_REQUEST_STATUS.IN_PROGRESS,
    });
  } catch (error) {
    console.error('[vetService.assignVetToRequest]', error);
    throw error;
  }
}

/**
 * Fetch all vet requests (system-wide).
 *
 * Used by: **Admin** (overview of all health issues).
 *
 * @returns {Promise<Array<object>>}
 */
export async function getAllVetRequests() {
  try {
    const requests = await getDocuments(COLLECTIONS.VET_REQUESTS);
    return requests.sort((a, b) => {
      const ta = a.createdAt?.seconds || 0;
      const tb = b.createdAt?.seconds || 0;
      return tb - ta;
    });
  } catch (error) {
    console.error('[vetService.getAllVetRequests]', error);
    throw error;
  }
}
