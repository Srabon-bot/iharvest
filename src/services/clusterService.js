import { getDocuments, where } from '../firebase/firestore.js';
import { COLLECTIONS } from '../utils/constants.js';

export async function getClustersByManager(managerId) {
  try {
    return await getDocuments(COLLECTIONS.CLUSTERS, where('managerId', '==', managerId));
  } catch (error) {
    console.error('[clusterService.getClustersByManager]', error);
    throw error;
  }
}

export async function getAllClusters() {
  try {
    return await getDocuments(COLLECTIONS.CLUSTERS);
  } catch (error) {
    console.error('[clusterService.getAllClusters]', error);
    throw error;
  }
}
