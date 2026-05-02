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
import { COLLECTIONS, INVESTMENT_STATUS, TRANSACTION_TYPES, TRANSACTION_STATUS } from '../utils/constants.js';
import { createTransaction, updateTransactionStatus } from './transactionService.js';

/**
 * Create a new investment record when an investor purchases a package.
 *
 * Used by: **Investor**, **Admin**.
 *
 * @param {{ investorId: string, packageId: string, livestockIds: string[], amount: number, investorSplit: number, farmerSplit: number, durationMonths: number }} data
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
      investorSplit: data.investorSplit || 40,
      farmerSplit: data.farmerSplit || 60,
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
 * @returns {Promise<Array<{ id: string, packageId: string, amount: number, investorSplit: number, status: string }>>}
 */
export async function getInvestmentsByInvestor(investorId) {
  try {
    const investments = await getDocuments(COLLECTIONS.INVESTMENTS);
    return investments
      .filter(i => i.investorId === investorId)
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
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
    const investments = await getDocuments(COLLECTIONS.INVESTMENTS);
    return investments.sort((a, b) => {
      const ta = a.createdAt?.seconds || 0;
      const tb = b.createdAt?.seconds || 0;
      return tb - ta;
    });
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
 * Complete an investment cycle using the Profit-Sharing model.
 * Calculates net profit and triggers payouts for Investor and Farmer.
 *
 * @param {string} investmentId
 * @param {string} farmerId
 * @param {number} grossRevenue
 * @param {number} totalExpenses
 * @returns {Promise<{ netProfit: number, investorPayout: number, farmerPayout: number }>}
 */
export async function completeInvestmentCycle(investmentId, farmerId, grossRevenue, totalExpenses) {
  try {
    const investment = await getInvestmentById(investmentId);
    if (!investment) throw new Error('Investment not found');

    const netProfit = Math.max(0, grossRevenue - investment.amount - totalExpenses);
    
    const investorShare = netProfit * (investment.investorSplit / 100);
    const farmerShare = netProfit * (investment.farmerSplit / 100);
    
    const investorPayout = investment.amount + investorShare;
    const farmerPayout = farmerShare;

    // Update investment document
    await updateDocument(COLLECTIONS.INVESTMENTS, investmentId, {
      status: INVESTMENT_STATUS.COMPLETED,
      financials: {
        grossRevenue,
        totalExpenses,
        netProfit,
        investorPayout,
        farmerPayout
      }
    });

    // Create Transaction for Investor
    const invTxId = await createTransaction({
      userId: investment.investorId,
      amount: investorPayout,
      type: TRANSACTION_TYPES.PAYOUT,
      description: `Cycle completion payout (Capital + ${investment.investorSplit}% Profit)`
    });
    // Auto-complete it for this demo
    await updateTransactionStatus(invTxId, TRANSACTION_STATUS.COMPLETED);

    // Create Transaction for Farmer
    const farmTxId = await createTransaction({
      userId: farmerId,
      amount: farmerPayout,
      type: TRANSACTION_TYPES.PAYOUT,
      description: `Cycle completion payout (${investment.farmerSplit}% Profit Share)`
    });
    await updateTransactionStatus(farmTxId, TRANSACTION_STATUS.COMPLETED);

    return { netProfit, investorPayout, farmerPayout };
  } catch (error) {
    console.error('[investmentService.completeInvestmentCycle]', error);
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
    const investments = await getDocuments(COLLECTIONS.INVESTMENTS);
    return investments
      .filter(i => i.status === INVESTMENT_STATUS.ACTIVE)
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  } catch (error) {
    console.error('[investmentService.getActiveInvestments]', error);
    throw error;
  }
}
