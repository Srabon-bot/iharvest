/**
 * iHarvest — Package Service
 *
 * CRUD operations for investment packages.
 * Packages define the livestock offering that investors can purchase.
 *
 * @module services/packageService
 */

import {
  addDocument,
  getDocuments,
  updateDocument,
  getDocument,
  where,
  orderBy,
} from '../firebase/firestore.js';
import { COLLECTIONS } from '../utils/constants.js';

/**
 * Create a new investment package.
 *
 * Used by: **Admin**.
 *
 * @param {{ name: string, type: string, price: number, livestockCount: number, durationMonths: number, expectedROI: number }} data
 * @returns {Promise<string>} The new package document ID
 */
export async function createPackage(data) {
  try {
    const packageData = {
      name: data.name,
      type: data.type,
      price: data.price,
      livestockCount: data.livestockCount,
      durationMonths: data.durationMonths,
      expectedROI: data.expectedROI,
      isActive: true,
    };
    return await addDocument(COLLECTIONS.PACKAGES, packageData);
  } catch (error) {
    console.error('[packageService.createPackage]', error);
    throw error;
  }
}

/**
 * Fetch all packages (active and inactive).
 *
 * Used by: **Admin** (package management).
 *
 * @returns {Promise<Array<{ id: string, name: string, type: string, price: number, livestockCount: number, durationMonths: number, expectedROI: number, isActive: boolean }>>}
 */
export async function getAllPackages() {
  try {
    return await getDocuments(COLLECTIONS.PACKAGES, orderBy('createdAt', 'desc'));
  } catch (error) {
    console.error('[packageService.getAllPackages]', error);
    throw error;
  }
}

/**
 * Fetch only active packages available for investment.
 *
 * Used by: **Investor** (marketplace), **All authenticated users**.
 *
 * @returns {Promise<Array<{ id: string, name: string, type: string, price: number, livestockCount: number, durationMonths: number, expectedROI: number }>>}
 */
export async function getActivePackages() {
  try {
    return await getDocuments(
      COLLECTIONS.PACKAGES,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[packageService.getActivePackages]', error);
    throw error;
  }
}

/**
 * Fetch a single package by ID.
 *
 * Used by: **Investor** (package detail view), **Admin**.
 *
 * @param {string} packageId
 * @returns {Promise<{ id: string, name: string, type: string, price: number, livestockCount: number, durationMonths: number, expectedROI: number, isActive: boolean } | null>}
 */
export async function getPackageById(packageId) {
  try {
    return await getDocument(COLLECTIONS.PACKAGES, packageId);
  } catch (error) {
    console.error('[packageService.getPackageById]', error);
    throw error;
  }
}

/**
 * Update an existing package's fields.
 *
 * Used by: **Admin** (edit price, ROI, duration, deactivate, etc.).
 *
 * @param {string} packageId
 * @param {object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updatePackage(packageId, data) {
  try {
    await updateDocument(COLLECTIONS.PACKAGES, packageId, data);
  } catch (error) {
    console.error('[packageService.updatePackage]', error);
    throw error;
  }
}
