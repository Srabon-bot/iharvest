import {
  addDocument,
  getDocuments,
  updateDocument,
  where,
} from '../firebase/firestore.js';
import { COLLECTIONS, DELIVERY_STATUS } from '../utils/constants.js';

/**
 * Fetch all deliveries.
 */
export async function getAllDeliveries() {
  try {
    const deliveries = await getDocuments(COLLECTIONS.DELIVERIES);
    return deliveries.sort((a, b) => {
      const ta = a.createdAt?.seconds || 0;
      const tb = b.createdAt?.seconds || 0;
      return tb - ta;
    });
  } catch (error) {
    console.error('[deliveryService.getAllDeliveries]', error);
    throw error;
  }
}

/**
 * Create a new delivery.
 */
export async function createDelivery(data) {
  try {
    const deliveryData = {
      cluster: data.cluster,
      items: data.items,
      driver: data.driver,
      status: DELIVERY_STATUS.PENDING,
    };
    return await addDocument(COLLECTIONS.DELIVERIES, deliveryData);
  } catch (error) {
    console.error('[deliveryService.createDelivery]', error);
    throw error;
  }
}

/**
 * Update a delivery's status.
 */
export async function updateDeliveryStatus(deliveryId, status) {
  try {
    await updateDocument(COLLECTIONS.DELIVERIES, deliveryId, { status });
  } catch (error) {
    console.error('[deliveryService.updateDeliveryStatus]', error);
    throw error;
  }
}
