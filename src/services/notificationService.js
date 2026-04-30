import {
  addDocument,
  getDocuments,
  updateDocument,
  where,
  orderBy,
  limit,
  subscribeToCollection
} from '../firebase/firestore.js';
import { COLLECTIONS } from '../utils/constants.js';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Mock state for local dev
let mockNotifications = [
  { id: 'n1', title: 'Welcome to iHarvest', message: 'Your account has been created.', isRead: false, createdAt: new Date() },
  { id: 'n2', title: 'System Update', message: 'Mudarabah features are now live!', isRead: true, createdAt: new Date(Date.now() - 86400000) }
];

export async function getUserNotifications(userId) {
  if (USE_MOCK_AUTH) return [...mockNotifications];
  
  try {
    return await getDocuments(
      COLLECTIONS.NOTIFICATIONS,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  } catch (error) {
    console.error('[notificationService.getUserNotifications]', error);
    return [];
  }
}

export function subscribeToUserNotifications(userId, callback) {
  if (USE_MOCK_AUTH) {
    callback([...mockNotifications]);
    return () => {}; // mock unsubscribe
  }

  return subscribeToCollection(
    COLLECTIONS.NOTIFICATIONS,
    callback,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
}

export async function markNotificationRead(notificationId) {
  if (USE_MOCK_AUTH) {
    mockNotifications = mockNotifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    return;
  }

  try {
    await updateDocument(COLLECTIONS.NOTIFICATIONS, notificationId, { isRead: true });
  } catch (error) {
    console.error('[notificationService.markNotificationRead]', error);
  }
}

export async function createNotification(userId, title, message) {
  if (USE_MOCK_AUTH) {
    mockNotifications = [
      { id: `n-${Date.now()}`, title, message, isRead: false, createdAt: new Date() },
      ...mockNotifications
    ];
    return;
  }

  try {
    await addDocument(COLLECTIONS.NOTIFICATIONS, {
      userId,
      title,
      message,
      isRead: false
    });
  } catch (error) {
    console.error('[notificationService.createNotification]', error);
  }
}
