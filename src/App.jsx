import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { ToastProvider } from './components/ui/Toast.jsx';
import { ROLES, ROLE_DASHBOARD } from './utils/constants.js';

// Auth & Public
import Login from './pages/auth/Login.jsx';
import Unauthorized from './pages/auth/Unauthorized.jsx';
import DesignSystemDemo from './pages/DesignSystemDemo.jsx';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import FarmerDashboard from './pages/dashboards/FarmerDashboard.jsx';
import InvestorDashboard from './pages/dashboards/InvestorDashboard.jsx';
import VetDashboard from './pages/dashboards/VetDashboard.jsx';
import FsoDashboard from './pages/dashboards/FsoDashboard.jsx';
import ManagerDashboard from './pages/dashboards/ManagerDashboard.jsx';
import FundManagerDashboard from './pages/dashboards/FundManagerDashboard.jsx';

// Security
import RoleRoute from './routes/RoleRoute.jsx';

function App() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        Loading iHarvest...
      </div>
    );
  }

  // Determine root redirect based on role
  const getRootRedirect = () => {
    if (!user) return '/login';
    return ROLE_DASHBOARD[role] || '/unauthorized';
  };

  return (
    <ToastProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to={getRootRedirect()} replace /> : <Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/design" element={<DesignSystemDemo />} />
        
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />

        {/* Protected Role Routes */}
        <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.ADMIN]} element={<AdminDashboard />} />
        </Route>

        <Route element={<RoleRoute roles={[ROLES.FARMER]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.FARMER]} element={<FarmerDashboard />} />
        </Route>

        <Route element={<RoleRoute roles={[ROLES.INVESTOR]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.INVESTOR]} element={<InvestorDashboard />} />
        </Route>

        <Route element={<RoleRoute roles={[ROLES.VET]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.VET]} element={<VetDashboard />} />
        </Route>

        <Route element={<RoleRoute roles={[ROLES.FSO]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.FSO]} element={<FsoDashboard />} />
        </Route>

        <Route element={<RoleRoute roles={[ROLES.CLUSTER_MANAGER]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.CLUSTER_MANAGER]} element={<ManagerDashboard />} />
        </Route>

        <Route element={<RoleRoute roles={[ROLES.FUND_MANAGER]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.FUND_MANAGER]} element={<FundManagerDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
