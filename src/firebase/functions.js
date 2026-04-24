/**
 * iHarvest — Firebase Cloud Functions helpers
 *
 * Wraps the callable Cloud Functions SDK.
 * Use this to invoke server-side logic for ROI calculations,
 * notifications, and other triggers.
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from './config.js';

/**
 * Call a Firebase Cloud Function by name.
 * @param {string} functionName - The deployed function name
 * @param {object} [data={}] - Data payload to send
 * @returns {Promise<any>} The function's response data
 */
export async function callFunction(functionName, data = {}) {
  try {
    const fn = httpsCallable(functions, functionName);
    const result = await fn(data);
    return result.data;
  } catch (error) {
    console.error(`[callFunction] ${functionName}`, error);
    throw error;
  }
}

/**
 * Trigger ROI recalculation for a specific investment.
 * Calls the `calculateROI` Cloud Function.
 * @param {string} investmentId
 * @returns {Promise<{ currentROI: number, status: string }>}
 */
export async function calculateROI(investmentId) {
  return callFunction('calculateROI', { investmentId });
}

/**
 * Send a notification via Cloud Function.
 * @param {{ userId: string, title: string, body: string, type: string }} payload
 * @returns {Promise<{ success: boolean }>}
 */
export async function sendNotification(payload) {
  return callFunction('sendNotification', payload);
}

/**
 * Process an investor payout via Cloud Function.
 * @param {{ investmentId: string, investorId: string }} payload
 * @returns {Promise<{ transactionId: string, amount: number }>}
 */
export async function processInvestorPayout(payload) {
  return callFunction('processInvestorPayout', payload);
}

/**
 * Get system-wide analytics (admin only).
 * @returns {Promise<{ totalInvestments: number, totalLivestock: number, mortalityRate: number, totalProfit: number }>}
 */
export async function getSystemAnalytics() {
  return callFunction('getSystemAnalytics');
}
