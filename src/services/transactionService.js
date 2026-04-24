/**
 * iHarvest — Transaction Service
 *
 * Tracks all financial transactions (deposits and payouts).
 *
 * @module services/transactionService
 */

import {
  addDocument,
  getDocuments,
  updateDocument,
  where,
  orderBy,
} from '../firebase/firestore.js';
import { COLLECTIONS, TRANSACTION_STATUS } from '../utils/constants.js';

/**
 * Create a new transaction record.
 *
 * Used by: **Fund Manager** (recording deposits/payouts), **Investor** (purchase).
 *
 * @param {{ userId: string, amount: number, type: string, description?: string }} data
 * @returns {Promise<string>} The new transaction document ID
 */
export async function createTransaction(data) {
  try {
    const txData = {
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      description: data.description || '',
      status: TRANSACTION_STATUS.PENDING,
    };
    return await addDocument(COLLECTIONS.TRANSACTIONS, txData);
  } catch (error) {
    console.error('[transactionService.createTransaction]', error);
    throw error;
  }
}

/**
 * Fetch all transactions for a specific user.
 *
 * Used by: **Investor** (their transaction history), **Fund Manager**.
 *
 * @param {string} userId
 * @returns {Promise<Array<object>>}
 */
export async function getTransactionsByUser(userId) {
  try {
    return await getDocuments(
      COLLECTIONS.TRANSACTIONS,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[transactionService.getTransactionsByUser]', error);
    throw error;
  }
}

/**
 * Fetch all transactions in the system.
 *
 * Used by: **Admin**, **Fund Manager** (financial overview).
 *
 * @returns {Promise<Array<object>>}
 */
export async function getAllTransactions() {
  try {
    return await getDocuments(COLLECTIONS.TRANSACTIONS, orderBy('createdAt', 'desc'));
  } catch (error) {
    console.error('[transactionService.getAllTransactions]', error);
    throw error;
  }
}

/**
 * Update a transaction's status (e.g. pending → completed).
 *
 * Used by: **Admin**, **Fund Manager** (approving payments).
 *
 * @param {string} transactionId
 * @param {string} status - One of TRANSACTION_STATUS values
 * @returns {Promise<void>}
 */
export async function updateTransactionStatus(transactionId, status) {
  try {
    await updateDocument(COLLECTIONS.TRANSACTIONS, transactionId, { status });
  } catch (error) {
    console.error('[transactionService.updateTransactionStatus]', error);
    throw error;
  }
}
