/**
 * iHarvest — Investment Service
 *
 * Manages investor purchases of packages and tracks ROI.
 *
 * @module services/investmentService
 */

import {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  where,
  orderBy,
} from '../firebase/firestore.js';
import { COLLECTIONS, INVESTMENT_STATUS } from '../utils/constants.js';

/**
 * Create a new investment record when an investor purchases a package.
 *
 * Used by: **Investor**, **Fund Manager**.
 *
 * @param {{ investorId: string, packageId: string, livestockIds: string[], amount: number, expectedROI: number, durationMonths: number }} data
 * @returns {Promise<string>} The new investment document ID
 */
export async function createInvestment(data) {
  try {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + (data.durationMonths || 6));

    const investmentData = {
      investorId: data.investorId,
      packageId: data.packageId,
      livestockIds: data.livestockIds || [],
      amount: data.amount,
      expectedROI: data.expectedROI,
      currentROI: 0,
      status: INVESTMENT_STATUS.ACTIVE,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
    };
    return await addDocument(COLLECTIONS.INVESTMENTS, investmentData);
  } catch (error) {
    console.error('[investmentService.createInvestment]', error);
    throw error;
  }
}

/**
 * Fetch all investments by a specific investor.
 *
 * Used by: **Investor** (portfolio dashboard).
 *
 * @param {string} investorId
 * @returns {Promise<Array<{ id: string, packageId: string, amount: number, expectedROI: number, currentROI: number, status: string }>>}
 */
export async function getInvestmentsByInvestor(investorId) {
  try {
    return await getDocuments(
      COLLECTIONS.INVESTMENTS,
      where('investorId', '==', investorId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[investmentService.getInvestmentsByInvestor]', error);
    throw error;
  }
}

/**
 * Fetch all investments in the system.
 *
 * Used by: **Admin**, **Fund Manager**.
 *
 * @returns {Promise<Array<{ id: string, investorId: string, amount: number, status: string }>>}
 */
export async function getAllInvestments() {
  try {
    return await getDocuments(COLLECTIONS.INVESTMENTS, orderBy('createdAt', 'desc'));
  } catch (error) {
    console.error('[investmentService.getAllInvestments]', error);
    throw error;
  }
}

/**
 * Fetch a single investment by ID.
 *
 * Used by: **Investor**, **Fund Manager**, **Admin**.
 *
 * @param {string} investmentId
 * @returns {Promise<object|null>}
 */
export async function getInvestmentById(investmentId) {
  try {
    return await getDocument(COLLECTIONS.INVESTMENTS, investmentId);
  } catch (error) {
    console.error('[investmentService.getInvestmentById]', error);
    throw error;
  }
}

/**
 * Update the current ROI of an investment.
 *
 * Used by: **Fund Manager**, **Cloud Functions**.
 *
 * @param {string} investmentId
 * @param {number} currentROI
 * @returns {Promise<void>}
 */
export async function updateROI(investmentId, currentROI) {
  try {
    await updateDocument(COLLECTIONS.INVESTMENTS, investmentId, { currentROI });
  } catch (error) {
    console.error('[investmentService.updateROI]', error);
    throw error;
  }
}

/**
 * Mark an investment as completed.
 *
 * Used by: **Fund Manager**, **Admin**.
 *
 * @param {string} investmentId
 * @returns {Promise<void>}
 */
export async function completeInvestment(investmentId) {
  try {
    await updateDocument(COLLECTIONS.INVESTMENTS, investmentId, {
      status: INVESTMENT_STATUS.COMPLETED,
    });
  } catch (error) {
    console.error('[investmentService.completeInvestment]', error);
    throw error;
  }
}

/**
 * Fetch all active investments.
 *
 * Used by: **Fund Manager**.
 *
 * @returns {Promise<Array<object>>}
 */
export async function getActiveInvestments() {
  try {
    return await getDocuments(
      COLLECTIONS.INVESTMENTS,
      where('status', '==', INVESTMENT_STATUS.ACTIVE),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[investmentService.getActiveInvestments]', error);
    throw error;
  }
}
