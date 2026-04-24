/**
 * iHarvest — useRole Hook
 *
 * Check whether the current user has a specific role (or one of several roles).
 *
 * @module hooks/useRole
 */

import { useAuth } from './useAuth.js';

/**
 * Check if the current user has access based on their role.
 *
 * Used by: **RoleRoute** and any component that conditionally renders by role.
 *
 * @param {string|string[]} requiredRole - A single role or array of allowed roles
 * @returns {{ hasAccess: boolean, role: string|null, loading: boolean }}
 */
export function useRole(requiredRole) {
  const { role, loading } = useAuth();

  if (loading) {
    return { hasAccess: false, role, loading: true };
  }

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasAccess = role !== null && allowedRoles.includes(role);

  return { hasAccess, role, loading: false };
}

export default useRole;
