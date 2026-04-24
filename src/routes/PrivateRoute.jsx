/**
 * iHarvest — PrivateRoute
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to /login.
 *
 * @module routes/PrivateRoute
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

/**
 * PrivateRoute wrapper component.
 * Renders child routes (Outlet) if the user is authenticated.
 * Redirects to /login if not authenticated.
 * Shows nothing while auth state is loading.
 *
 * Usage in router:
 * ```jsx
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * ```
 *
 * @returns {JSX.Element}
 */
export function PrivateRoute() {
  const { user, loading } = useAuth();

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
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
