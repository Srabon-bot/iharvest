/**
 * iHarvest — RoleRoute
 *
 * Protects routes that require specific user roles.
 * Redirects unauthorized users to /unauthorized.
 *
 * @module routes/RoleRoute
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

/**
 * RoleRoute wrapper component.
 * Renders child routes (Outlet) only if the user's role is in the allowed list.
 * Redirects to /unauthorized if the role doesn't match.
 *
 * Usage in router:
 * ```jsx
 * <Route element={<RoleRoute roles={['admin', 'fund_manager']} />}>
 *   <Route path="/admin" element={<AdminDashboard />} />
 * </Route>
 * ```
 *
 * @param {{ roles: string[] }} props - Array of allowed role strings
 * @returns {JSX.Element}
 */
export function RoleRoute({ roles = [] }) {
  const { role, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.1rem',
        color: '#666',
      }}>
        Verifying access...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If we have a user but no profile/role yet, they might be in the middle of signup
  // or the profile fetch is slightly delayed. Show loading instead of rejecting.
  if (!role) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>Finalizing session...</span>
      </div>
    );
  }

  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
