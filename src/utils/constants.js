/**
 * iHarvest — Application-wide constants
 * All Firestore collection names, user roles, and status enums.
 * Import from here — never hardcode collection or role strings.
 */

// ─── Firestore Collection Names ─────────────────────────────────────────────
export const COLLECTIONS = Object.freeze({
  USERS: 'users',
  CLUSTERS: 'clusters',
  PACKAGES: 'packages',
  LIVESTOCK: 'livestock',
  INVESTMENTS: 'investments',
  SURVEYS: 'surveys',
  VET_REQUESTS: 'vet_requests',
  TRANSACTIONS: 'transactions',
  NOTIFICATIONS: 'notifications',
  DELIVERIES: 'deliveries',
});

// ─── User Roles ─────────────────────────────────────────────────────────────
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  FSO: 'fso',
  CLUSTER_MANAGER: 'cluster_manager',
  VET: 'vet',
  FARMER: 'farmer',
  INVESTOR: 'investor',
});

// ─── Livestock Types ────────────────────────────────────────────────────────
export const LIVESTOCK_TYPES = Object.freeze({
  CHICKEN: 'chicken',
  CATTLE: 'cattle',
});

// ─── Livestock Status ───────────────────────────────────────────────────────
export const LIVESTOCK_STATUS = Object.freeze({
  ACTIVE: 'active',
  SOLD: 'sold',
  DEAD: 'dead',
});

// ─── Investment Status ──────────────────────────────────────────────────────
export const INVESTMENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

// ─── Vet Request Status ─────────────────────────────────────────────────────
export const VET_REQUEST_STATUS = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

// ─── Transaction Types ──────────────────────────────────────────────────────
export const TRANSACTION_TYPES = Object.freeze({
  DEPOSIT: 'deposit',
  PAYOUT: 'payout',
});

// ─── Transaction Status ─────────────────────────────────────────────────────
export const TRANSACTION_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

// ─── Delivery Status ────────────────────────────────────────────────────────
export const DELIVERY_STATUS = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

// ─── Health Status Options (for Surveys) ────────────────────────────────────
export const HEALTH_STATUS = Object.freeze({
  HEALTHY: 'healthy',
  SICK: 'sick',
  CRITICAL: 'critical',
  RECOVERED: 'recovered',
});

// ─── Route Paths ────────────────────────────────────────────────────────────
export const ROUTES = Object.freeze({
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',
  // Role-specific dashboards
  ADMIN_DASHBOARD: '/admin',
  FSO_DASHBOARD: '/fso',
  MANAGER_DASHBOARD: '/manager',
  VET_DASHBOARD: '/vet',
  FARMER_DASHBOARD: '/farmer',
  INVESTOR_DASHBOARD: '/investor',
});

// ─── Default role → dashboard mapping ───────────────────────────────────────
export const ROLE_DASHBOARD = Object.freeze({
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  [ROLES.FSO]: ROUTES.FSO_DASHBOARD,
  [ROLES.CLUSTER_MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.VET]: ROUTES.VET_DASHBOARD,
  [ROLES.FARMER]: ROUTES.FARMER_DASHBOARD,
  [ROLES.INVESTOR]: ROUTES.INVESTOR_DASHBOARD,
});
