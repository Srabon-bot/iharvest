/**
 * iHarvest — Application Service
 *
 * Handles farmer applications for joining the platform.
 *
 * @module services/applicationService
 */

import {
  addDocument,
  getDocuments,
  updateDocument,
  getDocument,
  where,
  orderBy,
} from '../firebase/firestore.js';

const COLLECTIONS = {
  APPLICATIONS: 'farmer_applications',
};

export const APPLICATION_STATUS = Object.freeze({
  PENDING: 'pending',
  SURVEYED: 'surveyed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

/**
 * Submit a new farmer application
 * @param {object} data - { name, phone, location, farmSize, experience, ... }
 */
export async function submitApplication(data) {
  try {
    const applicationData = {
      ...data,
      status: APPLICATION_STATUS.PENDING,
      surveyReport: null,
      fsoId: null,
    };
    return await addDocument(COLLECTIONS.APPLICATIONS, applicationData);
  } catch (error) {
    console.error('[applicationService.submitApplication]', error);
    throw error;
  }
}

/**
 * Fetch applications by status
 * @param {string} status 
 */
export async function getApplicationsByStatus(status) {
  try {
    return await getDocuments(
      COLLECTIONS.APPLICATIONS,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('[applicationService.getApplicationsByStatus]', error);
    throw error;
  }
}

/**
 * Fetch a specific application
 */
export async function getApplication(id) {
  try {
    return await getDocument(COLLECTIONS.APPLICATIONS, id);
  } catch (error) {
    console.error('[applicationService.getApplication]', error);
    throw error;
  }
}

/**
 * Update an application (e.g., attach a survey report)
 */
export async function updateApplication(id, updates) {
  try {
    await updateDocument(COLLECTIONS.APPLICATIONS, id, updates);
  } catch (error) {
    console.error('[applicationService.updateApplication]', error);
    throw error;
  }
}
