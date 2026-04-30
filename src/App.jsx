import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { ToastProvider } from './components/ui/Toast.jsx';
import { ROLES, ROLE_DASHBOARD } from './utils/constants.js';
import { PageLoader } from './components/ui/Loader.jsx';

// Auth & Public
import Login from './pages/auth/Login.jsx';
import Unauthorized from './pages/auth/Unauthorized.jsx';
import DesignSystemDemo from './pages/DesignSystemDemo.jsx';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import AdminSetup from './pages/AdminSetup.jsx';
import FarmerDashboard from './pages/dashboards/FarmerDashboard.jsx';
import InvestorDashboard from './pages/dashboards/InvestorDashboard.jsx';
import VetDashboard from './pages/dashboards/VetDashboard.jsx';
import FsoDashboard from './pages/dashboards/FsoDashboard.jsx';
import ManagerDashboard from './pages/dashboards/ManagerDashboard.jsx';

// Admin sub-pages
import UsersPage from './pages/admin/UsersPage.jsx';
import FarmsPage from './pages/admin/FarmsPage.jsx';
import AdminInvestmentsPage from './pages/admin/InvestmentsPage.jsx';

// Farmer sub-pages
import LivestockPage from './pages/farmer/LivestockPage.jsx';
import TasksPage from './pages/farmer/TasksPage.jsx';

// Investor sub-pages
import MarketplacePage from './pages/investor/MarketplacePage.jsx';
import InvestorTransactionsPage from './pages/investor/TransactionsPage.jsx';

// FSO sub-pages
import SurveysPage from './pages/fso/SurveysPage.jsx';
import FarmersPage from './pages/fso/FarmersPage.jsx';

// Manager sub-pages
import ClustersPage from './pages/manager/ClustersPage.jsx';
import DeliveriesPage from './pages/manager/DeliveriesPage.jsx';

// Vet sub-pages
import RequestsPage from './pages/vet/RequestsPage.jsx';
import ReportsPage from './pages/vet/ReportsPage.jsx';

// Security
import RoleRoute from './routes/RoleRoute.jsx';

function App() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <PageLoader message="Loading iHarvest..." />
      </div>
    );
  }

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
        <Route path="/init-admin" element={<AdminSetup />} />
        {/* Design system demo — dev only */}
        {import.meta.env.DEV && <Route path="/design" element={<DesignSystemDemo />} />}

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />

        {/* ══ Admin ══ */}
        <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.ADMIN]} element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/farms" element={<FarmsPage />} />
          <Route path="/admin/investments" element={<AdminInvestmentsPage />} />
        </Route>

        {/* ══ Farmer ══ */}
        <Route element={<RoleRoute roles={[ROLES.FARMER]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.FARMER]} element={<FarmerDashboard />} />
          <Route path="/farmer/livestock" element={<LivestockPage />} />
          <Route path="/farmer/tasks" element={<TasksPage />} />
        </Route>

        {/* ══ Investor ══ */}
        <Route element={<RoleRoute roles={[ROLES.INVESTOR]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.INVESTOR]} element={<InvestorDashboard />} />
          <Route path="/investor/investments" element={<MarketplacePage />} />
          <Route path="/investor/transactions" element={<InvestorTransactionsPage />} />
        </Route>

        {/* ══ Vet ══ */}
        <Route element={<RoleRoute roles={[ROLES.VET]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.VET]} element={<VetDashboard />} />
          <Route path="/vet/requests" element={<RequestsPage />} />
          <Route path="/vet/reports" element={<ReportsPage />} />
        </Route>

        {/* ══ FSO ══ */}
        <Route element={<RoleRoute roles={[ROLES.FSO]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.FSO]} element={<FsoDashboard />} />
          <Route path="/fso/surveys" element={<SurveysPage />} />
          <Route path="/fso/farmers" element={<FarmersPage />} />
        </Route>

        {/* ══ Cluster Manager ══ */}
        <Route element={<RoleRoute roles={[ROLES.CLUSTER_MANAGER]} />}>
          <Route path={ROLE_DASHBOARD[ROLES.CLUSTER_MANAGER]} element={<ManagerDashboard />} />
          <Route path="/manager/clusters" element={<ClustersPage />} />
          <Route path="/manager/deliveries" element={<DeliveriesPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
