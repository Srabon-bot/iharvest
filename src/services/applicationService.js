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
  DETAILS_REQUESTED: 'details_requested',
  VISIT_SCHEDULED: 'visit_scheduled',
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
 * Fetch applications by status (client-side filtered for index independence)
 * @param {string} status 
 */
export async function getApplicationsByStatus(status) {
  try {
    const all = await getDocuments(COLLECTIONS.APPLICATIONS);
    return all
      .filter(a => a.status === status)
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  } catch (error) {
    console.error('[applicationService.getApplicationsByStatus]', error);
    throw error;
  }
}

/**
 * Fetch all applications relevant to the FSO pre-survey phase (client-side filtered)
 */
export async function getApplicationsForFso() {
  try {
    const FSO_STATUSES = [
      APPLICATION_STATUS.PENDING,
      APPLICATION_STATUS.DETAILS_REQUESTED,
      APPLICATION_STATUS.VISIT_SCHEDULED,
    ];
    const all = await getDocuments(COLLECTIONS.APPLICATIONS);
    return all
      .filter(a => FSO_STATUSES.includes(a.status))
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  } catch (error) {
    console.error('[applicationService.getApplicationsForFso]', error);
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
